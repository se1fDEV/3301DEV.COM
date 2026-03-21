const fs = require('fs');
const path = require('path');

/**
 * Loads an HTML file and sets up the DOM for testing.
 * Returns the document object.
 */
function loadPage(pageName) {
  const html = fs.readFileSync(path.resolve(__dirname, '..', pageName), 'utf8');
  document.documentElement.innerHTML = '';
  document.open();
  document.write(html);
  document.close();
  return document;
}

/**
 * Reads raw HTML string for a page.
 */
function readPageHTML(pageName) {
  return fs.readFileSync(path.resolve(__dirname, '..', pageName), 'utf8');
}

/**
 * Reads the i18n.js source as a string.
 */
function readI18nSource() {
  return fs.readFileSync(path.resolve(__dirname, '..', 'js', 'i18n.js'), 'utf8');
}

/**
 * List of all site pages.
 */
const ALL_PAGES = ['index.html', 'pricing.html', 'support.html', 'try-free.html'];

module.exports = { loadPage, readPageHTML, readI18nSource, ALL_PAGES };
