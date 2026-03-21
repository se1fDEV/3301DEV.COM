/**
 * i18n (Internationalization) Tests
 * Tests the translation engine: key completeness, language switching,
 * DOM application, localStorage persistence, and the public API.
 */
const fs = require('fs');
const path = require('path');
const { readPageHTML, readI18nSource, ALL_PAGES } = require('./helpers');

// Extract the translations object by evaluating the IIFE in a controlled scope
function getTranslations() {
  const src = readI18nSource();
  // Extract the translations object literal between `var translations = {` and the matching close
  const match = src.match(/var\s+translations\s*=\s*(\{[\s\S]*?\n\s*\});/);
  if (!match) throw new Error('Could not extract translations object from i18n.js');
  // Use indirect eval to parse it
  const fn = new Function('return ' + match[1]);
  return fn();
}

describe('i18n — Translation completeness', () => {
  let translations;

  beforeAll(() => {
    translations = getTranslations();
  });

  test('has "en" and "ua" language entries', () => {
    expect(translations).toHaveProperty('en');
    expect(translations).toHaveProperty('ua');
  });

  test('EN and UA have the same translation keys', () => {
    const enKeys = Object.keys(translations.en).sort();
    const uaKeys = Object.keys(translations.ua).sort();
    expect(enKeys).toEqual(uaKeys);
  });

  test('no empty translation values in EN', () => {
    Object.entries(translations.en).forEach(([key, val]) => {
      expect(val).toBeTruthy();
    });
  });

  test('no empty translation values in UA', () => {
    Object.entries(translations.ua).forEach(([key, val]) => {
      expect(val).toBeTruthy();
    });
  });

  test('EN translations are different from UA translations (not just copies)', () => {
    let differentCount = 0;
    Object.keys(translations.en).forEach((key) => {
      if (translations.en[key] !== translations.ua[key]) {
        differentCount++;
      }
    });
    // Most translations should differ; allow a few to be the same (e.g. "DevOps")
    expect(differentCount).toBeGreaterThan(Object.keys(translations.en).length * 0.8);
  });
});

describe('i18n — data-i18n keys in HTML match translation keys', () => {
  let translations;

  beforeAll(() => {
    translations = getTranslations();
  });

  ALL_PAGES.forEach((page) => {
    test(`all data-i18n keys in ${page} exist in EN translations`, () => {
      const html = readPageHTML(page);
      const keyPattern = /data-i18n="([^"]+)"/g;
      let match;
      const missingKeys = [];
      while ((match = keyPattern.exec(html)) !== null) {
        if (translations.en[match[1]] === undefined) {
          missingKeys.push(match[1]);
        }
      }
      expect(missingKeys).toEqual([]);
    });

    test(`all data-i18n-ph keys in ${page} exist in EN translations`, () => {
      const html = readPageHTML(page);
      const keyPattern = /data-i18n-ph="([^"]+)"/g;
      let match;
      const missingKeys = [];
      while ((match = keyPattern.exec(html)) !== null) {
        if (translations.en[match[1]] === undefined) {
          missingKeys.push(match[1]);
        }
      }
      expect(missingKeys).toEqual([]);
    });
  });
});

describe('i18n — Engine behavior', () => {
  let originalHTML;

  beforeEach(() => {
    // Reset DOM
    originalHTML = readPageHTML('index.html');
    document.documentElement.innerHTML = '';
    document.open();
    document.write(originalHTML);
    document.close();

    // Reset localStorage
    localStorage.clear();

    // Execute i18n script
    const src = readI18nSource();
    eval(src);
  });

  test('applies EN translations by default', () => {
    const el = document.querySelector('[data-i18n="nav.products"]');
    expect(el).not.toBeNull();
    expect(el.innerHTML).toBe('Products');
  });

  test('exposes window.i18n.t() function', () => {
    expect(typeof window.i18n.t).toBe('function');
  });

  test('window.i18n.t() returns correct EN text', () => {
    expect(window.i18n.t('nav.products')).toBe('Products');
    expect(window.i18n.t('nav.pricing')).toBe('Plans & Pricing');
  });

  test('window.i18n.t() returns key for unknown keys', () => {
    expect(window.i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  test('window.i18n.lang() returns current language', () => {
    expect(window.i18n.lang()).toBe('en');
  });

  test('applyTranslations switches to UA', () => {
    window.i18n.apply('ua');
    expect(window.i18n.lang()).toBe('ua');
    const el = document.querySelector('[data-i18n="nav.products"]');
    expect(el.innerHTML).toBe('Продукти');
  });

  test('language is persisted to localStorage', () => {
    window.i18n.apply('ua');
    expect(localStorage.getItem('lang')).toBe('ua');
  });

  test('sets html lang attribute to "uk" for UA', () => {
    window.i18n.apply('ua');
    expect(document.documentElement.lang).toBe('uk');
  });

  test('sets html lang attribute to "en" for EN', () => {
    window.i18n.apply('en');
    expect(document.documentElement.lang).toBe('en');
  });

  test('updates lang button active state on switch', () => {
    window.i18n.apply('ua');
    const uaBtn = document.querySelector('.lang-btn[data-lang="ua"]');
    const enBtn = document.querySelector('.lang-btn[data-lang="en"]');
    expect(uaBtn.classList.contains('active')).toBe(true);
    expect(enBtn.classList.contains('active')).toBe(false);
  });

  test('restores EN after switching back from UA', () => {
    window.i18n.apply('ua');
    window.i18n.apply('en');
    expect(window.i18n.lang()).toBe('en');
    const el = document.querySelector('[data-i18n="nav.products"]');
    expect(el.innerHTML).toBe('Products');
  });

  test('loads saved language from localStorage on init', () => {
    localStorage.setItem('lang', 'ua');
    // Re-execute i18n script
    const src = readI18nSource();
    eval(src);
    expect(window.i18n.lang()).toBe('ua');
  });
});
