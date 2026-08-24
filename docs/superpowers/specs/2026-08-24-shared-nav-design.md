# 공용 nav 바 추출 설계

## 배경 / 문제

현재 nav 바(`<nav class="site-nav">...</nav>`)와 그 CSS(`.site-nav` 관련 3개 규칙)가 6곳에 동일하게 중복돼 있다.

- HTML: `index.html`, `public/about.html`, `public/contact.html`, `public/faq.html`, `public/guide.html`, `public/privacy.html` — 6개 파일 모두 같은 `<nav>` 마크업을 그대로 복사해 갖고 있음.
- CSS: `public/about.html` 등 5개 파일의 inline `<style>` 블록 + `src/styles.css` — 총 6곳에 `.site-nav`, `.site-nav a`, `.site-nav a:hover` 규칙이 동일하게 중복.

링크를 하나 추가/변경하려면 6개 파일을 전부 고쳐야 하는 상태. 이를 단일 소스로 합치고 빌드 시점에 각 페이지에 주입하도록 만든다.

## 제약 조건

- Vite는 프로젝트 루트의 `index.html`만 HTML 엔트리로 처리(변환)하고, `public/` 안의 파일은 어떤 처리도 없이 `dist/`로 그대로 복사한다. 따라서 `public/*.html`을 Vite가 실제로 처리하게 하려면 `public/` 밖으로 옮겨야 한다.
- `404.html`, `favicon.svg`, `robots.txt`, `ads.txt`, `sitemap.xml`은 nav가 없고 처리할 필요도 없으므로 `public/`에 그대로 둔다.
- 새 의존성 추가 없이 Vite 기본 API(`transformIndexHtml`)만 사용한다.

## 설계

### 1. 파일 구조 & 빌드 설정

- `public/about.html`, `public/contact.html`, `public/faq.html`, `public/guide.html`, `public/privacy.html`을 프로젝트 루트로 이동 (`index.html`과 같은 위치).
- `vite.config.js`의 `build.rollupOptions.input`에 6개 HTML 엔트리(`index.html` + 이동된 5개)를 등록. 빌드 결과물(`dist/*.html`)의 위치와 파일명은 지금과 동일하게 유지된다.

### 2. 공용 nav — 단일 소스 + 빌드/dev 시점 주입

- 새 파일 `src/nav.html`: `<nav class="site-nav">...</nav>` 블록만 포함하는 유일한 원본.
- 6개 페이지 전부에서 기존 `<nav>...</nav>` 마크업을 `<!--NAV-->` 플레이스홀더 주석으로 교체.
- `vite.config.js`에 인라인 커스텀 플러그인 추가: `transformIndexHtml` 훅에서 `src/nav.html`을 읽어 `<!--NAV-->`를 그 내용으로 치환. 이 훅은 `vite dev`와 `vite build` 양쪽에서 모두 실행되므로, dev 서버에서 새로고침만 해도 최신 nav가 반영되고 빌드 결과물에도 동일하게 적용된다.

### 3. 공용 CSS

- 새 파일 `src/nav.css`: `.site-nav`, `.site-nav a`, `.site-nav a:hover` 3개 규칙만 포함.
- `src/styles.css` 상단에 `@import './nav.css';` 추가하고 기존 3개 규칙은 제거 (`index.html`은 `main.js` → `styles.css` 번들 경로로 이미 커버됨, 추가 변경 불필요).
- 이동된 5개 페이지: inline `<style>` 블록에서 동일한 3개 규칙 제거하고, `<head>`에 `<link rel="stylesheet" href="/src/nav.css">` 추가.

## 범위 밖 (Out of scope)

- 5개 페이지 inline `<style>`에 남아있는 `body`/`main`/`h1` 등 나머지 공통 규칙의 중복 제거는 이번 작업 범위가 아님 (nav 관련 중복만 처리).
- 현재 페이지를 강조하는 active-link 스타일링은 기존에도 없던 기능이라 추가하지 않음.

## 검증

로직이 없는 마크업/설정 변경이므로 유닛 테스트 대상은 아니다.

1. `npm run dev` 실행 후 6개 페이지 모두에서 nav가 정상 렌더링되고 링크가 동작하는지 확인.
2. `src/nav.html`을 한 번 수정해 6개 페이지 전체에 반영되는지 확인 (단일 소스 검증).
3. `npm run build` 실행 후 `dist/*.html`에 실제 nav 마크업이 박혀있고 `<!--NAV-->` 플레이스홀더가 남아있지 않은지 확인.
