import os
import time
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, Page
from supabase import create_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
DRY_RUN = os.environ.get("DRY_RUN", "false").lower() == "true"
WEVITY_MAX_PAGES = int(os.environ.get("WEVITY_MAX_PAGES", "5"))
REQUEST_SLEEP_SEC = float(os.environ.get("REQUEST_SLEEP_SEC", "1.2"))

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "ai": ["ai", "인공지능", "머신러닝", "딥러닝", "nlp", "챗봇", "gpt", "llm", "데이터", "비전"],
    "dev": ["sw", "소프트웨어", "개발", "앱", "웹", "해커톤", "it", "코딩", "프로그래밍", "iot", "클라우드"],
    "planning": ["기획", "ux", "ui", "서비스", "디자인", "아이디어"],
    "startup": ["창업", "스타트업", "사업계획", "비즈니스", "벤처"],
}

WEVITY_BASE = "https://www.wevity.com"
WEVITY_LIST_URL = f"{WEVITY_BASE}/?c=find&s=1&gub=1&cidx=18&cata=A&page={{page}}"


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


def fetch_html(page: Page, url: str) -> Optional[BeautifulSoup]:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=20000)
        time.sleep(REQUEST_SLEEP_SEC)
        return BeautifulSoup(page.content(), "html.parser")
    except Exception as e:
        log.warning("fetch error %s: %s", url, e)
        return None


def scrape_detail(page: Page, url: str) -> dict:
    soup = fetch_html(page, url)
    if not soup:
        return {}

    result: dict = {}

    for a in soup.select("a[href]"):
        href = a.get("href", "")
        text = a.get_text(strip=True)
        if "홈페이지" in text or "공식" in text:
            result["official_url"] = href
            break

    img = soup.select_one(".view-thumb img, .thumb img, .contest-img img")
    if img:
        src = img.get("src", "")
        result["thumbnail_url"] = src if src.startswith("http") else WEVITY_BASE + src

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


def scrape_wevity(page: Page) -> list[Contest]:
    items: list[Contest] = []

    for pg in range(1, WEVITY_MAX_PAGES + 1):
        url = WEVITY_LIST_URL.format(page=pg)
        log.info("scraping wevity page %d → %s", pg, url)
        soup = fetch_html(page, url)
        if not soup:
            break

        rows = soup.select("ul.list li, .contest-list li, .find-list li")
        if not rows:
            rows = soup.select("div.list-wrap .item, .board-list tr")
        if not rows:
            log.warning("page %d: no rows found, stopping", pg)
            break

        page_count = 0
        for row in rows:
            a = row.select_one("a[href]")
            if not a:
                continue

            href = a.get("href", "")
            detail_url = href if href.startswith("http") else WEVITY_BASE + href

            title_el = row.select_one(".title, .tit, h3, h4, .subject")
            title = title_el.get_text(strip=True) if title_el else a.get_text(strip=True)
            if not title:
                continue

            org_el = row.select_one(".organizer, .host, .org, .company")
            organizer = org_el.get_text(strip=True) if org_el else None

            contest = Contest(
                title=title,
                wevity_url=detail_url,
                organizer=organizer,
                category=classify_category(title, organizer or ""),
            )

            detail = scrape_detail(page, detail_url)
            for k, v in detail.items():
                setattr(contest, k, v)

            items.append(contest)
            page_count += 1
            log.info("  [%s] %s", contest.category, contest.title[:60])

        log.info("page %d: %d items", pg, page_count)

    return items


def upsert_contests(client, contests: list[Contest]) -> None:
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

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            locale="ko-KR",
            viewport={"width": 1280, "height": 800},
        )
        pg = ctx.new_page()

        contests: list[Contest] = []
        contests.extend(scrape_wevity(pg))

        browser.close()

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
