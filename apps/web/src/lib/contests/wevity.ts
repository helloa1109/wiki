import * as cheerio from 'cheerio'
import type { Contest, ContestCategory, ContestSource } from './types'

const SOURCE: ContestSource = 'wevity'

const WEVITY_BASE = 'https://www.wevity.com'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const CATEGORY_KEYWORDS: Record<ContestCategory, string[]> = {
  ai: ['ai', '인공지능', '머신러닝', '딥러닝', 'nlp', '챗봇', 'gpt', 'llm', '데이터', '비전'],
  dev: ['sw', '소프트웨어', '개발', '앱', '웹', '해커톤', 'it', '코딩', '프로그래밍', 'iot', '클라우드'],
  planning: ['기획', 'ux', 'ui', '서비스', '디자인', '아이디어'],
  startup: ['창업', '스타트업', '사업계획', '비즈니스', '벤처'],
  etc: [],
}

function classifyCategory(title: string, field: string): ContestCategory {
  const text = (title + ' ' + field).toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ContestCategory, string[]][]) {
    if (cat === 'etc') continue
    if (keywords.some((kw) => text.includes(kw))) return cat
  }
  return 'etc'
}

function parseDaysLeft(dayText: string): number | null {
  const match = dayText.match(/D-(\d+)/)
  if (!match) return null
  return parseInt(match[1]!, 10)
}

async function fetchPage(page: number): Promise<Contest[]> {
  const url = `${WEVITY_BASE}/?c=find&s=1&gp=${page}`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error(`[wevity] fetch failed: ${res.status} on page ${page}`)
    return []
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const contests: Contest[] = []

  $('ul.list > li').each((_, el) => {
    if ($(el).hasClass('top')) return

    const titleEl = $(el).find('div.tit > a')
    const title = titleEl
      .clone()
      .children('span')
      .remove()
      .end()
      .text()
      .trim()

    const href = titleEl.attr('href')
    if (!title || !href) return

    const detailUrl = `${WEVITY_BASE}/${href.replace(/^\//, '')}`
    const id = href.match(/ix=(\d+)/)?.[1] ?? href

    const organizer = $(el).find('div.organ').text().trim() || null
    const field = $(el).find('div.sub-tit').text().replace('분야 :', '').trim()

    const dayText = $(el).find('div.day').text().trim()
    const daysLeft = parseDaysLeft(dayText)

    const category = classifyCategory(title, field)

    contests.push({
      id: `wevity-${id}`,
      title,
      organizer,
      category,
      startDate: null,
      endDate: null,
      daysLeft,
      prize: null,
      target: null,
      detailUrl,
      thumbnailUrl: null,
      source: SOURCE,
    })
  })

  return contests
}

export async function fetchWevityContests(options?: { maxPages?: number }): Promise<Contest[]> {
  const maxPages = options?.maxPages ?? 3
  const results: Contest[] = []

  for (let page = 1; page <= maxPages; page++) {
    try {
      const items = await fetchPage(page)
      results.push(...items)
    } catch (err) {
      console.error(`[wevity] error on page ${page}:`, err)
    }
  }

  return results
}
