import { createClient } from 'jsr:@supabase/supabase-js@2'
import { load } from 'npm:cheerio@1'

const WEVITY_BASE = 'https://www.wevity.com'
const LINKAREER_BASE = 'https://linkareer.com'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

type Category = 'ai' | 'dev' | 'planning' | 'startup' | 'etc'

const KEYWORDS: Record<Category, string[]> = {
  ai: ['ai', '인공지능', '머신러닝', '딥러닝', 'nlp', '챗봇', 'gpt', 'llm', '데이터', '비전'],
  dev: ['sw', '소프트웨어', '개발', '앱', '웹', '해커톤', 'it', '코딩', '프로그래밍', 'iot', '클라우드'],
  planning: ['기획', 'ux', 'ui', '서비스', '디자인', '아이디어'],
  startup: ['창업', '스타트업', '사업계획', '비즈니스', '벤처'],
  etc: [],
}

function classify(text: string): Category {
  const t = text.toLowerCase()
  for (const [cat, kws] of Object.entries(KEYWORDS) as [Category, string[]][]) {
    if (cat === 'etc') continue
    if (kws.some((kw) => t.includes(kw))) return cat
  }
  return 'etc'
}

interface ContestRow {
  external_id: string
  title: string
  organizer: string | null
  category: string
  start_date: string | null
  end_date: string | null
  days_left: number | null
  prize: string | null
  target: string | null
  detail_url: string
  thumbnail_url: string | null
  source: string
  scraped_at: string
}

async function scrapeWevity(maxPages = 3): Promise<ContestRow[]> {
  const results: ContestRow[] = []
  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `${WEVITY_BASE}/?c=find&s=1&gp=${page}`
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!res.ok) {
        console.error(`[wevity] ${res.status} on page ${page}`)
        continue
      }
      const $ = load(await res.text())
      $('ul.list > li').each((_, el) => {
        if ($(el).hasClass('top')) return
        const titleEl = $(el).find('div.tit > a')
        const title = titleEl.clone().children('span').remove().end().text().trim()
        const href = titleEl.attr('href')
        if (!title || !href) return

        const id = href.match(/ix=(\d+)/)?.[1] ?? href
        const detailUrl = `${WEVITY_BASE}/${href.replace(/^\//, '')}`
        const organizer = $(el).find('div.organ').text().trim() || null
        const field = $(el).find('div.sub-tit').text().replace('분야 :', '').trim()
        const dayText = $(el).find('div.day').text().trim()
        const daysMatch = dayText.match(/D-(\d+)/)
        const daysLeft = daysMatch ? parseInt(daysMatch[1]!) : null

        results.push({
          external_id: `wevity-${id}`,
          title,
          organizer,
          category: classify(title + ' ' + field),
          start_date: null,
          end_date: null,
          days_left: daysLeft,
          prize: null,
          target: null,
          detail_url: detailUrl,
          thumbnail_url: null,
          source: 'wevity',
          scraped_at: new Date().toISOString(),
        })
      })
    } catch (err) {
      console.error(`[wevity] error page ${page}:`, err)
    }
  }
  return results
}

async function scrapeLinkareer(maxPages = 2): Promise<ContestRow[]> {
  const results: ContestRow[] = []
  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `${LINKAREER_BASE}/list/contest${page > 1 ? `?page=${page}` : ''}`
      const res = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!res.ok) {
        console.error(`[linkareer] ${res.status} on page ${page}`)
        continue
      }
      const $ = load(await res.text())
      $('a.image-link').each((_, el) => {
        const card = $(el).parent().parent()
        const href = $(el).attr('href')
        if (!href) return
        const activityId = href.match(/\/activity\/(\d+)/)?.[1]
        if (!activityId) return

        const titleEl = card.find('h5.activity-title')
        const title = titleEl.clone().children('span').remove().end().text().trim()
        if (!title) return

        const organizer = card.find('p.organization-name, a.organization-name').first().text().trim() || null
        const dayText = card.find('div.activity-info-wrapper').text()
        let daysLeft: number | null = null
        if (dayText.includes('마감')) {
          daysLeft = -1
        } else {
          const m = dayText.match(/D-(\d+)/)
          if (m) daysLeft = parseInt(m[1]!)
        }

        const thumbnailUrl = $(el).find('img.activity-image').attr('src') ?? null

        results.push({
          external_id: `linkareer-${activityId}`,
          title,
          organizer,
          category: classify(title),
          start_date: null,
          end_date: null,
          days_left: daysLeft,
          prize: null,
          target: null,
          detail_url: `${LINKAREER_BASE}/activity/${activityId}`,
          thumbnail_url: thumbnailUrl || null,
          source: 'linkareer',
          scraped_at: new Date().toISOString(),
        })
      })
    } catch (err) {
      console.error(`[linkareer] error page ${page}:`, err)
    }
  }
  return results
}

Deno.serve(async (req) => {
  // 인증 헤더 확인 (cron 호출 허용)
  const authHeader = req.headers.get('Authorization')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    serviceKey,
  )

  const [wevityContests, linkareerContests] = await Promise.allSettled([
    scrapeWevity(3),
    scrapeLinkareer(2),
  ])

  const all: ContestRow[] = [
    ...(wevityContests.status === 'fulfilled' ? wevityContests.value : []),
    ...(linkareerContests.status === 'fulfilled' ? linkareerContests.value : []),
  ]

  if (all.length === 0) {
    return new Response(JSON.stringify({ error: 'no contests scraped' }), { status: 500 })
  }

  const { error } = await supabase
    .from('contests')
    .upsert(all, { onConflict: 'external_id' })

  if (error) {
    console.error('[scrape-contests] upsert error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(
    JSON.stringify({ ok: true, count: all.length }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
