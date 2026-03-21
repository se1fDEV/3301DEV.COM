/**
 * CSS & Styling Tests
 * Validates that the CSS file defines expected variables, classes,
 * and responsive breakpoints referenced by all pages.
 */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.resolve(__dirname, '..', 'css', 'styles.css'), 'utf8');

describe('CSS Variables', () => {
  test('defines primary color variables', () => {
    expect(css).toContain('--color-primary');
    expect(css).toContain('--color-primary-dark');
  });

  test('defines background color variables', () => {
    expect(css).toContain('--color-bg');
    expect(css).toContain('--color-bg-surface');
  });

  test('defines text color variables', () => {
    expect(css).toContain('--color-text');
    expect(css).toContain('--color-text-light');
  });

  test('defines font-family variable', () => {
    expect(css).toContain('--font-family');
  });

  test('defines max-width variable', () => {
    expect(css).toContain('--max-width');
  });

  test('defines border-radius variable', () => {
    expect(css).toContain('--radius');
  });

  test('defines shadow variables', () => {
    expect(css).toContain('--shadow');
  });
});

describe('CSS Layout classes', () => {
  test('has .container class', () => {
    expect(css).toMatch(/\.container\s*\{/);
  });

  test('has .site-header class', () => {
    expect(css).toMatch(/\.site-header\s*\{/);
  });

  test('has .site-footer class', () => {
    expect(css).toMatch(/\.site-footer/);
  });

  test('has .hero class', () => {
    expect(css).toMatch(/\.hero\s*\{/);
  });

  test('has .section class', () => {
    expect(css).toMatch(/\.section\s*\{/);
  });

  test('has .cards class', () => {
    expect(css).toMatch(/\.cards?\s*\{/);
  });
});

describe('CSS Component classes', () => {
  test('has button styles (.btn)', () => {
    expect(css).toMatch(/\.btn\s*\{/);
  });

  test('has primary button style (.btn-primary)', () => {
    expect(css).toMatch(/\.btn-primary/);
  });

  test('has outline button style (.btn-outline)', () => {
    expect(css).toMatch(/\.btn-outline/);
  });

  test('has navigation button style (.btn-nav)', () => {
    expect(css).toMatch(/\.btn-nav/);
  });

  test('has pricing card styles', () => {
    expect(css).toMatch(/\.pricing-card/);
  });

  test('has form group styles', () => {
    expect(css).toMatch(/\.form-group/);
  });

  test('has chat container styles', () => {
    expect(css).toMatch(/\.chat-container/);
  });

  test('has chat bubble styles', () => {
    expect(css).toMatch(/\.chat-bubble/);
  });

  test('has FAQ item styles', () => {
    expect(css).toMatch(/\.faq-item/);
  });

  test('has language switcher styles', () => {
    expect(css).toMatch(/\.lang-switcher/);
  });

  test('has language button styles', () => {
    expect(css).toMatch(/\.lang-btn/);
  });
});

describe('CSS Responsive design', () => {
  test('has at least one media query', () => {
    expect(css).toMatch(/@media/);
  });

  test('has mobile breakpoint (max-width)', () => {
    expect(css).toMatch(/@media\s*\([^)]*max-width/);
  });

  test('nav toggle is display:none by default (desktop)', () => {
    expect(css).toMatch(/\.nav-toggle\s*\{[^}]*display:\s*none/);
  });
});

describe('CSS Utility & states', () => {
  test('has .active state styling', () => {
    expect(css).toMatch(/\.active/);
  });

  test('has .highlight text styling', () => {
    expect(css).toMatch(/\.highlight/);
  });

  test('has sticky header', () => {
    expect(css).toMatch(/position:\s*sticky/);
  });

  test('has scroll-behavior smooth', () => {
    expect(css).toMatch(/scroll-behavior:\s*smooth/);
  });

  test('has dark background theme', () => {
    // PRD shows dark theme with #121212 or similar
    expect(css).toMatch(/#1[0-2][0-9a-f]{4}/i);
  });
});
