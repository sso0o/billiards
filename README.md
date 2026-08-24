# 당구 경로 도해

당구 샷의 예상 경로를 시각화하는 브라우저 기반 도구입니다.

## 기능

- **4구 / 3쿠션** 모드 전환
- 수구·목적구를 드래그로 배치
- 두께(두껍게/얇게)·당점(시계 방향·레벨)에 따른 경로 계산
- 쿠션 반사, 가로/세로 회전(영어), 팔로우/드로우 반영
- 장애 공 감지 시 경고 메시지 표시

## 시작하기

```bash
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # dist/ 빌드
```

## 테스트

```bash
npm test          # 단위 테스트 (vitest)
npm run test:e2e  # E2E 테스트 (playwright)
```

## 구조

```
src/
  domain/         # 순수 계산 로직 (물리, 경로, 벡터)
  state/          # 샷 상태 관리
  ui/             # SVG 렌더링, 드래그, 컨트롤 패널
```

## 환경

Node.js 20 이상
