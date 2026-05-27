# NotionMD

**A Notion-style block editor for your local Markdown files, right inside VS Code.**

Open any `.md` file and it renders as polished, block-based content. Click anywhere to edit, drag blocks to reorder, slash to insert. The file on disk stays plain Markdown, so your commits stay clean and your notes are never locked in a database.

---

## Why use it

VS Code's built-in preview is great for reading. The plain text editor is great for editing config files. **NotionMD is for writing** — the way you write in Notion or Linear, not the way you edit YAML.

- Blocks behave like blocks: drag, click, slash to insert.
- Real headings, lists, and tables instead of raw `##` and `|---|` clutter.
- Familiar muscle memory if you come from Notion: block model, drag handles, slash menu, bubble toolbar, page width.
- Round-trips Markdown losslessly, so diffs stay readable.
- Works on any folder. No database, no cloud, no account, no migration.

---

## Install

From the VS Code Extensions panel (`⌘⇧X` / `Ctrl+Shift+X`), search **NotionMD** and install. Or from the command line:

```bash
code --install-extension jihan.notion-wysiwyg-md
```

Open any Markdown file and it appears in the block view by default. To edit raw Markdown, click the **Code** segment in the toolbar or run **Notion Markdown Editor: Open Source View** from the Command Palette.

---

## Features

### Block editor

- **Drag-handle reordering** — hover any block for a `⠿` handle and move it anywhere.
- **Slash / block picker** — `⌘/` (`Ctrl+/`) opens an inline picker; type to filter.
- **Bubble menu** — select text for inline formatting, links, color, highlight, emoji, and a "Turn into" converter.
- **Click-to-edit** — every block is editable in place, no mode switching.

### Block types

- **Text** — paragraph, H1, H2, H3.
- **Lists** — bullet, numbered, and task lists with real checkboxes that round-trip to `- [ ]` / `- [x]`.
- **Tables** — GFM pipe syntax, inline cell editing, add rows and columns from the bubble menu.
- **Code blocks** — syntax highlighting for ~50 languages, line-number gutter, drag lines to reorder, copy button, optional auto-collapse for long snippets.
- **Callouts** — `<callout icon="💡" color="blue_bg">` with any emoji, the 18 Notion colors, and nested block content (paragraphs, lists, code, even nested callouts).
- **Toggles** — collapsible `<details>` sections.
- **Media & misc** — images, blockquotes, dividers.

### Display settings (Aa panel)

- **Four themes** — Light, Claude, Sepia, Dark — plus a **Sync with** selector (Off / OS / IDE) that follows your system or editor's light/dark mode.
- **Page-width slider** — magnetic snap stops at 600 / 800 / 1000 / 1200 / 1400 px, or a full-window override.
- **Text size** — S / M / L / XL with live preview tooltips.
- **Font family** — Sans / Serif / Mono with live previews.
- **Code-block toggles** — force-dark snippets, force-dark source view, full-width source, auto-collapse long blocks.
- **Save view as default** — persist every setting to your User-scope settings; **Reset** restores the built-ins.

### Markdown fidelity

- **Lossless round-trip** — disk stays plain CommonMark + GFM.
- **Frontmatter aware** — YAML (`---`) and TOML (`+++`) are auto-detected, hidden from preview, preserved on save, with a badge to jump straight to Code view.
- **MDX-lite** — `.mdx` renders as Markdown; embedded JSX falls back to raw text or Code view.

### Workflow

- **Code / Preview toggle** — switch between rendered blocks and raw Markdown without leaving the editor.
- **Auto-fading toolbar** — drops to 50% opacity when your cursor is away, lights up when you approach.
- **Filename actions menu** — copy page content, copy file path, duplicate, open in Finder.
- **RTL aware** — Hebrew, Arabic, and other RTL scripts auto-detected per block; Markdown stays plain on disk.

### Privacy

- 100% local: no telemetry, no network calls, no accounts.

---

## Supported file types

The block view registers as a custom editor for `*.md`, `*.markdown`, `*.mdown`, `*.mkd`, and `*.mdx`. MDX content renders as Markdown; embedded JSX falls into raw paragraphs (or edit it directly in Code view).

---

## The toolbar

```
┌──────────────────────────────────────────────────────────────────────┐
│ [logo]  [Preview | Code]            filename.md            [Aa] [⋯]  │
└──────────────────────────────────────────────────────────────────────┘
```

The toolbar fades to 50% opacity when your cursor isn't near it, then lights back up when the mouse comes within ~150 px of the top of the page.

| Element | Behavior |
| --- | --- |
| **Preview / Code** | Switch between the rendered block view and the raw Markdown view. |
| **Filename** | Centered. Hover to open the actions menu; the full name shows in a tooltip when truncated. |
| **Aa** | Opens the display-settings panel (theme, page width, font, code-block options). |
| **⋯** | Opens the actions menu, anchored to the top-right. |

---

## Display settings (Aa)

Every visual setting is **runtime-only by default** — change anything for the current session and it won't follow you to other files. Click **Save view as default** to commit the current view as your global default; **Reset** restores the built-ins.

### Theme

| Theme | Vibe |
| --- | --- |
| **Light** | Clean white background |
| **Claude** | Soft warm tones |
| **Sepia** | Paper-warm, easy on long reading sessions |
| **Dark** | Deep neutrals, comfortable at night |

The **Sync with** row offers three modes: **Off** (use the manual theme above), **OS** (follow `prefers-color-scheme`), and **IDE** (follow the host editor's color theme). Picking a manual theme flips Sync back to Off.

### Page width

A continuous slider with magnetic snap stops at 600 / 800 / 1000 / 1200 / 1400 px. Drag the thumb and it snaps near a stop; click a dot to jump; the pill on the right shows the live value. The **Full width** toggle below is an override — touching the slider turns it off.

### Text size and font

`S` / `M` / `L` / `XL` (14 / 16 / 18 / 20 px) and `Sans` / `Serif` / `Mono`. Each button's tooltip previews a sample at that exact size and face.

### Code blocks

| Toggle | Effect |
| --- | --- |
| **Always dark: Code Snippets** | Force fenced code blocks to a dark background even on a light page theme. |
| **Always dark: Code view** | Same, but for the raw Markdown source view. |
| **Full width: Only in Code view** | Source view fills the window even when the rendered view stays narrow. |
| **Shorten Code Snippets** | Long code blocks collapse behind a Show more / Show less button. |

---

## Editor blocks

Click `+` in the gutter or press `⌘/` (`Ctrl+/`) to open the block picker. Filter by typing.

| Section | Blocks |
| --- | --- |
| **Text** | Paragraph, Heading 1, Heading 2, Heading 3 |
| **Lists** | Bullet list, Numbered list, Task list |
| **Media** | Image, Callout, Toggle |
| **Other** | Blockquote, Code block, Divider |

### Callouts

Pick a preset (Note, Tip, Important, Warning, Caution) from the slash menu, then click the emoji to open a popover with a custom-emoji field and the 18 Notion color swatches. Callouts hold block content — multiple paragraphs, lists, code, even nested callouts.

```markdown
<callout icon="⚠️" color="yellow_bg">
Heads-up text with **inline** formatting.

- and nested blocks
- like this list
</callout>
```

The `icon` and `color` attributes use Notion's enhanced-markdown form (9 text hues plus 9 `_bg` variants), so callouts map 1:1 to Notion callout blocks.

### Code blocks

A first-class block, not just a `<pre>`: syntax highlighting for ~50 languages via [lowlight](https://github.com/wooorm/lowlight), a line-number gutter with click-and-drag line reordering, a copy button, an optional Show more / Show less collapse, and smart-paste fence stripping.

### Task lists, tables, toggles

Task lists render as checkboxes and round-trip to `- [ ]` / `- [x]`. Tables edit inline, with row and column controls in the bubble menu. Toggles round-trip as HTML `<details>` blocks.

### Bubble menu

| Group | Buttons |
| --- | --- |
| **Inline formatting** | Bold, italic, underline, strikethrough, inline code |
| **Linking & color** | Insert link, text color, highlight color |
| **Insert** | Emoji picker |
| **Convert** | "Turn into" submenu — paragraph to heading, list, quote, code block, etc. |

### Frontmatter

YAML (`---`) and TOML (`+++`) frontmatter is auto-detected and hidden from the rendered view. A **FRONTMATTER · N lines** pill appears at the top; click it to jump to Code view and edit it directly. Preserved losslessly on save.

---

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘/` / `Ctrl+/` | Open the block picker at the cursor |
| `⌘B` / `Ctrl+B` | Bold |
| `⌘I` / `Ctrl+I` | Italic |
| `⌘U` / `Ctrl+U` | Underline |
| `⌘⇧X` / `Ctrl+Shift+X` | Strikethrough |
| `⌘E` / `Ctrl+E` | Inline code |
| `⌘K` / `Ctrl+K` | Insert link |
| `Esc` | Close any open menu or popover |

---

## Commands

Available via the Command Palette (`⌘⇧P` / `Ctrl+Shift+P`):

| Command | Description |
| --- | --- |
| **Notion Markdown Editor: Open Block View** | Reopens the active file with the block editor |
| **Notion Markdown Editor: Open Source View** | Reopens the active file with VS Code's default text editor |

---

## Settings reference

All settings live under `notionMdEditor.*`. They're written by **Save view as default**, but you can edit them by hand.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `notionMdEditor.theme` | `"light"` \| `"claude"` \| `"sepia"` \| `"dark"` | `"light"` | Color theme |
| `notionMdEditor.font` | `"sans"` \| `"serif"` \| `"mono"` | `"sans"` | Font family |
| `notionMdEditor.textSize` | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | Base text size |
| `notionMdEditor.pageWidth` | `number` (400–2400) | `800` | Page width in px |
| `notionMdEditor.fullWidth` | `boolean` | `false` | Open at full window width |
| `notionMdEditor.alwaysDarkCode` | `boolean` | `false` | Force dark code blocks regardless of theme |
| `notionMdEditor.alwaysDarkSource` | `boolean` | `false` | Force dark source view regardless of theme |
| `notionMdEditor.sourceFullWidth` | `boolean` | `false` | Render source view at full width |
| `notionMdEditor.shortenCodeSnippets` | `boolean` | `false` | Collapse long code snippets behind a Show more button |

---

## Markdown compatibility

NotionMD reads and writes CommonMark plus the GitHub-flavored extensions you'd expect: headings, paragraphs, blockquotes, lists (bulleted, ordered, task), GFM tables, strikethrough, inline and fenced code, links, autolinks, images, and HTML passthrough (`<details>`, etc.). On top of that: Notion-flavored callouts (`<callout icon color>`, 18 colors, nested blocks) and preserved YAML / TOML frontmatter.

---

## RTL / bidirectional content

Hebrew, Arabic, and other RTL scripts are auto-detected per block from the first strong character and applied as explicit `dir` on every paragraph, heading, blockquote, callout, table cell, and toggle. Lists keep every marker on the same side, set by the first item, so a list never shows mixed-side markers. Code blocks and the source view stay LTR. Storage is plain Markdown — direction lives in the rendered view only, recomputed on each load.

---

## Requirements

- VS Code **1.74** or newer.
- No external services, no telemetry, no network calls. Everything runs locally in the webview.

---

## Known limitations

- Very large Markdown files (>1 MB) may take a beat to render on first open.
- Image paths render relative to the workspace root.
- MDX support is "lite": embedded JSX renders as raw text in the rendered view; switch to Code view for full MDX editing.

---

## Build from source

```bash
git clone https://github.com/2JIHAN/notion-markdown-editor-vscode-extension.git
cd notion-markdown-editor-vscode-extension
npm install            # node_modules/ is gitignored, so install on every fresh clone
npm run compile        # tsc + esbuild (bundles the webview)
code .                 # open the repo in VS Code, then press F5
```

`F5` launches an Extension Development Host with the extension loaded. While developing, `npm run watch` rebuilds on save and `npm test` runs the Jest suite.

---

## Release notes

See [CHANGELOG.md](CHANGELOG.md).

---

## License

[MIT](LICENSE)
