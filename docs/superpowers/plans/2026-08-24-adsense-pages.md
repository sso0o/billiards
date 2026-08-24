# AdSense 승인용 페이지 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 애드센스 승인을 가로막는 "콘텐츠 부족 / 탐색 불가" 문제를 해결하기 위해 소개·이용방법·개인정보처리방침·문의 4개 정적 페이지와 전 페이지 공통 네비 바를 추가한다.

**Architecture:** 기존 도구는 `index.html` 하나뿐인 순수 SPA다. 새 페이지 4개는 `public/`에 순수 정적 HTML로 추가해 Vite가 빌드 설정 변경 없이 `dist/` 루트로 그대로 복사하도록 한다. 전 페이지는 동일한 상대경로 네비 바(`index.html` / `about.html` / `guide.html` / `privacy.html` / `contact.html`)로 서로 연결된다. 콘텐츠는 정적 텍스트뿐이라 로직이 없으므로, 각 태스크의 "테스트" 단계는 자동화 유닛 테스트 대신 `npm run build` 출력물과 네비 링크 존재 여부를 `grep`으로 확인하는 방식을 쓴다 (스펙에 명시된 대로 이 범위는 자동화 테스트 대상이 아님).

**Tech Stack:** Vite (정적 파일 복사, 빌드 설정 변경 없음), 순수 HTML/CSS.

**Spec:** `docs/superpowers/specs/2026-08-24-adsense-pages-design.md`

---

### Task 1: 도구 페이지(index.html)에 네비 바 추가

**Files:**
- Modify: `index.html`
- Modify: `src/styles.css`

- [ ] **Step 1: `src/styles.css` 맨 끝에 네비 바 스타일 추가**

`src/styles.css` 파일 끝에 다음을 추가한다:

```css

.site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
.site-nav a { color: #a8c3b0; text-decoration: none; }
.site-nav a:hover { text-decoration: underline; }
```

- [ ] **Step 2: `index.html`의 `<body>`를 다음으로 교체**

기존:
```html
  <body><main id="app"></main><script type="module" src="/src/main.js"></script></body>
```

변경 후:
```html
  <body>
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
    <main id="app"></main>
    <script type="module" src="/src/main.js"></script>
  </body>
```

- [ ] **Step 3: 개발 서버로 확인**

Run: `npm run dev`
브라우저로 `http://localhost:5173` 열어 상단에 네비 바(홈·소개·이용방법·개인정보처리방침·문의)가 보이고 도구가 그대로 동작하는지 확인한다. (이 시점에서는 다른 링크는 아직 404 — 다음 태스크들에서 생성)

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles.css
git commit -m "도구 페이지에 네비게이션 바 추가"
```

---

### Task 2: 소개 페이지 추가

**Files:**
- Create: `public/about.html`

- [ ] **Step 1: `public/about.html` 생성**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>소개 - 당구 경로 도해</title>
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
    </style>
  </head>
  <body>
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
    <main>
      <h1>당구 경로 도해 — 소개</h1>
      <p>당구 경로 도해는 4구·3쿠션 당구 샷의 예상 경로를 브라우저에서 바로 시각화해주는 무료 웹 도구입니다.</p>
      <p>큐볼과 목적구를 테이블 위에 드래그로 배치하고, 두께(두껍게/얇게)와 당점(시계 방향 위치·레벨)을 조절하면 쿠션 반사, 회전(영어), 팔로우/드로우 효과까지 반영한 예상 경로가 즉시 그려집니다. 회원가입이나 설치 없이 브라우저에서 바로 사용할 수 있습니다.</p>
      <p>당구를 연습하거나 두께·당점에 따른 공의 움직임을 직관적으로 확인하고 싶은 분들을 위해 만들었습니다.</p>
    </main>
  </body>
</html>
```

- [ ] **Step 2: 빌드 후 산출물 확인**

Run: `npm run build && ls dist/about.html`
Expected: `dist/about.html` 존재.

- [ ] **Step 3: Commit**

```bash
git add public/about.html
git commit -m "소개 페이지 추가"
```

---

### Task 3: 이용방법 페이지 추가

**Files:**
- Create: `public/guide.html`

- [ ] **Step 1: `public/guide.html` 생성**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>이용 방법 - 당구 경로 도해</title>
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      li { margin-bottom: 12px; }
    </style>
  </head>
  <body>
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
    <main>
      <h1>이용 방법</h1>
      <ol>
        <li><strong>모드 선택</strong> — 화면 상단 컨트롤 패널에서 "4구" 또는 "3쿠션" 모드를 선택합니다.</li>
        <li><strong>공 배치</strong> — "수구", "제1목적구" 드롭다운으로 공을 고르고, 테이블 위에서 공을 드래그해 원하는 위치로 옮깁니다.</li>
        <li><strong>두께 조절</strong> — 두껍게/얇게 옵션으로 큐볼이 목적구를 맞히는 두께를 조절합니다.</li>
        <li><strong>당점 선택</strong> — 시계식 당점 선택기에서 원하는 위치(시계 방향)와 레벨(강도)을 클릭해 회전·팔로우/드로우 효과를 지정합니다.</li>
        <li><strong>경로 확인</strong> — 큐볼 경로(하늘색)와 목적구 경로(파란색), 쿠션 반사 지점이 테이블 위에 실시간으로 표시됩니다. 경로 중간에 다른 공이 걸리면 경고 메시지가 나타납니다.</li>
      </ol>
    </main>
  </body>
</html>
```

- [ ] **Step 2: 빌드 후 산출물 확인**

Run: `npm run build && ls dist/guide.html`
Expected: `dist/guide.html` 존재.

- [ ] **Step 3: Commit**

```bash
git add public/guide.html
git commit -m "이용방법 페이지 추가"
```

---

### Task 4: 개인정보처리방침 페이지 추가

**Files:**
- Create: `public/privacy.html`

- [ ] **Step 1: `public/privacy.html` 생성**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>개인정보처리방침 - 당구 경로 도해</title>
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.1rem; margin-top: 28px; }
      a { color: #75e3ef; }
    </style>
  </head>
  <body>
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
    <main>
      <h1>개인정보처리방침</h1>
      <p>시행일: 2026-08-24</p>
      <p>당구 경로 도해(이하 "사이트")는 별도의 회원가입이나 로그인 없이 누구나 이용할 수 있으며, 이용자로부터 이름·이메일 등 개인정보를 직접 수집하지 않습니다.</p>
      <h2>광고 서비스</h2>
      <p>본 사이트는 광고 게재를 위해 Google AdSense를 사용합니다. Google과 협력 광고 제공업체는 쿠키를 사용해 이용자의 이전 방문 기록을 기반으로 광고를 게재할 수 있습니다. 이용자는 <a href="https://adssettings.google.com" rel="noopener">Google 광고 설정</a>에서 맞춤 광고를 비활성화할 수 있습니다.</p>
      <h2>문의</h2>
      <p>개인정보 처리와 관련해 문의사항이 있으시면 아래 이메일로 연락해 주십시오.<br><a href="mailto:thduschdl@gmail.com">thduschdl@gmail.com</a></p>
    </main>
  </body>
</html>
```

- [ ] **Step 2: 빌드 후 산출물 확인**

Run: `npm run build && ls dist/privacy.html`
Expected: `dist/privacy.html` 존재.

- [ ] **Step 3: Commit**

```bash
git add public/privacy.html
git commit -m "개인정보처리방침 페이지 추가"
```

---

### Task 5: 문의 페이지 추가

**Files:**
- Create: `public/contact.html`

- [ ] **Step 1: `public/contact.html` 생성**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>문의 - 당구 경로 도해</title>
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      a { color: #75e3ef; }
    </style>
  </head>
  <body>
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
    <main>
      <h1>문의</h1>
      <p>버그 제보, 기능 제안, 광고·정책 관련 문의 등은 아래 이메일로 보내주세요.</p>
      <p><a href="mailto:thduschdl@gmail.com">thduschdl@gmail.com</a></p>
    </main>
  </body>
</html>
```

- [ ] **Step 2: 빌드 후 산출물 확인**

Run: `npm run build && ls dist/contact.html`
Expected: `dist/contact.html` 존재.

- [ ] **Step 3: Commit**

```bash
git add public/contact.html
git commit -m "문의 페이지 추가"
```

---

### Task 6: 전체 빌드 검증 및 네비 링크 점검

**Files:** 없음 (검증만)

- [ ] **Step 1: 전체 산출물 확인**

Run: `npm run build && ls dist/*.html`
Expected: `dist/about.html`, `dist/contact.html`, `dist/guide.html`, `dist/index.html`, `dist/privacy.html` 5개 모두 출력.

- [ ] **Step 2: 각 페이지의 네비가 5개 링크를 모두 포함하는지 확인**

Run:
```bash
for f in dist/index.html dist/about.html dist/guide.html dist/privacy.html dist/contact.html; do
  echo "== $f =="
  grep -o 'href="[a-z]*\.html"' "$f" | sort -u
done
```
Expected: 5개 파일 모두 `href="index.html"`, `href="about.html"`, `href="guide.html"`, `href="privacy.html"`, `href="contact.html"` 5줄이 전부 출력됨.

- [ ] **Step 3: 개발 서버에서 수동 클릭 확인**

Run: `npm run dev`
브라우저로 각 페이지를 직접 열어(`/index.html`, `/about.html`, `/guide.html`, `/privacy.html`, `/contact.html`) 네비 바의 5개 링크를 각각 클릭하며 정상 이동하는지 확인하고, 기존 당구 도구(모드 전환, 드래그, 경로 계산)가 여전히 정상 동작하는지 확인한다.

이 태스크는 코드 변경이 없으므로 커밋하지 않는다.

---

## 완료 조건

- [ ] `public/about.html`, `public/guide.html`, `public/privacy.html`, `public/contact.html` 존재
- [ ] `index.html`과 4개 신규 페이지 모두 동일한 네비 바로 상호 연결
- [ ] `npm run build` 성공, `dist/`에 5개 html 모두 생성
- [ ] 기존 도구 기능(모드 전환, 드래그, 경로 계산) 회귀 없음
