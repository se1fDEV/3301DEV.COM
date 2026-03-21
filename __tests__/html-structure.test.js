/**
 * HTML Structure Tests
 * Validates that every page has the required structural elements
 * per the PRD: header, nav, footer, meta tags, etc.
 */
const { readPageHTML, ALL_PAGES } = require('./helpers');

describe.each(ALL_PAGES)('HTML Structure — %s', (page) => {
  let html;

  beforeAll(() => {
    html = readPageHTML(page);
  });

  test('has DOCTYPE declaration', () => {
    expect(html.trim().toLowerCase()).toMatch(/^<!doctype html>/);
  });

  test('has <html lang="en">', () => {
    expect(html).toMatch(/<html\s[^>]*lang="en"/);
  });

  test('has charset UTF-8 meta', () => {
    expect(html).toMatch(/<meta\s[^>]*charset=["']UTF-8["']/i);
  });

  test('has viewport meta tag', () => {
    expect(html).toMatch(/<meta\s[^>]*name=["']viewport["']/i);
  });

  test('has meta description', () => {
    expect(html).toMatch(/<meta\s[^>]*name=["']description["']/i);
  });

  test('has title element with 3301dev.com', () => {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    expect(titleMatch).not.toBeNull();
    expect(titleMatch[1]).toContain('3301dev.com');
  });

  test('links to styles.css', () => {
    expect(html).toMatch(/<link\s[^>]*href=["']css\/styles\.css["']/);
  });

  test('includes i18n.js script', () => {
    expect(html).toMatch(/<script\s[^>]*src=["']js\/i18n\.js["']/);
  });

  test('has site-header element', () => {
    expect(html).toMatch(/<header\s[^>]*class=["'][^"']*site-header/);
  });

  test('has site-footer element', () => {
    expect(html).toMatch(/<footer\s[^>]*class=["'][^"']*site-footer/);
  });

  test('has main navigation', () => {
    expect(html).toMatch(/<nav\s[^>]*class=["'][^"']*main-nav/);
  });

  test('has logo link to index.html', () => {
    expect(html).toMatch(/<a\s[^>]*href=["']index\.html["'][^>]*class=["']logo["']/);
  });

  test('has mobile nav toggle button', () => {
    expect(html).toMatch(/<button\s[^>]*class=["']nav-toggle["']/);
  });

  test('has a hero section or trial-hero section', () => {
    expect(html).toMatch(/class=["'][^"']*(hero|trial-hero)/);
  });

  test('has an h1 heading', () => {
    expect(html).toMatch(/<h1[\s>]/);
  });
});

describe('Page-specific structure', () => {
  test('index.html has 4 service cards', () => {
    const html = readPageHTML('index.html');
    const cards = html.match(/<div\s[^>]*class=["']card["']/g);
    expect(cards).not.toBeNull();
    expect(cards.length).toBe(4);
  });

  test('index.html has 2 team cards', () => {
    const html = readPageHTML('index.html');
    const teams = html.match(/<div\s[^>]*class=["']team-card["']/g);
    expect(teams).not.toBeNull();
    expect(teams.length).toBe(2);
  });

  test('index.html has AI CTA section', () => {
    const html = readPageHTML('index.html');
    expect(html).toMatch(/class=["']ai-cta["']/);
  });

  test('pricing.html has 3 pricing cards', () => {
    const html = readPageHTML('pricing.html');
    const cards = html.match(/<div\s[^>]*class=["']pricing-card[\s"']/g);
    expect(cards).not.toBeNull();
    expect(cards.length).toBe(3);
  });

  test('pricing.html has a featured (Most Popular) card', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toMatch(/class=["'][^"']*featured/);
  });

  test('pricing.html has billing toggle', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toMatch(/id=["']billingToggle["']/);
    expect(html).toMatch(/id=["']toggleSwitch["']/);
  });

  test('pricing.html has comparison table', () => {
    const html = readPageHTML('pricing.html');
    expect(html).toMatch(/class=["']compare-table["']/);
  });

  test('support.html has contact form', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/id=["']supportForm["']/);
  });

  test('support.html has FAQ section with 5 items', () => {
    const html = readPageHTML('support.html');
    const faqs = html.match(/<div\s[^>]*class=["']faq-item["']/g);
    expect(faqs).not.toBeNull();
    expect(faqs.length).toBe(5);
  });

  test('support.html has AI chat container', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/id=["']chatContainer["']/);
    expect(html).toMatch(/id=["']chatForm["']/);
    expect(html).toMatch(/id=["']chatMessages["']/);
  });

  test('support.html has contacts section', () => {
    const html = readPageHTML('support.html');
    expect(html).toMatch(/support\.contacts\.title/);
  });

  test('try-free.html has trial form', () => {
    const html = readPageHTML('try-free.html');
    expect(html).toMatch(/id=["']trialForm["']/);
  });

  test('try-free.html has 4 benefit cards', () => {
    const html = readPageHTML('try-free.html');
    const benefits = html.match(/<div\s[^>]*class=["']trial-benefit["']/g);
    expect(benefits).not.toBeNull();
    expect(benefits.length).toBe(4);
  });

  test('try-free.html has testimonial/social proof', () => {
    const html = readPageHTML('try-free.html');
    expect(html).toMatch(/trial\.social\.quote/);
  });
});
