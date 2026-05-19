# 미완료·개선 플랜

> 완료된 항목은 `[x]`로 표시합니다.

## 검사 상세 리포트 · 아카이브

### 기대와 다른 점 (현재 동작 메모)

- [x] **「날짜 선택」UI** (`InspectionReportArchive`): 연·월 선택 후 풀 캘린더(요일 헤더 + 일 칸), 검사 있는 날만 선택·**전체**로 필터 해제, 없는 날 비활성.



## 상세 리포트 정형 구조·가독성 (목업 대비)
- [x] 상세 리포트 시각 폴리시: 섹션 간격·타이포 토큰·카드/표/CTA 정리 (`InspectionReportFullView`, `InspectionReportDetail`). Figma 1:1은 디자인 확정 시 추가.

## 미션 화면 · 보관함 (기획 대비)

## 기술 메모

- `useBloomMissionsStore`의 `completed` 키가 동적 미션 id(`m-…`)를 포함할 수 있음. 예전 `quit-smoking` 등 키도 그대로 동작.
