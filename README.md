# Fertility Helper · 결혼·출산 준비 헬스케어

[![빌드 검사](https://github.com/rokmc1893/Capstone-Design/actions/workflows/build.yml/badge.svg)](https://github.com/rokmc1893/Capstone-Design/actions/workflows/build.yml)

결혼·출산을 준비하는 사용자의 건강 설문, 결과 리포트, 생활 습관 미션과 커뮤니티를 연결하는 모바일 웹 프론트엔드다. React 19, TypeScript, Vite, Tailwind CSS와 Zustand를 사용한다. 백엔드는 이 저장소에 포함되지 않는다.

## 유소민의 역할

건강 설문·결과 리포트·생활 미션·커뮤니티의 프론트엔드를 개발하고, 이메일·카카오 인증과 백엔드 API를 연동했다.

[주요 작업과 관련 코드](docs/CONTRIBUTIONS.md)

## 실행

Node.js 24와 npm을 사용한다. `package-lock.json`에 기록된 의존성을 설치한다.

```sh
npm ci
npm run dev
```

기본 개발 주소는 `http://localhost:5173`이다. 첫 화면에서 온보딩으로 이동하며, 로그인 화면은 `/login`이다. 로그인·검사 저장·결과 조회 등 API 기능은 별도 백엔드 설정이 필요하다.

## 환경변수와 API 연결

`.env.example`을 `.env.local`로 복사한 뒤, 연동할 백엔드의 실제 주소를 설정한다.

```sh
cp .env.example .env.local
```

| 변수 | 역할 |
| --- | --- |
| `VITE_API_BASE_URL` | 인증·사용자·검사·결과·미션 API의 기준 주소다. 끝에 `/`를 붙이지 않는다. |
| `VITE_USE_MOCK_BENCHMARK` | `true`일 때 검사 리포트의 비교 기준에 목업을 사용한다. 기본 예제에서는 `false`다. |

`VITE_` 변수는 브라우저 번들에 포함되므로 비밀키를 넣지 않는다. 환경변수 변경 후에는 개발 서버를 재시작하거나 배포 산출물을 다시 빌드한다.

로컬 Vite 설정에는 API 프록시가 없다. 개발 프론트와 백엔드 주소가 다르면 백엔드에서 개발 주소의 CORS 요청을 허용해야 한다. API 주소 미설정 시 일부 화면은 로컬 상태로 동작하지만, 로그인과 서버 저장까지 완료되는 독립 실행 모드는 아니다.

카카오 로그인은 백엔드의 `/oauth/kakao/login`으로 이동한다. 프론트 콜백 경로는 `/oauth/kakao/callback`이다. 해당 백엔드와 카카오 앱의 리다이렉트 설정이 일치해야 한다.

## 주요 화면과 코드

| 경로·위치 | 역할 |
| --- | --- |
| `/app` | 건강 요약과 미션 현황을 표시한다. `/home` 화면 경로는 `/app`으로 이동한다. |
| `/inspection` | 성별 선택 후 건강 설문을 시작한다. |
| `/inspection-reports/archive`, `/inspection-reports/detail` | 검사 기록과 상세 리포트를 표시한다. |
| `/missions`, `/missions/archive` | 생활 습관 미션과 꽃 성장 기록을 표시한다. |
| `/community` | 게시글·댓글·저장·신고·차단 화면을 제공한다. |
| `src/lib/` | API 클라이언트, 인증 갱신, 검사 세션과 결과 매핑을 담는다. |
| `src/store/` | 인증·설문·미션·커뮤니티 상태를 관리한다. |
| `src/components/`, `src/pages/` | 공통 컴포넌트와 화면을 담는다. |

## 검증

```sh
npm run build
npm run preview
```

`build`는 TypeScript 프로젝트 검사 후 `dist/`를 생성한다. `preview`는 생성된 프론트엔드 산출물을 확인하는 명령이며 백엔드를 실행하지 않는다. GitHub Actions도 Node.js 24에서 `npm ci`와 `npm run build`를 실행한다. 자동 빌드 성공은 실제 인증·API 연동 성공을 뜻하지 않는다.

```sh
npm run lint
```

린트는 별도로 실행한다. 2026-11-07 기본 브랜치 점검에서는 오류 16개와 경고 1개가 확인됐다. 주로 Effect 안의 상태 갱신, 미사용 변수, Fast Refresh export 규칙과 Hook 의존성에 관한 항목이다. 이 기존 실패를 숨기거나 규칙을 해제하지 않으며, 빌드 CI와 별도로 개선할 대상이다. 현재 `npm test` 스크립트는 없다.

## 배포

`netlify.toml`은 `npm run build`와 `dist/` 배포, 백엔드 프록시, React Router의 SPA fallback을 정의한다. 배포 대상이 바뀌면 프록시 대상과 `VITE_API_BASE_URL`을 함께 확인한다. 이 저장소의 기존 프록시 서버가 현재 가동 중인지는 빌드 검사로 확인하지 않는다.

홈 화면은 `/app`이고, Netlify의 `/home`은 백엔드 API 프록시로 사용된다. 화면 URL과 API URL을 혼용하지 않는다. 카카오 프론트 콜백과 SPA fallback 설정도 유지해야 직접 URL 접근과 새로고침이 동작한다.

## 라이선스

저장소의 [MIT 라이선스](LICENSE)를 따른다.
