/* ===== Billing period toggle ===== */
(function () {
  var toggle        = document.getElementById('toggleSwitch');
  if (!toggle) return;

  var labels        = document.querySelectorAll('.toggle-label');
  var prices        = document.querySelectorAll('.pricing-price');
  var monthlyLabels = document.querySelectorAll('.monthly-label');
  var annualLabels  = document.querySelectorAll('.annual-label');
  var isAnnual      = localStorage.getItem('billingPeriod') === 'annual';

  function applyPeriod() {
    toggle.classList.toggle('active', isAnnual);

    labels.forEach(function (l) {
      l.classList.toggle('active', isAnnual
        ? l.dataset.period === 'annual'
        : l.dataset.period === 'monthly');
    });

    prices.forEach(function (el) {
      var price = isAnnual ? el.dataset.annual : el.dataset.monthly;
      el.innerHTML = '$' + price + '<span>/mo</span>';
    });

    monthlyLabels.forEach(function (el) {
      el.style.display = isAnnual ? 'none' : '';
    });
    annualLabels.forEach(function (el) {
      el.style.display = isAnnual ? '' : 'none';
    });
  }

  applyPeriod();

  toggle.addEventListener('click', function () {
    isAnnual = !isAnnual;
    localStorage.setItem('billingPeriod', isAnnual ? 'annual' : 'monthly');
    applyPeriod();
  });
})();
