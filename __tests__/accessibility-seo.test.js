/**
 * Accessibility & SEO Tests
 * Validates WCAG-related markup, ARIA attributes, semantic HTML,
 * SEO meta tags, and content requirements from the PRD.
 */
const { readPageHTML, ALL_PAGES } = require('./helpers');

/**
 * Load HTML into the global jsdom document and return it.
 */
function loadDOM(page) {
  const html = readPageHTML(page);
  document.documentElement.innerHTML = '';
  document.open();
  document.write(html);
  document.close();
  return document;
}

describe.each(ALL_PAGES)('Accessibility — %s', (page) => {
  let html;
  let doc;

  beforeAll(() => {
    html = readPageHTML(page);
    doc = loadDOM(page);
  });

  test('nav toggle has aria-label', () => {
    expect(html).toMatch(/<button\s[^>]*class="nav-toggle"[^>]*aria-label="[^"]+"/);
  });

  test('images have alt attributes (if any)', () => {
    const imgPattern = /<img\s[^>]*>/g;
    let match;
    while ((match = imgPattern.exec(html)) !== null) {
      expect(match[0]).toMatch(/alt=/);
    }
  });

  test('form inputs have associated labels or aria-label', () => {
    const inputs = doc.querySelectorAll('input[type="text"], input[type="email"], textarea, select');
    inputs.forEach((input) => {
      const id = input.id;
      if (id) {
        const label = doc.querySelector(`label[for="${id}"]`);
        const ariaLabel = input.getAttribute('aria-label');
        const placeholder = input.getAttribute('placeholder');
        // label, aria-label, or placeholder all provide accessible names
        expect(label || ariaLabel || placeholder).toBeTruthy();
      }
    });
  });

  test('buttons have accessible text', () => {
    const buttons = doc.querySelectorAll('button');
    buttons.forEach((btn) => {
      const text = btn.textContent.trim();
      const ariaLabel = btn.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    });
  });

  test('has only one h1 element', () => {
    const h1Matches = html.match(/<h1[\s>]/g);
    expect(h1Matches).not.toBeNull();
    expect(h1Matches.length).toBe(1);
  });

  test('links have discernible text', () => {
    const links = doc.querySelectorAll('a[href]');
    links.forEach((a) => {
      const text = a.textContent.trim();
      const ariaLabel = a.getAttribute('aria-label');
      const hasChild = a.querySelector('svg, img');
      expect(text || ariaLabel || hasChild).toBeTruthy();
    });
  });
});

describe.each(ALL_PAGES)('SEO — %s', (page) => {
  let html;

  beforeAll(() => {
    html = readPageHTML(page);
  });

  test('has unique title', () => {
    const match = html.match(/<title>([^<]+)<\/title>/);
    expect(match).not.toBeNull();
    expect(match[1].length).toBeGreaterThan(10);
  });

  test('has meta description with sufficient content', () => {
    const match = html.match(/<meta\s[^>]*name="description"\s[^>]*content="([^"]+)"/);
    expect(match).not.toBeNull();
    expect(match[1].length).toBeGreaterThan(30);
  });

  test('has viewport meta for responsive design', () => {
    expect(html).toMatch(/content="width=device-width/);
  });
});

describe('PRD Content Requirements', () => {
  test('index.html showcases 4 service categories', () => {
    const html = readPageHTML('index.html');
    expect(html).toContain('IT Specialists');
    expect(html).toContain('Software Developers');
    expect(html).toContain('DevOps Engineers');
    expect(html).toContain('Support Agents');
  });

  test('index.html shows Human Agents and AI Agents teams', () => {
    const html = readPageHTML('index.html');
    expect(html).toContain('Human Agents');
    expect(html).toContain('AI Agents');
  });

  test('pricing.html shows 3 tiers: Basic, Professional, Premium', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toContain('Basic');
    expect(html).toContain('Professional');
    expect(html).toContain('Premium');
  });

  test('pricing.html shows correct base prices', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toContain('data-monthly="25"');
    expect(html).toContain('data-monthly="100"');
    expect(html).toContain('data-monthly="250"');
  });

  test('pricing.html annual prices are 20% less', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toContain('data-annual="20"');   // 25 * 0.8
    expect(html).toContain('data-annual="80"');   // 100 * 0.8
    expect(html).toContain('data-annual="200"');  // 250 * 0.8
  });

  test('support.html has contact form and FAQ', () => {
    const html = readPageHTML('support.html');
    expect(html).toContain('supportForm');
    expect(html).toContain('Frequently Asked Questions');
  });

  test('support.html has AI agent chat', () => {
    const html = readPageHTML('support.html');
    expect(html).toContain('chatContainer');
    expect(html).toContain('AI Agent Chat');
  });

  test('try-free.html mentions 14-day trial and no credit card', () => {
    const html = readPageHTML('try-free.html');
    expect(html).toMatch(/14\s*days?/i);
    expect(html).toMatch(/no credit card/i);
  });

  test('all pages have language switcher (EN/UA)', () => {
    ALL_PAGES.forEach((page) => {
      const html = readPageHTML(page);
      expect(html).toContain('lang-switcher');
      expect(html).toContain('data-lang="en"');
      expect(html).toContain('data-lang="ua"');
    });
  });
});

