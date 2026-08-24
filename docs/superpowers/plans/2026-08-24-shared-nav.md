# 공용 nav 바 추출 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6개 HTML 페이지(`index.html` + `public/` 안의 5개 페이지)에 중복된 `<nav class="site-nav">` 마크업과 관련 CSS를 단일 소스로 합치고, Vite 빌드/dev 시점에 자동 주입되게 만든다.

**Architecture:** `public/*.html` 5개 파일을 프로젝트 루트로 옮겨 Vite가 실제로 처리하는 멀티페이지 엔트리로 전환한다. nav HTML은 `src/nav.html`, nav CSS는 `src/nav.css`에 단일 소스로 두고, `vite.config.js`의 커스텀 `transformIndexHtml` 플러그인이 각 페이지의 `<!--NAV-->` 플레이스홀더를 `src/nav.html` 내용으로 치환한다.

**Tech Stack:** Vite 7 (native `transformIndexHtml` plugin hook, `build.rollupOptions.input`), 순수 HTML/CSS. 새 의존성 없음.

---

## Task 1: 공용 nav HTML 파일 생성

**Files:**
- Create: `src/nav.html`

- [ ] **Step 1: `src/nav.html` 작성**

```html
<nav class="site-nav">
  <a href="index.html">홈</a>
  <a href="about.html">소개</a>
  <a href="guide.html">이용방법</a>
  <a href="faq.html">FAQ</a>
  <a href="privacy.html">개인정보처리방침</a>
  <a href="contact.html">문의</a>
</nav>
```

- [ ] **Step 2: 커밋**

```bash
git add src/nav.html
git commit -m "feat: 공용 nav HTML 파일 추가"
```

---

## Task 2: 공용 nav CSS 분리

**Files:**
- Create: `src/nav.css`
- Modify: `src/styles.css`

- [ ] **Step 1: `src/nav.css` 작성**

```css
.site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
.site-nav a { color: #a8c3b0; text-decoration: none; }
.site-nav a:hover { text-decoration: underline; }
```

- [ ] **Step 2: `src/styles.css`에서 중복 규칙 제거하고 `@import` 추가**

`src/styles.css` 맨 위 (1번째 줄 `/* src/styles.css */` 바로 다음)에 import 추가:

```css
/* src/styles.css */
@import './nav.css';
:root { font-family: system-ui, sans-serif; color: #eef5f1; background: #111513; }
```

파일 맨 끝의 중복 규칙 제거 — 아래 3줄을 삭제:

```css
.site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
.site-nav a { color: #a8c3b0; text-decoration: none; }
.site-nav a:hover { text-decoration: underline; }
```

> CSS 스펙상 `@import`는 `@charset` 다음, 다른 규칙보다 앞에 와야 유효하다 — 파일 맨 위에 둬야 하는 이유.

- [ ] **Step 3: 커밋**

```bash
git add src/nav.css src/styles.css
git commit -m "refactor: nav CSS를 src/nav.css로 분리"
```

---

## Task 3: Vite 빌드 설정 — 멀티페이지 엔트리 + nav 주입 플러그인

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: `vite.config.js` 전체를 아래 내용으로 교체**

```js
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const navHtml = readFileSync(new URL('./src/nav.html', import.meta.url), 'utf-8').trim();

function injectNav() {
  return {
    name: 'inject-nav',
    transformIndexHtml(html) {
      return html.replace('<!--NAV-->', navHtml);
    },
  };
}

export default defineConfig({
  // base: '/billiards/',
  plugins: [injectNav()],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        about: 'about.html',
        contact: 'contact.html',
        faq: 'faq.html',
        guide: 'guide.html',
        privacy: 'privacy.html',
      },
    },
  },
});
```

- [ ] **Step 2: 커밋**

```bash
git add vite.config.js
git commit -m "feat: nav 자동 주입 Vite 플러그인 + 멀티페이지 빌드 설정"
```

(이 시점엔 아직 각 HTML 파일에 `<!--NAV-->` 플레이스홀더가 없으므로 `npm run dev`로 확인해도 nav가 그대로 보인다 — 정상. Task 4~9에서 각 파일을 바꾼 뒤에 최종 확인한다.)

---

## Task 4: `index.html` — nav를 플레이스홀더로 교체

**Files:**
- Modify: `index.html`

- [ ] **Step 1: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
  <nav class="site-nav">
    <a href="index.html">홈</a>
    <a href="about.html">소개</a>
    <a href="guide.html">이용방법</a>
    <a href="faq.html">FAQ</a>
    <a href="privacy.html">개인정보처리방침</a>
    <a href="contact.html">문의</a>
  </nav>
```

New:
```html
  <!--NAV-->
```

- [ ] **Step 2: 커밋**

```bash
git add index.html
git commit -m "refactor: index.html nav를 공용 플레이스홀더로 교체"
```

---

## Task 5: `about.html` — `public/`에서 루트로 이동 + nav/CSS 정리

**Files:**
- Move: `public/about.html` → `about.html`

- [ ] **Step 1: 파일 이동**

```bash
git mv public/about.html about.html
```

- [ ] **Step 2: `<head>`에 nav 스타일시트 링크 추가**

Old:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

New:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/src/nav.css">
```

- [ ] **Step 3: inline `<style>`에서 중복 `.site-nav` 규칙 제거**

Old:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
    </style>
```

New:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
    </style>
```

- [ ] **Step 4: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="faq.html">FAQ</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
```

New:
```html
    <!--NAV-->
```

- [ ] **Step 5: 커밋**

```bash
git add about.html
git commit -m "refactor: about.html을 루트로 이동하고 nav 공용화"
```

---

## Task 6: `contact.html` — `public/`에서 루트로 이동 + nav/CSS 정리

**Files:**
- Move: `public/contact.html` → `contact.html`

- [ ] **Step 1: 파일 이동**

```bash
git mv public/contact.html contact.html
```

- [ ] **Step 2: `<head>`에 nav 스타일시트 링크 추가**

Old:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

New:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/src/nav.css">
```

- [ ] **Step 3: inline `<style>`에서 중복 `.site-nav` 규칙 제거**

Old:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      a { color: #75e3ef; }
    </style>
```

New:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      a { color: #75e3ef; }
    </style>
```

- [ ] **Step 4: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="faq.html">FAQ</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
```

New:
```html
    <!--NAV-->
```

- [ ] **Step 5: 커밋**

```bash
git add contact.html
git commit -m "refactor: contact.html을 루트로 이동하고 nav 공용화"
```

---

## Task 7: `faq.html` — `public/`에서 루트로 이동 + nav/CSS 정리

**Files:**
- Move: `public/faq.html` → `faq.html`

- [ ] **Step 1: 파일 이동**

```bash
git mv public/faq.html faq.html
```

- [ ] **Step 2: `<head>`에 nav 스타일시트 링크 추가**

Old:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

New:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/src/nav.css">
```

- [ ] **Step 3: inline `<style>`에서 중복 `.site-nav` 규칙 제거**

Old:
```html
    <style>
        body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
        .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
        .site-nav a { color: #a8c3b0; text-decoration: none; }
        .site-nav a:hover { text-decoration: underline; }
        main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
        h1 { font-size: 1.4rem; }
        details { margin-bottom: 14px; border-bottom: 1px solid #29342f; padding-bottom: 14px; }
        summary { cursor: pointer; font-weight: 600; }
        details p { margin: 10px 0 0; color: #cdd8d2; }
    </style>
```

New:
```html
    <style>
        body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
        main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
        h1 { font-size: 1.4rem; }
        details { margin-bottom: 14px; border-bottom: 1px solid #29342f; padding-bottom: 14px; }
        summary { cursor: pointer; font-weight: 600; }
        details p { margin: 10px 0 0; color: #cdd8d2; }
    </style>
```

- [ ] **Step 4: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
<nav class="site-nav">
    <a href="index.html">홈</a>
    <a href="about.html">소개</a>
    <a href="guide.html">이용방법</a>
    <a href="faq.html">FAQ</a>
    <a href="privacy.html">개인정보처리방침</a>
    <a href="contact.html">문의</a>
</nav>
```

New:
```html
<!--NAV-->
```

- [ ] **Step 5: 커밋**

```bash
git add faq.html
git commit -m "refactor: faq.html을 루트로 이동하고 nav 공용화"
```

---

## Task 8: `guide.html` — `public/`에서 루트로 이동 + nav/CSS 정리

**Files:**
- Move: `public/guide.html` → `guide.html`

- [ ] **Step 1: 파일 이동**

```bash
git mv public/guide.html guide.html
```

- [ ] **Step 2: `<head>`에 nav 스타일시트 링크 추가**

Old:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

New:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/src/nav.css">
```

- [ ] **Step 3: inline `<style>`에서 중복 `.site-nav` 규칙 제거**

Old:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      .site-nav { display: flex; gap: 16px; flex-wrap: wrap; padding: 16px 20px; border-bottom: 1px solid #29342f; }
      .site-nav a { color: #a8c3b0; text-decoration: none; }
      .site-nav a:hover { text-decoration: underline; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.1rem; margin-top: 28px; }
      li { margin-bottom: 12px; }
    </style>
```

New:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.1rem; margin-top: 28px; }
      li { margin-bottom: 12px; }
    </style>
```

- [ ] **Step 4: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="faq.html">FAQ</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
```

New:
```html
    <!--NAV-->
```

- [ ] **Step 5: 커밋**

```bash
git add guide.html
git commit -m "refactor: guide.html을 루트로 이동하고 nav 공용화"
```

---

## Task 9: `privacy.html` — `public/`에서 루트로 이동 + nav/CSS 정리

**Files:**
- Move: `public/privacy.html` → `privacy.html`

- [ ] **Step 1: 파일 이동**

```bash
git mv public/privacy.html privacy.html
```

- [ ] **Step 2: `<head>`에 nav 스타일시트 링크 추가**

Old:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

New:
```html
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/src/nav.css">
```

- [ ] **Step 3: inline `<style>`에서 중복 `.site-nav` 규칙 제거**

Old:
```html
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
```

New:
```html
    <style>
      body { margin: 0; min-width: 320px; font-family: system-ui, sans-serif; background: #111513; color: #eef5f1; }
      main { max-width: 640px; margin: 0 auto; padding: 24px 20px 60px; line-height: 1.7; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.1rem; margin-top: 28px; }
      a { color: #75e3ef; }
    </style>
```

- [ ] **Step 4: nav 블록을 `<!--NAV-->`로 교체**

Old:
```html
    <nav class="site-nav">
      <a href="index.html">홈</a>
      <a href="about.html">소개</a>
      <a href="guide.html">이용방법</a>
      <a href="faq.html">FAQ</a>
      <a href="privacy.html">개인정보처리방침</a>
      <a href="contact.html">문의</a>
    </nav>
```

New:
```html
    <!--NAV-->
```

- [ ] **Step 5: 커밋**

```bash
git add privacy.html
git commit -m "refactor: privacy.html을 루트로 이동하고 nav 공용화"
```

---

## Task 10: dev 서버로 검증

**Files:** (읽기 전용 검증, 파일 변경 없음)

- [ ] **Step 1: dev 서버 실행**

```bash
npm run dev
```

- [ ] **Step 2: 브라우저에서 6개 페이지 확인**

`http://localhost:5173/`, `/about.html`, `/contact.html`, `/faq.html`, `/guide.html`, `/privacy.html` 각각 열어서:
- nav 바가 정상적으로 보이고 6개 링크(홈/소개/이용방법/FAQ/개인정보처리방침/문의)가 모두 있는지
- 링크 클릭 시 해당 페이지로 정상 이동하는지
- nav 바 스타일(간격, 밑줄 hover 등)이 기존과 동일하게 보이는지

확인.

- [ ] **Step 3: 단일 소스 반영 확인**

`src/nav.html`의 `<a href="contact.html">문의</a>`를 임시로 `<a href="contact.html">문의하기</a>`로 바꾸고 브라우저를 새로고침 — 6개 페이지 전부에 "문의하기"로 바뀌어 보이는지 확인한 뒤, 원래 텍스트("문의")로 되돌린다.

- [ ] **Step 4: dev 서버 종료** (Ctrl+C)

---

## Task 11: 프로덕션 빌드로 검증

**Files:** (읽기 전용 검증, 파일 변경 없음)

- [ ] **Step 1: 빌드 실행**

```bash
npm run build
```

Expected: 에러 없이 종료, `dist/index.html`, `dist/about.html`, `dist/contact.html`, `dist/faq.html`, `dist/guide.html`, `dist/privacy.html`, `dist/404.html` 생성.

- [ ] **Step 2: 플레이스홀더가 남아있지 않은지 확인**

```bash
grep -rl "NAV-->" dist/*.html
```

Expected: 아무 출력 없음 (매치되는 파일 없음 = 모든 페이지에서 실제 nav로 치환됨).

- [ ] **Step 3: 각 dist 페이지에 실제 nav가 주입됐는지 확인**

```bash
grep -c "site-nav" dist/index.html dist/about.html dist/contact.html dist/faq.html dist/guide.html dist/privacy.html
```

Expected: 6개 파일 모두 1 이상 (nav 마크업 존재).

- [ ] **Step 4: 최종 커밋** (dist는 보통 gitignore 대상이 아니라면 별도 확인 후 커밋)

```bash
git status
```

`dist/`가 버전관리 대상이면 결과물을 커밋, 아니면 이 단계는 건너뛴다.

---

## Self-Review 체크리스트 (계획 작성자용, 참고)

- **스펙 커버리지:** 설계 문서의 "1. 파일 구조 & 빌드 설정" → Task 3, 5~9 / "2. 공용 nav" → Task 1, 3, 4~9 / "3. 공용 CSS" → Task 2, 5~9 / "검증" → Task 10~11. 모두 커버됨.
- **플레이스홀더 스캔:** "TBD", "TODO" 등 없음.
- **타입/이름 일관성:** 플레이스홀더 문자열 `<!--NAV-->`, 플러그인 이름 `inject-nav`, 파일명 `src/nav.html`/`src/nav.css`가 모든 Task에서 동일하게 사용됨.
