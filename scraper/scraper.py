import os
import time
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from curl_cffi import requests
from bs4 import BeautifulSoup
from supabase import create_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"
WEVITY_MAX_PAGES = int(os.environ.get("WEVITY_MAX_PAGES", "5"))
REQUEST_SLEEP_SEC = float(os.environ.get("REQUEST_SLEEP_SEC", "0.7"))

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "ai": ["ai", "인공지능", "머신러닝", "딥러닝", "nlp", "챗봇", "gpt", "llm", "데이터", "비전"],
    "dev": ["sw", "소프트웨어", "개발", "앱", "웹", "해커톤", "it", "코딩", "프로그래밍", "iot", "클라우드"],
    "planning": ["기획", "ux", "ui", "서비스", "디자인", "아이디어"],
    "startup": ["창업", "스타트업", "사업계획", "비즈니스", "벤처"],
}

LINKAREER_BASE = "https://linkareer.com"
LINKAREER_LIST_URL = f"{LINKAREER_BASE}/list/contest?page={{page}}"


@dataclass
class Contest:
    title: str
    wevity_url: str
    organizer: Optional[str] = None
    category: str = "etc"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    prize: Optional[str] = None
    target: Optional[str] = None
    official_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    source: str = "wevity"


def classify_category(title: str, organizer: str = "") -> str:
    text = (title + " " + (organizer or "")).lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return cat
    return "etc"


def parse_date(raw: str) -> Optional[str]:
    raw = raw.strip().replace(".", "-").replace("/", "-")
    for fmt in ("%Y-%m-%d", "%y-%m-%d"):
        try:
            return datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def fetch(url: str) -> Optional[BeautifulSoup]:
    try:
        r = requests.get(url, impersonate="chrome120", timeout=15)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        log.warning("fetch error %s: %s", url, e)
        return None


def scrape_detail(url: str) -> dict:
    soup = fetch(url)
    if not soup:
        return {}

    result: dict = {}

    for a in soup.select("a[href]"):
        text = a.get_text(strip=True)
        if "홈페이지" in text or "공식" in text:
            result["official_url"] = a.get("href", "")
            break

    img = soup.select_one(".view-thumb img, .thumb img, .contest-img img")
    if img:
        src = img.get("src", "")
        result["thumbnail_url"] = src if src.startswith("http") else LINKAREER_BASE + src

    for row in soup.select("dl dt, table th, .info-list li"):
        text = row.get_text(strip=True)
        if "접수" in text or "기간" in text:
            sibling = row.find_next_sibling()
            if sibling:
                parts = sibling.get_text(strip=True).replace(" ", "").split("~")
                if len(parts) == 2:
                    result["start_date"] = parse_date(parts[0])
                    result["end_date"] = parse_date(parts[1])
            break

    for row in soup.select("dl dt, table th, .info-list li"):
        if any(k in row.get_text(strip=True) for k in ("시상", "상금", "혜택")):
            sibling = row.find_next_sibling()
            if sibling:
                result["prize"] = sibling.get_text(strip=True)[:200]
            break

    for row in soup.select("dl dt, table th, .info-list li"):
        if any(k in row.get_text(strip=True) for k in ("자격", "대상")):
            sibling = row.find_next_sibling()
            if sibling:
                result["target"] = sibling.get_text(strip=True)[:200]
            break

    return result


def scrape_linkareer() -> list[Contest]:
    items: list[Contest] = []

    for pg in range(1, WEVITY_MAX_PAGES + 1):
        url = LINKAREER_LIST_URL.format(page=pg)
        log.info("scraping linkareer page %d → %s", pg, url)
        soup = fetch(url)
        if not soup:
            break

        rows = soup.select(".activity-list-item, .list-item, .contest-item, article, .card")
        if not rows:
            rows = soup.select("li[class*='item'], li[class*='card'], div[class*='item']")
        if not rows:
            log.warning("page %d: no rows found (html snippet: %s)", pg, str(soup.body)[:2000] if soup.body else "")
            break

        page_count = 0
        for row in rows:
            a = row.select_one("a[href]")
            if not a:
                continue

            href = a.get("href", "")
            detail_url = href if href.startswith("http") else LINKAREER_BASE + href

            title_el = row.select_one("h2, h3, h4, .title, .tit, strong")
            title = title_el.get_text(strip=True) if title_el else a.get_text(strip=True)
            if not title or len(title) < 3:
                continue

            org_el = row.select_one(".organizer, .host, .org, .company, .sponsor")
            organizer = org_el.get_text(strip=True) if org_el else None

            contest = Contest(
                title=title,
                wevity_url=detail_url,
                organizer=organizer,
                category=classify_category(title, organizer or ""),
                source="linkareer",
            )

            time.sleep(REQUEST_SLEEP_SEC)
            detail = scrape_detail(detail_url)
            for k, v in detail.items():
                setattr(contest, k, v)

            items.append(contest)
            page_count += 1
            log.info("  [%s] %s", contest.category, contest.title[:60])

        log.info("page %d: %d items", pg, page_count)
        time.sleep(REQUEST_SLEEP_SEC)

    return items


def upsert_contests(client, contests: list[Contest]) -> None:
    if not contests:
        log.info("no contests to upsert, skipping")
        return
    rows = [
        {
            "title": c.title,
            "organizer": c.organizer,
            "category": c.category,
            "start_date": c.start_date,
            "end_date": c.end_date,
            "prize": c.prize,
            "target": c.target,
            "wevity_url": c.wevity_url,
            "official_url": c.official_url,
            "thumbnail_url": c.thumbnail_url,
            "source": c.source,
            "scraped_at": datetime.utcnow().isoformat(),
        }
        for c in contests
    ]
    client.table("contests").upsert(rows, on_conflict="wevity_url").execute()
    log.info("upserted %d rows", len(rows))


def main():
    log.info("=== Contest Scraper start (dry_run=%s) ===", DRY_RUN)

    contests = scrape_linkareer()
    log.info("total scraped: %d", len(contests))

    if DRY_RUN:
        for c in contests[:5]:
            log.info("DRY_RUN sample: %s | %s | %s~%s", c.category, c.title[:50], c.start_date, c.end_date)
        return

    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    upsert_contests(client, contests)
    log.info("=== done ===")


if __name__ == "__main__":
    main()
