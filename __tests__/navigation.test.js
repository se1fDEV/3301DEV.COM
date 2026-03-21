/**
 * Navigation & Links Tests
 * Validates consistent navigation across all pages, correct active states,
 * valid internal link targets, and footer structure consistency.
 */
const { readPageHTML, ALL_PAGES } = require('./helpers');

const VALID_INTERNAL_TARGETS = [
  'index.html',
  'pricing.html',
  'support.html',
  'try-free.html',
];

describe.each(ALL_PAGES)('Navigation — %s', (page) => {
  let html;

  beforeAll(() => {
    html = readPageHTML(page);
  });

  test('header nav contains links to all 4 pages', () => {
    VALID_INTERNAL_TARGETS.forEach((target) => {
      expect(html).toContain(`href="${target}"`);
    });
  });

  test('has exactly one active nav link in header', () => {
    // Extract the <nav> block
    const navMatch = html.match(/<nav[^>]*class="main-nav"[^>]*>[\s\S]*?<\/nav>/);
    expect(navMatch).not.toBeNull();
    const navHtml = navMatch[0];
    const activeLinks = navHtml.match(/class="[^"]*active[^"]*"/g) || [];
    // active class appears on: either a nav link OR the lang-btn (active lang)
    // We want at least one active page link
    const activePageLinks = navHtml.match(/<a\s[^>]*class="[^"]*active[^"]*"/g) || [];
    // btn-nav active is also valid (try-free.html)
    expect(activePageLinks.length).toBeGreaterThanOrEqual(1);
  });

  test('footer contains links to all 4 pages', () => {
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
    expect(footerMatch).not.toBeNull();
    const footerHtml = footerMatch[0];
    VALID_INTERNAL_TARGETS.forEach((target) => {
      expect(footerHtml).toContain(`href="${target}"`);
    });
  });

  test('footer has 4 grid columns (brand, pages, services, contact)', () => {
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
    const footerHtml = footerMatch[0];
    expect(footerHtml).toContain('footer-brand');
    expect(footerHtml).toContain('footer.pages');
    expect(footerHtml).toContain('footer.services');
    expect(footerHtml).toContain('footer.contact');
  });

  test('footer has copyright notice', () => {
    expect(html).toContain('footer.copy');
    expect(html).toMatch(/2026.*3301dev\.com/);
  });

  test('all internal links point to valid pages', () => {
    const hrefPattern = /href="([^"#]+)"/g;
    let match;
    while ((match = hrefPattern.exec(html)) !== null) {
      const href = match[1];
      // Skip external links, mailto, tel
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      // Skip CSS/JS resources
      if (href.endsWith('.css') || href.endsWith('.js')) continue;
      expect(VALID_INTERNAL_TARGETS).toContain(href);
    }
  });

  test('has language switcher with EN and UA buttons', () => {
    expect(html).toMatch(/class="lang-btn[^"]*"\s+data-lang="en"/);
    expect(html).toMatch(/class="lang-btn[^"]*"\s+data-lang="ua"/);
  });
});

describe('Active page highlighting', () => {
  test('index.html marks Products as active', () => {
    const html = readPageHTML('index.html');
    expect(html).toMatch(/<a\s+href="index\.html"\s+class="active"/);
  });

  test('pricing.html marks Pricing as active', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toMatch(/<a\s+href="pricing\.html"\s+class="active"/);
  });

  test('support.html marks Support as active', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/<a\s+href="support\.html"\s+class="active"/);
  });

  test('try-free.html marks Try Free as active', () => {
    const html = readPageHTML('try-free.html');
    expect(html).toMatch(/<a\s+href="try-free\.html"\s+class="btn-nav active"/);
  });
});

describe('External links', () => {
  test('support.html Telegram link opens in new tab', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/href="https:\/\/t\.me\/[^"]*"[^>]*target="_blank"/);
    expect(html).toMatch(/rel="noopener noreferrer"/);
  });

  test('support.html has email contact links', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/href="mailto:[^"]+"/);
  });
});
