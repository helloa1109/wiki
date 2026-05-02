# DBC

> 기획하고, 만들고, 함께 기록하는 팀.

PM · 기획자 · 개발자가 함께 만드는 블로그이자 위키입니다.
우리가 배우고, 고민하고, 만들어낸 것들을 여기에 쌓아갑니다.

<br/>

## 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Monorepo | Turborepo + pnpm |
| Deploy | Vercel |

<br/>

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

`apps/web/.env.local` 파일에 환경변수를 설정해주세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

<br/>

## 구조

```
wiki/
├── apps/
│   └── web/                # Next.js 앱
│       └── src/
│           ├── app/        # 라우팅
│           ├── components/ # UI 컴포넌트
│           └── lib/        # 유틸리티, 훅
│
└── packages/
    ├── database/           # Supabase 클라이언트 & 타입 (@chat/database)
    ├── ui/                 # 공유 UI 컴포넌트 (@chat/ui)
    └── typescript-config/  # 공유 TS 설정
```

<br/>

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm type-check   # 타입 검사
pnpm lint         # 린트
pnpm format       # 포맷팅
```

<br/>

## 커밋 컨벤션

```
type(scope): subject
```

`feat` · `fix` · `style` · `refactor` · `chore` · `docs` · `remove`

<br/>

---

[helloa1109](https://github.com/helloa1109) · Deployed on [Vercel](https://vercel.com)
