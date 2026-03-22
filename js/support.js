/* ===== FAQ accordion ===== */
(function () {
  function toggleFaq(item) {
    var isOpen = item.classList.contains('open');
    var h4 = item.querySelector('h4');

    document.querySelectorAll('.faq-item').forEach(function (i) {
      i.classList.remove('open');
      i.querySelector('h4').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      h4.setAttribute('aria-expanded', 'true');
    }
  }

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var h4 = item.querySelector('h4');

    item.addEventListener('click', function () { toggleFaq(item); });

    h4.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(item);
      }
    });
  });
})();

/* ===== Contact form ===== */
(function () {
  var form      = document.getElementById('supportForm');
  if (!form) return;

  var successMsg = document.getElementById('formSuccess');
  var errorMsg   = document.getElementById('formError');
  var submitBtn  = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';

    var name    = form.name.value.trim();
    var email   = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      errorMsg.textContent   = window.i18n.t('support.form.error.required');
      errorMsg.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg.textContent   = window.i18n.t('support.form.error.email');
      errorMsg.style.display = 'block';
      return;
    }

    submitBtn.disabled     = true;
    submitBtn.style.opacity = '0.6';

    // Replace setTimeout with real fetch() to your endpoint
    setTimeout(function () {
      successMsg.style.display = 'block';
      successMsg.setAttribute('tabindex', '-1');
      successMsg.focus();
      form.reset();
      submitBtn.disabled      = false;
      submitBtn.style.opacity = '';
    }, 600);
  });
})();

/* ===== AI Chat ===== */
(function () {
  var chatForm     = document.getElementById('chatForm');
  if (!chatForm) return;

  var chatInput    = document.getElementById('chatInput');
  var chatMessages = document.getElementById('chatMessages');

  function getResponse(msg) {
    var ua = window.i18n.lang() === 'ua';

    if (/ci\s*\/?\s*cd|pipeline|deploy|конвеєр|деплой/i.test(msg)) {
      return ua ? window.i18n.t('chat.response.cicd')
        : 'Based on your description, a CI/CD pipeline setup typically falls under our <strong>Professional plan ($100/mo)</strong>. Estimated scope: 8–16 hours of DevOps work. Want me to connect you with a specialist?';
    }
    if (/website|web\s*app|frontend|landing|сайт|веб|лендінг/i.test(msg)) {
      return ua ? window.i18n.t('chat.response.web')
        : 'A custom website or web app project usually takes 20–60 hours depending on complexity. Our <strong>Professional</strong> or <strong>Premium</strong> plan would be a great fit. Shall I prepare a detailed estimate?';
    }
    if (/security|audit|penetration|vulnerability|безпека|аудит|вразливість/i.test(msg)) {
      return ua ? window.i18n.t('chat.response.security')
        : 'Security audits and vulnerability assessments are covered under our <strong>Premium plan ($250/mo)</strong>. Estimated scope: 12–30 hours with our IT specialists. Would you like to start a trial?';
    }
    if (/api|integration|backend|інтеграція|бекенд/i.test(msg)) {
      return ua ? window.i18n.t('chat.response.api')
        : 'API development and system integrations typically require 15–40 hours of development work. Our <strong>Professional plan</strong> includes dedicated developers for this. Want to discuss specifics?';
    }
    if (/support|help\s*desk|tickets|підтримка|тікети|запити/i.test(msg)) {
      return ua ? window.i18n.t('chat.response.support')
        : 'For ongoing support and help-desk services, our <strong>Basic plan ($25/mo)</strong> covers up to 5 tickets/month. Need more? Professional offers 20, and Premium is unlimited.';
    }
    return ua ? window.i18n.t('chat.response.default')
      : 'Thanks for sharing! Based on what you\'ve described, I\'d recommend starting with our <strong>Professional plan ($100/mo)</strong> for access to developers and DevOps specialists. You can <a href="try-free.html">start a free trial</a> to evaluate the fit. Want more details on any specific service?';
  }

  function addBubble(text, sender) {
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + sender;
    var label = sender === 'bot'
      ? window.i18n.t('support.chat.agent')
      : window.i18n.t('support.chat.you');
    bubble.innerHTML = '<strong>' + label + '</strong><p>' + text + '</p>';
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = chatInput.value.trim();
    if (!msg) return;

    var safeMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    addBubble(safeMsg, 'user');
    chatInput.value = '';

    var typingBubble = document.createElement('div');
    typingBubble.className = 'chat-bubble bot';
    typingBubble.innerHTML = '<strong>' + window.i18n.t('support.chat.agent') + '</strong>'
      + '<p class="typing-dots"><span></span><span></span><span></span></p>';
    chatMessages.appendChild(typingBubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(function () {
      chatMessages.removeChild(typingBubble);
      addBubble(getResponse(msg), 'bot');
    }, 800);
  });
})();
