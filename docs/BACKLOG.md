# Backlog — 다음 할 일

fork(md-editor-plus) 이후 이 프로젝트의 남은 작업. 우선순위 순. 완료 항목은 [history](history/) 로 옮긴다.

## 1. callout serialize 런타임 QA  — 우선

- **무엇**: 편집 결과 → markdown 직렬화가 `<callout icon="…" color="…">…</callout>` 로 제대로 왕복하는지 확인.
- **왜 남았나**: 단위 테스트는 node 환경이라 TipTap 에디터를 못 띄움 → **파스 방향만** 검증됨([tests/callout.test.ts](../tests/callout.test.ts)). serialize(`addStorage().markdown.serialize` + `state.renderContent`) 는 미검증.
- **방법**: VSCode 에서 F5(또는 Cmd+R 리로드, **확장 호스트 kill 금지**)로 `.md` 열기 → callout 삽입/색·이모지 변경/중첩 블록 → 저장 → 디스크 markdown 확인. 기존 `<callout>` 파일 열어 라운드트립도 확인.
- **확인 포인트**: 색/이모지 보존, 중첩 블록·리스트·코드블록(빈 줄 포함) 보존, 닫는 태그 앞 여분 빈 줄이 재파스에서 안정적인지.

## 2. 프로젝트 레벨 문서  — README 가 아직 upstream

- **README.md** 100% upstream("MD Editor Plus"). 제목·브랜딩 교체, Notion-flavored callout + Notion sync 방향 반영, upstream(MIT) attribution 유지.
- **docs/structure.md** 신규 — 폴더 트리, extension host vs webview 분리, callout 파스/직렬화 경로, 빌드(tsc + esbuild, punycode shim) 설명.

## 3. Notion sync  — 그린필드 (별도 설계 필요)

- **무엇**: 로컬 `.md` ↔ Notion API 양방향 sync (pull/push).
- **결정 트리(미정, grill 대상)**: 인증/토큰 저장 방식, md 블록 ↔ Notion 블록 매핑(callout color 는 Notion 색상과 1:1 이라 유리), 페이지 id/last-edited 메타 저장 위치, diff/conflict 전략, 명령·UI.
- 착수 전 design 세션 1회.

## 기타 / 낮음

- upstream `tests/toggle.test.ts` 가 ts-jest 타입에러로 fail(ProseMirror `Node` vs DOM `Node` 충돌). 우리 작업과 무관하나, green 베이스라인 원하면 한 줄 캐스팅 수정.
- callout 메뉴 칩의 `data-callout-preview` 색 타일 — 현재 프리셋 색 재사용. 추후 다듬기.
