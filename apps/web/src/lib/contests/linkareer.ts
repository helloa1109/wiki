import * as cheerio from 'cheerio'
import type { Contest, ContestCategory, ContestSource } from './types'

const LINKAREER_BASE = 'https://linkareer.com'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const SOURCE: ContestSource = 'linkareer'

const CATEGORY_KEYWORDS: Record<ContestCategory, string[]> = {
  ai: ['ai', '인공지능', '머신러닝', '딥러닝', 'nlp', '챗봇', 'gpt', 'llm', '데이터', '비전'],
  dev: ['sw', '소프트웨어', '개발', '앱', '웹', '해커톤', 'it', '코딩', '프로그래밍', 'iot', '클라우드'],
  planning: ['기획', 'ux', 'ui', '서비스', '디자인', '아이디어'],
  startup: ['창업', '스타트업', '사업계획', '비즈니스', '벤처'],
  etc: [],
}

function classifyCategory(title: string): ContestCategory {
  const text = title.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ContestCategory, string[]][]) {
    if (cat === 'etc') continue
    if (keywords.some((kw) => text.includes(kw))) return cat
  }
  return 'etc'
}

function parseDaysLeft(text: string): number | null {
  if (text.includes('마감')) return -1
  const match = text.match(/D-(\d+)/)
  if (match) return -parseInt(match[1]!, 10) * -1  // D-30 → 30
  return null
}

async function fetchPage(page: number): Promise<Contest[]> {
  const url = `${LINKAREER_BASE}/list/contest${page > 1 ? `?page=${page}` : ''}`
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error(`[linkareer] fetch failed: ${res.status} on page ${page}`)
    return []
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const contests: Contest[] = []

  $('a.image-link').each((_, el) => {
    const card = $(el).parent().parent()

    const href = $(el).attr('href')
    if (!href) return
    const activityId = href.match(/\/activity\/(\d+)/)?.[1]
    if (!activityId) return

    const titleEl = card.find('h5.activity-title')
    const title = titleEl
      .clone()
      .children('span')
      .remove()
      .end()
      .text()
      .trim()

    if (!title) return

    const organizer =
      card.find('p.organization-name, a.organization-name').first().text().trim() || null

    const infoWrapper = card.find('div.activity-info-wrapper')
    const dayText = infoWrapper.text()
    const daysLeft = parseDaysLeft(dayText)

    const detailUrl = `${LINKAREER_BASE}/activity/${activityId}`
    const category = classifyCategory(title)

    contests.push({
      id: `linkareer-${activityId}`,
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

export async function fetchLinkareerContests(options?: { maxPages?: number }): Promise<Contest[]> {
  const maxPages = options?.maxPages ?? 2
  const results: Contest[] = []

  for (let page = 1; page <= maxPages; page++) {
    try {
      const items = await fetchPage(page)
      results.push(...items)
    } catch (err) {
      console.error(`[linkareer] error on page ${page}:`, err)
    }
  }

  return results
}
