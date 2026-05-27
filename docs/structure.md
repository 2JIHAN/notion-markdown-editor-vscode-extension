# Structure

두 레이어로 나뉜다. **extension host**(Node, VS Code API) 와 **webview**(브라우저, TipTap 에디터). 빌드도 둘로 나뉜다 — host 는 `tsc`, webview 는 `esbuild` 번들.

```
src/
├── extension.ts                     ← activate(), 명령 등록
├── notionMarkdownEditorProvider.ts  ← CustomTextEditorProvider, 문서 ↔ webview 동기화, HTML 셸
└── webview/                         ← 전부 브라우저 컨텍스트 (esbuild → dist/webview.js)
    ├── index.ts                     ← 엔트리. 에디터 부트, 패널 배선
    ├── editor.ts                    ← TipTap 인스턴스 + tiptap-markdown 설정, 직렬화/역직렬화
    ├── blockPicker.ts               ← 슬래시 / 블록 피커 (callout 프리셋 포함)
    ├── calloutMenu.ts               ← callout 이모지/색 팝오버
    ├── bubbleMenu.ts, blockHandle.ts, sourceBubbleMenu.ts, outlinePanel.ts, …
    ├── extensions/                  ← 커스텀 TipTap 노드
    │   ├── callout.ts               ← Notion-flavored <callout> 노드 (아래 참조)
    │   ├── toggle.ts, codeBlock.ts, blockDirection.ts, outline.ts
    └── styles/                      ← editor.css + notion-light/dark.css (esbuild 가 text 로 인라인)
docs/  ← adr/, history/, BACKLOG.md, structure.md
tests/ ← jest (ts-jest, node 환경). 에디터 못 띄움 → 순수 함수만 검증
```

## 빌드 / 실행

- `npm run compile` = `tsc -p tsconfig.json`(host → `dist/`) `&&` `node esbuild.config.js`(webview → `dist/webview.js`, IIFE, `platform: browser`).
- F5 = Extension Development Host. 코드 바꾸면 리로드(Cmd+R)로 반영, **확장 호스트 kill 금지**.
- `npm test` = jest. `tests/` 는 node 환경이라 TipTap 에디터를 못 띄운다 → **직렬화는 단위 테스트 불가, 런타임 QA 필요** (see [BACKLOG](BACKLOG.md)).
- **punycode shim**: webview 번들이 `markdown-it` 를 포함하는데 그게 `require('punycode')`(node 빌트인) 를 함. `platform: browser` 에선 없으므로 userland `punycode` 패키지를 devDependency 로 둬서 esbuild 가 resolve 한다. 빼면 esbuild 가 멈춘다([history 2026-05-27](history/2026-05-27.md) 참조).

## 문서 모델 / 동기화

source of truth 는 VS Code `TextDocument`(디스크의 `.md`). webview 는 편집 UI일 뿐 — 편집 결과를 markdown 문자열로 되돌려 `WorkspaceEdit` 으로 문서에 반영한다. provider 가 양방향 메시지를 중계한다([notionMarkdownEditorProvider.ts](../src/notionMarkdownEditorProvider.ts)).

## Callout 파스/직렬화 경로

callout 은 Notion-flavored `<callout icon="…" color="…">…</callout>` 로 저장된다(왜 GFM 이 아닌지는 [ADR 0001](adr/0001-notion-flavored-callout.md)). 코드는 [extensions/callout.ts](../src/webview/extensions/callout.ts).

- **읽기**: `preprocessMarkdownCallouts()` 가 `<callout>` 블록을 `<div data-callout data-emoji data-color>` HTML 로 변환(중첩 재귀, 내부 markdown 은 markdown-it 로 렌더 후 `&#10;` 인코딩해 단일 라인 → CommonMark 가 빈 줄에서 HTML 블록을 끊지 않게). tiptap-markdown 의 HTML passthrough → ProseMirror `parseHTML`(`div[data-callout]`) → callout 노드.
- **쓰기**: 노드의 `addStorage().markdown.serialize` 가 `<callout …>` 태그를 쓰고 `state.renderContent(node)` 로 자식 블록을 markdown 으로 직렬화.
- **속성**: `emoji`(자유 이모지) + `color`(18 Notion 색: 9 text + 9 `_bg`). content 는 `block+`(중첩 블록 허용). CSS 는 `.callout[data-color="…"]` 로 스타일.
