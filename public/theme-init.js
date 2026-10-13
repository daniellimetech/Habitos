(function () {
  var preference = 'system';
  try { var saved = localStorage.getItem('ritmo-theme'); if (['light', 'dark', 'system'].includes(saved)) preference = saved; } catch (_) {}
  var dark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
})();
