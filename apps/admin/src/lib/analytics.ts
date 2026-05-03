import 'server-only'
import { google } from 'googleapis'

export interface AnalyticsData {
  pageViews7d: number
  activeUsers7d: number
  sessions7d: number
  avgSessionDuration: number
}

export async function getAnalyticsData(): Promise<AnalyticsData | null> {
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth })

    const { data } = await analyticsData.properties.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
        ],
      },
    })

    const row = data.rows?.[0]?.metricValues
    if (!row) return null

    return {
      pageViews7d: parseInt(row[0]?.value ?? '0'),
      activeUsers7d: parseInt(row[1]?.value ?? '0'),
      sessions7d: parseInt(row[2]?.value ?? '0'),
      avgSessionDuration: parseFloat(row[3]?.value ?? '0'),
    }
  } catch {
    return null
  }
}
