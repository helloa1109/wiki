# DBC Wiki 프로젝트

## 구조
Turborepo + pnpm workspaces 모노레포
- `apps/web` — 사용자 웹사이트 (Next.js 14, App Router)
- `apps/admin` — 관리자 시스템 (Next.js 14, App Router)
- `packages/database` — 공유 Supabase 타입

## 기술 스택
- Framework: Next.js 14 App Router (Server Components 기본)
- Styling: Tailwind CSS
- DB: Supabase (PostgreSQL, RLS)
- Auth: Supabase Auth + SSR (`@supabase/ssr`)
- Icons: lucide-react
- Monorepo: Turborepo + pnpm

## Supabase 클라이언트 패턴
- `apps/web/src/lib/supabase/server.ts` — 서버용 (anon key)
- `apps/admin/src/lib/supabase/admin.ts` — 서비스 롤 (secret key, server-only)
- `apps/admin/src/lib/supabase/server.ts` — 서버용
- `apps/admin/src/lib/supabase/client.ts` — 클라이언트용

## 환경변수
### web
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key, sb_publishable_...)
- `NEXT_PUBLIC_GOOGLE_ANALYTICS`

### admin
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (service role, sb_secret_...)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- `GA4_PROPERTY_ID` (535782678)

## 데이터베이스 주요 테이블
- `posts`: id, title, content, thumbnail_url, tags(array), author_id, published, created_at, updated_at
- `profiles`: id, email, nickname, status(pending/approved/rejected), created_at

## 빌드
- 로컬: `cd apps/web && npx next build` (pnpm --filter web build는 간헐적 오류)
- Vercel web: Root Directory=`apps/web`, Build=`pnpm build`
- Vercel admin: Root Directory=`apps/admin`, Build=`pnpm build`

## 하지 말 것
- `createAdminClient()`에 `Database` 제네릭 붙이지 말 것 → update() 타입 never 오류
- Supabase select() 타입 추론 안 되면 `as { data: Type | null }` 캐스팅 사용
- admin 클라이언트를 클라이언트 번들에 포함하지 말 것 (`import 'server-only'` 필수)
- `observer.disconnect()` 후 entries 배열 구조분해 금지 → entry possibly undefined

## 커밋 컨벤션
`type(scope): subject` — feat, fix, style, refactor, chore, docs, test
한글 subject 허용. 예: `feat(web): 검색 모달 추가`
