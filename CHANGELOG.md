# Change Log

All notable changes to **NotionMD** are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-05-27

Initial release. Builds on the [md-editor-plus](https://github.com/aviranrevach/md-editor-plus) block editor (MIT) and re-points it at a Notion-sync workflow with a Notion-flavored callout dialect.

### Editor

- Notion-style WYSIWYG editor for `.md` / `.markdown` / `.mdown` / `.mkd` / `.mdx` files via a custom editor.
- Source view alongside the rendered view, with syntax-highlighted Markdown via lowlight.
- Lossless YAML / TOML frontmatter handling with a "Frontmatter · N lines" pill that jumps to Source view.

### Blocks

- Block picker (`⌘/` or `Ctrl+/`): paragraph, H1–H3, bullet/numbered/task lists, image, callout, toggle, blockquote, code block, divider.
- Drag handle (`⠿`) in the gutter to reorder any block.
- Bubble menu on text selection: bold, italic, underline, strikethrough, inline code, link, color, highlight, emoji, plus a "Turn into" submenu.
- Task lists with interactive checkboxes that round-trip Markdown.
- GFM tables.
- Code blocks with language label, copy button, line-number gutter, drag-to-reorder lines, smart-paste fence stripping, and an optional **Show more / Show less** collapse.
- Notion-flavored callouts (`<callout>` with icon and color) plus GFM admonitions (`> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!CAUTION]`).
- Toggle blocks (collapsible `<details>`).

### Display settings (Aa panel)

- Four themes: Light, Claude, Sepia, Dark — with color-swatch tooltip previews.
- Theme sync selector: **Off / OS / IDE** (OS follows `prefers-color-scheme`, IDE follows the host editor theme).
- Page-width slider (600–1400 px) with magnetic snap stops and a live value pill, plus a full-width override.
- Text-size (S / M / L / XL) and font (Sans / Serif / Mono) segmented controls with live-preview tooltips.
- Code-block toggles: always-dark code snippets, always-dark code view, full-width Code view, shortened code snippets.
- **Save view as default** + **Reset** — every setting is runtime-only until explicitly saved to User-scope settings.

### RTL / bidirectional

- Hebrew, Arabic, and other RTL scripts auto-detected per block; lists detect once at list level so markers stay on one side. Code blocks and source view stay LTR.

### Commands

- `Notion Markdown Editor: Open Block View`
- `Notion Markdown Editor: Open Source View`

### Settings (`notionMdEditor.*`)

- `theme`, `font`, `textSize`, `pageWidth`, `fullWidth`
- `alwaysDarkCode`, `alwaysDarkSource`, `sourceFullWidth`, `shortenCodeSnippets`
- `outlineVisible`, `readOnly`, `sourceWordWrap`
