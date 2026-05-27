# Callouts use Notion-flavored `<callout>` syntax, not GFM `> [!NOTE]`

## Status

accepted

## Context

This project is forked from [md-editor-plus](https://github.com/aviranrevach/md-editor-plus), whose callout block reads and writes GitHub-flavored admonitions (`> [!NOTE]`). Our goal includes **local ↔ Notion sync**, so the on-disk markdown should round-trip with the Notion API losslessly.

## Decision

Store callouts as Notion-flavored Markdown:

```
<callout icon="⚠️" color="yellow_bg">
Body, with **inline** formatting and nested blocks.
</callout>
```

- `icon` (emoji) + `color` (the 18 Notion colors: 9 text hues + 9 `_bg` variants) attributes.
- `content: block+` — callouts may contain paragraphs, lists, code, even nested callouts.

The TipTap `callout` node parses/serializes this form; `preprocessMarkdownCallouts` converts `<callout>` blocks into `<div data-callout>` HTML for tiptap-markdown's HTML passthrough, and `addStorage().markdown.serialize` emits the `<callout>` tag back out.

## Considered options

- **GFM `> [!NOTE]` (upstream default)** — broad GitHub/editor compatibility, but no color attribute and no nested children, so it is lossy against Notion. Rejected.
- **Support both on read, write one** — extra parser/test surface for little gain; can be added later if real files demand it. Deferred.

## Consequences

- `<callout icon="…" color="…">` is exactly the Notion API's enhanced-markdown form (see [Notion enhanced markdown reference](https://developers.notion.com/guides/data-apis/enhanced-markdown)), so the sync layer maps callouts to Notion callout blocks 1:1 including color and children.
- Files written by this editor are **not** GitHub admonitions — they will not render as alerts on GitHub. That is the deliberate trade-off for Notion fidelity.
- Inner markdown is rendered to HTML on a single line with newlines encoded as `&#10;` so a code block containing blank lines inside a callout survives CommonMark's HTML-block parsing. Bundling `markdown-it` for the browser required adding the userland `punycode` package (the node builtin is unavailable under esbuild `platform: 'browser'`).
