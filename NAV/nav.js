/**
 * nav.js — Principia Orthogona shared navigation
 *
 * Usage: add to any page in the repo:
 *   <script src="nav.js"></script>         (from book/ root)
 *   <script src="../nav.js"></script>       (from book4/ or subdirectory)
 *
 * Features:
 *   - Series nav bar (all volumes)
 *   - BRICS+ language dropdown (PT, ZH, RU, HI, EN, ES, AR, FR + more)
 *   - Fork/clone banner for student repos
 *   - Detects depth automatically (root vs book4/ vs other subdir)
 *   - Works fully offline (no CDN required)
 *
 * Fork this repo: https://github.com/TOTOGT/GTCT
 * Students: clone the repo, open any HTML file in your browser.
 * The nav automatically updates links based on your folder depth.
 *
 * G6 LLC · Newark NJ · Pablo Nogueira Grossi · 2026
 * MIT License (code)
 */

(function () {
  'use strict';

  // ── 1. DETECT DEPTH ─────────────────────────────────────────────────────────
  // Figure out whether we're in the root (book/) or a subdirectory (book4/, etc.)
  var path = window.location.pathname;
  var inSubdir = /\/(book\d+|chapters|sessions|tools)\//.test(path);
  var prefix = inSubdir ? '../' : '';

  // ── 2. LANGUAGE CATALOGUE ───────────────────────────────────────────────────
  // BRICS+ languages + major academic languages
  // Flags are emoji — no image dependencies.
  var LANGS = [
    // BRICS founding + new members (2024)
    { code: 'pt', flag: '🇧🇷', label: 'Português',    note: 'Brasil' },
    { code: 'en', flag: '🇺🇸', label: 'English',      note: 'Primary' },
    { code: 'zh', flag: '🇨🇳', label: '中文',          note: 'Mandarin' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский',      note: 'Russian' },
    { code: 'hi', flag: '🇮🇳', label: 'हिन्दी',        note: 'Hindi' },
    { code: 'ar', flag: '🇸🇦', label: 'العربية',       note: 'Arabic · RTL' },
    { code: 'fa', flag: '🇮🇷', label: 'فارسی',         note: 'Farsi · RTL' },
    { code: 'am', flag: '🇪🇹', label: 'አማርኛ',          note: 'Amharic' },
    // Major academic + partner languages
    { code: 'es', flag: '🇪🇸', label: 'Español',      note: 'Spanish' },
    { code: 'fr', flag: '🇫🇷', label: 'Français',     note: 'French' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch',      note: 'German' },
    { code: 'ja', flag: '🇯🇵', label: '日本語',          note: 'Japanese' },
    { code: 'ko', flag: '🇰🇷', label: '한국어',          note: 'Korean' },
    { code: 'sw', flag: '🇰🇪', label: 'Kiswahili',    note: 'Swahili' },
    { code: 'ur', flag: '🇵🇰', label: 'اردو',           note: 'Urdu · RTL' },
    { code: 'bn', flag: '🇧🇩', label: 'বাংলা',          note: 'Bengali' },
    { code: 'tr', flag: '🇹🇷', label: 'Türkçe',       note: 'Turkish' },
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt',  note: 'Vietnamese' },
    { code: 'id', flag: '🇮🇩', label: 'Bahasa Indo.', note: 'Indonesian' },
  ];

  // ── 3. UI STRINGS (bilingual EN/PT) ─────────────────────────────────────────
  var UI = {
    en: {
      vol3:      'Book 3',
      vol4:      'Book 4',
      hub:       'All Volumes',
      axle:      'AXLE',
      github:    'GitHub',
      gumroad:   'Membership',
      lang:      'Language',
      fork_msg:  'Fork this repo: students can clone and study offline.',
      fork_link: 'github.com/TOTOGT/GTCT',
    },
    pt: {
      vol3:      'Livro 3',
      vol4:      'Livro 4',
      hub:       'Todos os Volumes',
      axle:      'AXLE',
      github:    'GitHub',
      gumroad:   'Associação',
      lang:      'Idioma',
      fork_msg:  'Faça um fork deste repositório: estudantes podem clonar e estudar offline.',
      fork_link: 'github.com/TOTOGT/GTCT',
    }
  };

  // ── 4. CURRENT LANGUAGE STATE ───────────────────────────────────────────────
  var currentLang = localStorage.getItem('po_lang') || detectLang();

  function detectLang() {
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (nav.startsWith('pt')) return 'pt';
    if (nav.startsWith('zh')) return 'zh';
    if (nav.startsWith('ru')) return 'ru';
    if (nav.startsWith('hi')) return 'hi';
    if (nav.startsWith('ar')) return 'ar';
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('fr')) return 'fr';
    return 'en';
  }

  function t(key) {
    var strings = UI[currentLang] || UI['en'];
    return strings[key] || UI['en'][key] || key;
  }

  // ── 5. GOOGLE TRANSLATE INTEGRATION ─────────────────────────────────────────
  // Injects the Google Translate element (no API key required)
  // Only loads when user selects a language other than EN/PT
  // (EN and PT have native content; others use GT)
  var gtLoaded = false;
  function loadGoogleTranslate() {
    if (gtLoaded) return;
    gtLoaded = true;
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element'
      );
    };
    var s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  }

  function translateTo(langCode) {
    currentLang = langCode;
    localStorage.setItem('po_lang', langCode);

    // For PT: page content may already be bilingual; just update html lang
    document.documentElement.lang = langCode;

    // For all non-native languages: trigger Google Translate
    if (langCode !== 'en') {
      loadGoogleTranslate();
      // Give GT a moment to load, then trigger
      setTimeout(function () {
        var sel = document.querySelector('.goog-te-combo');
        if (sel) {
          sel.value = langCode;
          sel.dispatchEvent(new Event('change'));
        }
      }, 1000);
    }

    // Update RTL for Arabic/Farsi/Urdu
    var rtlLangs = ['ar', 'fa', 'ur', 'he'];
    document.documentElement.dir = rtlLangs.indexOf(langCode) >= 0 ? 'rtl' : 'ltr';

    // Rebuild dropdown to show selection
    renderLangDropdown();
    closeLangMenu();
  }

  // ── 6. STYLES ────────────────────────────────────────────────────────────────
  function injectStyles() {
    var id = 'po-nav-styles';
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.textContent = [
      '#po-nav{',
        'position:sticky;top:0;z-index:9000;',
        'background:rgba(10,22,40,.97);',
        'backdrop-filter:blur(8px);',
        '-webkit-backdrop-filter:blur(8px);',
        'border-bottom:1px solid rgba(201,168,76,.15);',
        'font-family:"Outfit",system-ui,sans-serif;',
        'height:52px;',
        'display:flex;align-items:center;',
        'padding:0 1.2rem;',
        'gap:1.2rem;',
        'box-sizing:border-box;',
      '}',
      '#po-nav a{',
        'color:rgba(255,255,255,.55);',
        'font-size:.76rem;text-decoration:none;',
        'letter-spacing:.04em;',
        'transition:color .15s;',
        'white-space:nowrap;',
      '}',
      '#po-nav a:hover{color:#c9a84c;}',
      '#po-nav .po-brand{',
        'color:#c9a84c;',
        'font-weight:700;letter-spacing:.18em;',
        'text-transform:uppercase;font-size:.77rem;',
        'margin-right:.5rem;',
      '}',
      '#po-nav .po-sep{',
        'color:rgba(255,255,255,.15);',
        'font-size:.7rem;',
      '}',
      '#po-nav .po-spacer{flex:1;}',
      /* lang button */
      '#po-lang-btn{',
        'background:rgba(201,168,76,.08);',
        'border:1px solid rgba(201,168,76,.2);',
        'color:#c9a84c;',
        'font-family:"Outfit",system-ui,sans-serif;',
        'font-size:.72rem;letter-spacing:.06em;',
        'padding:.25rem .6rem;',
        'cursor:pointer;',
        'display:flex;align-items:center;gap:.3rem;',
        'white-space:nowrap;',
      '}',
      '#po-lang-btn:hover{background:rgba(201,168,76,.15);}',
      /* dropdown */
      '#po-lang-menu{',
        'position:absolute;top:52px;right:0;',
        'background:#0a1628;',
        'border:1px solid rgba(201,168,76,.2);',
        'border-top:none;',
        'min-width:210px;',
        'max-height:60vh;overflow-y:auto;',
        'z-index:9100;',
        'display:none;',
      '}',
      '#po-lang-menu.open{display:block;}',
      '.po-lang-item{',
        'display:flex;align-items:center;gap:.6rem;',
        'padding:.45rem .8rem;',
        'cursor:pointer;',
        'border-bottom:1px solid rgba(255,255,255,.04);',
        'transition:background .1s;',
      '}',
      '.po-lang-item:hover{background:rgba(201,168,76,.07);}',
      '.po-lang-item.active{background:rgba(201,168,76,.1);}',
      '.po-lang-flag{font-size:1rem;line-height:1;}',
      '.po-lang-label{',
        'font-family:"Outfit",system-ui,sans-serif;',
        'font-size:.78rem;color:rgba(255,255,255,.75);',
        'flex:1;',
      '}',
      '.po-lang-note{',
        'font-size:.64rem;color:rgba(255,255,255,.3);',
        'font-style:italic;',
      '}',
      /* GT hidden element */
      '#google_translate_element{display:none;}',
      '.skiptranslate{display:none!important;}',
      'body{top:0!important;}',
      /* fork banner */
      '#po-fork-banner{',
        'background:rgba(26,107,90,.12);',
        'border-bottom:1px solid rgba(26,107,90,.25);',
        'padding:.35rem 1.2rem;',
        'display:flex;align-items:center;gap:.8rem;',
        'font-family:"Outfit",system-ui,sans-serif;',
        'font-size:.72rem;color:rgba(255,255,255,.55);',
      '}',
      '#po-fork-banner a{color:rgba(26,180,140,.8);text-decoration:none;}',
      '#po-fork-banner a:hover{color:#7ecfb2;}',
      '#po-fork-close{',
        'margin-left:auto;background:none;border:none;',
        'color:rgba(255,255,255,.3);cursor:pointer;font-size:1rem;line-height:1;',
      '}',
    ].join('');
    document.head.appendChild(style);
  }

  // ── 7. BUILD NAV HTML ────────────────────────────────────────────────────────
  function buildNav() {
    var nav = document.createElement('nav');
    nav.id = 'po-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Principia Orthogona series navigation');

    nav.innerHTML = [
      '<a href="' + prefix + 'series-hub.html" class="po-brand" aria-label="Series hub">⚜ PO</a>',
      '<a href="' + prefix + 'index.html">' + t('vol3') + '</a>',
      '<span class="po-sep">·</span>',
      '<a href="' + prefix + 'book4/index.html">' + t('vol4') + '</a>',
      '<span class="po-sep">·</span>',
      '<a href="' + prefix + 'series-hub.html">' + t('hub') + '</a>',
      '<span class="po-sep">·</span>',
      '<a href="https://totogt.github.io/AXLE/" target="_blank" rel="noopener">' + t('axle') + ' ↗</a>',
      '<span class="po-sep">·</span>',
      '<a href="https://g6llc.gumroad.com/l/soundworks" target="_blank" rel="noopener">' + t('gumroad') + ' ↗</a>',
      '<div class="po-spacer"></div>',
      /* Language selector */
      '<div style="position:relative;">',
        '<button id="po-lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="Select language">',
          '<span id="po-lang-flag">' + getCurrentFlag() + '</span>',
          '<span id="po-lang-label">' + getCurrentLabel() + '</span>',
          '<span style="opacity:.5">▾</span>',
        '</button>',
        '<div id="po-lang-menu" role="menu">',
          buildLangItems(),
        '</div>',
      '</div>',
      /* Hidden Google Translate element */
      '<div id="google_translate_element"></div>',
    ].join('');

    return nav;
  }

  function getCurrentFlag() {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === currentLang) return LANGS[i].flag;
    }
    return '🌐';
  }

  function getCurrentLabel() {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === currentLang) return LANGS[i].label;
    }
    return 'EN';
  }

  function buildLangItems() {
    return LANGS.map(function (l) {
      var active = l.code === currentLang ? ' active' : '';
      return [
        '<div class="po-lang-item' + active + '" role="menuitem" tabindex="0"',
          ' data-lang="' + l.code + '"',
          ' aria-label="Switch to ' + l.label + '">',
          '<span class="po-lang-flag">' + l.flag + '</span>',
          '<span class="po-lang-label">' + l.label + '</span>',
          '<span class="po-lang-note">' + l.note + '</span>',
        '</div>',
      ].join('');
    }).join('');
  }

  function renderLangDropdown() {
    var btn = document.getElementById('po-lang-btn');
    var menu = document.getElementById('po-lang-menu');
    if (!btn || !menu) return;
    document.getElementById('po-lang-flag').textContent = getCurrentFlag();
    document.getElementById('po-lang-label').textContent = getCurrentLabel();
    menu.innerHTML = buildLangItems();
    attachLangItemEvents();
  }

  function attachLangItemEvents() {
    var items = document.querySelectorAll('.po-lang-item');
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        item.addEventListener('click', function () {
          translateTo(item.getAttribute('data-lang'));
        });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            translateTo(item.getAttribute('data-lang'));
          }
        });
      })(items[i]);
    }
  }

  function openLangMenu() {
    var menu = document.getElementById('po-lang-menu');
    var btn = document.getElementById('po-lang-btn');
    if (!menu || !btn) return;
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeLangMenu() {
    var menu = document.getElementById('po-lang-menu');
    var btn = document.getElementById('po-lang-btn');
    if (!menu || !btn) return;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  // ── 8. FORK BANNER ──────────────────────────────────────────────────────────
  // Shows once per session for new visitors (localStorage flag)
  function buildForkBanner() {
    if (localStorage.getItem('po_fork_seen')) return null;
    var banner = document.createElement('div');
    banner.id = 'po-fork-banner';
    banner.setAttribute('role', 'banner');
    banner.innerHTML = [
      '<span>🌿</span>',
      '<span>',
        t('fork_msg'),
        ' <a href="https://github.com/TOTOGT/GTCT" target="_blank" rel="noopener">',
          t('fork_link'),
        ' ↗</a>',
      '</span>',
      '<button id="po-fork-close" aria-label="Dismiss">×</button>',
    ].join('');
    return banner;
  }

  // ── 9. INJECT INTO DOM ──────────────────────────────────────────────────────
  function inject() {
    injectStyles();

    var nav = buildNav();
    var body = document.body;

    // Insert nav before the first child of body
    body.insertBefore(nav, body.firstChild);

    // Fork banner
    var banner = buildForkBanner();
    if (banner) {
      body.insertBefore(banner, nav.nextSibling);
    }

    // Set html lang attribute
    document.documentElement.lang = currentLang;
    var rtlLangs = ['ar', 'fa', 'ur', 'he'];
    if (rtlLangs.indexOf(currentLang) >= 0) {
      document.documentElement.dir = 'rtl';
    }

    // ── Events ──
    var btn = document.getElementById('po-lang-btn');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var menu = document.getElementById('po-lang-menu');
        if (menu && menu.classList.contains('open')) {
          closeLangMenu();
        } else {
          openLangMenu();
        }
      });
    }

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      var menu = document.getElementById('po-lang-menu');
      if (menu && !menu.contains(e.target) && e.target !== btn) {
        closeLangMenu();
      }
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLangMenu();
    });

    attachLangItemEvents();

    // Fork banner close
    var forkClose = document.getElementById('po-fork-close');
    if (forkClose) {
      forkClose.addEventListener('click', function () {
        localStorage.setItem('po_fork_seen', '1');
        var b = document.getElementById('po-fork-banner');
        if (b) b.remove();
      });
    }

    // Auto-translate if stored lang is non-English
    if (currentLang !== 'en') {
      setTimeout(function () { translateTo(currentLang); }, 500);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
