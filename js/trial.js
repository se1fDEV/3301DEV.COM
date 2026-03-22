/* ===== Trial form ===== */
(function () {
  var form      = document.getElementById('trialForm');
  if (!form) return;

  var successMsg = document.getElementById('trialSuccess');
  var errorMsg   = document.getElementById('trialError');
  var submitBtn  = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.style.display = 'none';
    errorMsg.style.display   = 'none';

    var name  = form.fullName.value.trim();
    var email = form.workEmail.value.trim();

    if (!name || !email) {
      errorMsg.textContent   = window.i18n.t('trial.form.error.required');
      errorMsg.style.display = 'block';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg.textContent   = window.i18n.t('trial.form.error.email');
      errorMsg.style.display = 'block';
      return;
    }

    submitBtn.disabled      = true;
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
