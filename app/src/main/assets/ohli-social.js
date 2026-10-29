/* OHLI Social shell. Uses the existing authenticated RKM runtime through window.ohliRuntime. */
(function () {
  'use strict';

  var rt = window.ohliRuntime;
  if (!rt) { console.error('OHLI Social runtime bridge is unavailable.'); return; }

  var icons = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    video: '<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    story: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.3"/><circle cx="12" cy="12" r="1.5"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    live: '<circle cx="12" cy="12" r="2.5"/><path d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M4 4a11.3 11.3 0 0 0 0 16M20 4a11.3 11.3 0 0 1 0 16"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l.9-4.9A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 13.5h5"/>',
    contacts: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.3-3.2 2.4-5 6-5s5.7 1.8 6 5M17 8h4M19 6v4M17 15c2.1.4 3.4 1.8 3.7 4"/>',
    groups: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.8 20c.3-3.7 2.4-5.5 6.2-5.5s5.9 1.8 6.2 5.5M16 14.5c3.1.1 4.8 1.8 5.2 4.7"/>',
    channel: '<path d="M4 9v6M8 6l12-3v18L8 18M8 6v12M4 9H2v6h2M8 18l2 4h4l-3-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 2.4-2.4 2.4-2.5-1.4a7.9 7.9 0 0 1-2 .8l-.7 2.7h-3.4l-.7-2.7a7.9 7.9 0 0 1-2-.8l-2.5 1.4-2.4-2.4 1.4-2.5a7.9 7.9 0 0 1-.8-2L1.2 12v-3.4l2.7-.7a7.9 7.9 0 0 1 .8-2L3.3 3.4 5.7 1 8.2 2.4a7.9 7.9 0 0 1 2-.8L10.9-1h3.4l.7 2.7a7.9 7.9 0 0 1 2 .8l2.5-1.4 2.4 2.4-1.4 2.5a7.9 7.9 0 0 1 .8 2l2.7.7V12l-2.7.7a7.9 7.9 0 0 1-.9 2.3Z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-4 3.2 2.5 3.1-3 4.7 4"/>',
    send: '<path d="m21 3-7 18-4-7-7-4Z"/><path d="M21 3 10 14"/>',
    heart: '<path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>',
    comment: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l.9-4.9A8.5 8.5 0 1 1 21 11.5Z"/>',
    bookmark: '<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2"/>',
    arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.6 8.6 0 1 0 20.5 14.1Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    userPlus: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.3-3.5 2.3-5 6-5s5.7 1.5 6 5M19 8v6M16 11h6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 1M4 17l2-1a7 7 0 0 0 12.5-3"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  function ico(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.home) + '</svg>'; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }
  function shortDate(value) { var d = new Date(Number(value) || value); if (isNaN(d.getTime())) return ''; var delta = Date.now() - d.getTime(); if (delta < 60000) return 'baru saja'; if (delta < 3600000) return Math.max(1, Math.floor(delta / 60000)) + ' mnt'; if (delta < 86400000) return Math.floor(delta / 3600000) + ' jam'; return d.toLocaleDateString('id-ID', {day:'numeric',month:'short'}); }
  function initial(name) { var words = String(name || 'OHLI').trim().split(/\s+/); return ((words[0] || 'O').charAt(0) + (words.length > 1 ? words[words.length - 1].charAt(0) : '')).toUpperCase(); }
  function avatar(name, phone, sizeClass) { return '<span class="ohli-avatar ' + (sizeClass || '') + '" aria-hidden="true">' + esc(initial(name || phone)) + '</span>'; }
  function empty(icon, title, description, actionLabel, action) { return '<div class="ohli-empty"><div class="ohli-empty-icon">' + ico(icon || 'home') + '</div><h3>' + esc(title) + '</h3><p>' + esc(description) + '</p>' + (actionLabel ? '<div style="margin-top:16px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="' + esc(action || '') + '">' + esc(actionLabel) + '</button></div>' : '') + '</div>'; }

  var shell, pageContent, pageTitle, pageDescription, pageActions, nav, searchInput, toastBox, overlay, overlayContent;
  var page = 'home', lastSocialPage = 'home', pageQuery = '', archiveMode = 'archive', posts = [], nextBefore = 0, hasMore = false, users = [], statusList = [], groupItems = [], channelItems = [], notificationItems = [], profileTarget = '', profileData = null, openComments = {}, selectedFile = null, selectedStatusFile = null, videoObserver = null, storyIndex = 0, storyItems = [], theme = 'dark';
  var pageTitles = {home:['Beranda','Temukan kabar, video, dan percakapan dari orang yang kamu ikuti.'],videos:['Video pendek','Tonton satu per satu; video dijeda saat keluar dari layar.'],story:['Story & pembaruan','Cerita yang masih aktif dari akun yang boleh kamu lihat.'],explore:['Jelajahi','Cari pengguna dan postingan publik dari server.'],live:['Live','Siaran langsung yang sedang aktif di server.'],contacts:['Kontak','Temukan orang dan lanjutkan percakapan pribadi.'],groups:['Grup & komunitas','Temukan ruang komunitas dan kelola keanggotaan.'],channels:['Channels','Ikuti kanal pengumuman satu-ke-banyak.'],notifications:['Notifikasi','Aktivitas akun yang tersimpan di server.'],profile:['Profil','Informasi akun dan postingan yang dapat kamu lihat.'],settings:['Pengaturan','Kelola tampilan, akun, privasi, dan koneksi.'],archive:['Arsip & tersimpan','Kelola postingan yang diarsipkan dan koleksi pribadi.']};
  var navItems = [
    ['home','Beranda','home'],['videos','Video pendek','video'],['create','Buat konten','plus'],['story','Story','story'],['explore','Jelajahi','search'],['live','Live','live'],['chat','Chat','chat'],['contacts','Kontak','contacts'],['groups','Grup & komunitas','groups'],['channels','Channels','channel'],['notifications','Notifikasi','bell'],['archive','Arsip & tersimpan','bookmark'],['profile','Profil','profile'],['settings','Pengaturan','settings']
  ];

  function makeShell() {
    shell = document.createElement('section'); shell.id = 'ohliSocialShell'; shell.hidden = true; shell.setAttribute('aria-label','OHLI Social');
    shell.innerHTML = '<header class="ohli-topbar"><button type="button" class="ohli-brand" data-action="home" aria-label="OHLI Social, beranda"><span class="ohli-logo"></span><span><strong>OHLI Social</strong><span>Satu aplikasi, banyak cerita.</span></span></button><form class="ohli-global-search" id="ohliGlobalSearch" role="search">' + ico('search') + '<input id="ohliSearchInput" type="search" placeholder="Cari orang, postingan, topik…" aria-label="Pencarian global"><span class="ohli-sr-only">Tekan Enter untuk mencari</span></form><div class="ohli-topbar-spacer"></div><div class="ohli-status-pill"><span class="ohli-status-dot"></span><span id="ohliConnectionLabel">Menghubungkan…</span></div><button type="button" class="ohli-mobile-menu" data-action="more-menu" aria-label="Menu lain">' + ico('menu') + '</button><button type="button" class="ohli-user-top" data-action="my-profile" aria-label="Buka profil">' + avatar('OHLI','') + '<span class="ohli-user-label"><strong id="ohliTopName">Akun OHLI</strong><small id="ohliTopPhone"></small></span></button></header><aside class="ohli-sidebar" id="ohliGlobalNav" aria-label="Navigasi OHLI"><div class="ohli-nav-caption">Menu utama</div><div id="ohliPrimaryNav"></div><div class="ohli-nav-caption">Ruang sosial</div><div id="ohliCommunityNav"></div><div class="ohli-nav-spacer"></div><button type="button" class="ohli-theme-button" id="ohliThemeToggle">' + ico('sun') + '<span>Ganti tema</span></button><div class="ohli-nav-foot">OHLI Social<br><span>Komunikasi dan komunitas, dalam satu ruang.</span></div></aside><main class="ohli-stage"><div class="ohli-stage-head"><div><h1 id="ohliPageTitle">Beranda</h1><p id="ohliPageDescription"></p></div><div class="ohli-stage-actions" id="ohliPageActions"></div></div><div id="ohliPageContent" class="ohli-page-content"></div></main><div class="ohli-modal-backdrop" id="ohliModalBackdrop" hidden><section class="ohli-modal" role="dialog" aria-modal="true" aria-labelledby="ohliModalTitle"><div class="ohli-modal-head"><h2 id="ohliModalTitle">OHLI Social</h2><button class="ohli-modal-close" type="button" data-action="close-modal" aria-label="Tutup">×</button></div><div id="ohliModalContent"></div></section></div><div class="ohli-story-viewer" id="ohliStoryViewer" hidden><section class="ohli-story-screen"><div class="ohli-story-progress"><span></span></div><div class="ohli-story-owner" id="ohliStoryOwner"></div><div class="ohli-story-media" id="ohliStoryMedia"></div></section></div><div class="ohli-toast" id="ohliToast" hidden role="status" aria-live="polite"></div><input id="ohliPostFile" class="ohli-composer-file" type="file" accept="image/*,video/*"><input id="ohliStatusFile" class="ohli-composer-file" type="file" accept="image/*,video/*">';
    document.body.insertBefore(shell, document.getElementById('modalBackdrop'));
    pageContent = shell.querySelector('#ohliPageContent'); pageTitle = shell.querySelector('#ohliPageTitle'); pageDescription = shell.querySelector('#ohliPageDescription'); pageActions = shell.querySelector('#ohliPageActions'); nav = shell.querySelector('#ohliGlobalNav'); searchInput = shell.querySelector('#ohliSearchInput'); toastBox = shell.querySelector('#ohliToast'); overlay = shell.querySelector('#ohliModalBackdrop'); overlayContent = shell.querySelector('#ohliModalContent');
    var pnav = shell.querySelector('#ohliPrimaryNav'), cnav = shell.querySelector('#ohliCommunityNav');
    navItems.forEach(function (item) {
      var button = document.createElement('button'); button.type = 'button'; button.className = 'ohli-nav-link'; button.dataset.page = item[0]; button.dataset.action = 'navigate'; button.innerHTML = ico(item[2]) + '<span>' + esc(item[1]) + '</span>';
      if (['home','videos','create','story','chat'].indexOf(item[0]) >= 0) button.setAttribute('data-mobile-primary','true');
      if (['home','videos','create','story','explore','live','chat'].indexOf(item[0]) >= 0) pnav.appendChild(button); else cnav.appendChild(button);
    });
    shell.querySelector('#ohliGlobalSearch').addEventListener('submit', function (event) { event.preventDefault(); pageQuery = searchInput.value.trim(); setPage('explore'); });
    shell.querySelector('#ohliThemeToggle').addEventListener('click', toggleTheme);
    shell.addEventListener('click', handleClick);
    shell.addEventListener('submit', handleSubmit);
    shell.addEventListener('change', handleChange);
    shell.querySelector('#ohliStoryViewer').addEventListener('click', function (event) { if (event.target.id === 'ohliStoryViewer') closeStory(); });
    shell.querySelector('#ohliModalBackdrop').addEventListener('click', function (event) { if (event.target === overlay) closeModal(); });
    addLegacyReturnButton();
    theme = localStorage.getItem('ohli:social-theme') || 'dark'; applyTheme();
  }

  function addLegacyReturnButton() {
    var sideHead = document.querySelector('#app .side-head'); if (!sideHead || sideHead.querySelector('#ohliBackSocial')) return;
    var button = document.createElement('button'); button.type = 'button'; button.id = 'ohliBackSocial'; button.className = 'ohli-legacy-return'; button.innerHTML = ico('arrow') + '<span>OHLI Social</span>'; button.title = 'Kembali ke OHLI Social';
    button.addEventListener('click', function () { showShell(lastSocialPage || 'home'); }); sideHead.insertBefore(button, sideHead.firstChild);
  }

  function setShellVisible(visible) {
    shell.hidden = !visible;
    var app = document.getElementById('app'); if (app) app.hidden = visible;
    if (visible) { var me = rt.getMe(); if (me) { shell.querySelector('#ohliTopName').textContent = me.name || 'Akun OHLI'; shell.querySelector('#ohliTopPhone').textContent = me.phone || ''; } }
  }
  function showShell(targetPage) { setShellVisible(true); setPage(targetPage || page || 'home'); }
  function goLegacy(which) {
    shell.hidden = true; var app = document.getElementById('app'); app.hidden = false; app.classList.remove('page-open','chat-open');
    if (which === 'contacts') rt.openContacts(); else if (which === 'calls') rt.openCalls(); else rt.openChat();
    var returnBtn = document.getElementById('ohliBackSocial'); if (returnBtn) returnBtn.style.display = '';
  }
  function setPage(next, extra) {
    if (next === 'chat') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'chat'; goLegacy('chat'); return; }
    if (next === 'contacts') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'contacts'; goLegacy('contacts'); return; }
    if (next === 'calls') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'calls'; goLegacy('calls'); return; }
    if (next === 'create') { page = 'home'; setShellVisible(true); renderPage(); setTimeout(function () { var area = shell.querySelector('#ohliPostText'); if (area) area.focus(); }, 40); return; }
    page = next || 'home'; if (extra && extra.phone) profileTarget = extra.phone; setShellVisible(true);
    shell.querySelectorAll('.ohli-nav-link').forEach(function (button) { button.classList.toggle('active', button.dataset.page === page || (page === 'profile' && button.dataset.page === 'profile')); });
    var meta = pageTitles[page] || pageTitles.home; pageTitle.textContent = meta[0]; pageDescription.textContent = meta[1]; pageActions.innerHTML = '';
    if (page === 'home') pageActions.innerHTML = '<button class="ohli-btn ohli-btn-primary" type="button" data-action="compose-focus">' + ico('plus') + ' Buat postingan</button>';
    if (page === 'profile') pageActions.innerHTML = '<button class="ohli-btn" type="button" data-action="edit-profile">' + ico('settings') + ' Edit profil</button>';
    renderPage();
  }
  function applyTheme() { if (!shell) return; shell.classList.toggle('ohli-dark', theme !== 'light'); var btn = shell.querySelector('#ohliThemeToggle'); if (btn) btn.innerHTML = ico(theme === 'light' ? 'moon' : 'sun') + '<span>' + (theme === 'light' ? 'Mode gelap' : 'Mode terang') + '</span>'; }
  function toggleTheme() { theme = theme === 'light' ? 'dark' : 'light'; localStorage.setItem('ohli:social-theme', theme); applyTheme(); }
  var toastTimeout = null;
  function toast(message) { toastBox.textContent = String(message || 'Selesai'); toastBox.hidden = false; if (toastTimeout) clearTimeout(toastTimeout); toastTimeout = setTimeout(function () { toastBox.hidden = true; }, 3300); }
  function apiError(error) { return (error && error.message) ? error.message : 'Permintaan belum berhasil. Periksa koneksi server dan coba lagi.'; }
  function showLoading() { pageContent.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>'; }
  function showError(message, retryAction) { pageContent.innerHTML = '<div class="ohli-error"><strong>Belum dapat memuat data.</strong><div style="margin:6px 0 12px">' + esc(message) + '</div><button type="button" class="ohli-btn" data-action="' + esc(retryAction || 'retry') + '">' + ico('refresh') + ' Coba lagi</button></div>'; }
  function renderPage() {
    if (videoObserver) { videoObserver.disconnect(); videoObserver = null; }
    if (page === 'home') return renderHome(true);
    if (page === 'videos') return renderVideos();
    if (page === 'story') return renderStories();
    if (page === 'explore') return renderExplore();
    if (page === 'live') return renderLive();
    if (page === 'groups') return renderCommunities('group');
    if (page === 'channels') return renderCommunities('channel');
    if (page === 'notifications') return renderNotifications();
    if (page === 'archive') return renderArchives();
    if (page === 'profile') return renderProfile(profileTarget || (rt.getMe() && rt.getMe().phone));
    if (page === 'settings') return renderSettings();
    pageContent.innerHTML = empty('home','Selamat datang di OHLI Social','Mulai dengan membuat postingan, mencari orang, atau masuk ke chat.', 'Buat postingan','compose-focus');
  }

  function composeCard() {
    var me = rt.getMe() || {};
    return '<form class="ohli-card ohli-compose" id="ohliComposeForm"><div class="ohli-compose-top">' + avatar(me.name,me.phone) + '<textarea id="ohliPostText" name="text" maxlength="2000" placeholder="Apa yang ingin kamu bagikan?" aria-label="Isi postingan"></textarea></div><div class="ohli-compose-divider"></div><div class="ohli-compose-bottom"><select id="ohliAudience" class="ohli-audience" aria-label="Audiens postingan"><option value="public">Publik</option><option value="followers">Pengikut</option><option value="private">Pribadi</option></select><button type="button" class="ohli-btn" data-action="pick-post-media">' + ico('image') + ' Foto / video</button><span class="ohli-hint" id="ohliSelectedFileLabel"></span><div class="ohli-compose-actions"><button class="ohli-btn ohli-btn-primary" type="submit" id="ohliPostSubmit">' + ico('send') + ' Posting</button></div></div></form>';
  }

  function homeBase() {
    return '<div class="ohli-home-grid"><div class="ohli-feed-column"><div class="ohli-feed-tabs"><button type="button" class="ohli-feed-tab active" data-action="feed-mode" data-mode="public">Untuk Kamu</button><button type="button" class="ohli-feed-tab" data-action="feed-mode" data-mode="following">Mengikuti</button></div>' + composeCard() + '<div id="ohliStoryStrip" class="ohli-card" style="padding:16px 15px 11px"><div class="ohli-rail-title"><span>Story terbaru</span><button class="ohli-btn" type="button" data-action="navigate" data-page="story">Lihat semua</button></div><div id="ohliStoryStripContent"></div></div><div id="ohliFeedList" class="ohli-feed-column"></div><div id="ohliFeedMore" style="text-align:center"></div></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title"><span>Orang yang mungkin kamu kenal</span><small>akun</small></div><div id="ohliSuggestions"></div></div><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title"><span>Jelajahi topik</span><small>OHLI</small></div><button type="button" class="ohli-trend" data-action="search-topic" data-query="teknologi"><small>Topik populer</small><strong>#Teknologi</strong><span>Jelajahi diskusi teknologi</span></button><button type="button" class="ohli-trend" data-action="search-topic" data-query="kreator"><small>Untuk kreator</small><strong>#Kreator</strong><span>Postingan dan karya terbaru</span></button><button type="button" class="ohli-trend" data-action="search-topic" data-query="komunitas"><small>Ruang bersama</small><strong>#Komunitas</strong><span>Temukan percakapan baru</span></button></div><div class="ohli-rail-footer">OHLI Social · Privasi dan keamanan tetap menjadi bagian dari pengalaman sosial.<br>Konten pada feed berasal dari server; bukan contoh/demo.</div></aside></div>';
  }

  var currentFeedMode = 'public';
  async function renderHome(reset) {
    pageContent.innerHTML = homeBase();
    var list = pageContent.querySelector('#ohliFeedList'); list.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>';
    if (reset) nextBefore = 0;
    pageContent.querySelectorAll('.ohli-feed-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.mode === currentFeedMode); });
    var feedPath = '/api/feed?mode=' + encodeURIComponent(currentFeedMode) + (reset || !nextBefore ? '' : '&before=' + encodeURIComponent(nextBefore));
    try {
      var data = await rt.request(feedPath); var newPosts = data.posts || [];
      if (reset || !nextBefore) posts = newPosts; else { var seen = {}; posts.forEach(function (p) { seen[p.id] = true; }); newPosts.forEach(function (p) { if (!seen[p.id]) posts.push(p); }); }
      nextBefore = Number(data.nextBefore) || 0; hasMore = !!data.hasMore;
      list.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home', currentFeedMode === 'following' ? 'Feed Mengikuti masih kosong' : 'Belum ada postingan', currentFeedMode === 'following' ? 'Ikuti akun lain untuk melihat postingannya di sini.' : 'Jadilah orang pertama yang membagikan cerita di OHLI Social.', 'Buat postingan','compose-focus');
      var more = pageContent.querySelector('#ohliFeedMore'); more.innerHTML = hasMore ? '<button type="button" class="ohli-btn" data-action="load-more">Muat postingan lainnya</button>' : (posts.length ? '<p class="ohli-hint">Kamu sudah melihat postingan yang tersedia untuk halaman ini.</p>' : '');
      var stories = await rt.request('/api/status'); statusList = stories.statuses || []; renderStoryStrip(pageContent.querySelector('#ohliStoryStripContent'), statusList);
      try { var ud = await rt.request('/api/users'); users = ud.users || []; renderSuggestions(pageContent.querySelector('#ohliSuggestions')); } catch (ignoreUsers) { }
    } catch (e) { list.innerHTML = ''; showError(apiError(e), 'retry'); }
  }

  function renderStoryStrip(target, list) {
    if (!target) return;
    var me = rt.getMe() || {}, allowed = (list || []).filter(function (s) { return s && s.id; }).slice(0, 16);
    var html = '<div class="ohli-story-row"><button type="button" class="ohli-story-item" data-action="navigate" data-page="story"><div class="ohli-story-ring ohli-story-add"><span>+</span></div><strong>Story kamu</strong><small>Tambah</small></button>';
    allowed.forEach(function (s) { html += '<button type="button" class="ohli-story-item" data-action="view-story" data-story-id="' + esc(s.id) + '"><div class="ohli-story-ring"><span>' + esc(initial(s.name || s.phone)) + '</span></div><strong>' + esc(s.phone === me.phone ? 'Kamu' : (s.name || s.phone)) + '</strong><small>' + esc(shortDate(s.time)) + '</small></button>'; });
    html += '</div>'; target.innerHTML = html;
    target.querySelectorAll('[data-action="view-story"]').forEach(function (button) { button.addEventListener('click', function () { var s = allowed.find(function (x) { return x.id === button.dataset.storyId; }); if (s) viewStory(s); }); });
  }

  function renderSuggestions(target) {
    if (!target) return; var me = rt.getMe() || {}, list = (users || []).filter(function (u) { return u.phone !== me.phone; }).slice(0, 5);
    target.innerHTML = list.length ? list.map(function (u) { return '<div class="ohli-user-suggestion">' + avatar(u.name,u.phone) + '<div class="ohli-user-copy"><strong>' + esc(u.name || u.phone) + '</strong><small>' + esc(u.about || 'Pengguna OHLI') + '</small></div><button class="ohli-follow-mini" type="button" data-action="follow" data-phone="' + esc(u.phone) + '">Ikuti</button></div>'; }).join('') : '<p class="ohli-hint">Akun lain akan muncul di sini saat tersedia.</p>';
  }

  function postCard(p) {
    var me = rt.getMe() || {}, isMine = p.author === me.phone, isVideo = p.mediaType === 'video' || (p.mimeType && p.mimeType.indexOf('video/') === 0), media = '';
    if (p.mediaId) media = isVideo ? '<video class="ohli-post-media" src="' + esc(rt.mediaUrl(p.mediaId)) + '" playsinline muted loop controls preload="metadata" data-ohli-video="true" aria-label="Video postingan"></video>' : '<img class="ohli-post-media" src="' + esc(rt.mediaUrl(p.mediaId)) + '" alt="Media postingan" loading="lazy">';
    var comments = openComments[p.id] ? '<div class="ohli-post-comments">' + ((p.comments || []).map(function (c) { return '<div class="ohli-comment">' + avatar(c.name,c.phone) + '<div class="ohli-comment-copy"><strong>' + esc(c.name || c.phone) + '</strong><p>' + esc(c.text) + '</p></div></div>'; }).join('') || '<p class="ohli-hint">Belum ada komentar.</p>') + '<form class="ohli-comment-form" data-comment-post="' + esc(p.id) + '"><input name="comment" maxlength="500" placeholder="Tulis komentar…" aria-label="Tulis komentar" required><button type="submit" aria-label="Kirim komentar">' + ico('send') + '</button></form></div>' : '';
    return '<article class="ohli-card ohli-post" data-post-card="' + esc(p.id) + '"><div class="ohli-post-head"><button type="button" class="ohli-post-author" data-action="profile" data-phone="' + esc(p.author) + '">' + avatar(p.authorName,p.author) + '<span class="ohli-post-author-copy"><strong>' + esc(p.authorName || p.author) + '</strong><small>@' + esc(p.author) + ' · ' + esc(shortDate(p.createdAt)) + ' · ' + esc(p.audience || 'public') + '</small></span></button>' + (isMine ? '<button type="button" class="ohli-post-menu" data-action="post-menu" data-post-id="' + esc(p.id) + '" data-archived="' + (p.archived ? '1' : '0') + '" aria-label="Kelola postingan">⋯</button>' : '') + '</div>' + (p.text ? '<p class="ohli-post-text">' + esc(p.text) + '</p>' : '') + media + '<div class="ohli-post-stats"><span>' + ico('heart') + ' ' + Number(p.likesCount || 0) + ' suka</span><span>' + Number(p.commentsCount || 0) + ' komentar</span></div><div class="ohli-post-actions"><button type="button" class="ohli-btn ' + (p.liked ? 'is-active is-liked' : '') + '" data-action="like" data-post-id="' + esc(p.id) + '">' + ico('heart') + ' ' + (p.liked ? 'Disukai' : 'Suka') + '</button><button type="button" class="ohli-btn" data-action="comments" data-post-id="' + esc(p.id) + '">' + ico('comment') + ' Komentar</button><button type="button" class="ohli-btn ' + (p.saved ? 'is-active' : '') + '" data-action="bookmark" data-post-id="' + esc(p.id) + '">' + ico('bookmark') + ' Simpan</button><button type="button" class="ohli-btn" data-action="share-post" data-post-id="' + esc(p.id) + '">' + ico('share') + ' Bagikan</button></div>' + comments + '</article>';
  }

  async function renderVideos() {
    showLoading();
    try { var data = await rt.request('/api/feed?mode=videos'); posts = data.posts || []; pageContent.innerHTML = posts.length ? '<div class="ohli-video-feed">' + posts.map(function (p) { var isVideo = p.mediaId && (p.mediaType === 'video' || (p.mimeType || '').indexOf('video/') === 0); if (!isVideo) return ''; return '<article class="ohli-video-card" data-post-card="' + esc(p.id) + '"><video src="' + esc(rt.mediaUrl(p.mediaId)) + '" muted playsinline loop controls preload="metadata" data-ohli-video="true"></video><div class="ohli-video-meta"><strong>' + esc(p.authorName || p.author) + '</strong><p>' + esc(p.text || '') + '</p><div class="ohli-video-actions"><button type="button" class="ohli-btn" data-action="like" data-post-id="' + esc(p.id) + '">' + ico('heart') + ' ' + Number(p.likesCount || 0) + '</button><button type="button" class="ohli-btn" data-action="comments" data-post-id="' + esc(p.id) + '">' + ico('comment') + ' ' + Number(p.commentsCount || 0) + '</button><button type="button" class="ohli-btn" data-action="profile" data-phone="' + esc(p.author) + '">' + ico('profile') + ' Kreator</button></div></div></article>'; }).filter(Boolean).join('') : empty('video','Belum ada video pendek','Unggah video melalui tombol Buat konten di Beranda. Video yang tersedia akan diputar saat terlihat di layar.','Unggah video','compose-focus');
      initVideoObserver();
    } catch (e) { showError(apiError(e), 'retry'); }
  }
  function initVideoObserver() {
    if (videoObserver) { videoObserver.disconnect(); videoObserver = null; }
    var vids = pageContent.querySelectorAll('video[data-ohli-video="true"]'); if (!vids.length) return;
    if (!('IntersectionObserver' in window)) { vids.forEach(function (v) { v.pause(); }); return; }
    videoObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { var video = entry.target; if (entry.isIntersecting && entry.intersectionRatio >= 0.6) { vids.forEach(function (other) { if (other !== video) other.pause(); }); video.play().catch(function () {}); } else video.pause(); }); }, {threshold:[0,0.6,1]});
    vids.forEach(function (v) { videoObserver.observe(v); });
  }

  async function renderStories() {
    pageContent.innerHTML = '<div class="ohli-home-grid"><div class="ohli-feed-column"><form class="ohli-card ohli-compose" id="ohliStoryForm"><div class="ohli-compose-top">' + avatar((rt.getMe() || {}).name,(rt.getMe() || {}).phone) + '<textarea id="ohliStoryText" name="text" maxlength="240" placeholder="Bagikan pembaruan singkat…" aria-label="Teks Story"></textarea></div><div class="ohli-compose-divider"></div><div class="ohli-compose-bottom"><button type="button" class="ohli-btn" data-action="pick-story-media">' + ico('image') + ' Foto / video</button><span id="ohliStoryFileLabel" class="ohli-hint"></span><div class="ohli-compose-actions"><button type="submit" id="ohliStorySubmit" class="ohli-btn ohli-btn-primary">Bagikan Story</button></div></div><p class="ohli-hint">Story aktif hingga 24 jam. Foto/video dibatasi 16 MB per file. Hak akses mengikuti aturan kontak server saat ini.</p></form><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Story yang tersedia</div><div id="ohliAllStories"></div></div></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Privasi Story</div><p class="ohli-hint">Pada server sumber, Story hanya dibagikan ke akun yang menyimpan pembuatnya sebagai kontak. Pengaturan Close Friends dan pengecualian per akun belum tersedia pada backend ini.</p><button type="button" class="ohli-btn" data-action="legacy-settings">Lihat pengaturan</button></div></aside></div>';
    var target = pageContent.querySelector('#ohliAllStories'); target.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div></div>';
    try { var data = await rt.request('/api/status'); statusList = data.statuses || []; target.innerHTML = statusList.length ? statusList.slice().sort(function (a,b) { return Number(b.time)-Number(a.time); }).map(function (s) { var me=rt.getMe()||{}; return '<button type="button" class="ohli-list-card ohli-card" style="width:100%;text-align:left" data-action="view-story" data-story-id="' + esc(s.id) + '">' + avatar(s.name || s.phone,s.phone) + '<span class="ohli-list-copy"><strong>' + esc(s.phone === me.phone ? 'Story saya' : (s.name || s.phone)) + '</strong><p>' + esc(s.text || (s.mediaType === 'video' ? 'Video Story' : 'Story foto')) + '</p><span class="ohli-list-meta">' + esc(shortDate(s.time)) + '</span></span>' + ico('arrow') + '</button>'; }).join('') : empty('story','Belum ada Story','Story yang baru dibuat oleh kamu atau kontakmu akan muncul di sini.'); } catch(e) { target.innerHTML = '<div class="ohli-error">' + esc(apiError(e)) + '</div>'; }
  }

  function viewStory(status) {
    var me = rt.getMe() || {}, viewer = shell.querySelector('#ohliStoryViewer'), owner = shell.querySelector('#ohliStoryOwner'), media = shell.querySelector('#ohliStoryMedia'); storyItems = statusList.slice(); storyIndex = Math.max(0, storyItems.findIndex(function (s) { return s.id === status.id; }));
    if (status.phone !== me.phone) rt.request('/api/status/view', {method:'POST', body:{statusId:status.id}}).catch(function () {});
    owner.innerHTML = avatar(status.name || status.phone,status.phone) + '<span><strong>' + esc(status.phone === me.phone ? 'Story kamu' : (status.name || status.phone)) + '</strong><small>' + esc(shortDate(status.time)) + '</small></span><button type="button" class="ohli-modal-close ohli-story-close" data-action="close-story" aria-label="Tutup">×</button>';
    var mediaUrl = status.mediaId ? ((status.fileSize || status.mimeType) ? rt.mediaUrl(status.mediaId) : ('/api/image?token=' + encodeURIComponent(rt.getToken()) + '&id=' + encodeURIComponent(status.mediaId))) : '';
    media.innerHTML = (status.mediaId ? (status.mediaType === 'video' || (status.mimeType || '').indexOf('video/') === 0 ? '<video src="' + esc(mediaUrl) + '" controls playsinline autoplay></video>' : '<img src="' + esc(mediaUrl) + '" alt="Media Story">') : '') + (status.text ? '<p class="ohli-story-text">' + esc(status.text) + '</p>' : '');
    viewer.hidden = false;
  }
  function closeStory() { var viewer = shell.querySelector('#ohliStoryViewer'); if (viewer) { viewer.hidden = true; shell.querySelector('#ohliStoryMedia').innerHTML = ''; } }

  async function renderExplore() {
    var q = pageQuery || searchInput.value.trim(); pageQuery = q; pageContent.innerHTML = '<div class="ohli-card" style="padding:17px"><form id="ohliExploreForm" class="ohli-comment-form" style="margin:0"><input name="q" value="' + esc(q) + '" maxlength="80" placeholder="Cari nama, username, atau kata di postingan…" aria-label="Cari di OHLI" autofocus><button type="submit" aria-label="Cari">' + ico('search') + '</button></form></div><div id="ohliSearchResults"></div>';
    if (!q) { pageContent.querySelector('#ohliSearchResults').innerHTML = empty('search','Mulai pencarian','Masukkan nama pengguna atau kata kunci. Pencarian memakai endpoint server dan hanya mengembalikan postingan yang boleh kamu lihat.'); return; }
    var target = pageContent.querySelector('#ohliSearchResults'); target.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>';
    try { var data = await rt.request('/api/search?q=' + encodeURIComponent(q)); var userHtml = (data.users || []).map(function (u) { return '<div class="ohli-card ohli-list-card"><button type="button" class="ohli-post-author" data-action="profile" data-phone="' + esc(u.phone) + '">' + avatar(u.name,u.phone) + '<span class="ohli-list-copy"><strong>' + esc(u.name || u.phone) + '</strong><p>' + esc(u.about || 'Pengguna OHLI') + '</p></span></button><button type="button" class="ohli-btn" data-action="follow" data-phone="' + esc(u.phone) + '">Ikuti</button></div>'; }).join(''); var postHtml = (data.posts || []).map(postCard).join(''); target.innerHTML = (userHtml ? '<section class="ohli-result-section"><h2>Pengguna (' + data.users.length + ')</h2><div class="ohli-result-list">' + userHtml + '</div></section>' : '') + (postHtml ? '<section class="ohli-result-section"><h2>Postingan (' + data.posts.length + ')</h2><div class="ohli-feed-column">' + postHtml + '</div></section>' : '') + (!userHtml && !postHtml ? empty('search','Tidak ada hasil','Coba kata kunci yang berbeda atau cek ejaan nama akun.') : ''); posts = (data.posts || []); }
    catch (e) { target.innerHTML = '<div class="ohli-error">' + esc(apiError(e)) + '</div>'; }
  }

  async function renderLive() {
    showLoading();
    try { var data = await rt.request('/api/live'); var lives = data.lives || []; pageContent.innerHTML = '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="start-live">' + ico('live') + ' Mulai Live</button><button type="button" class="ohli-btn" data-action="retry">' + ico('refresh') + ' Perbarui daftar</button></div>' + (lives.length ? '<div class="ohli-feed-column">' + lives.map(function (l) { return '<div class="ohli-card ohli-list-card">' + avatar(l.hostName,l.host) + '<div class="ohli-list-copy"><strong>' + esc(l.title || 'Siaran Live') + '</strong><p>' + esc(l.hostName || l.host) + '</p><div class="ohli-list-meta">' + Number(l.viewerCount || 0) + ' penonton saat ini · koneksi peer-to-peer</div></div><button type="button" class="ohli-btn ohli-btn-primary" data-action="join-live" data-live-id="' + esc(l.id) + '">Tonton</button></div>'; }).join('') + '</div>' : empty('live','Tidak ada Live aktif','Ketika seseorang memulai Live dari browser yang mendukung WebRTC, siaran akan muncul di sini. Server ini hanya menyediakan signaling peer-to-peer, bukan SFU relay.')) + '<p class="ohli-hint" style="margin-top:15px">Live dapat memerlukan HTTPS, izin kamera/mikrofon, STUN/TURN, koneksi host yang stabil, dan kapasitas upload yang cukup. Menutup tab host dapat mengakhiri aliran media.</p>'; }
    catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderCommunities(kind) {
    var label = kind === 'group' ? 'grup' : 'channel', endpoint = kind === 'group' ? '/api/groups' : '/api/channels'; showLoading();
    try { var data = await rt.request(endpoint); var items = data.items || []; if (kind === 'group') groupItems = items; else channelItems = items; pageContent.innerHTML = '<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="create-community" data-kind="' + kind + '">' + ico('plus') + ' Buat ' + (kind === 'group' ? 'grup' : 'channel') + '</button></div>' + (items.length ? '<div class="ohli-feed-column">' + items.map(function (item) { var joined = kind === 'group' ? item.joined : item.following; var action = kind === 'group' ? 'join-community' : 'follow-channel'; return '<div class="ohli-card ohli-list-card">' + '<div class="ohli-avatar">' + (kind === 'group' ? ico('groups') : ico('channel')) + '</div><div class="ohli-list-copy"><strong>' + esc(item.name) + '</strong><p>' + esc(item.description || (kind === 'group' ? 'Komunitas OHLI' : 'Channel OHLI')) + '</p><span class="ohli-list-meta">' + Number(item.memberCount || 0) + (kind === 'group' ? ' anggota' : ' anggota') + ' · ' + esc(item.privacy || 'public') + '</span></div><button type="button" class="ohli-btn ' + (joined ? '' : 'ohli-btn-primary') + '" data-action="' + action + '" data-id="' + esc(item.id) + '" data-joined="' + (joined ? '1' : '0') + '">' + (joined ? (kind === 'group' ? 'Bergabung' : 'Diikuti') : (kind === 'group' ? 'Gabung' : 'Ikuti')) + '</button></div>'; }).join('') + '</div>' : empty(kind === 'group' ? 'groups' : 'channel', 'Belum ada ' + label, 'Buat ' + label + ' pertama atau buka halaman lagi ketika akun lain sudah membuat ruang publik.', 'Buat ' + label, 'create-community:' + kind)); }
    catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderNotifications() {
    showLoading();
    try { var data = await rt.request('/api/notifications'); notificationItems = data.notifications || []; var unread = notificationItems.filter(function (n) { return !n.read; }).length; pageContent.innerHTML = '<div style="display:flex;justify-content:flex-end;margin-bottom:13px"><button type="button" class="ohli-btn" data-action="mark-all-read">Tandai semua dibaca' + (unread ? ' (' + unread + ')' : '') + '</button></div>' + (notificationItems.length ? '<div class="ohli-card">' + notificationItems.map(function (n) { var typeIcon = n.type === 'like' ? 'heart' : n.type === 'comment' ? 'comment' : n.type === 'follow' ? 'userPlus' : 'bell'; return '<button type="button" class="ohli-notification ' + (!n.read ? 'unread' : '') + '" style="width:100%;border-left:0;border-right:0;border-top:0;text-align:left" data-action="open-notification" data-id="' + esc(n.id) + '" data-actor="' + esc(n.actor) + '" data-object="' + esc(n.objectId) + '"><span class="ohli-notification-icon">' + ico(typeIcon) + '</span><span class="ohli-notification-copy"><strong>' + esc(n.actorName || n.actor) + '</strong> ' + esc(n.text || 'memperbarui aktivitas') + '<small>' + esc(shortDate(n.time)) + (n.read ? '' : ' · Belum dibaca') + '</small></span></button>'; }).join('') + '</div>' : empty('bell','Belum ada notifikasi','Notifikasi baru muncul ketika akun lain mengikuti atau berinteraksi dengan kontenmu.')); }
    catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderProfile(targetPhone) {
    var me = rt.getMe() || {}; targetPhone = targetPhone || me.phone; profileTarget = targetPhone; showLoading();
    try { var data = await rt.request('/api/profile?phone=' + encodeURIComponent(targetPhone)); profileData = data; var u = data.user || {}, self = u.phone === me.phone; var hero = '<section class="ohli-card ohli-profile-hero"><div class="ohli-cover"></div><div class="ohli-profile-summary">' + avatar(u.name,u.phone) + '<div class="ohli-profile-title"><div><h2>' + esc(u.name || u.phone) + '</h2><p>@' + esc(u.phone) + (self ? ' · Profil kamu' : '') + '</p></div><div style="display:flex;gap:7px;flex-wrap:wrap">' + (self ? '<button type="button" class="ohli-btn ohli-btn-primary" data-action="edit-profile">Edit profil</button>' : '<button type="button" class="ohli-btn ' + (data.isFollowing ? '' : 'ohli-btn-primary') + '" data-action="follow" data-phone="' + esc(u.phone) + '" data-following="' + (data.isFollowing ? '1' : '0') + '">' + (data.isFollowing ? 'Mengikuti' : 'Ikuti') + '</button><button type="button" class="ohli-btn" data-action="open-chat-user" data-phone="' + esc(u.phone) + '">Chat</button>') + '</div></div><p class="ohli-profile-bio">' + esc(u.about || 'Belum menambahkan bio.') + '</p><div class="ohli-profile-stats"><span><strong>' + Number(data.postsCount || 0) + '</strong><small>Postingan</small></span><span><strong>' + Number(data.followersCount || 0) + '</strong><small>Pengikut</small></span><span><strong>' + Number(data.followingCount || 0) + '</strong><small>Mengikuti</small></span></div><div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap"><button class="ohli-btn" data-action="copy-profile" type="button">' + ico('share') + ' Salin ID profil</button>' + (self ? '<button class="ohli-btn" data-action="profile-privacy" type="button">' + ico('shield') + ' Privasi</button>' : '') + '</div></div></section><div class="ohli-tab-strip"><button class="active" type="button" data-action="profile-tab" data-tab="posts">Postingan</button><button type="button" data-action="profile-tab" data-tab="media">Media</button><button type="button" data-action="profile-tab" data-tab="about">Tentang</button></div><div id="ohliProfileContent" class="ohli-feed-column">' + ((data.posts || []).map(postCard).join('') || empty('profile','Belum ada postingan','Postingan yang dapat dilihat pada profil ini akan ditampilkan di sini.')) + '</div>';
      pageContent.innerHTML = hero;
    } catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderArchives() {
    showLoading();
    var endpoint = archiveMode === 'saved' ? '/api/posts/saved' : '/api/posts/archive';
    try {
      var data = await rt.request(endpoint); posts = data.posts || [];
      pageContent.innerHTML = '<div class="ohli-feed-tabs"><button type="button" class="ohli-feed-tab ' + (archiveMode === 'archive' ? 'active' : '') + '" data-action="archive-mode" data-mode="archive">Arsip postingan</button><button type="button" class="ohli-feed-tab ' + (archiveMode === 'saved' ? 'active' : '') + '" data-action="archive-mode" data-mode="saved">Tersimpan</button></div>' + (posts.length ? '<div class="ohli-feed-column">' + posts.map(postCard).join('') + '</div>' : empty('bookmark', archiveMode === 'saved' ? 'Belum ada postingan tersimpan' : 'Arsip masih kosong', archiveMode === 'saved' ? 'Tekan Simpan pada postingan untuk mengumpulkannya secara pribadi.' : 'Arsip menyembunyikan postingan milikmu dari feed dan profil tanpa menghapusnya.'));
    } catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderSettings() {
    var me = rt.getMe() || {}, connection = 'Memeriksa server…';
    pageContent.innerHTML = '<div class="ohli-home-grid"><div class="ohli-feed-column"><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Akun dan identitas</div><div class="ohli-list-card" style="padding:0 0 14px">' + avatar(me.name,me.phone) + '<div class="ohli-list-copy"><strong>' + esc(me.name || 'Akun OHLI') + '</strong><p>Nomor akun: ' + esc(me.phone || '-') + '</p></div><button class="ohli-btn" data-action="edit-profile">Edit</button></div></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Tampilan</div><p class="ohli-hint">Tema halaman OHLI disimpan pada perangkat ini. Preferensi ini tidak mengubah tema pengguna lain.</p><button type="button" class="ohli-btn" data-action="toggle-theme">' + ico(theme === 'dark' ? 'sun' : 'moon') + ' Ganti tema</button></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Chat, arsip, privasi</div><p class="ohli-hint">Pengaturan chat lama, arsip, ekspor, dan sebagian preferensi tetap dikelola di halaman chat yang sudah ada.</p><button type="button" class="ohli-btn ohli-btn-primary" data-action="legacy-settings">Buka pengaturan lengkap</button></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Server dan keamanan</div><p class="ohli-hint">Server Android menyimpan data secara lokal di perangkat server. Untuk penggunaan publik, gunakan HTTPS/tunnel tepercaya, cadangkan berkas data, dan jangan menaruh kredensial di HTML.</p><div id="ohliHealthState" class="ohli-hint">' + esc(connection) + '</div><button type="button" class="ohli-btn" data-action="check-health">Periksa koneksi</button></section></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Status fitur</div><div class="ohli-trend"><small>Aktif pada backend ini</small><strong>Chat, media, status, follow, posting teks/media, like, komentar, pencarian, grup/channel dasar</strong></div><div class="ohli-trend"><small>Perlu infrastruktur tambahan</small><strong>SQL database skala produksi, TURN/SFU Live, push notification, OTP, E2EE</strong></div></div></aside></div>';
    checkHealth();
  }
  async function checkHealth() { var target = shell.querySelector('#ohliHealthState'); if (!target) return; try { var r = await fetch('/health', {cache:'no-store'}); var d = await r.json(); target.textContent = r.ok && d.ok ? 'Server menjawab · ' + (d.users || 0) + ' akun · ' + (d.messages || 0) + ' pesan' : 'Server memberikan respons yang tidak valid.'; shell.querySelector('#ohliConnectionLabel').textContent = r.ok ? 'Server tersambung' : 'Server bermasalah'; } catch (e) { target.textContent = 'Server tidak dapat dijangkau dari browser ini.'; shell.querySelector('#ohliConnectionLabel').textContent = 'Server tidak terjangkau'; } }

  function showModal(title, body, submitLabel, onSubmit) {
    shell.querySelector('#ohliModalTitle').textContent = title; overlayContent.innerHTML = body + (submitLabel ? '<div class="ohli-modal-actions"><button type="button" class="ohli-btn" data-action="close-modal">Batal</button><button type="button" class="ohli-btn ohli-btn-primary" id="ohliModalSubmit">' + esc(submitLabel) + '</button></div>' : ''); overlay.hidden = false;
    var submit = shell.querySelector('#ohliModalSubmit'); if (submit && onSubmit) submit.addEventListener('click', async function () { submit.disabled = true; try { await onSubmit(overlayContent); } catch (e) { toast(apiError(e)); } finally { submit.disabled = false; } });
    var first = overlayContent.querySelector('input,textarea,select,button'); if (first) setTimeout(function () { first.focus(); }, 25);
  }
  function closeModal() { overlay.hidden = true; overlayContent.innerHTML = ''; }

  async function handleClick(event) {
    var button = event.target.closest('[data-action]'); if (!button || !shell.contains(button)) return; var action = button.dataset.action;
    try {
      if (action === 'navigate') { event.preventDefault(); if (!overlay.hidden) closeModal(); setPage(button.dataset.page || 'home'); }
      else if (action === 'home') setPage('home');
      else if (action === 'more-menu') { var menuHtml = '<div class="ohli-nav-picker">' + navItems.filter(function (it) { return it[0] !== 'create'; }).map(function (it) { return '<button type="button" class="ohli-btn" data-action="navigate" data-page="' + esc(it[0]) + '">' + ico(it[2]) + esc(it[1]) + '</button>'; }).join('') + '</div>'; showModal('Menu OHLI Social', menuHtml, '', null); }
      else if (action === 'my-profile') setPage('profile', {phone:(rt.getMe()||{}).phone});
      else if (action === 'compose-focus') { setPage('home'); setTimeout(function () { var area = shell.querySelector('#ohliPostText'); if (area) area.focus(); }, 50); }
      else if (action === 'pick-post-media') shell.querySelector('#ohliPostFile').click();
      else if (action === 'pick-story-media') shell.querySelector('#ohliStatusFile').click();
      else if (action === 'feed-mode') { currentFeedMode = button.dataset.mode || 'public'; nextBefore = 0; shell.querySelectorAll('.ohli-feed-tab').forEach(function (b) { b.classList.toggle('active', b === button); }); await renderHome(true); }
      else if (action === 'view-story') { var s = statusList.find(function (x) { return x.id === button.dataset.storyId; }); if (s) viewStory(s); }
      else if (action === 'close-story') closeStory();
      else if (action === 'close-modal') closeModal();
      else if (action === 'archive-mode') { archiveMode = button.dataset.mode === 'saved' ? 'saved' : 'archive'; await renderArchives(); }
      else if (action === 'post-menu') { var targetPost = findPost(button.dataset.postId); if (!targetPost) { toast('Postingan tidak ditemukan pada tampilan ini. Muat ulang halaman.'); return; } var archived = targetPost.archived === true || button.dataset.archived === '1'; var menuBody = '<p class="ohli-hint">Kelola postingan milikmu. Perubahan akan disimpan ke server.</p><div class="ohli-post-manage-menu"><button type="button" class="ohli-btn" data-action="edit-post" data-post-id="' + esc(targetPost.id) + '">Edit teks dan audiens</button><button type="button" class="ohli-btn" data-action="archive-post" data-post-id="' + esc(targetPost.id) + '" data-archived="' + (archived ? '1' : '0') + '">' + (archived ? 'Pulihkan dari arsip' : 'Arsipkan postingan') + '</button><button type="button" class="ohli-btn ohli-btn-danger" data-action="delete-post" data-post-id="' + esc(targetPost.id) + '">Hapus postingan</button></div>'; showModal('Kelola postingan',menuBody,'',null); }
      else if (action === 'edit-post') { var pEdit = findPost(button.dataset.postId); if (!pEdit) return; var editBody = '<form id="ohliEditPostForm"><div class="ohli-field"><label for="ohliEditPostText">TEKS / CAPTION</label><textarea id="ohliEditPostText" name="text" maxlength="2000">' + esc(pEdit.text || '') + '</textarea></div><div class="ohli-field"><label for="ohliEditPostAudience">AUDIENS</label><select id="ohliEditPostAudience" name="audience"><option value="public" ' + (pEdit.audience === 'public' ? 'selected' : '') + '>Publik</option><option value="followers" ' + (pEdit.audience === 'followers' ? 'selected' : '') + '>Pengikut</option><option value="private" ' + (pEdit.audience === 'private' ? 'selected' : '') + '>Pribadi</option></select></div></form>'; showModal('Edit postingan',editBody,'Simpan perubahan',async function(content){var form=content.querySelector('#ohliEditPostForm');if(!form.reportValidity())return;var fd=new FormData(form);var updated=await rt.request('/api/posts/edit',{method:'POST',body:{postId:pEdit.id,text:fd.get('text'),audience:fd.get('audience')}});updatePost(updated.post);closeModal();toast('Postingan diperbarui di server.');if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await rerenderContent();}); }
      else if (action === 'archive-post') { var arch = await rt.request('/api/posts/archive',{method:'POST',body:{postId:button.dataset.postId,action:button.dataset.archived === '1' ? 'restore' : 'archive'}}); closeModal(); toast(arch.archived ? 'Postingan dipindahkan ke arsip.' : 'Postingan dipulihkan dari arsip.'); if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await renderHome(true); }
      else if (action === 'like') { var d = await rt.request('/api/posts/like', {method:'POST',body:{postId:button.dataset.postId}}); updatePost(d.post); await rerenderContent(); }
      else if (action === 'comments') { var id = button.dataset.postId; openComments[id] = !openComments[id]; await rerenderContent(); var form = Array.from(shell.querySelectorAll('[data-comment-post]')).filter(function (el) { return el.getAttribute('data-comment-post') === id; }).map(function (el) { return el.querySelector('input'); })[0]; if (openComments[id] && form) form.focus(); }
      else if (action === 'bookmark') { var bdata = await rt.request('/api/posts/bookmark', {method:'POST',body:{postId:button.dataset.postId}}); var p = findPost(button.dataset.postId); if (p) p.saved = !!bdata.saved; toast(bdata.saved ? 'Postingan disimpan ke koleksi pribadi.' : 'Postingan dikeluarkan dari koleksi pribadi.'); await rerenderContent(); }
      else if (action === 'share-post') { var sharePost = findPost(button.dataset.postId); if (sharePost) { var link = location.origin + '/#post-' + encodeURIComponent(sharePost.id); if (navigator.share) await navigator.share({title:'OHLI Social',text:sharePost.text || 'Postingan di OHLI Social',url:link}); else if (navigator.clipboard) { await navigator.clipboard.writeText(link); toast('Tautan postingan disalin.'); } else toast('Salin tautan tidak didukung browser ini.'); } }
      else if (action === 'delete-post') { if (confirm('Hapus postingan ini? Tindakan ini tidak dapat dibatalkan.')) { await rt.request('/api/posts/delete',{method:'POST',body:{postId:button.dataset.postId}}); posts = posts.filter(function (p) { return p.id !== button.dataset.postId; }); if (profileData) profileData.posts = (profileData.posts || []).filter(function (p) { return p.id !== button.dataset.postId; }); closeModal(); toast('Postingan dihapus dari server.'); if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await rerenderContent(); } }
      else if (action === 'load-more') { var next = nextBefore; if (!next || !hasMore) return; button.disabled = true; button.textContent = 'Memuat…'; var data = await rt.request('/api/feed?mode=' + encodeURIComponent(currentFeedMode) + '&before=' + encodeURIComponent(next)); var current = {}; posts.forEach(function (p) { current[p.id] = true; }); (data.posts || []).forEach(function (p) { if (!current[p.id]) posts.push(p); }); nextBefore = Number(data.nextBefore) || 0; hasMore = !!data.hasMore; var feedList = pageContent.querySelector('#ohliFeedList'); if (feedList) feedList.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home','Belum ada postingan','Bagikan cerita pertamamu.','Buat postingan','compose-focus'); var moreBox = pageContent.querySelector('#ohliFeedMore'); if (moreBox) moreBox.innerHTML = hasMore ? '<button type="button" class="ohli-btn" data-action="load-more">Muat postingan lainnya</button>' : '<p class="ohli-hint">Kamu sudah melihat postingan yang tersedia untuk halaman ini.</p>'; }
      else if (action === 'profile') setPage('profile',{phone:button.dataset.phone});
      else if (action === 'follow') { var currentMe = rt.getMe() || {}, followTarget = button.dataset.phone, isFollowing = button.dataset.following === '1'; if (!followTarget) return; var followData = await rt.request('/api/follow',{method:'POST',body:{target:followTarget,action:isFollowing?'unfollow':'follow'}}); toast(followData.following ? 'Akun berhasil diikuti.' : 'Kamu berhenti mengikuti akun ini.'); if (page === 'profile' && profileTarget === followTarget) await renderProfile(followTarget); else await rerenderContent(); }
      else if (action === 'search-topic') { pageQuery = button.dataset.query || ''; searchInput.value = pageQuery; setPage('explore'); }
      else if (action === 'start-live') rt.startLive();
      else if (action === 'join-live') { var live = (await rt.request('/api/live')).lives || []; var selected = live.find(function (l) { return l.id === button.dataset.liveId; }); if (selected) rt.joinLive(selected); else toast('Siaran tidak lagi aktif.'); }
      else if (action === 'create-community' || action.indexOf('create-community:') === 0) { var kind = button.dataset.kind || action.split(':')[1] || 'group'; showCommunityForm(kind); }
      else if (action === 'join-community' || action === 'follow-channel') { var kind2 = action === 'join-community' ? 'group' : 'channel', endpoint = kind2 === 'group' ? '/api/groups/join' : '/api/channels/follow'; var dataJoin = await rt.request(endpoint,{method:'POST',body:{id:button.dataset.id,action:button.dataset.joined === '1' ? (kind2 === 'group' ? 'leave' : 'unfollow') : (kind2 === 'group' ? 'join' : 'follow')}}); toast(dataJoin.joined ? 'Kamu sudah bergabung.' : (kind2 === 'group' ? 'Kamu keluar dari grup.' : 'Kamu berhenti mengikuti channel.')); await renderCommunities(kind2); }
      else if (action === 'mark-all-read') { await rt.request('/api/notifications/read',{method:'POST',body:{}}); toast('Notifikasi ditandai sudah dibaca.'); await renderNotifications(); }
      else if (action === 'open-notification') { await rt.request('/api/notifications/read',{method:'POST',body:{id:button.dataset.id}}); if (button.dataset.actor) setPage('profile',{phone:button.dataset.actor}); else setPage('home'); }
      else if (action === 'edit-profile') rt.editProfile();
      else if (action === 'copy-profile') { var u = profileData && profileData.user; if (u && navigator.clipboard) { await navigator.clipboard.writeText(u.phone); toast('ID profil disalin.'); } else toast('ID: ' + ((profileData && profileData.user && profileData.user.phone) || '')); }
      else if (action === 'profile-privacy') { goLegacy('chat'); rt.openLegacySettings(); toast('Pengaturan privasi tersedia pada halaman pengaturan lama.'); }
      else if (action === 'open-chat-user') { var phone = button.dataset.phone; shell.hidden = true; document.getElementById('app').hidden = false; rt.openChatWith(phone); var returnBtn = document.getElementById('ohliBackSocial'); if (returnBtn) returnBtn.style.display = ''; }
      else if (action === 'profile-tab') { var tab = button.dataset.tab; shell.querySelectorAll('[data-action="profile-tab"]').forEach(function (b) { b.classList.toggle('active', b === button); }); var target = shell.querySelector('#ohliProfileContent'); if (!target || !profileData) return; var ps = profileData.posts || []; if (tab === 'media') ps = ps.filter(function (p) { return !!p.mediaId; }); if (tab === 'about') target.innerHTML = '<div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Tentang</div><p class="ohli-profile-bio">' + esc((profileData.user && profileData.user.about) || 'Belum menambahkan bio.') + '</p><p class="ohli-hint">Username/ID saat ini menggunakan nomor akun pada backend. Pengaturan username terpisah belum tersedia.</p></div>'; else target.innerHTML = ps.length ? ps.map(postCard).join('') : empty('profile','Belum ada konten','Konten pada tab ini akan muncul ketika tersedia.'); }
      else if (action === 'toggle-theme') toggleTheme();
      else if (action === 'legacy-settings') { goLegacy('chat'); rt.openLegacySettings(); }
      else if (action === 'check-health') await checkHealth();
      else if (action === 'retry') await renderPage();
    } catch (e) { toast(apiError(e)); }
  }

  async function handleSubmit(event) {
    var form = event.target;
    if (form.id === 'ohliComposeForm') {
      event.preventDefault(); var text = form.querySelector('[name="text"]').value.trim(), audience = shell.querySelector('#ohliAudience').value, file = selectedFile;
      if (!text && !file) { toast('Tulis postingan atau pilih foto/video terlebih dahulu.'); return; }
      var submit = form.querySelector('#ohliPostSubmit'); submit.disabled = true; submit.textContent = file ? 'Mengunggah…' : 'Memposting…';
      try { if (file) await rt.uploadPostMedia(file,text,audience); else await rt.request('/api/posts',{method:'POST',body:{text:text,audience:audience}}); selectedFile = null; nextBefore = 0; toast('Postingan berhasil disimpan di server.'); await renderHome(true); }
      catch (e) { toast(apiError(e)); }
      finally { var button = shell.querySelector('#ohliPostSubmit'); if (button) { button.disabled = false; button.innerHTML = ico('send') + ' Posting'; } }
    } else if (form.id === 'ohliStoryForm') {
      event.preventDefault(); var storyText = form.querySelector('[name="text"]').value.trim(), storyFile = selectedStatusFile;
      if (!storyText && !storyFile) { toast('Isi teks Story atau pilih foto/video.'); return; }
      var sb = form.querySelector('#ohliStorySubmit'); sb.disabled = true; sb.textContent = storyFile ? 'Mengunggah…' : 'Membagikan…';
      try { if (storyFile) await rt.uploadStatusMedia(storyFile,storyText); else await rt.request('/api/status',{method:'POST',body:{text:storyText}}); selectedStatusFile = null; toast('Story berhasil dibagikan.'); await renderStories(); }
      catch (e) { toast(apiError(e)); }
      finally { var liveBtn = shell.querySelector('#ohliStorySubmit'); if (liveBtn) { liveBtn.disabled = false; liveBtn.textContent = 'Bagikan Story'; } }
    } else if (form.id === 'ohliExploreForm') { event.preventDefault(); pageQuery = form.querySelector('[name="q"]').value.trim(); searchInput.value = pageQuery; await renderExplore(); }
    else if (form.hasAttribute('data-comment-post')) {
      event.preventDefault(); var comment = form.querySelector('[name="comment"]').value.trim(), postId = form.getAttribute('data-comment-post'); if (!comment) return;
      try { var data = await rt.request('/api/posts/comment',{method:'POST',body:{postId:postId,text:comment}}); updatePost(data.post); openComments[postId] = true; await rerenderContent(); }
      catch (e) { toast(apiError(e)); }
    }
  }

  function handleChange(event) {
    var target = event.target;
    if (target.id === 'ohliPostFile') { selectedFile = target.files && target.files[0] || null; var label = shell.querySelector('#ohliSelectedFileLabel'); if (label) label.textContent = selectedFile ? selectedFile.name + ' · ' + Math.ceil(selectedFile.size/1024/1024) + ' MB' : ''; if (selectedFile && selectedFile.size > 16*1024*1024) { toast('Ukuran maksimum media adalah 16 MB.'); selectedFile = null; target.value = ''; if (label) label.textContent = ''; } }
    if (target.id === 'ohliStatusFile') { selectedStatusFile = target.files && target.files[0] || null; var statusLabel = shell.querySelector('#ohliStoryFileLabel'); if (statusLabel) statusLabel.textContent = selectedStatusFile ? selectedStatusFile.name + ' · ' + Math.ceil(selectedStatusFile.size/1024/1024) + ' MB' : ''; if (selectedStatusFile && selectedStatusFile.size > 16*1024*1024) { toast('Ukuran maksimum media adalah 16 MB.'); selectedStatusFile = null; target.value = ''; if (statusLabel) statusLabel.textContent = ''; } }
  }

  function findPost(id) { var found = (posts || []).find(function (p) { return p.id === id; }); if (found) return found; return profileData && (profileData.posts || []).find(function (p) { return p.id === id; }) || null; }
  function updatePost(updated) { if (!updated) return; var found = false; posts = (posts || []).map(function (p) { if (p.id === updated.id) { found = true; return updated; } return p; }); if (!found && page === 'profile' && profileData) profileData.posts = (profileData.posts || []).map(function (p) { return p.id === updated.id ? updated : p; }); }
  async function rerenderContent() { if (page === 'archive') return renderArchives(); if (page === 'home') { var list = pageContent.querySelector('#ohliFeedList'); if (list) list.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home','Belum ada postingan','Bagikan cerita pertamamu.','Buat postingan','compose-focus'); } else if (page === 'videos') await renderVideos(); else if (page === 'explore') await renderExplore(); else if (page === 'profile') await renderProfile(profileTarget); }

  function showCommunityForm(kind) {
    var isGroup = kind === 'group', title = isGroup ? 'Buat grup/komunitas' : 'Buat Channel';
    var body = '<form id="ohliCommunityForm"><div class="ohli-field"><label for="ohliCommunityName">NAMA</label><input id="ohliCommunityName" name="name" maxlength="70" minlength="2" required placeholder="Nama ' + (isGroup ? 'komunitas' : 'channel') + '"></div><div class="ohli-field"><label for="ohliCommunityDescription">DESKRIPSI</label><textarea id="ohliCommunityDescription" name="description" maxlength="500" placeholder="Tentang ' + (isGroup ? 'komunitas' : 'channel') + '"></textarea></div><div class="ohli-field"><label for="ohliCommunityPrivacy">AKSES</label><select id="ohliCommunityPrivacy" name="privacy"><option value="public">Publik</option><option value="private">Privat</option></select></div><p class="ohli-hint">' + (isGroup ? 'Pembuatan grup dan keanggotaan sudah tersimpan di server. Percakapan grup serta pengaturan peran admin belum diterapkan pada backend ini.' : 'Channel dapat dibuat dan diikuti. Pengiriman postingan channel, moderasi, dan peran admin lanjutan belum diterapkan.') + '</p></form>';
    showModal(title, body, 'Buat', async function (content) { var form = content.querySelector('#ohliCommunityForm'), data = Object.fromEntries(new FormData(form).entries()); if (!form.reportValidity()) return; await rt.request(isGroup?'/api/groups':'/api/channels',{method:'POST',body:data}); closeModal(); toast((isGroup?'Grup':'Channel') + ' dibuat.'); await renderCommunities(kind); });
  }

  // Legacy bridge so users can switch back without losing the existing chat screen/API.
  window.addEventListener('ohli-authenticated', function () { if (!shell) makeShell(); profileTarget = (rt.getMe() || {}).phone; showShell('home'); checkHealth(); });
  window.addEventListener('ohli-logged-out', function () { if (shell) shell.hidden = true; var app = document.getElementById('app'); if (app) app.hidden = true; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { if (!shell) makeShell(); }); else makeShell();
  window.ohliSocial = { openHome:function(){ if (!shell) makeShell(); showShell('home'); }, navigate:function(p){ if (!shell) makeShell(); showShell(p); } };
})();
