'use strict';
const language = document.querySelector('#language');
function setLanguage(value) {
  const lang = value === 'pt' ? 'pt' : 'en';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-en][data-pt]').forEach(el => { el.innerHTML = el.dataset[lang]; });
  language.value = lang;
  try { localStorage.setItem('detent-language', lang); } catch {}
}
let saved = 'en';
try { saved = localStorage.getItem('detent-language') || 'en'; } catch {}
setLanguage(saved);
language.addEventListener('change', () => setLanguage(language.value));
