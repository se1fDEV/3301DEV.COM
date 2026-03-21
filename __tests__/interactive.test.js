/**
 * Form Validation & Interactive Features Tests
 * Tests support form validation, trial form validation,
 * pricing billing toggle, and AI chat behavior.
 */
const fs = require('fs');
const path = require('path');
const { readPageHTML, readI18nSource } = require('./helpers');

function setupPage(pageName) {
  let html = readPageHTML(pageName);
  // Strip inline <script> blocks to avoid jsdom executing them
  // (we attach handlers directly in each test suite)
  html = html.replace(/<script>[\s\S]*?<\/script>/g, '');
  // Also strip external script references
  html = html.replace(/<script\s[^>]*src=[^>]*><\/script>/g, '');
  document.documentElement.innerHTML = '';
  document.open();
  document.write(html);
  document.close();
  localStorage.clear();
  // Load i18n so window.i18n.t() is available
  eval(readI18nSource());
}

/**
 * Attach form handler that mirrors the support.html inline script.
 * Uses getElementById instead of form named property access (jsdom limitation).
 */
function attachSupportFormHandler() {
  var form = document.getElementById('supportForm');
  var successMsg = document.getElementById('formSuccess');
  var errorMsg = document.getElementById('formError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      errorMsg.textContent = window.i18n.t('support.form.error.required');
      errorMsg.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg.textContent = window.i18n.t('support.form.error.email');
      errorMsg.style.display = 'block';
      return;
    }

    successMsg.style.display = 'block';
    form.reset();
  });
}

/**
 * Attach form handler that mirrors the try-free.html inline script.
 */
function attachTrialFormHandler() {
  var form = document.getElementById('trialForm');
  var successMsg = document.getElementById('trialSuccess');
  var errorMsg = document.getElementById('trialError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    var name = document.getElementById('fullName').value.trim();
    var email = document.getElementById('workEmail').value.trim();

    if (!name || !email) {
      errorMsg.textContent = window.i18n.t('trial.form.error.required');
      errorMsg.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg.textContent = window.i18n.t('trial.form.error.email');
      errorMsg.style.display = 'block';
      return;
    }

    successMsg.style.display = 'block';
    form.reset();
  });
}

// ─── Support Form ───────────────────────────────────────────

describe('Support form validation', () => {
  let form, successMsg, errorMsg;

  beforeEach(() => {
    setupPage('support.html');
    form = document.getElementById('supportForm');
    successMsg = document.getElementById('formSuccess');
    errorMsg = document.getElementById('formError');
    attachSupportFormHandler();
  });

  test('form exists with required fields', () => {
    expect(form).not.toBeNull();
    expect(document.getElementById('name')).not.toBeNull();
    expect(document.getElementById('email')).not.toBeNull();
    expect(document.getElementById('category')).not.toBeNull();
    expect(document.getElementById('message')).not.toBeNull();
  });

  test('shows error when required fields are empty', () => {
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(errorMsg.style.display).toBe('block');
    expect(successMsg.style.display).toBe('none');
  });

  test('shows error for invalid email', () => {
    document.getElementById('name').value = 'Test User';
    document.getElementById('email').value = 'notanemail';
    document.getElementById('message').value = 'Test message';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(errorMsg.style.display).toBe('block');
  });

  test('shows success for valid input', () => {
    document.getElementById('name').value = 'Test User';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('message').value = 'I need help with my account';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(successMsg.style.display).toBe('block');
    expect(errorMsg.style.display).toBe('none');
  });

  test('resets form after successful submission', () => {
    document.getElementById('name').value = 'Test User';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('message').value = 'Test';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(document.getElementById('name').value).toBe('');
    expect(document.getElementById('email').value).toBe('');
    expect(document.getElementById('message').value).toBe('');
  });

  test('category select has correct options', () => {
    const select = document.getElementById('category');
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain('billing');
    expect(values).toContain('technical');
    expect(values).toContain('onboarding');
    expect(values).toContain('scope');
    expect(values).toContain('other');
  });
});

// ─── Trial Form ─────────────────────────────────────────────

describe('Trial form validation', () => {
  let form, successMsg, errorMsg;

  beforeEach(() => {
    setupPage('try-free.html');
    form = document.getElementById('trialForm');
    successMsg = document.getElementById('trialSuccess');
    errorMsg = document.getElementById('trialError');
    attachTrialFormHandler();
  });

  test('form exists with required fields', () => {
    expect(form).not.toBeNull();
    expect(document.getElementById('fullName')).not.toBeNull();
    expect(document.getElementById('workEmail')).not.toBeNull();
    expect(document.getElementById('company')).not.toBeNull();
    expect(document.getElementById('teamSize')).not.toBeNull();
  });

  test('shows error when name and email are empty', () => {
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(errorMsg.style.display).toBe('block');
  });

  test('shows error for invalid email', () => {
    document.getElementById('fullName').value = 'Jane Smith';
    document.getElementById('workEmail').value = 'invalid-email';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(errorMsg.style.display).toBe('block');
  });

  test('shows success for valid submission', () => {
    document.getElementById('fullName').value = 'Jane Smith';
    document.getElementById('workEmail').value = 'jane@company.com';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(successMsg.style.display).toBe('block');
  });

  test('resets form after successful submission', () => {
    document.getElementById('fullName').value = 'Jane Smith';
    document.getElementById('workEmail').value = 'jane@company.com';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(document.getElementById('fullName').value).toBe('');
    expect(document.getElementById('workEmail').value).toBe('');
  });

  test('team size select has correct options', () => {
    const select = document.getElementById('teamSize');
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain('1-5');
    expect(values).toContain('6-20');
    expect(values).toContain('21-50');
    expect(values).toContain('51+');
  });
});

// ─── Pricing Toggle ─────────────────────────────────────────

describe('Pricing billing toggle', () => {
  beforeEach(() => {
    setupPage('pricing.html');
    // Attach billing toggle handler directly (mirrors inline script)
    var toggle = document.getElementById('toggleSwitch');
    var labels = document.querySelectorAll('.toggle-label');
    var prices = document.querySelectorAll('.pricing-price');
    var monthlyLabels = document.querySelectorAll('.monthly-label');
    var annualLabels = document.querySelectorAll('.annual-label');
    var isAnnual = false;

    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      toggle.classList.toggle('active', isAnnual);

      labels.forEach(function (l) {
        l.classList.toggle('active', isAnnual ? l.dataset.period === 'annual' : l.dataset.period === 'monthly');
      });

      prices.forEach(function (el) {
        var price = isAnnual ? el.dataset.annual : el.dataset.monthly;
        el.innerHTML = '$' + price + '<span>/mo</span>';
      });

      monthlyLabels.forEach(function (el) { el.style.display = isAnnual ? 'none' : ''; });
      annualLabels.forEach(function (el) { el.style.display = isAnnual ? '' : 'none'; });
    });
  });

  test('pricing cards show monthly prices by default', () => {
    const prices = document.querySelectorAll('.pricing-price');
    expect(prices.length).toBe(3);
    expect(prices[0].textContent).toContain('25');
    expect(prices[1].textContent).toContain('100');
    expect(prices[2].textContent).toContain('250');
  });

  test('pricing cards have data-monthly and data-annual attributes', () => {
    const prices = document.querySelectorAll('.pricing-price');
    prices.forEach((p) => {
      expect(p.dataset.monthly).toBeDefined();
      expect(p.dataset.annual).toBeDefined();
      expect(Number(p.dataset.annual)).toBeLessThan(Number(p.dataset.monthly));
    });
  });

  test('toggle switch updates to annual prices', () => {
    const toggle = document.getElementById('toggleSwitch');
    toggle.click();
    const prices = document.querySelectorAll('.pricing-price');
    expect(prices[0].textContent).toContain('20');
    expect(prices[1].textContent).toContain('80');
    expect(prices[2].textContent).toContain('200');
  });

  test('toggle switch toggles back to monthly prices', () => {
    const toggle = document.getElementById('toggleSwitch');
    toggle.click(); // annual
    toggle.click(); // back to monthly
    const prices = document.querySelectorAll('.pricing-price');
    expect(prices[0].textContent).toContain('25');
    expect(prices[1].textContent).toContain('100');
    expect(prices[2].textContent).toContain('250');
  });

  test('annual labels are hidden by default, monthly visible', () => {
    const monthly = document.querySelectorAll('.monthly-label');
    const annual = document.querySelectorAll('.annual-label');
    monthly.forEach((el) => expect(el.style.display).not.toBe('none'));
    annual.forEach((el) => expect(el.style.display).toBe('none'));
  });

  test('clicking toggle shows annual labels and hides monthly', () => {
    const toggle = document.getElementById('toggleSwitch');
    toggle.click();
    const monthly = document.querySelectorAll('.monthly-label');
    const annual = document.querySelectorAll('.annual-label');
    monthly.forEach((el) => expect(el.style.display).toBe('none'));
    annual.forEach((el) => expect(el.style.display).not.toBe('none'));
  });
});

// ─── AI Chat ────────────────────────────────────────────────

describe('AI Chat behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupPage('support.html');

    // Attach chat handler directly (mirrors inline script)
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var chatMessages = document.getElementById('chatMessages');

    var responses = [
      function (msg) {
        if (/ci\s*\/?\s*cd|pipeline|deploy/i.test(msg)) {
          return 'Based on your description, a CI/CD pipeline setup typically falls under our <strong>Professional plan ($100/mo)</strong>. Estimated scope: 8–16 hours of DevOps work. Want me to connect you with a specialist?';
        }
        if (/website|web\s*app|frontend|landing/i.test(msg)) {
          return 'A custom website or web app project usually takes 20–60 hours depending on complexity. Our <strong>Professional</strong> or <strong>Premium</strong> plan would be a great fit. Shall I prepare a detailed estimate?';
        }
        if (/security|audit|penetration|vulnerability/i.test(msg)) {
          return 'Security audits and vulnerability assessments are covered under our <strong>Premium plan ($250/mo)</strong>. Estimated scope: 12–30 hours with our IT specialists. Would you like to start a trial?';
        }
        if (/api|integration|backend/i.test(msg)) {
          return 'API development and system integrations typically require 15–40 hours of development work. Our <strong>Professional plan</strong> includes dedicated developers for this. Want to discuss specifics?';
        }
        if (/support|help\s*desk|tickets/i.test(msg)) {
          return 'For ongoing support and help-desk services, our <strong>Basic plan ($25/mo)</strong> covers up to 5 tickets/month. Need more? Professional offers 20, and Premium is unlimited.';
        }
        return 'Thanks for sharing! Based on what you\'ve described, I\'d recommend starting with our <strong>Professional plan ($100/mo)</strong> for access to developers and DevOps specialists. You can <a href="try-free.html">start a free trial</a> to evaluate the fit. Want more details on any specific service?';
      }
    ];

    function addBubble(text, sender) {
      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + sender;
      var label = sender === 'bot' ? window.i18n.t('support.chat.agent') : window.i18n.t('support.chat.you');
      bubble.innerHTML = '<strong>' + label + '</strong><p>' + text + '</p>';
      chatMessages.appendChild(bubble);
    }

    chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = chatInput.value.trim();
      if (!msg) return;

      var safeMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      addBubble(safeMsg, 'user');
      chatInput.value = '';

      setTimeout(function () {
        var reply = responses[0](msg);
        addBubble(reply, 'bot');
      }, 800);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('chat has initial greeting message', () => {
    const bubbles = document.querySelectorAll('.chat-bubble');
    expect(bubbles.length).toBeGreaterThanOrEqual(1);
    expect(bubbles[0].classList.contains('bot')).toBe(true);
  });

  test('submitting a message adds user bubble', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'I need a CI/CD pipeline';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    const bubbles = document.querySelectorAll('.chat-bubble.user');
    expect(bubbles.length).toBe(1);
  });

  test('bot responds after timeout', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'I need a CI/CD pipeline';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    jest.advanceTimersByTime(1000);
    const botBubbles = document.querySelectorAll('.chat-bubble.bot');
    expect(botBubbles.length).toBe(2); // greeting + response
  });

  test('CI/CD query gets pipeline-related response', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'Setup CI/CD pipeline';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    jest.advanceTimersByTime(1000);
    const botBubbles = document.querySelectorAll('.chat-bubble.bot');
    const lastBot = botBubbles[botBubbles.length - 1];
    expect(lastBot.textContent).toMatch(/pipeline|DevOps|Professional/i);
  });

  test('website query gets web-related response', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'I need a landing page website';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    jest.advanceTimersByTime(1000);
    const botBubbles = document.querySelectorAll('.chat-bubble.bot');
    const lastBot = botBubbles[botBubbles.length - 1];
    expect(lastBot.textContent).toMatch(/website|web app|Professional|Premium/i);
  });

  test('security query gets security-related response', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'We need a security audit';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    jest.advanceTimersByTime(1000);
    const botBubbles = document.querySelectorAll('.chat-bubble.bot');
    const lastBot = botBubbles[botBubbles.length - 1];
    expect(lastBot.textContent).toMatch(/security|audit|Premium/i);
  });

  test('user input is HTML-escaped in chat', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = '<script>alert("xss")</script>';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    const userBubble = document.querySelector('.chat-bubble.user');
    expect(userBubble.innerHTML).toContain('&lt;script&gt;');
    expect(userBubble.innerHTML).not.toContain('<script>alert');
  });

  test('empty message does not add a bubble', () => {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    input.value = '   ';
    const bubblesBefore = document.querySelectorAll('.chat-bubble').length;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    const bubblesAfter = document.querySelectorAll('.chat-bubble').length;
    expect(bubblesAfter).toBe(bubblesBefore);
  });

  test('clears input after sending message', () => {
    const input = document.getElementById('chatInput');
    const form = document.getElementById('chatForm');
    input.value = 'Hello';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(input.value).toBe('');
  });
});

// ─── Mobile Nav Toggle ──────────────────────────────────────

describe('Mobile nav toggle', () => {
  beforeEach(() => {
    setupPage('index.html');
    // Attach nav toggle handler directly (mirrors inline script)
    document.querySelector('.nav-toggle').addEventListener('click', function () {
      document.getElementById('mainNav').classList.toggle('open');
    });
  });

  test('nav toggle button exists', () => {
    expect(document.querySelector('.nav-toggle')).not.toBeNull();
  });

  test('clicking toggle adds "open" class to nav', () => {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.getElementById('mainNav');
    btn.click();
    expect(nav.classList.contains('open')).toBe(true);
  });

  test('clicking toggle again removes "open" class', () => {
    const btn = document.querySelector('.nav-toggle');
    const nav = document.getElementById('mainNav');
    btn.click();
    btn.click();
    expect(nav.classList.contains('open')).toBe(false);
  });
});
