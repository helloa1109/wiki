import { google } from 'googleapis'
import http from 'http'
import { URL } from 'url'

// .env.local에서 값을 가져오거나 직접 입력하세요
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'http://localhost:8080'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET 환경변수를 설정해주세요.')
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/analytics.readonly'],
  prompt: 'consent',
})

console.log('\n아래 URL을 브라우저에서 열어주세요:\n')
console.log(authUrl)
console.log('\n브라우저에서 로그인 후 자동으로 토큰이 출력됩니다...\n')

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  const code = url.searchParams.get('code')

  if (!code) {
    res.end('code가 없습니다.')
    return
  }

  try {
    const { tokens } = await oauth2Client.getToken(code)
    console.log('✅ 완료! 아래 값을 .env.local에 추가하세요:\n')
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`)
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`)
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
    res.end('✅ 완료! 터미널에서 토큰을 확인하세요. 이 창은 닫아도 됩니다.')
  } catch (e) {
    console.error('❌ 오류:', e.message)
    res.end('오류가 발생했습니다.')
  } finally {
    server.close()
  }
})

server.listen(8080)
