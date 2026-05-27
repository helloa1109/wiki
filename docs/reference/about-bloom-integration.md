# About 페이지 — 꽃 Hero + 가로 스크롤 섹션 통합 작업 지시서

> 작업자: Claude Code
> 대상: `wiki-eosin-eta` 프로젝트의 `/about` 페이지
> 목표: 기존 About 페이지에 (1) Three.js 기반 인터랙티브 꽃 hero 섹션과 (2) GSAP ScrollTrigger 기반 가로 스크롤 작품 갤러리를 추가한다.
> 작업 시간 예상: 1.5~2시간
> 단일 HTML 레퍼런스: 별첨 `bloom.html` (Claude가 생성한 standalone 데모. 동작/스타일/인터랙션의 기준 소스).

---

## 0. 작업 시작 전 필수 확인

다음을 **순서대로** 확인하고 보고할 것. 추측하지 말고 실제 파일을 열어보고 답할 것.

1. 프로젝트 루트의 `package.json`을 읽고 다음을 확인:
   - Next.js 버전 (App Router인지 Pages Router인지)
   - React 버전
   - 이미 설치된 `three`, `gsap` 패키지 유무
   - 스타일 솔루션 (Tailwind / CSS Modules / styled-components / 그 외)
2. `/app/about/page.tsx` 또는 `/pages/about.tsx` 위치 확인 후 현재 구조 읽기
3. 기존 폰트 로딩 방식 확인 (`next/font` 사용 여부, 어떤 폰트들이 이미 로드되어 있는지)
4. 전역 레이아웃의 다크모드 처리 방식 확인 (`next-themes`인지 직접 구현인지)
5. 위 5가지를 보고한 다음 작업 시작. **작업자가 위 정보를 모른 채로 코드를 쓰면 안 됨.**

---

## 1. 의존성 설치

```bash
npm install three gsap
npm install -D @types/three
```

만약 이미 설치되어 있다면 버전만 확인해서 보고하고 스킵.

---

## 2. 파일 구조

About 페이지 안에서만 사용되는 격리된 컴포넌트로 만든다. 전역 스타일이나 다른 페이지에 영향 가지 않게 할 것.

```
/app/about/                         (또는 /pages/about/)
├── page.tsx                        ← 기존 페이지. 섹션 삽입만 함.
└── _components/
    ├── BloomHero.tsx               ← Three.js 꽃 hero 섹션
    ├── BloomHero.module.css        ← Hero 전용 스타일
    ├── HorizontalWorks.tsx         ← 가로 스크롤 갤러리 섹션
    └── HorizontalWorks.module.css  ← 갤러리 전용 스타일
```

CSS Modules가 프로젝트에서 안 쓰이면 프로젝트의 표준 스타일링 방식을 따를 것 (예: Tailwind면 `className` 직접, styled-components면 styled로). **단, 전역 CSS 오염 금지.**

---

## 3. BloomHero 컴포넌트 — 작업 사양

### 3.1 위치
About 페이지 최상단. 기존 "Team DBC / 우리는 경험을 설계합니다" 영역을 **대체**하지 말고, 그 **위에 새 hero로 추가**한 다음 기존 인트로는 그대로 둘 것. (안전을 위해 기존 콘텐츠는 절대 삭제하지 말 것.)

### 3.2 시각 요소
- 전체 화면 (`min-height: 100dvh`)
- 배경: `radial-gradient(ellipse at 30% 20%, #f5f2ff 0%, #e6e5ee 60%, #d8d7e2 100%)`
- 전경: Three.js 캔버스 (`position: fixed; inset: 0; z-index: 1`) — **단, 이 hero 섹션이 화면에 보일 때만 렌더링**. 안 보이면 렌더 루프 중단해서 GPU 절약.
- 캔버스 위에 BLOOM 타이포(또는 "DBC"로 변경) 글래스 그라디언트
- 우측 하단에 카피(`Enter the living garden.`)와 description, glass-pill 형태의 CTA 버튼
- 하단 중앙에 "Scroll · 아래로 스크롤하세요" indicator

### 3.3 Three.js 사양 (필수)
- `IcosahedronGeometry(1, 5)` 베이스 (모바일은 detail=3)
- 셰이더는 별첨 `bloom.html`의 `vertexShader` / `fragmentShader` 문자열을 **그대로 복사해 사용**. 직접 다시 쓰지 말 것.
- 7가지 파스텔 팔레트 랜덤 분배 (`bloom.html`의 `palettes` 배열 그대로 사용)
- 꽃 개수: 데스크탑 36개, 모바일 18개
- 인터랙션:
  - 마우스 위치를 raycaster로 z=0 plane에 투영
  - 가까운 꽃은 exponential falloff로 밀려남 (`Math.exp(-dist * 0.35)`)
  - 모든 움직임은 `lerp` 0.08~0.12로 부드럽게
  - 카메라도 마우스 따라 미세하게 parallax
- 모든 변환(이동, 회전, 스케일)은 `requestAnimationFrame` 루프 안에서. CSS 애니메이션 쓰지 말 것.
- 컴포넌트 unmount 시 반드시 cleanup:
  ```ts
  return () => {
    cancelAnimationFrame(rafId);
    renderer.dispose();
    geometry.dispose();
    flowers.forEach(f => f.material.dispose());
    canvas.remove();
  };
  ```

### 3.4 SSR 처리
Next.js이므로 Three.js는 SSR이 불가능. 다음 중 하나로 처리:
- `'use client'` 디렉티브 + `useEffect` 안에서 Three 초기화 (App Router 권장)
- 또는 `dynamic(() => import('./BloomHero'), { ssr: false })` 사용

`window`, `document`는 반드시 `useEffect` 안에서만 접근. 로딩 중에는 placeholder(검정 또는 그라디언트 배경)만 보여주고 mount 후 fade-in.

### 3.5 인터랙션 디테일 (UX 가이드)
- 데스크탑만 커스텀 커서 + magnetic 버튼 + 타이포 마우스 반발 적용
- 모바일은 cursor: auto, 커스텀 커서 숨김, hero 영역 터치도 꽃 인터랙션 동작 (touchmove → 마우스와 동일 처리)
- 페이지 로드 시 글자별 stagger reveal (delay 0.3s → 0.62s)
- 절대로 모바일에서 데스크탑 인터랙션을 강제하지 말 것

### 3.6 안전장치
- Three.js 초기화 실패 시 (CDN 실패, WebGL 비활성화 등)에는 try/catch로 잡고 캔버스만 숨긴 채 그라디언트 배경 + 텍스트는 정상 표시
- 로더가 있다면 최대 4초 안에 무조건 hide되는 timeout 안전장치 추가

---

## 4. HorizontalWorks 컴포넌트 — 작업 사양

### 4.1 위치
About 페이지의 "Our Values" 섹션 **앞에** 삽입. (Hero → 기존 인트로 → What is DBC → **HorizontalWorks (신규)** → Our Values → What We Do → CTA 순)

### 4.2 시각 요소
- 다크 톤 배경 (`#0d0c18`), 위아래 fade로 주변 섹션과 자연스럽게 연결
- 좌측 상단: 작은 eyebrow "Selected Works · 05" + 큰 italic 제목
- 우측 상단: "Scroll to explore / ↓ becomes →" 보조 텍스트
- 중앙: 가로 트랙에 카드 5장 (Liquid Bloom, Tidal Garden, Coral Drift, Aurora Spin, Meadow Sequence)
- 하단 중앙: 진행률 바 (240px 너비, 채워지면서 진행도 표시)

카드 콘텐츠는 일단 더미로 두되, 추후 DBC 실제 Works로 교체 가능하도록 **배열로 정의**:
```ts
const works = [
  { num: '01', title: 'Liquid Bloom', tag: 'Generative · Blender · 2026', artClass: 'art-1' },
  // ...
];
```

### 4.3 카드 art
별첨 `bloom.html`의 `.art-1` ~ `.art-5` CSS를 그대로 사용. radial-gradient + conic-gradient + blur + CSS animation 조합.

### 4.4 GSAP ScrollTrigger 사양
```ts
gsap.registerPlugin(ScrollTrigger);

const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

gsap.to(track, {
  x: () => -getDistance(),
  ease: 'none',
  scrollTrigger: {
    trigger: pinWrap,
    pin: true,
    scrub: 1,
    start: 'top top',
    end: () => '+=' + getDistance(),
    invalidateOnRefresh: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      progressBar.style.width = (self.progress * 100) + '%';
    }
  }
});
```

### 4.5 모바일 처리 (중요)
**모바일에서는 ScrollTrigger hijack을 절대 적용하지 말 것.** iOS Safari의 momentum scroll과 충돌해서 UX가 망가짐. 미디어 쿼리 + JS 분기 두 군데 모두 처리:

- CSS: `@media (max-width: 768px)` 안에서 `.horizontal-track { flex-direction: column; transform: none !important; }`, `.h-progress { display: none; }` 등
- JS: `if (!isMobile)` 안에서만 ScrollTrigger 등록

`isMobile` 판정 기준:
```ts
const isMobile = window.matchMedia('(max-width: 768px)').matches ||
                 /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
```

### 4.6 cleanup
unmount 시 반드시 ScrollTrigger 인스턴스 kill:
```ts
return () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
};
```

---

## 5. 기존 페이지와의 통합

### 5.1 페이지 구조 (최종)
```tsx
export default function AboutPage() {
  return (
    <>
      <BloomHero />          {/* 신규 */}
      {/* 기존 인트로 (Team DBC / 우리는 경험을 설계합니다) */}
      {/* 기존 What is DBC */}
      <HorizontalWorks />    {/* 신규 */}
      {/* 기존 Our Values */}
      {/* 기존 What We Do */}
      {/* 기존 CTA */}
    </>
  );
}
```

### 5.2 z-index / 레이어 주의사항
- 사이트 글로벌 nav가 fixed라면 BloomHero의 캔버스(z-index: 1)나 텍스트(z-index: 5)가 nav를 가리지 않게 nav의 z-index를 확인 후 더 높게 유지
- 작업 전 반드시 글로벌 nav의 z-index를 grep으로 찾아보고 보고할 것

### 5.3 폰트
별첨 데모는 `Fraunces` (italic) + `Inter Tight`를 사용. 프로젝트가 이미 다른 serif/sans를 쓰고 있다면 그것을 따를 것. 다만 **BLOOM 글자만큼은 굵은 italic serif**가 미디어아트 무드의 핵심이므로, 프로젝트 기본 serif가 italic을 지원하지 않으면 그 글자만 `next/font/google`로 Fraunces 추가 로드.

---

## 6. 작업 순서 (이 순서대로)

1. **사전 조사 보고** (0번 항목)
2. **의존성 설치 + 빈 컴포넌트 파일 생성** → 빌드 깨지지 않는지 먼저 확인
3. **HorizontalWorks 먼저 구현** (난이도 낮음, 즉시 시각적 결과 확인 가능)
4. **About 페이지에 HorizontalWorks 삽입** → 로컬 dev 서버에서 동작 확인
5. **BloomHero 구현** (Three.js 셋업 + 셰이더 복사 + 인터랙션)
6. **About 페이지 최상단에 BloomHero 삽입**
7. **데스크탑 / 모바일 양쪽 테스트**
8. **prod 빌드 통과 확인** (`npm run build`) — Three.js 관련 SSR 에러나 타입 에러 잡기
9. **기존 페이지의 다른 섹션/스타일이 깨지지 않았는지 회귀 확인**

각 단계마다 결과를 보고할 것. **한 번에 다 만들지 말고 단계별 확인 받기.**

---

## 7. 절대 하지 말 것

- 기존 About 페이지 콘텐츠 삭제 또는 임의 수정 (텍스트, 구조 둘 다)
- 전역 CSS (`globals.css`)에 새 스타일 추가
- 기존 다른 페이지 (`/`, `/posts`, `/works`)에 영향 주는 변경
- 모바일에서 가로 스크롤 hijack 강제
- 셰이더 코드를 "개선"한답시고 직접 수정 (별첨 데모 그대로 복사 사용)
- `package.json`에서 기존 의존성 버전 변경 (`three`, `gsap` 신규 추가만 허용)
- 라이센스 없는 외부 이미지 임포트
- `any` 타입 남발 — Three.js는 `@types/three`로 타입 잡고 시작할 것

---

## 8. 완료 정의 (Done 기준)

- [ ] `/about` 진입 시 첫 화면이 파스텔 hero + 살아 움직이는 꽃들
- [ ] 마우스 따라 꽃들이 부드럽게 밀려남
- [ ] 스크롤 내리면 기존 About 콘텐츠 정상 노출
- [ ] "What is DBC" 다음에 다크 톤 가로 스크롤 섹션 등장
- [ ] 휠 스크롤하면 카드 5장이 가로로 흘러가고, 진행률 바가 채워짐
- [ ] 가로 끝나면 자연스럽게 "Our Values"로 넘어감
- [ ] 모바일에서 가로 섹션은 세로 스택, 인터랙션은 모두 부드럽게 동작
- [ ] `npm run build` 통과
- [ ] 다른 페이지 동작 변화 없음

---

## 9. 별첨

`bloom.html` 파일 (Claude가 생성한 standalone 데모, 단일 HTML)을 프로젝트 루트의 `/docs/reference/bloom.html`로 복사해두고, 작업 중 셰이더/CSS/인터랙션 코드를 옮길 때 그대로 복사해서 사용. 데모는 작업 완료 후 삭제 또는 git ignore에 추가.

---

## 10. 의문점이 생기면

작업 중 사양이 모호하거나 기존 코드와 충돌 나면 **추측해서 진행하지 말고 보고 후 대기**. 특히:
- 다크모드/라이트모드 토글이 있을 경우 hero가 어느 모드에 맞춰 색이 결정되는지
- 글로벌 nav가 hero 위로 오버레이되는지 hero가 nav 아래로 내려가는지
- "Works" 페이지가 이미 있는데 가로 스크롤 카드가 그 콘텐츠와 중복되거나 어색해지지 않는지

이 셋은 반드시 작업자가 결정하지 말고 사용자에게 확인받을 것.
