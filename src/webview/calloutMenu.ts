import { Editor } from '@tiptap/core';
import { CALLOUT_PRESETS, NOTION_CALLOUT_COLORS, CalloutColor } from './extensions/callout';

const DEFAULT_EMOJI = '💡';

// Colors offered in the swatch grid (skip the bare 'default' — the presets
// cover the neutral case).
const SWATCH_COLORS: CalloutColor[] = NOTION_CALLOUT_COLORS.filter((c) => c !== 'default');

const COLOR_LABELS: Record<string, string> = {
  gray: 'Gray', brown: 'Brown', orange: 'Orange', yellow: 'Yellow', green: 'Green',
  blue: 'Blue', purple: 'Purple', pink: 'Pink', red: 'Red',
  gray_bg: 'Gray background', brown_bg: 'Brown background', orange_bg: 'Orange background',
  yellow_bg: 'Yellow background', green_bg: 'Green background', blue_bg: 'Blue background',
  purple_bg: 'Purple background', pink_bg: 'Pink background', red_bg: 'Red background',
};

const EMOJI_GRID = [
  '😀','😂','😍','🥰','😎','🤔','😢','😡','🙏','👍',
  '👎','❤️','✅','❌','⚠️','💡','❓','❗','⭐','✨',
  '🔥','🎯','🚀','📌','📝','📚','💻','📱','🎉','💯',
  '🌟','🌈','🌸','🍀','☀️','🌙','⏰','🎨','📊','🎁',
];

type View = 'presets' | 'emoji';

export interface CalloutMenu {
  open: (anchorEl: HTMLElement, calloutPos: number) => void;
  close: () => void;
}

export function createCalloutMenu(editor: Editor): CalloutMenu {
  let pos = 0;

  const el = document.createElement('div');
  el.className = 'callout-menu';
  document.body.appendChild(el);

  function setAttrs(nextEmoji: string | null, nextColor: CalloutColor | null): void {
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const node = tr.doc.nodeAt(pos);
        if (!node || node.type.name !== 'callout') return false;
        if (dispatch) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            ...(nextEmoji ? { emoji: nextEmoji } : {}),
            ...(nextColor ? { color: nextColor } : {}),
          });
        }
        return true;
      })
      .run();
  }

  function showView(view: View): void {
    el.querySelectorAll<HTMLElement>('.callout-menu-view').forEach((v) => {
      v.classList.toggle('active', v.dataset.view === view);
    });
    if (view === 'emoji') {
      const input = el.querySelector<HTMLInputElement>('.callout-menu-emoji-input');
      requestAnimationFrame(() => {
        input?.focus();
        input?.select();
      });
    }
  }

  function render(currentEmoji: string, currentColor: CalloutColor): void {
    el.innerHTML = `
      <div class="callout-menu-view active" data-view="presets">
        <div class="callout-menu-header">Style</div>
        <div class="callout-menu-list">
          ${CALLOUT_PRESETS.map((p) => {
            const active = p.emoji === currentEmoji && p.color === currentColor;
            return `
            <button class="callout-menu-chip ${active ? 'active' : ''}" data-emoji="${escapeAttr(p.emoji)}" data-color="${p.color}" data-callout-preview="${p.color}">
              <span class="callout-menu-chip-emoji">${escapeHtml(p.emoji)}</span>
              <span class="callout-menu-chip-label">${p.label}</span>
              ${active ? '<span class="callout-menu-chip-check">✓</span>' : ''}
            </button>`;
          }).join('')}
        </div>
        <div class="callout-menu-divider"></div>
        <div class="callout-menu-color-label">Color</div>
        <div class="callout-menu-color-grid">
          ${SWATCH_COLORS.map((c) => `
            <button class="callout-menu-color-swatch ${c === currentColor ? 'active' : ''}" data-color="${c}" title="${escapeAttr(COLOR_LABELS[c] ?? c)}" aria-label="${escapeAttr(COLOR_LABELS[c] ?? c)}"></button>
          `).join('')}
        </div>
        <div class="callout-menu-divider"></div>
        <div class="callout-menu-emoji-section">
          <div class="callout-menu-emoji-head">
            <span class="callout-menu-emoji-title">Custom emoji</span>
            <button class="callout-menu-emoji-reset" data-action="reset">Reset</button>
          </div>
          <button class="callout-menu-emoji-trigger" data-action="open-picker">
            <span class="callout-menu-emoji-current">${escapeHtml(currentEmoji)}</span>
            <span class="callout-menu-emoji-trigger-label">Customize Emoji</span>
            <span class="callout-menu-emoji-trigger-caret">›</span>
          </button>
        </div>
      </div>
      <div class="callout-menu-view" data-view="emoji">
        <button class="callout-menu-back" data-action="back">
          <span class="callout-menu-back-icon">‹</span>
          <span class="callout-menu-back-label">Customize emoji</span>
        </button>
        <div class="callout-menu-emoji-input-row">
          <input
            class="callout-menu-emoji-input"
            type="text"
            spellcheck="false"
            autocomplete="off"
            maxlength="32"
            placeholder="Paste any emoji or press ↵"
            value="${escapeAttr(currentEmoji)}"
          />
          <button class="callout-menu-emoji-apply" data-action="apply">Set</button>
        </div>
        <div class="callout-menu-emoji-hint">
          Tip: focus this field and press <kbd>${osPickerShortcut()}</kbd> for the system emoji picker.
        </div>
        <div class="callout-menu-emoji-quickpicks-label">Quick picks</div>
        <div class="callout-menu-emoji-grid">
          ${EMOJI_GRID.map((e) => `
            <button class="callout-menu-emoji-cell ${e === currentEmoji ? 'active' : ''}" data-emoji="${escapeAttr(e)}" title="${escapeAttr(e)}">${e}</button>
          `).join('')}
        </div>
      </div>
    `;

    el.querySelectorAll<HTMLButtonElement>('.callout-menu-chip').forEach((row) => {
      row.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const newEmoji = row.dataset.emoji || DEFAULT_EMOJI;
        const newColor = (row.dataset.color as CalloutColor) || null;
        setAttrs(newEmoji, newColor);
        close();
      });
    });

    el.querySelectorAll<HTMLButtonElement>('.callout-menu-color-swatch').forEach((sw) => {
      sw.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const newColor = sw.dataset.color as CalloutColor | undefined;
        if (!newColor) return;
        setAttrs(null, newColor);
        // Reflect the new selection without closing — keep tweaking.
        el.querySelectorAll<HTMLElement>('.callout-menu-color-swatch').forEach((s) =>
          s.classList.toggle('active', s.dataset.color === newColor),
        );
      });
    });

    el.querySelector<HTMLButtonElement>('[data-action="open-picker"]')?.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showView('emoji');
    });

    el.querySelector<HTMLButtonElement>('[data-action="back"]')?.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showView('presets');
    });

    const input = el.querySelector<HTMLInputElement>('.callout-menu-emoji-input');
    function applyInput(): void {
      const raw = input?.value.trim() ?? '';
      if (!raw) return;
      setAttrs(raw, null);
      refreshTriggerPreview();
      showView('presets');
    }

    function refreshTriggerPreview(): void {
      const next = input?.value.trim() ?? '';
      const cur = el.querySelector<HTMLElement>('.callout-menu-emoji-current');
      if (cur) cur.textContent = next;
      const activeChipEmoji = el.querySelector<HTMLElement>('.callout-menu-chip.active .callout-menu-chip-emoji');
      if (activeChipEmoji) activeChipEmoji.textContent = next;
    }

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyInput();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        showView('presets');
      }
    });
    input?.addEventListener('mousedown', (e) => { e.stopPropagation(); });

    el.querySelector<HTMLButtonElement>('[data-action="apply"]')?.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyInput();
    });

    el.querySelectorAll<HTMLButtonElement>('.callout-menu-emoji-cell').forEach((cell) => {
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = cell.dataset.emoji ?? '';
        if (!next) return;
        if (input) input.value = next;
        setAttrs(next, null);
        refreshTriggerPreview();
        showView('presets');
      });
    });

    el.querySelector<HTMLButtonElement>('[data-action="reset"]')?.addEventListener('mousedown', (e) => {
      e.preventDefault();
      setAttrs(DEFAULT_EMOJI, null);
      if (input) input.value = DEFAULT_EMOJI;
      const cur = el.querySelector<HTMLElement>('.callout-menu-emoji-current');
      if (cur) cur.textContent = DEFAULT_EMOJI;
      const activeChipEmoji = el.querySelector<HTMLElement>('.callout-menu-chip.active .callout-menu-chip-emoji');
      if (activeChipEmoji) activeChipEmoji.textContent = DEFAULT_EMOJI;
    });
  }

  function open(anchorEl: HTMLElement, calloutPos: number): void {
    try {
      pos = calloutPos;
      const node = editor.state.doc.nodeAt(calloutPos);
      if (!node || node.type.name !== 'callout') return;
      const currentEmoji = (node.attrs.emoji as string) ?? DEFAULT_EMOJI;
      const currentColor = (node.attrs.color as CalloutColor) ?? 'gray_bg';
      render(currentEmoji, currentColor);
      el.classList.add('open');
      const rect = anchorEl.getBoundingClientRect();
      el.style.left = `${rect.left}px`;
      el.style.top = `${rect.bottom + 6}px`;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 12) {
          el.style.top = `${rect.top - r.height - 6}px`;
        }
        if (r.right > window.innerWidth - 12) {
          el.style.left = `${window.innerWidth - r.width - 12}px`;
        }
      });
    } catch (err) {
      console.error('[notion-md-editor] calloutMenu.open failed', err);
    }
  }

  function close(): void {
    el.classList.remove('open');
  }

  document.addEventListener('mousedown', (e) => {
    if (!el.contains(e.target as Node)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('open')) close();
  });
  // Close on any scroll — the popover is anchored to a viewport position,
  // so scrolling makes it visually disconnect from the callout it opened
  // from. capture:true catches scrolls on every ancestor.
  window.addEventListener('scroll', () => {
    if (el.classList.contains('open')) close();
  }, { capture: true, passive: true });

  // Open the menu when the user clicks the emoji icon inside a rendered callout.
  editor.view.dom.addEventListener('click', (e) => {
    try {
      const target = e.target as HTMLElement | null;
      const emojiEl = target?.closest?.('.callout-emoji') as HTMLElement | null;
      if (!emojiEl) return;
      const calloutEl = emojiEl.closest('.callout') as HTMLElement | null;
      if (!calloutEl) return;
      e.preventDefault();
      e.stopPropagation();
      const innerPos = editor.view.posAtDOM(calloutEl, 0);
      if (innerPos == null || innerPos < 0) return;
      const $pos = editor.state.doc.resolve(innerPos);
      if ($pos.depth < 1) return;
      const calloutPos = $pos.before(1);
      open(emojiEl, calloutPos);
    } catch (err) {
      console.error('[notion-md-editor] callout emoji click failed', err);
    }
  });

  return { open, close };
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function osPickerShortcut(): string {
  const ua = (navigator.userAgent || '').toLowerCase();
  const platform = ((navigator as unknown as { platform?: string }).platform || '').toLowerCase();
  if (ua.includes('mac') || platform.includes('mac')) return '⌃⌘Space';
  if (ua.includes('win') || platform.includes('win')) return 'Win+.';
  if (ua.includes('linux')) return 'system emoji shortcut';
  return '⌃⌘Space';
}
