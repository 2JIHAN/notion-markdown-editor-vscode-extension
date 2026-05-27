import { Node, mergeAttributes } from '@tiptap/core';
import MarkdownIt from 'markdown-it';

// Notion-flavored Markdown callout colors. The bare hue names are "text" colors
// (colored text + subtle background); the `_bg` variants fill the background.
// These match the Notion API's enhanced-markdown <callout> color attribute.
export const NOTION_CALLOUT_COLORS = [
  'default',
  'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red',
  'gray_bg', 'brown_bg', 'orange_bg', 'yellow_bg', 'green_bg', 'blue_bg', 'purple_bg', 'pink_bg', 'red_bg',
] as const;
export type CalloutColor = (typeof NOTION_CALLOUT_COLORS)[number];

const DEFAULT_EMOJI = '💡';
const DEFAULT_COLOR: CalloutColor = 'gray_bg';

function normalizeColor(value: string | null): CalloutColor {
  if (value && (NOTION_CALLOUT_COLORS as readonly string[]).includes(value)) {
    return value as CalloutColor;
  }
  return DEFAULT_COLOR;
}

export interface CalloutPreset {
  id: string;
  label: string;
  emoji: string;
  color: CalloutColor;
}

// Quick-pick presets for the slash / callout menus. The persisted node stores
// only emoji + color; presets are just convenient (emoji, color) pairs.
export const CALLOUT_PRESETS: CalloutPreset[] = [
  { id: 'note', label: 'Note', emoji: '💡', color: 'blue_bg' },
  { id: 'tip', label: 'Tip', emoji: '✅', color: 'green_bg' },
  { id: 'important', label: 'Important', emoji: '📌', color: 'purple_bg' },
  { id: 'warning', label: 'Warning', emoji: '⚠️', color: 'yellow_bg' },
  { id: 'caution', label: 'Caution', emoji: '🛑', color: 'red_bg' },
];

const OPEN_RE = /^<callout\b([^>]*)>\s*$/i;
const CLOSE_RE = /^<\/callout>\s*$/i;
const ATTR_RE = /(\w+)\s*=\s*"([^"]*)"/g;

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// markdown-it instance used only to render a callout's inner markdown to block
// HTML during preprocessing. html:true lets already-converted nested callout
// <div>s pass through untouched.
const inner = new MarkdownIt({ html: true, linkify: true, breaks: false });

interface CalloutAttrs {
  emoji: string;
  color: CalloutColor;
}

function readOpenAttrs(raw: string): CalloutAttrs {
  let emoji = DEFAULT_EMOJI;
  let color: CalloutColor = DEFAULT_COLOR;
  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(raw))) {
    if (m[1] === 'icon') emoji = m[2] || DEFAULT_EMOJI;
    else if (m[1] === 'color') color = normalizeColor(m[2]);
  }
  return { emoji, color };
}

/**
 * Turn Notion-flavored `<callout icon="…" color="…">…</callout>` blocks into
 * `<div data-callout …>…</div>` HTML so tiptap-markdown's HTML passthrough hands
 * them to the Callout node's parseHTML rule.
 *
 * The inner markdown is rendered to block HTML (recursively, so nested callouts
 * survive) and emitted on a single line with newlines encoded as `&#10;`. The
 * single-line form stops CommonMark from terminating the HTML block at a blank
 * line, while `&#10;` decodes back to real newlines inside <pre> when the DOM
 * is parsed — preserving code blocks that contain blank lines.
 */
export function preprocessMarkdownCallouts(markdown: string): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const open = OPEN_RE.exec(lines[i]);
    if (!open) {
      out.push(lines[i]);
      i++;
      continue;
    }
    // Walk to the matching close, tracking nesting depth.
    let depth = 1;
    const body: string[] = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (OPEN_RE.test(lines[j])) depth++;
      else if (CLOSE_RE.test(lines[j])) {
        depth--;
        if (depth === 0) break;
      }
      body.push(lines[j]);
    }
    if (depth !== 0) {
      // Unbalanced — leave the line untouched and move on.
      out.push(lines[i]);
      i++;
      continue;
    }
    const { emoji, color } = readOpenAttrs(open[1]);
    const innerMarkdown = preprocessMarkdownCallouts(body.join('\n'));
    const innerHtml = inner.render(innerMarkdown).trim().replace(/\n/g, '&#10;');
    out.push(
      `<div data-callout data-emoji="${escapeAttr(emoji)}" data-color="${color}">${innerHtml}</div>`,
      '',
    );
    i = j + 1;
  }
  return out.join('\n');
}

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      emoji: {
        default: DEFAULT_EMOJI,
        parseHTML: (element) => element.getAttribute('data-emoji') || DEFAULT_EMOJI,
        renderHTML: (attrs) => ({ 'data-emoji': attrs.emoji }),
      },
      color: {
        default: DEFAULT_COLOR,
        parseHTML: (element) => normalizeColor(element.getAttribute('data-color')),
        renderHTML: (attrs) => ({ 'data-color': attrs.color }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ 'data-callout': '', class: 'callout', dir: 'auto' }, HTMLAttributes),
      ['span', { class: 'callout-emoji', contenteditable: 'false' }, node.attrs.emoji as string],
      ['div', { class: 'callout-content', dir: 'auto' }, 0],
    ];
  },

  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const emoji = (node.attrs.emoji as string) || DEFAULT_EMOJI;
          const color = (node.attrs.color as string) || DEFAULT_COLOR;
          state.write(`<callout icon="${emoji}" color="${color}">`);
          state.ensureNewLine();
          state.renderContent(node);
          state.write('</callout>');
          state.closeBlock(node);
        },
      },
    };
  },
});

export default Callout;
