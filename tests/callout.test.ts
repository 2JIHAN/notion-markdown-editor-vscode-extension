import {
  preprocessMarkdownCallouts,
  CALLOUT_PRESETS,
  NOTION_CALLOUT_COLORS,
} from '../src/webview/extensions/callout';

describe('preprocessMarkdownCallouts — Notion-flavored <callout> parsing', () => {
  it('converts a simple callout into a data-callout div', () => {
    const md = '<callout icon="⚠️" color="yellow_bg">\nBe careful\n</callout>';
    expect(preprocessMarkdownCallouts(md).trim()).toBe(
      '<div data-callout data-emoji="⚠️" data-color="yellow_bg"><p>Be careful</p></div>',
    );
  });

  it('renders inline markdown inside the callout to HTML', () => {
    const md = '<callout icon="🎯" color="blue_bg">\nShip the **MVP** by [Friday](https://x.y)\n</callout>';
    const out = preprocessMarkdownCallouts(md);
    expect(out).toContain('<strong>MVP</strong>');
    expect(out).toContain('<a href="https://x.y">Friday</a>');
    expect(out).toContain('data-color="blue_bg"');
    expect(out).toContain('data-emoji="🎯"');
  });

  it('defaults emoji and color when the open tag omits them', () => {
    const md = '<callout>\nhi\n</callout>';
    expect(preprocessMarkdownCallouts(md)).toContain('data-emoji="💡"');
    expect(preprocessMarkdownCallouts(md)).toContain('data-color="gray_bg"');
  });

  it('falls back to gray_bg for an unknown color', () => {
    const md = '<callout icon="x" color="chartreuse">\nhi\n</callout>';
    expect(preprocessMarkdownCallouts(md)).toContain('data-color="gray_bg"');
  });

  it('preserves block children (multi-paragraph + list) on a single line via &#10;', () => {
    const md = '<callout icon="💡" color="green_bg">\nIntro text\n\n- one\n- two\n</callout>';
    const out = preprocessMarkdownCallouts(md);
    // single physical line for the div so CommonMark does not terminate early
    const divLine = out.split('\n').find((l) => l.includes('data-callout'))!;
    expect(divLine).toContain('<p>Intro text</p>');
    expect(divLine).toContain('<li>one</li>');
    expect(divLine).toContain('<li>two</li>');
    expect(divLine).toContain('&#10;'); // newlines encoded, not literal
    expect(divLine).not.toMatch(/\n/);
  });

  it('handles nested callouts recursively', () => {
    const md = [
      '<callout icon="📦" color="gray_bg">',
      'outer',
      '<callout icon="🔧" color="red_bg">',
      'inner',
      '</callout>',
      '</callout>',
    ].join('\n');
    const out = preprocessMarkdownCallouts(md);
    expect(out).toContain('data-emoji="📦"');
    // the inner callout became a nested data-callout div, not a raw <callout> tag
    expect(out).toContain('data-emoji="🔧"');
    expect(out).not.toContain('<callout');
  });

  it('leaves non-callout markdown untouched', () => {
    const md = '# Heading\n\nA paragraph.\n\n> a quote';
    expect(preprocessMarkdownCallouts(md)).toBe(md);
  });

  it('leaves an unbalanced callout open tag untouched', () => {
    const md = '<callout icon="x" color="red_bg">\nno close here';
    expect(preprocessMarkdownCallouts(md)).toBe(md);
  });
});

describe('callout presets & colors', () => {
  it('exposes 5 presets, each mapping to a valid Notion color', () => {
    expect(CALLOUT_PRESETS).toHaveLength(5);
    for (const p of CALLOUT_PRESETS) {
      expect(p.emoji).toBeTruthy();
      expect(NOTION_CALLOUT_COLORS).toContain(p.color);
    }
  });

  it('lists the 18 Notion colors plus default', () => {
    expect(NOTION_CALLOUT_COLORS).toContain('yellow_bg');
    expect(NOTION_CALLOUT_COLORS).toContain('red');
    expect(NOTION_CALLOUT_COLORS).toContain('default');
    expect(NOTION_CALLOUT_COLORS).toHaveLength(19);
  });
});
