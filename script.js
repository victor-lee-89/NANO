/* ============================================================
   AURAOS - Browser-Based Desktop Environment
   Modular Architecture in Single File
   Note: this build keeps all state in memory for the session
   (no localStorage), so it works reliably wherever it is embedded.
   ============================================================ */

// ── Constants & Configuration ──────────────────────────────
const WALLPAPERS = {
  sonoma:  { name:'Sonoma',  class:'wallpaper-sonoma',  light:false },
  monterey:{ name:'Monterey',class:'wallpaper-monterey',light:true  },
  ventura: { name:'Ventura', class:'wallpaper-ventura', light:false },
  sequoia: { name:'Sequoia', class:'wallpaper-sequoia', light:false },
  mojave:  { name:'Mojave',  class:'wallpaper-mojave',  light:true  },
  bigsur:  { name:'Big Sur', class:'wallpaper-bigsur',  light:false },
  aurora:  { name:'Aurora Drift', image:createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#07131f"/><path fill="#0f2b4a" d="M0 620 C240 560 420 520 650 570 C860 620 1080 670 1600 580 V1000 H0 Z"/><path fill="#2bd1ff" opacity="0.85" d="M0 440 C260 330 500 320 750 390 C1000 460 1290 500 1600 390 V1000 H0 Z"/><circle cx="1230" cy="240" r="150" fill="#fbbf24" opacity="0.95"/></svg>') },
  canyon:  { name:'Canyon Glow', image:createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#140b0c"/><path fill="#4c2a1b" d="M0 640 L250 420 L430 560 L620 360 L840 620 L1060 300 L1600 600 V1000 H0 Z"/><path fill="#d97706" opacity="0.8" d="M0 730 L280 510 L470 620 L690 420 L910 680 L1180 410 L1600 730 V1000 H0 Z"/></svg>') },
  bloom:   { name:'Bloom Field', image:createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#0f172a"/><path fill="#14532d" d="M0 610 C220 560 360 560 560 595 C760 630 980 690 1200 645 C1350 616 1470 575 1600 535 V1000 H0 Z"/><path fill="#4ade80" opacity="0.7" d="M0 500 C220 430 390 430 560 470 C760 518 1040 600 1600 470 V1000 H0 Z"/><circle cx="350" cy="280" r="110" fill="#fde68a" opacity="0.95"/><circle cx="1200" cy="260" r="140" fill="#f9a8d4" opacity="0.84"/></svg>') },
  coast:   { name:'Neon Coast', image:createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#020617"/><rect y="630" width="1600" height="370" fill="#0f172a"/><path fill="#1d4ed8" opacity="0.8" d="M0 700 C220 640 430 630 620 665 C840 706 1090 760 1300 705 C1410 680 1500 665 1600 660 V1000 H0 Z"/><path fill="#38bdf8" opacity="0.7" d="M0 590 C250 530 480 520 700 560 C880 594 1160 650 1600 530 V1000 H0 Z"/><circle cx="1220" cy="260" r="140" fill="#f472b6" opacity="0.8"/></svg>') },
};

const ACCENT_COLORS = [
  { name:'Amber',   h:28,  s:85, l:55 },
  { name:'Coral',   h:12,  s:80, l:58 },
  { name:'Rose',    h:348, s:75, l:55 },
  { name:'Teal',    h:170, s:70, l:42 },
  { name:'Emerald', h:155, s:65, l:40 },
  { name:'Cyan',    h:190, s:80, l:45 },
  { name:'Lavender',h:265, s:55, l:62 },
  { name:'Peach',   h:25,  s:90, l:65 },
];

const APP_ICONS = {
  finder:    { icon:'fa-regular fa-face-smile', bg:'linear-gradient(135deg,#3b82f6,#2563eb)' },
  terminal:  { icon:'fa-solid fa-terminal',     bg:'linear-gradient(135deg,#1e1e2e,#11111b)' },
  browser:   { icon:'fa-solid fa-compass',      bg:'linear-gradient(135deg,#06b6d4,#0284c7)' },
  notes:     { icon:'fa-regular fa-note-sticky', bg:'linear-gradient(135deg,#fbbf24,#d97706)' },
  calculator:{ icon:'fa-solid fa-calculator',   bg:'linear-gradient(135deg,#6b7280,#374151)' },
  code:      { icon:'fa-solid fa-code',         bg:'linear-gradient(135deg,#22c55e,#15803d)' },
  settings:  { icon:'fa-solid fa-gear',         bg:'linear-gradient(135deg,#78716c,#44403c)' },
  trash:     { icon:'fa-solid fa-trash',        bg:'linear-gradient(135deg,#78716c,#57534e)' },
  downloads: { icon:'fa-solid fa-download',     bg:'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  folder:    { icon:'fa-solid fa-folder',       bg:'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  file:      { icon:'fa-solid fa-file',         bg:'linear-gradient(135deg,#94a3b8,#64748b)' },
  text:      { icon:'fa-solid fa-file-lines',   bg:'linear-gradient(135deg,#94a3b8,#64748b)' },
  image:     { icon:'fa-solid fa-image',        bg:'linear-gradient(135deg,#ec4899,#be185d)' },
  music:     { icon:'fa-solid fa-music',        bg:'linear-gradient(135deg,#f43f5e,#be123c)' },
  messages:  { icon:'fa-regular fa-message',    bg:'linear-gradient(135deg,#22c55e,#16a34a)' },
  mail:      { icon:'fa-regular fa-envelope',   bg:'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  facetime:  { icon:'fa-solid fa-video',        bg:'linear-gradient(135deg,#22c55e,#15803d)' },
  photos:    { icon:'fa-solid fa-photo-film',   bg:'linear-gradient(135deg,#f43f5e,#e11d48)' },
  maps:      { icon:'fa-solid fa-map-pin',      bg:'linear-gradient(135deg,#22c55e,#15803d)' },
  calendar:  { icon:'fa-regular fa-calendar',   bg:'#fff', iconColor:'#ef4444' },
  weather:   { icon:'fa-solid fa-cloud-sun',     bg:'linear-gradient(135deg,#38bdf8,#0284c7)' },
  clock:     { icon:'fa-regular fa-clock',       bg:'linear-gradient(135deg,#2dd4bf,#0d9488)' },
  textedit:  { icon:'fa-regular fa-pen-to-square',bg:'linear-gradient(135deg,#f472b6,#be185d)' },
  calendarapp:{ icon:'fa-regular fa-calendar',   bg:'linear-gradient(135deg,#fb923c,#ea580c)' },
  reminders: { icon:'fa-solid fa-list-check',   bg:'linear-gradient(135deg,#e5e5e5,#a3a3a3)' },
};

// ── Utility Functions ──────────────────────────────────────
function $(sel, ctx=document) { return ctx.querySelector(sel); }
function $$(sel, ctx=document) { return [...ctx.querySelectorAll(sel)]; }
function el(tag, attrs={}, children=[]) {
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'ariaLabel') e.setAttribute('aria-label', v);
    else e.setAttribute(k, v);
  }
  for (const c of (Array.isArray(children) ? children : [children])) {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  }
  return e;
}
function formatTime(d) { return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }
function formatDate(d) { return d.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'}); }
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(1))+' '+sizes[i];
}
function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function createSvgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// ── Virtual File System (in-memory only, resets on reload) ─
class FileSystem {
  constructor() {
    this.root = this.getDefault();
  }
  getDefault() {
    const now = Date.now();
    return {
      type:'dir', name:'/', modified:now, created:now,
      children: {
        Desktop: { type:'dir', name:'Desktop', modified:now, created:now, children:{} },
        Documents: {
          type:'dir', name:'Documents', modified:now, created:now,
          children: {
            'Welcome.txt': { type:'file', name:'Welcome.txt', content:'Welcome to LazyOS!\n\nThis is your virtual desktop environment.\nFeel free to create files, open apps, and explore.', modified:now, created:now, size:120 },
            'Notes': { type:'dir', name:'Notes', modified:now, created:now, children:{} },
          }
        },
        Downloads: { type:'dir', name:'Downloads', modified:now, created:now, children:{} },
        Pictures: { type:'dir', name:'Pictures', modified:now, created:now, children:{} },
        Music: { type:'dir', name:'Music', modified:now, created:now, children:{} },
        Projects: {
          type:'dir', name:'Projects', modified:now, created:now,
          children: {
            'hello.js': { type:'file', name:'hello.js', content:'// Hello World in LazyOS\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("LazyOS"));', modified:now, created:now, size:95 },
            'index.html': { type:'file', name:'index.html', content:'<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>', modified:now, created:now, size:110 },
            'style.css': { type:'file', name:'style.css', content:'body {\n  margin: 0;\n  font-family: sans-serif;\n  background: #1a1a2e;\n  color: #eee;\n}', modified:now, created:now, size:85 },
          }
        },
        Trash: { type:'dir', name:'Trash', modified:now, created:now, children:{} },
      }
    };
  }
  save() { /* in-memory only for this session — intentionally a no-op */ }
  resolve(path) {
    if (path === '/') return this.root;
    const parts = path.replace(/^\/|\/$/g,'').split('/');
    let node = this.root;
    for (const p of parts) {
      if (!node || node.type !== 'dir' || !node.children[p]) return null;
      node = node.children[p];
    }
    return node;
  }
  parent(path) {
    const parts = path.replace(/^\/|\/$/g,'').split('/');
    if (parts.length <= 1) return { node: this.root, name: parts[0] || '' };
    const name = parts.pop();
    const parentPath = '/' + parts.join('/');
    return { node: this.resolve(parentPath), name, parentPath };
  }
  createFile(path, name, content='') {
    const dir = this.resolve(path);
    if (!dir || dir.type !== 'dir') return false;
    if (dir.children[name]) return false;
    const now = Date.now();
    dir.children[name] = { type:'file', name, content, modified:now, created:now, size: new Blob([content]).size };
    dir.modified = now;
    this.save();
    return true;
  }
  createDir(path, name) {
    const dir = this.resolve(path);
    if (!dir || dir.type !== 'dir') return false;
    if (dir.children[name]) return false;
    const now = Date.now();
    dir.children[name] = { type:'dir', name, children:{}, modified:now, created:now };
    dir.modified = now;
    this.save();
    return true;
  }
  delete(path) {
    if (path === '/') return false;
    const { node, name } = this.parent(path);
    if (!node || !node.children[name]) return false;
    delete node.children[name];
    node.modified = Date.now();
    this.save();
    return true;
  }
  rename(path, newName) {
    if (path === '/') return false;
    const { node, name } = this.parent(path);
    if (!node || !node.children[name] || node.children[newName]) return false;
    const entry = node.children[name];
    entry.name = newName;
    node.children[newName] = entry;
    delete node.children[name];
    node.modified = Date.now();
    this.save();
    return true;
  }
  move(fromPath, toDirPath) {
    if (fromPath === '/') return false;
    const { node: fromParent, name } = this.parent(fromPath);
    const toDir = this.resolve(toDirPath);
    if (!fromParent || !fromParent.children[name] || !toDir || toDir.type !== 'dir') return false;
    if (toDir.children[name]) return false;
    toDir.children[name] = fromParent.children[name];
    delete fromParent.children[name];
    toDir.modified = fromParent.modified = Date.now();
    this.save();
    return true;
  }
  list(path) {
    const node = this.resolve(path);
    if (!node || node.type !== 'dir') return [];
    return Object.values(node.children).sort((a,b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
  read(path) {
    const node = this.resolve(path);
    if (!node || node.type !== 'file') return null;
    return node.content;
  }
  write(path, content) {
    const node = this.resolve(path);
    if (!node || node.type !== 'file') return false;
    node.content = content;
    node.modified = Date.now();
    node.size = new Blob([content]).size;
    this.save();
    return true;
  }
  exists(path) { return this.resolve(path) !== null; }
  search(query, path='/') {
    const results = [];
    const node = this.resolve(path);
    if (!node || node.type !== 'dir') return results;
    const search = (n, p) => {
      if (n.type === 'dir') {
        for (const [name, child] of Object.entries(n.children)) {
          const cp = p === '/' ? '/'+name : p+'/'+name;
          if (name.toLowerCase().includes(query.toLowerCase())) results.push({ ...child, path:cp });
          if (child.type === 'dir') search(child, cp);
        }
      }
    };
    search(node, path);
    return results;
  }
  tree(path='/', prefix='', isLast=true) {
    const node = this.resolve(path);
    if (!node || node.type !== 'dir') return '';
    let output = '';
    const entries = Object.entries(node.children).sort((a,b) => {
      if (a[1].type !== b[1].type) return a[1].type === 'dir' ? -1 : 1;
      return a[0].localeCompare(b[0]);
    });
    entries.forEach(([name, child], i) => {
      const last = i === entries.length - 1;
      const connector = last ? '└── ' : '├── ';
      const icon = child.type === 'dir' ? '📁 ' : '📄 ';
      output += prefix + connector + icon + name + '\n';
      if (child.type === 'dir') {
        const newPrefix = prefix + (last ? '    ' : '│   ');
        const childPath = path === '/' ? '/'+name : path+'/'+name;
        output += this.tree(childPath, newPrefix, last);
      }
    });
    return output;
  }
  reset() { this.root = this.getDefault(); }
}

// ── Theme Manager (in-memory) ──────────────────────────────
class ThemeManager {
  constructor() {
    this.theme = 'dark';
    this.wallpaper = 'sonoma';
    this.customWallpaper = null;
    this.accent = ACCENT_COLORS[0];
    this.dockSize = 62;
    this.animations = true;
    this.apply();
  }
  save() { /* in-memory only for this session — intentionally a no-op */ }
  apply() {
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.style.setProperty('--accent-h', this.accent.h);
    document.documentElement.style.setProperty('--accent-s', this.accent.s + '%');
    document.documentElement.style.setProperty('--accent-l', this.accent.l + '%');
    document.documentElement.style.setProperty('--dock-size', this.dockSize + 'px');
    document.documentElement.style.setProperty('--dock-icon', (this.dockSize - 8) + 'px');
    const wp = $('#wallpaper');
    const entry = WALLPAPERS[this.wallpaper] || WALLPAPERS.sonoma;
    wp.className = '';
    wp.style.background = '';
    wp.style.backgroundImage = '';
    wp.style.backgroundSize = '';
    wp.style.backgroundPosition = '';
    wp.style.backgroundRepeat = '';
    if (entry && entry.class) {
      wp.className = entry.class;
    } else if (this.customWallpaper) {
      wp.style.backgroundImage = `url("${this.customWallpaper}")`;
      wp.style.backgroundSize = 'cover';
      wp.style.backgroundPosition = 'center';
      wp.style.backgroundRepeat = 'no-repeat';
    } else if (entry && entry.image) {
      wp.style.backgroundImage = `url("${entry.image}")`;
      wp.style.backgroundSize = 'cover';
      wp.style.backgroundPosition = 'center';
      wp.style.backgroundRepeat = 'no-repeat';
    }
    if (!this.animations) wp.style.animation = 'none'; else wp.style.animation = '';
    this.save();
  }
  setTheme(t) { this.theme = t; this.apply(); }
  setWallpaper(w) { this.wallpaper = w; this.customWallpaper = null; this.apply(); }
  setWallpaperImage(src) { this.customWallpaper = src; this.wallpaper = 'custom'; this.apply(); }
  setAccent(a) { this.accent = a; this.apply(); }
  setDockSize(s) { this.dockSize = s; this.apply(); }
}

// ── Notification Manager ───────────────────────────────────
class NotificationManager {
  constructor() {
    this.container = $('#notification-container');
    this.notifications = [];
  }
  send(title, body, icon='fa-solid fa-bell', iconBg='var(--accent)', duration=4000) {
    const id = uid();
    const notifEl = el('div', { class:'notification', 'data-id':id }, [
      el('div', { class:'notif-icon', style:{background:iconBg}, html:`<i class="${icon}"></i>` }),
      el('div', { class:'notif-content' }, [
        el('div', { class:'notif-title', text:title }),
        el('div', { class:'notif-body', text:body }),
      ]),
    ]);
    this.container.appendChild(notifEl);
    this.notifications.push({ id, el:notifEl, timer: setTimeout(() => this.remove(id), duration) });
    return id;
  }
  remove(id) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx === -1) return;
    const notif = this.notifications[idx];
    clearTimeout(notif.timer);
    notif.el.classList.add('removing');
    setTimeout(() => { notif.el.remove(); }, 300);
    this.notifications.splice(idx, 1);
  }
}

// ── Context Menu Manager ───────────────────────────────────
class ContextMenuManager {
  constructor() {
    this.menu = $('#context-menu');
    this.isOpen = false;
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.menu.contains(e.target)) this.close();
    });
    document.addEventListener('contextmenu', (e) => {
      if (this.isOpen && !this.menu.contains(e.target)) this.close();
    });
  }
  show(x, y, items) {
    this.menu.innerHTML = '';
    items.forEach(item => {
      if (item === '---') {
        this.menu.appendChild(el('div', { class:'dropdown-divider' }));
        return;
      }
      const el_item = el('div', {
        class:'dropdown-item' + (item.disabled ? ' disabled' : ''),
        role:'menuitem',
        text: item.label,
        onClick: () => { this.close(); if (item.action) item.action(); },
      });
      if (item.shortcut) {
        el_item.appendChild(el('span', { class:'shortcut', text:item.shortcut }));
      }
      this.menu.appendChild(el_item);
    });
    // Position
    const mw = 220, mh = this.menu.scrollHeight || 200;
    const maxX = window.innerWidth - mw - 8;
    const maxY = window.innerHeight - mh - 8;
    this.menu.style.left = Math.min(x, maxX) + 'px';
    this.menu.style.top = Math.min(y, maxY) + 'px';
    requestAnimationFrame(() => this.menu.classList.add('open'));
    this.isOpen = true;
  }
  close() {
    this.menu.classList.remove('open');
    this.isOpen = false;
  }
}

// ── Spotlight Manager ──────────────────────────────────────
class SpotlightManager {
  constructor() {
    this.overlay = $('#spotlight-overlay');
    this.input = $('#spotlight-input');
    this.results = $('#spotlight-results');
    this.isOpen = false;
    this.activeIdx = -1;
    this.overlay.addEventListener('mousedown', (e) => {
      if (e.target === this.overlay) this.close();
    });
    this.input.addEventListener('input', () => this.search());
    this.input.addEventListener('keydown', (e) => {
      const items = $$('.spotlight-result', this.results);
      if (e.key === 'ArrowDown') { e.preventDefault(); this.activeIdx = Math.min(this.activeIdx+1, items.length-1); this.updateActive(items); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.activeIdx = Math.max(this.activeIdx-1, 0); this.updateActive(items); }
      else if (e.key === 'Enter' && items[this.activeIdx]) { items[this.activeIdx].click(); }
      else if (e.key === 'Escape') { this.close(); }
    });
  }
  open() {
    this.isOpen = true;
    this.overlay.classList.add('open');
    this.input.value = '';
    this.results.innerHTML = '<div class="spotlight-empty">Type to search...</div>';
    this.activeIdx = -1;
    setTimeout(() => this.input.focus(), 50);
  }
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('open');
  }
  toggle() { this.isOpen ? this.close() : this.open(); }
  search() {
    const q = this.input.value.trim().toLowerCase();
    if (!q) { this.results.innerHTML = '<div class="spotlight-empty">Type to search...</div>'; return; }
    const results = [];
    // Search apps
    for (const [id, app] of Object.entries(appManager.registry)) {
      if (app.name.toLowerCase().includes(q)) {
        results.push({ type:'app', id, name:app.name, desc:'Application', icon:APP_ICONS[id] || APP_ICONS.file });
      }
    }
    // Search files
    const files = auraOS.fs.search(q);
    files.forEach(f => {
      results.push({ type:'file', path:f.path, name:f.name, desc:f.path, icon: f.type==='dir' ? APP_ICONS.folder : APP_ICONS.file });
    });
    if (results.length === 0) {
      this.results.innerHTML = '<div class="spotlight-empty">No results found</div>';
      return;
    }
    this.results.innerHTML = '';
    this.activeIdx = -1;
    results.slice(0, 8).forEach((r, i) => {
      const item = el('div', {
        class:'spotlight-result', role:'option',
        onClick:() => {
          this.close();
          if (r.type === 'app') appManager.open(r.id);
          else if (r.type === 'file') {
            if (r.path.endsWith('.js') || r.path.endsWith('.html') || r.path.endsWith('.css') || r.path.endsWith('.txt') || r.path.endsWith('.md'))
              appManager.open('code', { filePath: r.path });
            else appManager.open('finder', { path: r.path });
          }
        },
      }, [
        el('div', { class:'sr-icon', style:{background:r.icon.bg}, html:`<i class="${r.icon.icon}"></i>` }),
        el('div', { class:'sr-text' }, [
          el('div', { class:'sr-name', text:r.name }),
          el('div', { class:'sr-desc', text:r.desc }),
        ]),
      ]);
      this.results.appendChild(item);
    });
  }
  updateActive(items) {
    items.forEach((it, i) => it.classList.toggle('active', i === this.activeIdx));
    items[this.activeIdx]?.scrollIntoView({ block:'nearest' });
  }
}

// ── Window Manager ─────────────────────────────────────────
class WindowManager {
  constructor() {
    this.container = $('#windows-container');
    this.windows = new Map();
    this.zIndex = 100;
    this.focusedId = null;
    this.dragState = null;
    this.resizeState = null;
    this.snapPreview = $('#snap-preview');
    document.addEventListener('mousemove', (e) => this._onMouseMove(e));
    document.addEventListener('mouseup', (e) => this._onMouseUp(e));
  }
  create(opts) {
    const id = opts.id || uid();
    const w = el('div', {
      class:'window',
      'data-wid':id,
      ariaLabel: opts.title || 'Window',
      role:'dialog',
    });
    // Title bar
    const titlebar = el('div', { class:'window-titlebar' });
    const trafficLights = el('div', { class:'traffic-lights' });
    trafficLights.appendChild(el('button', { class:'traffic-light close', 'aria-label':'Close', onClick:(e) => { e.stopPropagation(); this.close(id); } }, [el('i', { class:'fa-solid fa-xmark' })]));
    trafficLights.appendChild(el('button', { class:'traffic-light minimize', 'aria-label':'Minimize', onClick:(e) => { e.stopPropagation(); this.minimize(id); } }, [el('i', { class:'fa-solid fa-minus' })]));
    trafficLights.appendChild(el('button', { class:'traffic-light maximize', 'aria-label':'Maximize', onClick:(e) => { e.stopPropagation(); this.toggleMaximize(id); } }, [el('i', { class:'fa-solid fa-expand' })]));
    titlebar.appendChild(trafficLights);
    titlebar.appendChild(el('div', { class:'window-title', text:opts.title || 'Window' }));
    titlebar.appendChild(el('div', { class:'window-controls' }));
    titlebar.addEventListener('dblclick', () => this.toggleMaximize(id));
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.traffic-lights') || e.target.closest('.window-controls')) return;
      this.focus(id);
      const win = this.windows.get(id);
      if (win?.maximized) return;
      this.dragState = {
        id, startX:e.clientX, startY:e.clientY,
        origX:win.x, origY:win.y,
      };
    });
    w.appendChild(titlebar);
    // Body
    const body = el('div', { class:'window-body' });
    w.appendChild(body);
    // Resize handles
    ['n','s','e','w','ne','nw','se','sw'].forEach(dir => {
      w.appendChild(el('div', { class:'resize-handle '+dir, 'data-dir':dir }));
    });
    w.addEventListener('mousedown', (e) => {
      const handle = e.target.closest('.resize-handle');
      if (handle) {
        e.stopPropagation();
        this.focus(id);
        const win = this.windows.get(id);
        if (win?.maximized) return;
        this.resizeState = {
          id, dir:handle.dataset.dir,
          startX:e.clientX, startY:e.clientY,
          origX:win.x, origY:win.y, origW:win.width, origH:win.height,
        };
      }
    });
    w.addEventListener('mousedown', () => this.focus(id));
    this.container.appendChild(w);
    // Window data
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const ww = opts.width || 700, wh = opts.height || 480;
    const wx = opts.x ?? Math.max(20, cx - ww/2 + (this.windows.size % 5) * 30);
    const wy = opts.y ?? Math.max(40, cy - wh/2 + (this.windows.size % 5) * 30);
    this.windows.set(id, {
      el:w, titlebar, body, title:opts.title,
      x:wx, y:wy, width:ww, height:wh,
      minimized:false, maximized:false,
      prevBounds:null, appId:opts.appId,
      onClose:opts.onClose,
    });
    this._applyBounds(id);
    requestAnimationFrame(() => { w.classList.add('open'); });
    this.focus(id);
    // Assign to current workspace
    if (workspaceManager) {
      workspaceManager.assignWindow(id, workspaceManager.current);
    }
    return { id, body, el:w };
  }
  _applyBounds(id) {
    const win = this.windows.get(id);
    if (!win) return;
    const e = win.el;
    e.style.left = win.x + 'px';
    e.style.top = win.y + 'px';
    e.style.width = win.width + 'px';
    e.style.height = win.height + 'px';
  }
  focus(id) {
    if (this.focusedId === id) return;
    this.windows.forEach((w, wid) => w.el.classList.toggle('focused', wid === id));
    this.focusedId = id;
    this.zIndex++;
    const win = this.windows.get(id);
    if (win) win.el.style.zIndex = this.zIndex;
    const appName = win?.appId ? (appManager.registry[win.appId]?.name || 'LazyOS') : 'LazyOS';
    $('#menubar-appname').textContent = appName;
  }
  close(id) {
    const win = this.windows.get(id);
    if (!win) return;
    win.el.classList.remove('open');
    win.el.classList.add('closing');
    setTimeout(() => {
      win.el.remove();
      this.windows.delete(id);
      if (this.focusedId === id) {
        this.focusedId = null;
        $('#menubar-appname').textContent = 'LazyOS';
        let topWin = null, topZ = 0;
        this.windows.forEach((w, wid) => {
          const z = parseInt(w.el.style.zIndex) || 0;
          if (z > topZ) { topZ = z; topWin = wid; }
        });
        if (topWin) this.focus(topWin);
      }
      if (win.onClose) win.onClose();
      dockManager.updateIndicators();
    }, 250);
  }
  minimize(id) {
    const win = this.windows.get(id);
    if (!win) return;
    win.minimized = true;
    win.el.classList.add('minimizing');
    win.el.classList.remove('open');
    setTimeout(() => { win.el.style.display = 'none'; win.el.classList.remove('minimizing'); }, 400);
    if (this.focusedId === id) {
      this.focusedId = null;
      $('#menubar-appname').textContent = 'LazyOS';
    }
  }
  restore(id) {
    const win = this.windows.get(id);
    if (!win || !win.minimized) return;
    win.minimized = false;
    win.el.style.display = '';
    requestAnimationFrame(() => { win.el.classList.add('open'); });
    this.focus(id);
  }
  toggleMaximize(id) {
    const win = this.windows.get(id);
    if (!win) return;
    if (win.maximized) {
      win.maximized = false;
      win.el.classList.remove('maximized');
      if (win.prevBounds) {
        win.x = win.prevBounds.x; win.y = win.prevBounds.y;
        win.width = win.prevBounds.w; win.height = win.prevBounds.h;
      }
      this._applyBounds(id);
    } else {
      win.prevBounds = { x:win.x, y:win.y, w:win.width, h:win.height };
      win.maximized = true;
      win.el.classList.add('maximized');
      win.x = 0; win.y = 0;
      win.width = window.innerWidth;
      win.height = window.innerHeight;
      this._applyBounds(id);
    }
    win.body.dispatchEvent(new Event('resize'));
  }
  setTitle(id, title) {
    const win = this.windows.get(id);
    if (!win) return;
    win.title = title;
    win.titlebar.querySelector('.window-title').textContent = title;
  }
  _onMouseMove(e) {
    if (this.dragState) {
      const d = this.dragState;
      const win = this.windows.get(d.id);
      if (!win) return;
      win.x = d.origX + (e.clientX - d.startX);
      win.y = Math.max(0, d.origY + (e.clientY - d.startY));
      this._applyBounds(d.id);
      const margin = 12;
      const sw = window.innerWidth, sh = window.innerHeight;
      let snap = null;
      if (e.clientX <= margin) snap = { x:0, y:0, w:sw/2, h:sh };
      else if (e.clientX >= sw - margin) snap = { x:sw/2, y:0, w:sw/2, h:sh };
      else if (e.clientY <= margin) snap = { x:0, y:0, w:sw, h:sh };
      if (snap) {
        this.snapPreview.style.left = snap.x+'px'; this.snapPreview.style.top = snap.y+'px';
        this.snapPreview.style.width = snap.w+'px'; this.snapPreview.style.height = snap.h+'px';
        this.snapPreview.classList.add('visible');
      } else {
        this.snapPreview.classList.remove('visible');
      }
    }
    if (this.resizeState) {
      const r = this.resizeState;
      const win = this.windows.get(r.id);
      if (!win) return;
      const dx = e.clientX - r.startX, dy = e.clientY - r.startY;
      const minW = 320, minH = 200;
      if (r.dir.includes('e')) win.width = Math.max(minW, r.origW + dx);
      if (r.dir.includes('w')) { win.width = Math.max(minW, r.origW - dx); win.x = r.origX + r.origW - win.width; }
      if (r.dir.includes('s')) win.height = Math.max(minH, r.origH + dy);
      if (r.dir.includes('n')) { win.height = Math.max(minH, r.origH - dy); win.y = r.origY + r.origH - win.height; }
      this._applyBounds(r.id);
    }
  }
  _onMouseUp(e) {
    if (this.dragState) {
      const d = this.dragState;
      const margin = 12;
      const sw = window.innerWidth, sh = window.innerHeight;
      const win = this.windows.get(d.id);
      if (win) {
        if (e.clientX <= margin) { win.x=0; win.y=0; win.width=sw/2; win.height=sh; }
        else if (e.clientX >= sw - margin) { win.x=sw/2; win.y=0; win.width=sw/2; win.height=sh; }
        else if (e.clientY <= margin) { win.x=0; win.y=0; win.width=sw; win.height=sh; }
        this._applyBounds(d.id);
      }
      this.snapPreview.classList.remove('visible');
      this.dragState = null;
    }
    if (this.resizeState) {
      const win = this.windows.get(this.resizeState.id);
      if (win) win.body.dispatchEvent(new Event('resize'));
      this.resizeState = null;
    }
  }
  getByApp(appId) {
    const results = [];
    this.windows.forEach((w, id) => { if (w.appId === appId) results.push({ id, ...w }); });
    return results;
  }
  focusByApp(appId) {
    const wins = this.getByApp(appId);
    if (wins.length === 0) return false;
    const w = wins[0];
    if (w.minimized) this.restore(w.id);
    else this.focus(w.id);
    return true;
  }
}

// ── Menu Bar ───────────────────────────────────────────────
class MenuBarManager {
  constructor() {
    this.container = $('#dropdown-container');
    this.openMenu = null;
    this.menus = {
      app: [
        { label:'About LazyOS', action:() => appManager.open('settings', {tab:'about'}) },
        '---',
        { label:'Settings...', shortcut:'Cmd+,', action:() => appManager.open('settings') },
        '---',
        { label:'Hide LazyOS', shortcut:'Cmd+H', disabled:true },
      ],
      file: [
        { label:'New Finder Window', shortcut:'Cmd+N', action:() => appManager.open('finder', { reuse:false }) },
        { label:'New Folder', shortcut:'Shift+Cmd+N', action:() => { auraOS.fs.createDir('/Desktop','New Folder'); desktopManager.refresh(); } },
        '---',
        { label:'Close Window', shortcut:'Cmd+W', action:() => { if (wm.focusedId) wm.close(wm.focusedId); } },
      ],
      edit: [
        { label:'Undo', shortcut:'Cmd+Z', disabled:true },
        { label:'Redo', shortcut:'Shift+Cmd+Z', disabled:true },
        '---',
        { label:'Cut', shortcut:'Cmd+X', disabled:true },
        { label:'Copy', shortcut:'Cmd+C', disabled:true },
        { label:'Paste', shortcut:'Cmd+V', disabled:true },
        { label:'Select All', shortcut:'Cmd+A', disabled:true },
      ],
      view: [
        { label:'as Icons', action:() => {} },
        { label:'as List', action:() => {} },
        '---',
        { label:'Show Sidebar', action:() => {} },
        { label:'Enter Full Screen', shortcut:'Ctrl+Cmd+F', action:() => { if (wm.focusedId) wm.toggleMaximize(wm.focusedId); } },
      ],
      window: [
        { label:'Minimize', shortcut:'Cmd+M', action:() => { if (wm.focusedId) wm.minimize(wm.focusedId); } },
        { label:'Zoom', action:() => { if (wm.focusedId) wm.toggleMaximize(wm.focusedId); } },
        '---',
        { label:'Bring All to Front', action:() => { wm.windows.forEach((_,id) => wm.focus(id)); } },
      ],
      help: [
        { label:'LazyOS Help', disabled:true },
        { label:'Keyboard Shortcuts', action:() => {
          notify.send('Keyboard Shortcuts', 'Cmd+Space: Search | Cmd+N: New Window | Cmd+W: Close | Cmd+M: Minimize | Cmd+,: Settings', 'fa-solid fa-keyboard');
        }},
      ],
    };
    $$('.menubar-left .menubar-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuKey = item.dataset.menu;
        if (this.openMenu === menuKey) { this.close(); return; }
        this.show(menuKey, item);
      });
      item.addEventListener('mouseenter', () => {
        if (this.openMenu && item.dataset.menu) this.show(item.dataset.menu, item);
      });
    });
    document.addEventListener('mousedown', (e) => {
      if (!e.target.closest('.menubar-left') && !e.target.closest('.dropdown-menu')) this.close();
    });
    this.clockEl = $('#menubar-clock');
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    $('#menubar-search').addEventListener('click', () => spotlight.toggle());
    $('#menubar-ctrl').addEventListener('click', (e) => { e.stopPropagation(); controlCenter.toggle(); });
    $('#menubar-clock').addEventListener('click', (e) => { e.stopPropagation(); calendarPopup.toggle(e); });
  }
  updateClock() {
    const now = new Date();
    this.clockEl.textContent = formatDate(now) + ' ' + formatTime(now);
  }
  show(key, anchor) {
    this.close();
    const items = this.menus[key];
    if (!items) return;
    const menu = el('div', { class:'dropdown-menu', role:'menu' });
    items.forEach(item => {
      if (item === '---') { menu.appendChild(el('div', { class:'dropdown-divider' })); return; }
      const di = el('div', {
        class:'dropdown-item' + (item.disabled ? ' disabled' : ''),
        role:'menuitem', text:item.label,
        onClick:() => { this.close(); if (item.action) item.action(); },
      });
      if (item.shortcut) di.appendChild(el('span', { class:'shortcut', text:item.shortcut }));
      menu.appendChild(di);
    });
    const rect = anchor.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 'px';
    menu.style.left = rect.left + 'px';
    this.container.appendChild(menu);
    $$('.menubar-left .menubar-item').forEach(i => i.classList.toggle('active', i.dataset.menu === key));
    requestAnimationFrame(() => menu.classList.add('open'));
    this.openMenu = key;
  }
  close() {
    this.container.innerHTML = '';
    $$('.menubar-left .menubar-item').forEach(i => i.classList.remove('active'));
    this.openMenu = null;
  }
}

// ── Dock Manager ───────────────────────────────────────────
class DockManager {
  constructor() {
    this.wrapper = $('#dock-wrapper');
    this.leftContainer = $('#dock-left');
    this.items = [
      { id:'finder', pinned:true },
      { id:'browser', pinned:true },
      { id:'terminal', pinned:true },
      { id:'code', pinned:true },
      { id:'textedit', pinned:true },
      '---',
      { id:'music', pinned:true },
      { id:'photos', pinned:true },
      { id:'weather', pinned:true },
      { id:'clock', pinned:true },
      '---',
      { id:'notes', pinned:true },
      { id:'calculator', pinned:true },
      { id:'calendarapp', pinned:true },
      '---',
      { id:'downloads', pinned:true },
      { id:'trash', pinned:true },
    ];
    this.showAppsBtn = null;
    this.render();
    this._magnify = this._magnify.bind(this);
    this.wrapper.addEventListener('mousemove', this._magnify);
    this.wrapper.addEventListener('mouseleave', () => {
      $$('.dock-item', this.leftContainer).forEach(i => { i.style.transform = ''; });
    });
    // Workspace dots
    $$('.dock-ws-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const ws = parseInt(dot.dataset.ws, 10);
        workspaceManager.switchTo(ws);
      });
    });
    // Show desktop
    $('#dock-show-desktop').addEventListener('click', () => {
      workspaceManager.showDesktop();
    });
    // Show Apps button
    this.showAppsBtn = $('#dock-show-apps');
    if (this.showAppsBtn) {
      this.showAppsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        appGrid.toggle();
      });
    }
    // Context menu on dock items
    this.leftContainer.addEventListener('contextmenu', (e) => {
      const item = e.target.closest('.dock-item');
      if (!item) return;
      e.preventDefault();
      const appId = item.dataset.app;
      ctxMenu.show(e.clientX, e.clientY, [
        { label:'Open', action:() => this._onClick(appId) },
        { label:'Remove from Dock', action:() => {
          this.items = this.items.filter(i => i !== '---' && i.id !== appId);
          this.render();
        }},
        '---',
        { label:'Show in Finder', disabled:true },
      ]);
    });
  }
  render() {
    this.leftContainer.innerHTML = '';
    // Logo
    const logoEl = el('div', { class:'dock-logo', title:'LazyOS — Show All Apps', onClick:() => appGrid.toggle() }, [
      el('div', { class:'dock-logo-icon', html:`
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="29" height="29" rx="7" fill="var(--accent)" opacity="0.15"/>
          <rect x="1.5" y="1.5" width="29" height="29" rx="7" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M9 15 L14 20 L23 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      `}),
    ]);
    this.leftContainer.appendChild(logoEl);
    this.leftContainer.appendChild(el('div', { class:'dock-separator' }));
    this.items.forEach((item, idx) => {
      if (item === '---') { this.leftContainer.appendChild(el('div', { class:'dock-separator' })); return; }
      const iconData = APP_ICONS[item.id] || APP_ICONS.file;
      const appName = appManager.registry[item.id]?.name || item.id;
      const di = el('div', {
        class:'dock-item' + (wm.getByApp(item.id).length > 0 ? ' running' : ''),
        'data-app':item.id, 'data-idx':idx,
        onClick:() => this._onClick(item.id),
        onMousedown:(e) => { if (e.button === 0) this._dragStart(e, idx); },
      }, [
        el('div', { class:'dock-tooltip', text:appName }),
        el('div', { class:'dock-icon', style:{background:iconData.bg}, html:`<i class="${iconData.icon}"></i>` }),
        el('div', { class:'dock-indicator' }),
      ]);
      this.leftContainer.appendChild(di);
    });
    this.updateIndicators();
  }
  _onClick(appId) {
    if (wm.focusByApp(appId)) return;
    appManager.open(appId);
    const item = $(`.dock-item[data-app="${appId}"]`, this.leftContainer);
    if (item) {
      item.classList.add('bouncing');
      setTimeout(() => item.classList.remove('bouncing'), 700);
    }
  }
  _magnify(e) {
    const items = $$('.dock-item', this.leftContainer);
    const mouseX = e.clientX;
    const maxDist = 100, maxScale = 1.25;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - center);
      const scale = dist < maxDist ? 1 + (maxScale - 1) * Math.cos((dist / maxDist) * Math.PI / 2) : 1;
      item.style.transform = `scale(${scale}) translateY(${-(scale - 1) * 10}px)`;
    });
  }
  updateIndicators() {
    if (!this.leftContainer) return;
    $$('.dock-item', this.leftContainer).forEach(item => {
      const appId = item.dataset.app;
      if (appId) item.classList.toggle('running', wm.getByApp(appId).length > 0);
    });
  }
  _dragStart(e, idx) {
    const itemEl = e.target.closest('.dock-item');
    if (!itemEl) return;
    const startX = e.clientX;
    let dragging = false;
    const onMove = (ev) => {
      if (!dragging && Math.abs(ev.clientX - startX) > 6) {
        dragging = true;
        itemEl.style.opacity = '0.5';
      }
      if (!dragging) return;
      const siblings = $$('.dock-item', this.leftContainer).filter(s => s !== itemEl);
      for (const sib of siblings) {
        const sr = sib.getBoundingClientRect();
        if (ev.clientX > sr.left && ev.clientX < sr.right) {
          const sibIdx = parseInt(sib.dataset.idx, 10);
          const curIdx = parseInt(itemEl.dataset.idx, 10);
          if (sibIdx < curIdx) sib.before(itemEl); else sib.after(itemEl);
          break;
        }
      }
    };
    const onUp = () => {
      itemEl.style.opacity = '';
      if (dragging) {
        const newOrder = [];
        $$('.dock-item, .dock-separator', this.leftContainer).forEach(node => {
          if (node.classList.contains('dock-separator')) { newOrder.push('---'); return; }
          const found = this.items.find(i => i && i !== '---' && i.id === node.dataset.app);
          if (found) newOrder.push(found);
        });
        this.items = newOrder;
        this.render();
      }
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
  addToDock(appId) {
    if (this.items.find(i => i !== '---' && i.id === appId)) return;
    this.items.splice(this.items.length - 1, 0, { id: appId, pinned: false });
    this.render();
  }
}

// ── Control Center ─────────────────────────────────────────
class ControlCenterManager {
  constructor() {
    this.el = $('#control-center');
    this.isOpen = false;
    this.wifiOn = true; this.bluetoothOn = false; this.dndOn = false; this.darkMode = true;
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.el.contains(e.target) && !e.target.closest('#menubar-ctrl')) this.close();
    });
    this.render();
  }
  render() {
    this.el.innerHTML = `
      <div class="cc-grid">
        <div class="cc-tile ${this.wifiOn?'active':''}" data-cc="wifi"><i class="fa-solid fa-wifi"></i><span>Wi-Fi</span></div>
        <div class="cc-tile ${this.bluetoothOn?'active':''}" data-cc="bt"><i class="fa-brands fa-bluetooth-b"></i><span>Bluetooth</span></div>
        <div class="cc-tile ${this.dndOn?'active':''}" data-cc="dnd"><i class="fa-solid fa-moon"></i><span>DND</span></div>
        <div class="cc-tile ${this.darkMode?'active':''}" data-cc="dark"><i class="fa-solid fa-circle-half-stroke"></i><span>Dark Mode</span></div>
      </div>
      <div class="cc-slider-group">
        <div class="cc-slider-label"><i class="fa-solid fa-display"></i> Brightness</div>
        <input type="range" class="cc-slider" min="30" max="100" value="100" data-cc="brightness">
      </div>
      <div class="cc-slider-group">
        <div class="cc-slider-label"><i class="fa-solid fa-volume-high"></i> Volume</div>
        <input type="range" class="cc-slider" min="0" max="100" value="75" data-cc="volume">
      </div>
    `;
    this.el.addEventListener('click', (e) => {
      const tile = e.target.closest('.cc-tile');
      if (!tile) return;
      const type = tile.dataset.cc;
      if (type === 'wifi') { this.wifiOn = !this.wifiOn; tile.classList.toggle('active'); }
      else if (type === 'bt') { this.bluetoothOn = !this.bluetoothOn; tile.classList.toggle('active'); }
      else if (type === 'dnd') { this.dndOn = !this.dndOn; tile.classList.toggle('active'); }
      else if (type === 'dark') {
        this.darkMode = !this.darkMode; tile.classList.toggle('active');
        themeManager.setTheme(this.darkMode ? 'dark' : 'light');
      }
    });
    this.el.addEventListener('input', (e) => {
      if (e.target.dataset.cc === 'brightness') {
        document.body.style.filter = `brightness(${e.target.value}%)`;
      }
    });
  }
  toggle() { this.isOpen ? this.close() : this.open(); }
  open() { this.isOpen = true; this.el.classList.add('open'); }
  close() { this.isOpen = false; this.el.classList.remove('open'); }
}

// ── Calendar Popup ─────────────────────────────────────────
class CalendarPopupManager {
  constructor() {
    this.el = $('#calendar-popup');
    this.isOpen = false;
    this.viewDate = new Date();
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.el.contains(e.target) && !e.target.closest('#menubar-clock')) this.close();
    });
    this.render();
  }
  render() {
    const d = this.viewDate;
    const year = d.getFullYear(), month = d.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let html = `<div class="cal-header">
      <button id="cal-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
      <span>${monthNames[month]} ${year}</span>
      <button id="cal-next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
    </div><div class="cal-grid">`;
    ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(n => { html += `<div class="cal-day-name">${n}</div>`; });
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-day other-month">${daysInPrev - i}</div>`;
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      html += `<div class="cal-day${isToday ? ' today' : ''}">${i}</div>`;
    }
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      html += `<div class="cal-day other-month">${i}</div>`;
    }
    html += '</div>';
    this.el.innerHTML = html;
    $('#cal-prev').addEventListener('click', () => { this.viewDate.setMonth(this.viewDate.getMonth() - 1); this.render(); });
    $('#cal-next').addEventListener('click', () => { this.viewDate.setMonth(this.viewDate.getMonth() + 1); this.render(); });
  }
  toggle(e) {
    if (this.isOpen) { this.close(); return; }
    this.viewDate = new Date();
    this.render();
    this.el.style.right = 'var(--spacing-3)';
    this.el.style.left = '';
    this.isOpen = true;
    this.el.classList.add('open');
  }
  close() { this.isOpen = false; this.el.classList.remove('open'); }
}

// ── Desktop Manager ────────────────────────────────────────
class DesktopManager {
  constructor() {
    this.container = $('#desktop-icons');
    this.selectedIcon = null;
    this.selectionBox = $('#selection-box');
    this._selStart = null;
    this.render();
    $('#desktop').addEventListener('mousedown', (e) => {
      if (e.target === $('#desktop') || e.target === this.container) {
        this.deselectAll();
        this._selStart = { x:e.clientX, y:e.clientY };
      }
    });
    document.addEventListener('mousemove', (e) => this._onSelMove(e));
    document.addEventListener('mouseup', (e) => this._onSelUp(e));
    $('#desktop').addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (e.target.closest('.desktop-icon')) return;
      ctxMenu.show(e.clientX, e.clientY, [
        { label:'New Folder', action:() => { auraOS.fs.createDir('/Desktop','New Folder'); this.refresh(); } },
        { label:'New File', action:() => { auraOS.fs.createFile('/Desktop','New File.txt',''); this.refresh(); } },
        '---',
        { label:'Sort by Name', action:() => this.refresh() },
        { label:'Refresh', action:() => this.refresh() },
        '---',
        { label:'Change Wallpaper...', action:() => appManager.open('settings', {tab:'wallpaper'}) },
        { label:'Settings...', action:() => appManager.open('settings') },
      ]);
    });
    this.container.addEventListener('contextmenu', (e) => {
      const icon = e.target.closest('.desktop-icon');
      if (!icon) return;
      e.preventDefault();
      e.stopPropagation();
      this.selectIcon(icon);
      const name = icon.dataset.name;
      const path = '/Desktop/' + name;
      const node = auraOS.fs.resolve(path);
      ctxMenu.show(e.clientX, e.clientY, [
        { label:'Open', action:() => this._openIcon(name, node) },
        '---',
        { label:'Rename', action:() => this._renameIcon(icon, name, path) },
        { label:'Delete', action:() => { auraOS.fs.delete(path); this.refresh(); } },
        '---',
        { label:'Get Info', action:() => {
          if (node) notify.send(name, `Type: ${node.type}\nSize: ${node.size ? formatFileSize(node.size) : '—'}\nModified: ${new Date(node.modified).toLocaleString()}`, node.type==='dir'?'fa-solid fa-folder':'fa-solid fa-file');
        }},
      ]);
    });
    this.container.addEventListener('dblclick', (e) => {
      const icon = e.target.closest('.desktop-icon');
      if (!icon) return;
      const name = icon.dataset.name;
      const path = '/Desktop/' + name;
      const node = auraOS.fs.resolve(path);
      this._openIcon(name, node);
    });
  }
  _openIcon(name, node) {
    if (!node) return;
    if (node.type === 'dir') appManager.open('finder', { path: '/Desktop/' + name });
    else if (name.endsWith('.js') || name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.txt') || name.endsWith('.md'))
      appManager.open('code', { filePath: '/Desktop/' + name });
    else appManager.open('finder', { path: '/Desktop' });
  }
  _renameIcon(icon, oldName, path) {
    const label = icon.querySelector('.icon-label');
    const input = el('input', { class:'rename-input', value:oldName });
    label.replaceWith(input);
    input.focus();
    input.select();
    const finish = () => {
      const newName = input.value.trim() || oldName;
      if (newName !== oldName) auraOS.fs.rename(path, newName);
      this.refresh();
    };
    input.addEventListener('blur', finish);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); if (e.key === 'Escape') { input.value = oldName; input.blur(); } });
  }
  render() {
    this.container.innerHTML = '';
    const items = auraOS.fs.list('/Desktop');
    items.forEach(item => {
      const iconData = item.type === 'dir' ? APP_ICONS.folder : (APP_ICONS.text || APP_ICONS.file);
      const icon = el('div', {
        class:'desktop-icon', 'data-name':item.name,
        onClick:(e) => { e.stopPropagation(); this.selectIcon(icon); },
      }, [
        el('div', { class:'icon-img', style:{background:iconData.bg}, html:`<i class="${iconData.icon}"></i>` }),
        el('div', { class:'icon-label', text:item.name }),
      ]);
      this.container.appendChild(icon);
    });
  }
  refresh() { this.render(); }
  selectIcon(icon) {
    this.deselectAll();
    icon.classList.add('selected');
    this.selectedIcon = icon;
  }
  deselectAll() {
    $$('.desktop-icon', this.container).forEach(i => i.classList.remove('selected'));
    this.selectedIcon = null;
  }
  _onSelMove(e) {
    if (!this._selStart) return;
    const x1 = Math.min(this._selStart.x, e.clientX), y1 = Math.min(this._selStart.y, e.clientY);
    const x2 = Math.max(this._selStart.x, e.clientX), y2 = Math.max(this._selStart.y, e.clientY);
    if (Math.abs(x2-x1) < 5 && Math.abs(y2-y1) < 5) return;
    this.selectionBox.style.display = 'block';
    this.selectionBox.style.left = x1+'px'; this.selectionBox.style.top = y1+'px';
    this.selectionBox.style.width = (x2-x1)+'px'; this.selectionBox.style.height = (y2-y1)+'px';
    const box = { x1, y1, x2, y2 };
    $$('.desktop-icon', this.container).forEach(icon => {
      const r = icon.getBoundingClientRect();
      const overlap = !(r.right < box.x1 || r.left > box.x2 || r.bottom < box.y1 || r.top > box.y2);
      icon.classList.toggle('selected', overlap);
    });
  }
  _onSelUp() {
    this._selStart = null;
    this.selectionBox.style.display = 'none';
  }
}

// ── Application Manager ────────────────────────────────────
class AppManager {
  constructor() {
    this.registry = {};
    this.registerDefaults();
  }
  registerDefaults() {
    this.register('finder', { name:'Files', create:() => new FinderApp() });
    this.register('terminal', { name:'Terminal', create:() => new TerminalApp() });
    this.register('browser', { name:'Browser', create:() => new BrowserApp() });
    this.register('notes', { name:'Notes', create:() => new NotesApp() });
    this.register('calculator', { name:'Calculator', create:() => new CalculatorApp() });
    this.register('code', { name:'Code Editor', create:() => new CodeEditorApp() });
    this.register('settings', { name:'Settings', create:() => new SettingsApp() });
    this.register('downloads', { name:'Downloads', create:() => new FinderApp('/Downloads') });
    this.register('trash', { name:'Trash', create:() => new FinderApp('/Trash', true) });
    this.register('music', { name:'Music', create:() => new MusicApp() });
    this.register('photos', { name:'Photos', create:() => new PhotosApp() });
    this.register('weather', { name:'Weather', create:() => new WeatherApp() });
    this.register('clock', { name:'Clock', create:() => new ClockApp() });
    this.register('textedit', { name:'TextEdit', create:() => new TextEditApp() });
    this.register('calendarapp', { name:'Calendar', create:() => new CalendarApp() });
  }
  register(id, def) { this.registry[id] = def; }
  open(appId, opts={}) {
    if (opts.reuse !== false && wm.focusByApp(appId)) return;
    const appDef = this.registry[appId];
    if (!appDef) return;
    const app = appDef.create();
    app.launch(opts);
    dockManager.updateIndicators();
  }
}

// ══════════════════════════════════════════════════════════
// APPLICATION IMPLEMENTATIONS
// ══════════════════════════════════════════════════════════

// ── Finder App ─────────────────────────────────────────────
class FinderApp {
  constructor(defaultPath='/Documents', isTrash=false) {
    this.defaultPath = defaultPath;
    this.isTrash = isTrash;
    this.currentPath = defaultPath;
    this.viewMode = 'grid';
    this.selectedItem = null;
  }
  launch(opts={}) {
    this.currentPath = opts.path || this.defaultPath;
    this.wid = wm.create({
      id: opts.id,
      title: this.isTrash ? 'Trash' : 'Files — ' + this.currentPath,
      width: 780, height: 500,
      appId: this.isTrash ? 'trash' : 'finder',
    });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'finder-container' });
    const sidebar = el('div', { class:'finder-sidebar' });
    const favs = [
      { name:'Desktop', path:'/Desktop', icon:'fa-solid fa-display' },
      { name:'Documents', path:'/Documents', icon:'fa-solid fa-file-lines' },
      { name:'Downloads', path:'/Downloads', icon:'fa-solid fa-download' },
      { name:'Pictures', path:'/Pictures', icon:'fa-solid fa-image' },
      { name:'Music', path:'/Music', icon:'fa-solid fa-music' },
      { name:'Projects', path:'/Projects', icon:'fa-solid fa-code' },
    ];
    sidebar.appendChild(el('div', { class:'finder-sidebar-section' }, [
      el('div', { class:'finder-sidebar-title', text:'Favorites' }),
      ...favs.map(f => el('div', {
        class:'finder-sidebar-item' + (this.currentPath === f.path ? ' active' : ''),
        onClick:() => { this.currentPath = f.path; this.render(); },
      }, [el('i', { class:f.icon }), el('span', { text:f.name })])),
    ]));
    container.appendChild(sidebar);
    const main = el('div', { class:'finder-main' });
    const toolbar = el('div', { class:'finder-toolbar' });
    toolbar.appendChild(el('button', { class:'finder-toolbar-btn', 'aria-label':'Back', onClick:() => this._goUp(), html:'<i class="fa-solid fa-chevron-left"></i>' }));
    const bc = el('div', { class:'finder-breadcrumb' });
    const parts = this.currentPath.split('/').filter(Boolean);
    bc.appendChild(el('span', { onClick:() => { this.currentPath='/'; this.render(); }, text:'LazyOS' }));
    parts.forEach((p, i) => {
      bc.appendChild(el('span', { class:'bc-sep', text:'/' }));
      const path = '/' + parts.slice(0, i+1).join('/');
      const isCurrent = i === parts.length - 1;
      bc.appendChild(el('span', { class:isCurrent?'current':'', onClick:() => { if (!isCurrent) { this.currentPath=path; this.render(); } }, text:p }));
    });
    toolbar.appendChild(bc);
    const searchInput = el('input', { class:'finder-search', placeholder:'Search...', 'aria-label':'Search files' });
    searchInput.addEventListener('input', () => this._renderContent(searchInput.value));
    toolbar.appendChild(searchInput);
    toolbar.appendChild(el('button', {
      class:'finder-toolbar-btn' + (this.viewMode==='grid'?' active':''),
      'aria-label':'Grid view', html:'<i class="fa-solid fa-grid-2"></i>',
      onClick:() => { this.viewMode='grid'; this.render(); },
    }));
    toolbar.appendChild(el('button', {
      class:'finder-toolbar-btn' + (this.viewMode==='list'?' active':''),
      'aria-label':'List view', html:'<i class="fa-solid fa-list"></i>',
      onClick:() => { this.viewMode='list'; this.render(); },
    }));
    main.appendChild(toolbar);
    const content = el('div', { class:'finder-content', id:'finder-content-'+this.wid.id });
    main.appendChild(content);
    container.appendChild(main);
    this.body.appendChild(container);
    this._renderContent();
    content.addEventListener('contextmenu', (e) => {
      const item = e.target.closest('.finder-item, .finder-list-item');
      if (item) {
        e.preventDefault(); e.stopPropagation();
        const name = item.dataset.name;
        const path = this.currentPath === '/' ? '/'+name : this.currentPath+'/'+name;
        ctxMenu.show(e.clientX, e.clientY, [
          { label:'Open', action:() => this._openItem(name) },
          '---',
          { label:'Delete', action:() => { auraOS.fs.delete(path); this.render(); } },
        ]);
        return;
      }
      e.preventDefault();
      ctxMenu.show(e.clientX, e.clientY, [
        { label:'New Folder', action:() => { auraOS.fs.createDir(this.currentPath,'New Folder'); this.render(); } },
        { label:'New File', action:() => { auraOS.fs.createFile(this.currentPath,'New File.txt',''); this.render(); } },
        '---',
        { label:'Sort by Name', action:() => this.render() },
      ]);
    });
    content.addEventListener('dblclick', (e) => {
      const item = e.target.closest('.finder-item, .finder-list-item');
      if (item) this._openItem(item.dataset.name);
    });
    wm.setTitle(this.wid.id, this.isTrash ? 'Trash' : 'Files — ' + this.currentPath);
  }
  _renderContent(filter='') {
    const content = this.body.querySelector('.finder-content');
    if (!content) return;
    content.innerHTML = '';
    let items = auraOS.fs.list(this.currentPath);
    if (filter) items = items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
    if (items.length === 0) {
      content.appendChild(el('div', { class:'finder-empty', text:'This folder is empty' }));
      return;
    }
    if (this.viewMode === 'grid') {
      const grid = el('div', { class:'finder-grid' });
      items.forEach(item => {
        const iconData = item.type === 'dir' ? APP_ICONS.folder : (APP_ICONS.text || APP_ICONS.file);
        grid.appendChild(el('div', {
          class:'finder-item', 'data-name':item.name,
          onClick:(e) => { e.stopPropagation(); $$('.finder-item',grid).forEach(i=>i.classList.remove('selected')); grid.querySelector(`[data-name="${CSS.escape(item.name)}"]`)?.classList.add('selected'); },
        }, [
          el('div', { class:'finder-item-icon', style:{background:iconData.bg}, html:`<i class="${iconData.icon}"></i>` }),
          el('div', { class:'finder-item-name', text:item.name }),
        ]));
      });
      content.appendChild(grid);
    } else {
      const list = el('div', { class:'finder-list' });
      list.appendChild(el('div', { class:'finder-list-header' }, [
        el('span', { text:'Name' }), el('span', { text:'Size' }), el('span', { text:'Modified' }),
      ]));
      items.forEach(item => {
        list.appendChild(el('div', {
          class:'finder-list-item', 'data-name':item.name,
          onClick:(e) => { e.stopPropagation(); $$('.finder-list-item',list).forEach(i=>i.classList.remove('selected')); list.querySelector(`[data-name="${CSS.escape(item.name)}"]`)?.classList.add('selected'); },
        }, [
          el('span', { text:item.name }),
          el('span', { class:'size', text:item.type==='file' ? formatFileSize(item.size||0) : '—' }),
          el('span', { class:'modified', text:new Date(item.modified).toLocaleDateString() }),
        ]));
      });
      content.appendChild(list);
    }
  }
  _openItem(name) {
    const path = this.currentPath === '/' ? '/'+name : this.currentPath+'/'+name;
    const node = auraOS.fs.resolve(path);
    if (!node) return;
    if (node.type === 'dir') { this.currentPath = path; this.render(); }
    else if (name.endsWith('.js') || name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.txt') || name.endsWith('.md'))
      appManager.open('code', { filePath:path });
    else notify.send('Cannot Open', `No application found for "${name}"`, 'fa-solid fa-circle-exclamation', 'var(--warning)');
  }
  _goUp() {
    const parts = this.currentPath.split('/').filter(Boolean);
    if (parts.length <= 0) return;
    parts.pop();
    this.currentPath = '/' + parts.join('/') || '/';
    this.render();
  }
}

// ── Terminal App ───────────────────────────────────────────
class TerminalApp {
  constructor() {
    this.cwd = '/Users/aura';
    this.history = [];
    this.historyIdx = -1;
    this.hostname = 'lazy@LazyOS';
    this.startTime = Date.now();
    this.aliases = { ll:'ls -la', la:'ls -a' };
    this.ws = null;
    this.realTerminal = false;
    this.outputBuffer = '';
    this.currentInput = '';
    this.cursorPos = 0;
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Terminal', width:700, height:480, appId:'terminal' });
    this.body = this.wid.body;
    this.body.innerHTML = '<div class="terminal-container" tabindex="0"></div>';
    this.terminal = this.body.querySelector('.terminal-container');
    this._tryRealTerminal();
  }
  _tryRealTerminal() {
    try {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'localhost:3000';
      this.ws = new WebSocket(protocol + '//' + host + '/terminal');
      this.ws.onopen = () => {
        this.realTerminal = true;
        this.terminal.innerHTML = '';
        this._setupRealTerminal();
      };
      this.ws.onmessage = (e) => {
        const parsed = JSON.parse(e.data);
        if (parsed.type === 'output') {
          this._appendRealOutput(parsed.data);
        }
      };
      this.ws.onclose = () => {
        if (this.realTerminal) {
          this._appendRealOutput('\r\n\x1b[1;31m[Connection closed]\x1b[0m\r\n');
        }
      };
      this.ws.onerror = () => {
        this.realTerminal = false;
        this._fallbackToFake();
      };
      setTimeout(() => {
        if (!this.realTerminal) this._fallbackToFake();
      }, 2000);
    } catch(e) {
      this._fallbackToFake();
    }
  }
  _setupRealTerminal() {
    this.terminal.innerHTML = '';
    this.outputEl = el('div', { class:'terminal-real-output' });
    this.terminal.appendChild(this.outputEl);
    this.inputLine = el('div', { class:'terminal-real-inputline' });
    this.realInput = el('input', {
      class:'terminal-real-input',
      'aria-label':'Terminal input',
      spellcheck:'false',
      autocomplete:'off',
    });
    this.inputLine.appendChild(this.realInput);
    this.terminal.appendChild(this.inputLine);
    this.realInput.focus();
    this.realInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.realInput.value + '\n';
        this.ws.send(JSON.stringify({ type: 'input', data: cmd }));
        this.history.push(this.realInput.value);
        this.historyIdx = this.history.length;
        this.realInput.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIdx > 0) { this.historyIdx--; this.realInput.value = this.history[this.historyIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIdx < this.history.length - 1) { this.historyIdx++; this.realInput.value = this.history[this.historyIdx]; }
        else { this.historyIdx = this.history.length; this.realInput.value = ''; }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        this.outputEl.innerHTML = '';
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        this.ws.send(JSON.stringify({ type: 'input', data: '\x03' }));
      } else if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault();
        this.ws.send(JSON.stringify({ type: 'input', data: '\x04' }));
      }
    });
    this.terminal.addEventListener('click', () => this.realInput?.focus());
  }
  _appendRealOutput(data) {
    const escaped = data
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const html = this._ansiToHtml(escaped);
    this.outputEl.innerHTML += html;
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }
  _ansiToHtml(text) {
    const ansiMap = {
      '0': '</span>',
      '1;31': '<span style="color:#f87171;font-weight:700">',
      '1;32': '<span style="color:#4ade80;font-weight:700">',
      '1;33': '<span style="color:#fbbf24;font-weight:700">',
      '1;34': '<span style="color:#60a5fa;font-weight:700">',
      '1;35': '<span style="color:#c084fc;font-weight:700">',
      '1;36': '<span style="color:#22d3ee;font-weight:700">',
      '1;37': '<span style="color:#f3f4f6;font-weight:700">',
      '1': '<span style="font-weight:700">',
      '31': '<span style="color:#f87171">',
      '32': '<span style="color:#4ade80">',
      '33': '<span style="color:#fbbf24">',
      '34': '<span style="color:#60a5fa">',
      '35': '<span style="color:#c084fc">',
      '36': '<span style="color:#22d3ee">',
      '37': '<span style="color:#f3f4f6">',
      '90': '<span style="color:#6b7280">',
      '91': '<span style="color:#ef4444">',
      '92': '<span style="color:#22c55e">',
      '93': '<span style="color:#eab308">',
      '94': '<span style="color:#3b82f6">',
      '95': '<span style="color:#a855f7">',
      '96': '<span style="color:#06b6d4">',
    };
    return text.replace(/\x1b\[([\d;]+)m/g, (match, code) => {
      return ansiMap[code] || '';
    }).replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
  }
  _fallbackToFake() {
    this.terminal.innerHTML = '';
    this._printHTML(`<span style="color:#22d3ee">╔══════════════════════════════════════════════╗</span>`, 'terminal-success');
    this._printHTML(`<span style="color:#22d3ee">║</span>  <span style="font-size:16px;font-weight:700">LazyOS Terminal</span>  <span style="color:#636">v2.0</span>  <span style="color:#f87171">(offline mode)</span>  <span style="color:#22d3ee">║</span>`, 'terminal-success');
    this._printHTML(`<span style="color:#22d3ee">║</span>  Run <span style="color:#f59e0b;font-weight:600">npm start</span> in the project dir for real shell! <span style="color:#22d3ee">║</span>`, 'terminal-success');
    this._printHTML(`<span style="color:#22d3ee">╚══════════════════════════════════════════════╝</span>`, 'terminal-success');
    this._printLine('');
    this._showFakePrompt();
    this.terminal.addEventListener('click', () => this.input?.focus());
  }
  _showFakePrompt() {
    const line = el('div', { class:'terminal-input-line' });
    const dir = this.cwd === '/Users/aura' ? '~' : this.cwd.replace('/Users/aura/', '~/');
    line.appendChild(el('span', { class:'terminal-prompt', text:`${this.hostname} ` }));
    line.appendChild(el('span', { class:'terminal-path', text:dir + ' ' }));
    line.appendChild(el('span', { style:{color:'var(--accent)'}, text:'% ' }));
    this.input = el('input', {
      class:'terminal-input',
      'aria-label':'Terminal input',
      spellcheck:'false',
      style:{caretColor:'var(--accent)'},
    });
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = this.input.value;
        this.history.push(cmd);
        this.historyIdx = this.history.length;
        this.input.disabled = true;
        this.input.style.caretColor = 'transparent';
        this._execCmd(cmd);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this._autocomplete();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIdx > 0) { this.historyIdx--; this.input.value = this.history[this.historyIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIdx < this.history.length - 1) { this.historyIdx++; this.input.value = this.history[this.historyIdx]; }
        else { this.historyIdx = this.history.length; this.input.value = ''; }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault(); this.terminal.innerHTML = ''; this._showFakePrompt();
      } else if (e.key === 'd' && e.ctrlKey) {
        e.preventDefault(); this._printLine('logout', 'terminal-output'); this._printLine('[Process completed]', 'terminal-error');
      }
    });
    line.appendChild(this.input);
    this.terminal.appendChild(line);
    this.input.focus();
  }
  _autocomplete() {
    const val = this.input.value;
    if (!val) return;
    const parts = val.trim().split(/\s+/);
    if (parts.length === 1) {
      const all = Object.keys(this._getCommands());
      const match = all.filter(c => c.startsWith(parts[0]));
      if (match.length === 1) {
        this.input.value = match[0] + ' ';
      } else if (match.length > 1) {
        this._printLine('\n' + match.join('  '));
        this._showFakePrompt();
        this.input.value = val;
      }
    }
  }
  _getCommands() {
    return {
      help:1, pwd:1, ls:1, cd:1, mkdir:1, touch:1, cat:1, echo:1,
      rm:1, mv:1, cp:1, clear:1, date:1, whoami:1, tree:1, history:1,
      theme:1, neofetch:1, man:1, which:1, uname:1, uptime:1, cal:1,
      df:1, du:1, head:1, tail:1, sort:1, wc:1, grep:1, open:1, sudo:1,
      alias:1, ping:1, banner:1, cowsay:1, fortune:1, yes:1,
    };
  }
  _printLine(text, cls='terminal-output') {
    const line = el('div', { class:'terminal-line ' + cls, text });
    const inputLine = this.terminal.querySelector('.terminal-input-line');
    if (inputLine) this.terminal.insertBefore(line, inputLine);
    else this.terminal.appendChild(line);
  }
  _printHTML(html, cls='terminal-output') {
    const line = el('div', { class:'terminal-line ' + cls, html });
    const inputLine = this.terminal.querySelector('.terminal-input-line');
    if (inputLine) this.terminal.insertBefore(line, inputLine);
    else this.terminal.appendChild(line);
  }
  _execCmd(cmdLine) {
    // Expand aliases
    let parts = cmdLine.trim().split(/\s+/);
    let cmd = parts[0];
    const args = parts.slice(1);

    if (this.aliases[cmd]) {
      const expanded = this.aliases[cmd] + (args.length ? ' ' + args.join(' ') : '');
      this._printHTML(`${this.hostname} ${this.cwd} % ${cmdLine}  <span style="color:#636"># alias: ${expanded}</span>`);
      cmdLine = expanded;
      parts = cmdLine.trim().split(/\s+/);
      cmd = parts[0];
    } else {
      this._printLine(`${this.hostname} ${this.cwd} % ${cmdLine}`);
    }

    if (!cmd) { this._showFakePrompt(); return; }
    try {
      switch(cmd) {
        case 'help': this._cmdHelp(); break;
        case 'man': this._cmdMan(args); break;
        case 'pwd': this._printLine(this.cwd); break;
        case 'ls': this._cmdLs(args); break;
        case 'cd': this._cmdCd(args); break;
        case 'mkdir': this._cmdMkdir(args); break;
        case 'touch': this._cmdTouch(args); break;
        case 'cat': this._cmdCat(args); break;
        case 'echo': this._cmdEcho(args); break;
        case 'clear': this.terminal.innerHTML = ''; break;
        case 'date': this._printLine(new Date().toString()); break;
        case 'whoami': this._cmdWhoami(); break;
        case 'uptime': this._cmdUptime(); break;
        case 'uname': this._cmdUname(args); break;
        case 'cal': this._cmdCal(args); break;
        case 'df': this._cmdDf(); break;
        case 'du': this._cmdDu(args); break;
        case 'head': this._cmdHead(args); break;
        case 'tail': this._cmdTail(args); break;
        case 'sort': this._cmdSort(args); break;
        case 'wc': this._cmdWc(args); break;
        case 'grep': this._cmdGrep(args); break;
        case 'which': this._cmdWhich(args); break;
        case 'tree': this._printLine(auraOS.fs.tree(this.cwd)); break;
        case 'history': this.history.forEach((h,i) => this._printLine(`  ${i+1}  ${h}`)); break;
        case 'rm': this._cmdRm(args); break;
        case 'mv': this._cmdMv(args); break;
        case 'cp': this._cmdCp(args); break;
        case 'theme': this._cmdTheme(args); break;
        case 'neofetch': this._cmdNeofetch(); break;
        case 'alias': this._cmdAlias(args); break;
        case 'open': this._cmdOpen(args); break;
        case 'sudo': this._cmdSudo(args); break;
        case 'ping': this._cmdPing(args); break;
        case 'banner': this._cmdBanner(args); break;
        case 'cowsay': this._cmdCowsay(args); break;
        case 'fortune': this._cmdFortune(); break;
        case 'yes': this._cmdYes(args); break;
        default: this._printLine(`zsh: command not found: ${cmd}`, 'terminal-error');
      }
    } catch(err) { this._printLine(`Error: ${err.message}`, 'terminal-error'); }
    this._showFakePrompt();
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }
  _resolvePath(p) {
    if (!p || p === '.') return this.cwd;
    if (p === '~' || p === '') return '/Users/aura';
    if (p.startsWith('~/')) p = '/Users/aura/' + p.slice(2);
    if (!p.startsWith('/')) p = this.cwd === '/' ? '/'+p : this.cwd+'/'+p;
    const parts = p.split('/').filter(Boolean);
    const resolved = [];
    for (const part of parts) {
      if (part === '..') resolved.pop();
      else if (part !== '.') resolved.push(part);
    }
    return '/' + resolved.join('/');
  }
  _cmdHelp() {
    this._printHTML(`
<span style="font-weight:700;font-size:14px">⚡ LazyOS Terminal Help — Learn macOS/Linux Commands</span>

  <span style="color:#f59e0b;font-weight:600">FILE MANAGEMENT</span>
    ls         List directory contents (-a for hidden)
    cd         Change directory (cd ~ for home)
    pwd        Show current directory path
    mkdir      Create a new directory
    touch      Create a new empty file
    cp         Copy files and directories
    mv         Move or rename files
    rm         Remove files or directories
    cat        Display file contents
    head       Show first lines of a file
    tail       Show last lines of a file
    sort       Sort lines of text
    wc         Count lines, words, characters
    grep       Search text using patterns
    open       Open a file with default app
    tree       Display directory tree

  <span style="color:#22d3ee;font-weight:600">SYSTEM INFO</span>
    whoami     Show current user
    uname      Show system information
    uptime     How long system has been running
    df         Show disk usage
    du         Show file/directory size
    date       Show current date and time
    cal        Display a calendar
    neofetch   Display system info in style
    history    Show command history

  <span style="color:#4ade80;font-weight:600">FUN & UTILITIES</span>
    echo       Print text or write to file (> for write)
    clear      Clear the terminal screen
    banner     Display large text banner
    cowsay     Make a cow say something
    fortune    Display a random quote
    ping       Test connectivity (simulated)
    yes        Repeat text until stopped
    theme      Switch dark/light theme
    alias      Set command aliases (ll='ls -la')
    sudo       Run as superuser (nice try!)
    which      Locate a command
    man        Show manual for a command

  Type <span style="color:#f59e0b;font-weight:600">man &lt;command&gt;</span> for detailed help on any command.`, 'terminal-output');
  }
  _cmdMan(args) {
    if (!args[0]) { this._printLine('usage: man [-w] [-C file] [-M path] name ...', 'terminal-output'); return; }
    const manPages = {
      ls:'LS(1)                    User Commands                    LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [-a] [file...]\n\nDESCRIPTION\n    For each file that is a directory, ls lists the contents. By default,\n    ls lists the current directory.\n\n    -a    Include directory entries whose names begin with a dot.\n\nEXAMPLES\n    ls -a         List all files including hidden\n    ls Documents  List contents of Documents folder',
      cd:'CD(1)                    User Commands                    CD(1)\n\nNAME\n    cd - change the current working directory\n\nSYNOPSIS\n    cd [directory]\n\nDESCRIPTION\n    Change the current directory to directory. If directory is not supplied,\n    the home directory is used.\n\n    ~    Home directory shortcut\n    ..   Parent directory\n    .    Current directory\n\nEXAMPLES\n    cd Documents   Go to Documents\n    cd ..          Go up one level\n    cd ~           Go to home directory',
      pwd:'PWD(1)                    User Commands                    PWD(1)\n\nNAME\n    pwd - print name of current/working directory\n\nSYNOPSIS\n    pwd\n\nDESCRIPTION\n    Print the full filename of the current working directory.',
      mkdir:'MKDIR(1)                    User Commands                    MKDIR(1)\n\nNAME\n    mkdir - make directories\n\nSYNOPSIS\n    mkdir directory...\n\nDESCRIPTION\n    Create the specified directories in the given order.\n\nEXAMPLES\n    mkdir Projects   Create a directory named Projects\n    mkdir foo/bar    Create directories foo and foo/bar',
      touch:'TOUCH(1)                    User Commands                    TOUCH(1)\n\nNAME\n    touch - create a file, update file timestamps\n\nSYNOPSIS\n    touch file...\n\nDESCRIPTION\n    Create specified files if they do not exist, or update their\n    modification time if they do.',
      cp:'CP(1)                    User Commands                    CP(1)\n\nNAME\n    cp - copy files\n\nSYNOPSIS\n    cp source target\n\nDESCRIPTION\n    Copy source file to target location.\n\nEXAMPLES\n    cp file.txt backup.txt                     Copy file\n    cp file.txt /Documents/                    Copy file to directory',
      mv:'MV(1)                    User Commands                    MV(1)\n\nNAME\n    mv - move or rename files\n\nSYNOPSIS\n    mv source target\n\nDESCRIPTION\n    Move source to target. If target is a directory, source is moved\n    inside it. Otherwise, source is renamed to target.\n\nEXAMPLES\n    mv file.txt old.txt                        Rename file\n    mv file.txt /Documents/                    Move file to directory',
      rm:'RM(1)                    User Commands                    RM(1)\n\nNAME\n    rm - remove files or directories\n\nSYNOPSIS\n    rm file...\n\nDESCRIPTION\n    Remove specified files.\n\nEXAMPLES\n    rm file.txt          Delete a file\n    rm -rf folder        Delete folder and its contents',
      cat:'CAT(1)                    User Commands                    CAT(1)\n\nNAME\n    cat - concatenate and display files\n\nSYNOPSIS\n    cat [file...]\n\nDESCRIPTION\n    Read each file in sequence and write it to the terminal.\n\nEXAMPLES\n    cat file.txt       Display contents of file.txt\n    cat file1 file2    Display multiple files',
      grep:'GREP(1)                    User Commands                    GREP(1)\n\nNAME\n    grep - search for patterns in files\n\nSYNOPSIS\n    grep pattern [file...]\n\nDESCRIPTION\n    Search for pattern in specified files. If no files, searches all files.\n\nEXAMPLES\n    grep hello file.txt      Search for "hello" in file\n    grep -i Hello file.txt   Case-insensitive search',
      echo:'ECHO(1)                    User Commands                    ECHO(1)\n\nNAME\n    echo - write text to the terminal or to a file\n\nSYNOPSIS\n    echo [text...]\n\nDESCRIPTION\n    Write text to the terminal. Use > to redirect to a file.\n\nEXAMPLES\n    echo Hello World            Print "Hello World"\n    echo Hello > file.txt       Write "Hello" to file.txt\n    echo line2 >> file.txt      Append "line2" to file.txt',
      clear:'CLEAR(1)                    User Commands                    CLEAR(1)\n\nNAME\n    clear - clear the terminal screen\n\nSYNOPSIS\n    clear\n\nDESCRIPTION\n    Clears the terminal window. Also available via Ctrl+L.',
      whoami:'WHOAMI(1)                    User Commands                    WHOAMI(1)\n\nNAME\n    whoami - print effective current user name\n\nSYNOPSIS\n    whoami\n\nDESCRIPTION\n    Display the current user name. In LazyOS, this is always "aura".',
      uname:'UNAME(1)                    User Commands                    UNAME(1)\n\nNAME\n    uname - print system information\n\nSYNOPSIS\n    uname [-a]\n\nDESCRIPTION\n    Print system information. With -a, prints all information.\n\nEXAMPLES\n    uname      Print kernel name\n    uname -a   Print all system information',
      uptime:'UPTIME(1)                    User Commands                    UPTIME(1)\n\nNAME\n    uptime - show how long system has been running\n\nSYNOPSIS\n    uptime\n\nDESCRIPTION\n    Display the current time, how long the system has been running,\n    and system load averages.',
      cal:'CAL(1)                    User Commands                    CAL(1)\n\nNAME\n    cal - display a calendar\n\nSYNOPSIS\n    cal [month] [year]\n\nDESCRIPTION\n    Display a calendar of the given month and year, or the current month.\n\nEXAMPLES\n    cal           Show current month\n    cal 12 2024   Show December 2024',
      df:'DF(1)                    User Commands                    DF(1)\n\nNAME\n    df - display free disk space\n\nSYNOPSIS\n    df [-h]\n\nDESCRIPTION\n    Show available disk space on all mounted filesystems.\n    -h    Human-readable sizes',
      du:'DU(1)                    User Commands                    DU(1)\n\nNAME\n    du - estimate file space usage\n\nSYNOPSIS\n    du [-sh] [file...]\n\nDESCRIPTION\n    Show disk usage of files and directories.\n    -s    Summary (total only)\n    -h    Human-readable sizes',
      neofetch:'NEOFETCH(1)                    User Commands                    NEOFETCH(1)\n\nNAME\n    neofetch - display system information in style\n\nSYNOPSIS\n    neofetch\n\nDESCRIPTION\n    Display system information with an ASCII logo.\n    Shows OS, kernel, shell, resolution, theme, and more.',
      tree:'TREE(1)                    User Commands                    TREE(1)\n\nNAME\n    tree - display directory tree\n\nSYNOPSIS\n    tree\n\nDESCRIPTION\n    List contents of directories in a tree-like format.',
      history:'HISTORY(1)                    User Commands                    HISTORY(1)\n\nNAME\n    history - display command history\n\nSYNOPSIS\n    history\n\nDESCRIPTION\n    Show the list of previously executed commands.',
      open:'OPEN(1)                    User Commands                    OPEN(1)\n\nNAME\n    open - open files and directories\n\nSYNOPSIS\n    open [file...]\n\nDESCRIPTION\n    Open the specified file with its default application.\n    Directories open in Files app.\n\nEXAMPLES\n    open Documents         Open Documents folder\n    open hello.js          Open file in Code Editor',
      sudo:'SUDO(1)                    User Commands                    SUDO(1)\n\nNAME\n    sudo - execute a command as superuser\n\nSYNOPSIS\n    sudo command...\n\nDESCRIPTION\n    LazyOS is a browser-based demo — you already have full access.\n    This command is kept for compatibility.',
      ping:'PING(8)                    System Manager                    PING(8)\n\nNAME\n    ping - send ICMP ECHO_REQUEST to network hosts\n\nSYNOPSIS\n    ping host\n\nDESCRIPTION\n    Send ICMP echo requests to test connectivity.\n    In LazyOS, this is a simulated ping.\n\nEXAMPLES\n    ping google.com   Test connection to Google',
      cowsay:'COWSAY(1)                    User Commands                    COWSAY(1)\n\nNAME\n    cowsay - make a cow say something\n\nSYNOPSIS\n    cowsay [text...]\n\nDESCRIPTION\n    Generate an ASCII picture of a cow saying the given text.\n    If no text is given, the cow says "Moo!"',
      banner:'BANNER(1)                    User Commands                    BANNER(1)\n\nNAME\n    banner - print large text banner\n\nSYNOPSIS\n    banner [text...]\n\nDESCRIPTION\n    Print the given text in large ASCII letters.',
      fortune:'FORTUNE(1)                    User Commands                    FORTUNE(1)\n\nNAME\n    fortune - display a random fortune\n\nSYNOPSIS\n    fortune\n\nDESCRIPTION\n    Display a random, hopefully interesting, adage.',
      alias:'ALIAS(1)                    User Commands                    ALIAS(1)\n\nNAME\n    alias - create command aliases\n\nSYNOPSIS\n    alias name=value\n\nDESCRIPTION\n    Create a shortcut for a longer command.\n\nEXAMPLES\n    alias ll="ls -la"    Now "ll" runs "ls -la"\n    alias                List all aliases',
    };
    const cmd = args[0];
    if (manPages[cmd]) this._printLine(manPages[cmd]);
    else this._printLine(`No manual entry for ${cmd}`, 'terminal-error');
  }
  // ── Command Implementations ──
  _cmdLs(args) {
    const showAll = args.includes('-a');
    const human = args.includes('-h') || args.includes('-l');
    const target = args.find(a => !a.startsWith('-'));
    const path = this._resolvePath(target);
    const items = auraOS.fs.list(path);
    if (!items) { this._printLine(`ls: ${target}: No such file or directory`, 'terminal-error'); return; }
    if (showAll) this._printLine('.  ..');
    if (items.length === 0) return;
    if (human) {
      // Detailed list view (macOS style)
      this._printLine(`total ${items.length}`);
      items.forEach(i => {
        const perms = i.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = i.size ? formatFileSize(i.size).padStart(8) : '       -';
        const mod = new Date(i.modified).toLocaleString('en-US', {month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'});
        const name = i.type === 'dir'
          ? `<span style="color:#22d3ee;font-weight:500">${i.name}</span>`
          : i.name;
        this._printHTML(`${perms}  aura  staff  ${size}  ${mod}  ${name}`);
      });
    } else {
      const line = items.map(i =>
        i.type==='dir'
          ? `<span style="color:#22d3ee;font-weight:500">${i.name}/</span>`
          : `<span style="color:#d4d4d8">${i.name}</span>`
      ).join('  ');
      this._printHTML(line);
    }
  }
  _cmdCd(args) {
    const target = args[0] || '~';
    const path = this._resolvePath(target);
    const node = auraOS.fs.resolve(path);
    if (!node) { this._printLine(`cd: no such directory: ${target}`, 'terminal-error'); return; }
    if (node.type !== 'dir') { this._printLine(`cd: not a directory: ${target}`, 'terminal-error'); return; }
    this.cwd = path;
  }
  _cmdMkdir(args) {
    if (!args[0]) { this._printLine('usage: mkdir [-p] directory ...', 'terminal-error'); return; }
    args.forEach(name => {
      const path = this._resolvePath(name);
      const parentParts = path.split('/').filter(Boolean);
      const dirName = parentParts.pop();
      const parentPath = '/' + parentParts.join('/');
      const parentNode = auraOS.fs.resolve(parentPath);
      if (!parentNode || parentNode.type !== 'dir') { this._printLine(`mkdir: ${name}: No such file or directory`, 'terminal-error'); return; }
      if (parentNode.children[dirName]) { this._printLine(`mkdir: ${name}: File exists`, 'terminal-error'); return; }
      auraOS.fs.createDir(parentPath, dirName);
    });
    desktopManager.refresh();
  }
  _cmdTouch(args) {
    if (!args[0]) { this._printLine('usage: touch file ...', 'terminal-error'); return; }
    args.forEach(name => {
      const path = this._resolvePath(name);
      const parentParts = path.split('/').filter(Boolean);
      const fileName = parentParts.pop();
      const parentPath = '/' + parentParts.join('/');
      if (!auraOS.fs.resolve(parentPath)) { this._printLine(`touch: ${name}: No such directory`, 'terminal-error'); return; }
      if (!auraOS.fs.exists(path)) auraOS.fs.createFile(parentPath, fileName, '');
    });
    desktopManager.refresh();
  }
  _cmdCat(args) {
    if (!args[0]) { this._printLine('usage: cat file ...', 'terminal-error'); return; }
    args.forEach(name => {
      const path = this._resolvePath(name);
      const content = auraOS.fs.read(path);
      if (content === null) { this._printLine(`cat: ${name}: No such file`, 'terminal-error'); return; }
      this._printLine(content);
    });
  }
  _cmdEcho(args) {
    const appendIdx = args.indexOf('>>');
    const redirIdx = args.indexOf('>');
    if (appendIdx !== -1) {
      // Append mode
      const text = args.slice(0, appendIdx).join(' ');
      const file = args[appendIdx + 1];
      if (!file) { this._printLine('echo: missing filename after >>', 'terminal-error'); return; }
      const path = this._resolvePath(file);
      const parentParts = path.split('/').filter(Boolean);
      const fileName = parentParts.pop();
      const parentPath = '/' + parentParts.join('/');
      if (!auraOS.fs.resolve(parentPath)) { this._printLine(`echo: ${file}: No such directory`, 'terminal-error'); return; }
      if (!auraOS.fs.exists(path)) auraOS.fs.createFile(parentPath, fileName, text);
      else auraOS.fs.write(path, auraOS.fs.read(path) + '\n' + text);
      desktopManager.refresh();
    } else if (redirIdx !== -1) {
      const text = args.slice(0, redirIdx).join(' ');
      const file = args[redirIdx + 1];
      if (!file) { this._printLine('echo: missing filename after >', 'terminal-error'); return; }
      const path = this._resolvePath(file);
      const parentParts = path.split('/').filter(Boolean);
      const fileName = parentParts.pop();
      const parentPath = '/' + parentParts.join('/');
      if (!auraOS.fs.resolve(parentPath)) { this._printLine(`echo: ${file}: No such directory`, 'terminal-error'); return; }
      if (!auraOS.fs.exists(path)) auraOS.fs.createFile(parentPath, fileName, text);
      else auraOS.fs.write(path, text);
      desktopManager.refresh();
    } else {
      this._printLine(args.join(' '));
    }
  }
  _cmdRm(args) {
    if (!args[0]) { this._printLine('usage: rm [-f] [-r] file ...', 'terminal-error'); return; }
    const force = args.includes('-f');
    const recurse = args.includes('-r') || args.includes('-rf');
    const targets = args.filter(a => !a.startsWith('-'));
    targets.forEach(name => {
      const path = this._resolvePath(name);
      if (!auraOS.fs.exists(path)) {
        if (!force) this._printLine(`rm: ${name}: No such file or directory`, 'terminal-error');
        return;
      }
      auraOS.fs.delete(path);
    });
    desktopManager.refresh();
  }
  _cmdMv(args) {
    if (args.length < 2) { this._printLine('usage: mv [-f] source target', 'terminal-error'); return; }
    const srci = args.findIndex(a => !a.startsWith('-'));
    if (srci === -1 || srci+1 >= args.length) { this._printLine('usage: mv source target', 'terminal-error'); return; }
    const src = this._resolvePath(args[srci]);
    const dest = this._resolvePath(args[srci+1]);
    if (!auraOS.fs.exists(src)) { this._printLine(`mv: ${args[srci]}: No such file or directory`, 'terminal-error'); return; }
    const destNode = auraOS.fs.resolve(dest);
    if (destNode && destNode.type === 'dir') { auraOS.fs.move(src, dest); }
    else { auraOS.fs.rename(src, dest.split('/').pop()); }
    desktopManager.refresh();
  }
  _cmdCp(args) {
    if (args.length < 2) { this._printLine('usage: cp source target', 'terminal-error'); return; }
    const srci = args.findIndex(a => !a.startsWith('-'));
    if (srci === -1 || srci+1 >= args.length) { this._printLine('usage: cp source target', 'terminal-error'); return; }
    const src = this._resolvePath(args[srci]);
    const dest = this._resolvePath(args[srci+1]);
    const content = auraOS.fs.read(src);
    if (content === null) { this._printLine(`cp: ${args[srci]}: No such file or directory`, 'terminal-error'); return; }
    const destNode = auraOS.fs.resolve(dest);
    if (destNode && destNode.type === 'dir') {
      const name = src.split('/').pop();
      auraOS.fs.createFile(dest, name, content);
    } else {
      const parentParts = dest.split('/').filter(Boolean);
      const fileName = parentParts.pop();
      const parentPath = '/' + parentParts.join('/');
      if (!auraOS.fs.exists(parentPath)) { this._printLine(`cp: cannot create '${args[srci+1]}'`, 'terminal-error'); return; }
      auraOS.fs.createFile(parentPath, fileName, content);
    }
    desktopManager.refresh();
  }
  // ── New Commands ──
  _cmdWhoami() {
    this._printLine('aura');
  }
  _cmdUptime() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const days = Math.floor(elapsed / 86400);
    const hrs = Math.floor((elapsed % 86400) / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days} day${days>1?'s':''}, `;
    uptimeStr += `${hrs>0?hrs+' hour'+(hrs>1?'s':'')+', ':''}${mins} minute${mins!==1?'s':''}`;
    const load = (process.uptime ? '0.00, 0.00, 0.00' : '1.23, 1.01, 0.89');
    this._printLine(`up ${uptimeStr}`);
    this._printLine(`load averages: ${load}`);
  }
  _cmdUname(args) {
    if (args.includes('-a')) {
      this._printLine('LazyOS lazyos.local 1.0.0 Browser x86_64');
    } else if (args.includes('-s')) {
      this._printLine('LazyOS');
    } else if (args.includes('-r')) {
      this._printLine('1.0.0');
    } else if (args.includes('-m')) {
      this._printLine('x86_64');
    } else {
      this._printLine('LazyOS');
    }
  }
  _cmdCal(args) {
    const now = new Date();
    let month = args[0] ? parseInt(args[0]) - 1 : now.getMonth();
    let year = args[1] ? parseInt(args[1]) : now.getFullYear();
    if (isNaN(month)) { month = now.getMonth(); year = now.getFullYear(); }
    if (month < 0) { month = 11; year--; }
    if (month > 11) { month = 0; year++; }
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const today = new Date();
    // Header
    this._printLine(`      ${monthNames[month]} ${year}`);
    this._printLine('Su Mo Tu We Th Fr Sa');
    let line = '   '.repeat(firstDay);
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      line += (isToday ? `<span style="color:var(--accent);font-weight:700;background:var(--accent-bg);border-radius:3px;padding:0 2px">${String(d).padStart(2)}</span>` : String(d).padStart(3));
      if ((firstDay + d) % 7 === 0 || d === daysInMonth) {
        this._printHTML(line);
        line = '';
      }
    }
  }
  _cmdDf() {
    const totalItems = ((n) => { let c=0; for(const k in n) c++; return c; })(auraOS.fs.root.children);
    this._printLine('Filesystem     Size   Used  Avail  Capacity  Mounted on');
    this._printLine(`lazyos        128MB  32MB   96MB    25%     /`);
    this._printLine(`dev            0MB    0MB    0MB     0%     /dev`);
    this._printLine(`/Users        128MB  32MB   96MB    25%     /Users`);
  }
  _cmdDu(args) {
    const human = args.includes('-h');
    const summary = args.includes('-s');
    const target = args.find(a => !a.startsWith('-')) || '.';
    const path = this._resolvePath(target);
    const node = auraOS.fs.resolve(path);
    if (!node) { this._printLine(`du: ${target}: No such file or directory`, 'terminal-error'); return; }
    const size = (n) => {
      if (n.type === 'file') return n.size || 0;
      let s = 0;
      for (const c of Object.values(n.children)) s += size(c);
      return s;
    };
    const bytes = size(node);
    const display = human ? formatFileSize(bytes) : bytes + 'B';
    if (summary) {
      this._printLine(`${display}\t${target}`);
    } else {
      if (node.type === 'dir') {
        for (const [name, child] of Object.entries(node.children)) {
          const s = human ? formatFileSize(size(child)) : size(child) + 'B';
          this._printLine(`${s}\t${name}`);
        }
        this._printLine(`${display}\ttotal`);
      } else {
        this._printLine(`${display}\t${target}`);
      }
    }
  }
  _cmdHead(args) {
    const nIdx = args.findIndex(a => a.startsWith('-n'));
    const n = nIdx !== -1 ? parseInt(args[nIdx+1]) || 10 : 10;
    const target = args.find(a => !a.startsWith('-'));
    if (!target) { this._printLine('usage: head [-n count] file', 'terminal-error'); return; }
    const path = this._resolvePath(target);
    const content = auraOS.fs.read(path);
    if (content === null) { this._printLine(`head: ${target}: No such file`, 'terminal-error'); return; }
    const lines = content.split('\n').slice(0, n);
    lines.forEach(l => this._printLine(l));
  }
  _cmdTail(args) {
    const nIdx = args.findIndex(a => a.startsWith('-n'));
    const n = nIdx !== -1 ? parseInt(args[nIdx+1]) || 10 : 10;
    const target = args.find(a => !a.startsWith('-'));
    if (!target) { this._printLine('usage: tail [-n count] file', 'terminal-error'); return; }
    const path = this._resolvePath(target);
    const content = auraOS.fs.read(path);
    if (content === null) { this._printLine(`tail: ${target}: No such file`, 'terminal-error'); return; }
    const lines = content.split('\n').slice(-n);
    lines.forEach(l => this._printLine(l));
  }
  _cmdSort(args) {
    const target = args.find(a => !a.startsWith('-'));
    if (!target) { this._printLine('usage: sort file', 'terminal-error'); return; }
    const path = this._resolvePath(target);
    const content = auraOS.fs.read(path);
    if (content === null) { this._printLine(`sort: ${target}: No such file`, 'terminal-error'); return; }
    const lines = content.split('\n').sort();
    lines.forEach(l => this._printLine(l));
  }
  _cmdWc(args) {
    const target = args.find(a => !a.startsWith('-'));
    if (!target) { this._printLine('usage: wc [-lwc] file', 'terminal-error'); return; }
    const path = this._resolvePath(target);
    const content = auraOS.fs.read(path);
    if (content === null) { this._printLine(`wc: ${target}: open: No such file or directory`, 'terminal-error'); return; }
    const lines = content.split('\n');
    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    const countLines = !args.includes('-w') && !args.includes('-c');
    const countWords = args.includes('-w') || !args.includes('-l');
    const countChars = args.includes('-c') || args.includes('-m');
    let out = '';
    if (countLines || (!args.includes('-w') && !args.includes('-c'))) out += `${lines.length} `.padStart(5);
    if (countWords || args.includes('-w')) out += `${words} `.padStart(5);
    if (countChars || args.includes('-c')) out += `${chars} `.padStart(6);
    out += target;
    this._printLine(out);
  }
  _cmdGrep(args) {
    const ignoreCase = args.includes('-i');
    const patternIdx = args.findIndex(a => !a.startsWith('-'));
    if (patternIdx === -1) { this._printLine('usage: grep [-i] pattern [file...]', 'terminal-error'); return; }
    const pattern = args[patternIdx];
    const targets = args.slice(patternIdx + 1);
    const regex = new RegExp(pattern, ignoreCase ? 'gi' : 'g');
    if (targets.length === 0) {
      // Search common files
      const common = ['/Projects/hello.js', '/Projects/index.html', '/Projects/style.css', '/Documents/Welcome.txt'];
      common.forEach(fpath => {
        const content = auraOS.fs.read(fpath);
        if (content) {
          content.split('\n').forEach((line, i) => {
            if (regex.test(line)) {
              this._printHTML(`<span style="color:#636">${fpath}:${i+1}:</span> ${line.replace(regex, m => `<span style="background:var(--accent-bg);color:var(--accent);font-weight:600">${m}</span>`)}`);
              regex.lastIndex = 0;
            }
          });
        }
      });
    } else {
      targets.forEach(name => {
        const path = this._resolvePath(name);
        const content = auraOS.fs.read(path);
        if (content === null) { this._printLine(`grep: ${name}: No such file`, 'terminal-error'); return; }
        content.split('\n').forEach((line, i) => {
          regex.lastIndex = 0;
          if (regex.test(line)) {
            const prefix = targets.length > 1 ? `<span style="color:#636">${name}:${i+1}:</span> ` : `<span style="color:#636">${i+1}:</span> `;
            this._printHTML(prefix + line.replace(regex, m => `<span style="background:var(--accent-bg);color:var(--accent);font-weight:600">${m}</span>`));
          }
        });
      });
    }
  }
  _cmdWhich(args) {
    if (!args[0]) { this._printLine('usage: which command ...', 'terminal-error'); return; }
    const cmds = this._getCommands();
    args.forEach(c => {
      if (cmds[c]) this._printLine(`${c}: shell built-in command`);
      else if (this.aliases[c]) this._printLine(`${c}: aliased to ${this.aliases[c]}`);
      else this._printLine(`${c} not found`);
    });
  }
  _cmdTheme(args) {
    const t = args[0];
    if (t === 'dark' || t === 'light') { themeManager.setTheme(t); this._printLine(`Theme set to ${t}`); }
    else this._printLine('Usage: theme <dark|light>', 'terminal-error');
  }
  _cmdAlias(args) {
    if (args.length === 0) {
      for (const [k,v] of Object.entries(this.aliases)) {
        this._printLine(`${k}=${v}`);
      }
      return;
    }
    const eqIdx = args[0].indexOf('=');
    if (eqIdx === -1) {
      const val = this.aliases[args[0]];
      if (val) this._printLine(`${args[0]} aliased to ${val}`);
      else this._printLine(`alias: ${args[0]} not found`, 'terminal-error');
      return;
    }
    const name = args[0].slice(0, eqIdx);
    const value = args[0].slice(eqIdx + 1).replace(/^['"]|['"]$/g, '');
    if (name && value) this.aliases[name] = value;
  }
  _cmdOpen(args) {
    if (!args[0]) { this._printLine('usage: open file ...', 'terminal-error'); return; }
    args.forEach(name => {
      const path = this._resolvePath(name);
      const node = auraOS.fs.resolve(path);
      if (!node) { this._printLine(`open: ${name}: No such file or directory`, 'terminal-error'); return; }
      if (node.type === 'dir') appManager.open('finder', { path });
      else if (name.endsWith('.js') || name.endsWith('.html') || name.endsWith('.css') || name.endsWith('.txt') || name.endsWith('.md'))
        appManager.open('code', { filePath: path });
      else appManager.open('finder', { path: this.cwd });
    });
  }
  _cmdSudo(args) {
    if (args.length === 0) {
      this._printLine('usage: sudo command');
      this._printLine('LazyOS: You already have root access. This is a demo OS 😄');
      return;
    }
    this._printLine(`Password:`);
    setTimeout(() => {
      this._printLine(`Sorry, try again.`);
      setTimeout(() => {
        this._printLine(`sudo: 3 incorrect password attempts`);
        this._printLine(`(Just kidding — LazyOS gives you full access!)`);
        // Actually run the command
        if (args.length > 0) {
          const fakeLine = args.join(' ');
          const parts = fakeLine.trim().split(/\s+/);
          const cmd = parts[0];
          if (this._getCommands()[cmd]) {
            this._printLine(`# Running "${fakeLine}" as root...`);
            this._execCmdActual(cmd, parts.slice(1));
          }
        }
      }, 500);
    }, 300);
  }
  _execCmdActual(cmd, args) {
    switch(cmd) {
      case 'ls': this._cmdLs(args); break;
      case 'cat': this._cmdCat(args); break;
      case 'rm': this._cmdRm(args); break;
      case 'mv': this._cmdMv(args); break;
      case 'cp': this._cmdCp(args); break;
      default: this._cmdHelp();
    }
  }
  _cmdPing(args) {
    if (!args[0]) { this._printLine('usage: ping host', 'terminal-error'); return; }
    const host = args[0];
    this._printLine(`PING ${host} (142.250.80.46): 56 data bytes`);
    let count = 0;
    const ping = setInterval(() => {
      if (count >= 4 || !this.terminal) { clearInterval(ping); return; }
      const ms = Math.floor(Math.random() * 80 + 10);
      this._printLine(`64 bytes from 142.250.80.46: icmp_seq=${count+1} ttl=118 time=${ms} ms`);
      count++;
    }, 400);
  }
  _cmdBanner(args) {
    if (!args.length) { this._printLine('usage: banner text ...', 'terminal-error'); return; }
    const text = args.join(' ');
    const letters = {
      A:[' █████╗ ','██╔══██╗','███████║','██╔══██║','██║  ██║'],
      B:['██████╗ ','██╔══██╗','██████╔╝','██╔══██╗','██████╔╝'],
      C:[' ██████╗','██╔════╝','██║     ','██║     ','╚██████╗'],
      D:['██████╗ ','██╔══██╗','██║  ██║','██║  ██║','██████╔╝'],
      E:['███████╗','██╔════╝','█████╗  ','██╔══╝  ','███████╗'],
      F:['███████╗','██╔════╝','█████╗  ','██╔══╝  ','██║     '],
      G:[' ██████╗','██╔════╝','██║  ███╗','██║   ██║','╚██████╔╝'],
      H:['██╗  ██╗','██║  ██║','███████║','██║  ██║','██║  ██║'],
      I:['███████╗','╚══██╔══╝','   ██║   ','   ██║   ','   ██║   '],
      J:['   ██╗  ','   ██║  ','   ██║  ','██╗██║  ','╚███╔╝  '],
      K:['██╗  ██╗','██║ ██╔╝','█████╔╝ ','██╔═██╗ ','██║  ██╗'],
      L:['██╗     ','██║     ','██║     ','██║     ','███████╗'],
      M:['███╗   ██╗','████╗  ██║','██╔██╗ ██║','██║╚██╗██║','██║ ╚████║'],
      N:['███╗   ██╗','████╗  ██║','██╔██╗ ██║','██║╚██╗██║','██║ ╚████║'],
      O:[' ██████╗','██╔═══██╗','██║   ██║','██║   ██║','╚██████╔╝'],
      P:['██████╗ ','██╔══██╗','██████╔╝','██╔═══╝ ','██║     '],
      Q:[' ██████╗','██╔═══██╗','██║   ██║','██║ ██╗██║','╚██████╔╝'],
      R:['██████╗ ','██╔══██╗','██████╔╝','██╔══██╗','██║  ██║'],
      S:[' ███████╗','██╔════╝','███████╗','╚════██║','███████║'],
      T:['████████╗','╚══██╔══╝','   ██║   ','   ██║   ','   ██║   '],
      U:['██╗   ██╗','██║   ██║','██║   ██║','██║   ██║','╚██████╔╝'],
      V:['██╗   ██╗','██║   ██║','██║   ██║','╚██╗ ██╔╝',' ╚═══╝  '],
      W:['██╗    ██╗','██║    ██║','██║ █╗ ██║','██║███╗██║','╚███╔███╔╝'],
      X:['██╗  ██╗','╚██╗██╔╝',' ╚███╔╝ ','██╔██╗ ','██╔╝ ██╗'],
      Y:['██╗   ██╗','╚██╗ ██╔╝',' ╚████╔╝ ','  ╚██╔╝  ','   ██║   '],
      Z:['███████╗','   ╚═██║','██████╔╝','╚═══██║','███████║'],
      ' ':[ '      ','      ','      ','      ','      ' ],
      '!':[' ██╗',' ╚═╝',' ██╗',' ╚═╝',' ██╗'],
      '?':['█████╗','╚═══██╗',' █████╔╝',' ╔═══╝ ',' ╚═╝  '],
    };
    const chars = text.toUpperCase().split('');
    for (let row = 0; row < 5; row++) {
      let line = '';
      chars.forEach(ch => {
        line += (letters[ch] ? letters[ch][row] : '      ');
      });
      this._printLine(line);
    }
  }
  _cmdCowsay(args) {
    const text = args.length ? args.join(' ') : 'Moo!';
    const width = Math.min(text.length, 40);
    const border = '─'.repeat(width + 2);
    this._printLine(`  ${border}`);
    this._printLine(`  │ ${text.padEnd(width)} │`);
    this._printLine(`  ${border}`);
    this._printLine(`        \\   ^__^`);
    this._printLine(`         \\  (oo)\\_______`);
    this._printLine(`            (__)\\       )\\/\\`);
    this._printLine(`                ||----w |`);
    this._printLine(`                ||     ||`);
  }
  _cmdFortune() {
    const fortunes = [
      'The best way to predict the future is to invent it. — Alan Kay',
      'Talk is cheap. Show me the code. — Linus Torvalds',
      'In theory, theory and practice are the same. In practice, they\'re not.',
      'Debugging is twice as hard as writing the code in the first place.',
      'A journey of a thousand miles begins with a single step.',
      'The only way to learn a new programming language is by writing programs in it.',
      'It works on my machine. — Every developer ever',
      'There are only two hard things in CS: cache invalidation and naming things.',
      'Code is like humor. When you have to explain it, it\'s bad.',
      'First, solve the problem. Then, write the code. — John Johnson',
      'Make it work, make it right, make it fast. — Kent Beck',
      'A good programmer is someone who always looks both ways before crossing a one-way street.',
      'The best time to plant a tree was 20 years ago. The second best time is now.',
      'Hello, world! — The first words of every programmer',
      'rm -rf / — The command that teaches you about backups',
      'A computer lets you make more mistakes faster than any other invention.',
      'The Internet? We\'ve heard of that. — Every 1990s movie',
      'I think Microsoft named .Net so it wouldn\'t show up in a Unix directory listing.',
    ];
    this._printLine(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }
  _cmdYes(args) {
    const text = args.join(' ') || 'y';
    let count = 0;
    const id = setInterval(() => {
      if (count >= 10 || !this.terminal) { clearInterval(id); return; }
      this._printLine(text);
      count++;
    }, 100);
  }
  _cmdNeofetch() {
    const lines = [
      `<span style="color:#22d3ee">                    'c.         </span>  <span style="font-weight:700">lazy@LazyOS</span>`,
      `<span style="color:#22d3ee">                 'x00k         </span>  ────────────────────`,
      `<span style="color:#22d3ee">               'x00OO0         </span>  <span style="color:#636">OS:</span> LazyOS 1.0.0`,
      `<span style="color:#22d3ee">             .k00OOOO0;        </span>  <span style="color:#636">Host:</span> Browser`,
      `<span style="color:#22d3ee">            .k00OOOOO0c        </span>  <span style="color:#636">Kernel:</span> JavaScript ES6+`,
      `<span style="color:#22d3ee">           .k00OOOOO00c        </span>  <span style="color:#636">Shell:</span> zsh-like 2.0`,
      `<span style="color:#22d3ee">          'k00OOOOOOOOc        </span>  <span style="color:#636">Resolution:</span> ${window.innerWidth}x${window.innerHeight}`,
      `<span style="color:#22d3ee">         'x00000000000c        </span>  <span style="color:#636">Theme:</span> ${themeManager.theme}`,
      `<span style="color:#22d3ee">        .x000000000000:        </span>  <span style="color:#636">Terminal:</span> LazyOS Terminal`,
      `<span style="color:#22d3ee">       .k00000O0000000;        </span>  <span style="color:#636">CPU:</span> ${navigator.hardwareConcurrency} cores`,
      `<span style="color:#22d3ee">      .k00000k  x00000l        </span>  <span style="color:#636">Memory:</span> ${performance.memory ? Math.round(performance.memory.usedJSHeapSize/1048576) + 'MB / ' + Math.round(performance.memory.jsHeapSizeLimit/1048576) + 'MB' : 'N/A'}`,
      `<span style="color:#22d3ee">     'x00000d    l00000c       </span>`,
      `<span style="color:#22d3ee">    ;x00000o      o00000x.     </span>`,
      `<span style="color:#22d3ee">   ,k00000:        :00000k,    </span>`,
      `<span style="color:#22d3ee">  'O00000;          ;00000c.   </span>`,
      `<span style="color:#22d3ee">  ....,'            ',.....    </span>`,
    ];
    lines.forEach(l => this._printHTML(l));
  }
}

// ── Browser App ────────────────────────────────────────────
class BrowserApp {
  constructor() {
    this.tabs = [];
    this.activeTab = 0;
    this.bookmarks = [
      { name:'Wikipedia', url:'https://en.m.wikipedia.org', icon:'fa-brands fa-wikipedia-w', bg:'linear-gradient(135deg,#636363,#333)' },
      { name:'MDN Docs', url:'https://developer.mozilla.org', icon:'fa-solid fa-book', bg:'linear-gradient(135deg,#1a1a2e,#16213e)' },
      { name:'GitHub', url:'https://github.com', icon:'fa-brands fa-github', bg:'linear-gradient(135deg,#333,#111)' },
      { name:'Hacker News', url:'https://news.ycombinator.com', icon:'fa-brands fa-hacker-news', bg:'linear-gradient(135deg,#f0652f,#c44d20)' },
    ];
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Browser', width:900, height:580, appId:'browser' });
    this.body = this.wid.body;
    this.tabs = [{ id:uid(), title:'New Tab', url:'', isNewTab:true }];
    this.activeTab = 0;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'browser-container' });
    const tabBar = el('div', { class:'code-tabs', style:{borderBottom:'1px solid var(--divider)', background:'var(--glass)'} });
    this.tabs.forEach((tab, i) => {
      tabBar.appendChild(el('div', {
        class:'code-tab' + (i === this.activeTab ? ' active' : ''),
        onClick:() => { this.activeTab = i; this.render(); },
      }, [
        el('span', { text:tab.title }),
        el('button', { class:'tab-close', 'aria-label':'Close tab', onClick:(e) => { e.stopPropagation(); this._closeTab(i); } }, [el('i', { class:'fa-solid fa-xmark' })]),
      ]));
    });
    tabBar.appendChild(el('div', {
      class:'code-tab', style:{opacity:0.5, minWidth:'32px', justifyContent:'center'},
      onClick:() => this._newTab(),
      html:'<i class="fa-solid fa-plus" style="font-size:11px"></i>',
    }));
    container.appendChild(tabBar);
    const toolbar = el('div', { class:'browser-toolbar' });
    toolbar.appendChild(el('button', { class:'browser-nav-btn', 'aria-label':'Back', onClick:() => this._goBack(), html:'<i class="fa-solid fa-chevron-left"></i>' }));
    toolbar.appendChild(el('button', { class:'browser-nav-btn', 'aria-label':'Forward', onClick:() => {}, html:'<i class="fa-solid fa-chevron-right"></i>' }));
    toolbar.appendChild(el('button', { class:'browser-nav-btn', 'aria-label':'Reload', onClick:() => this._reload(), html:'<i class="fa-solid fa-rotate-right"></i>' }));
    const urlBar = el('input', { class:'browser-url-bar', value:this.tabs[this.activeTab]?.url || '', placeholder:'Enter URL...', 'aria-label':'Address bar' });
    urlBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this._navigate(urlBar.value);
    });
    toolbar.appendChild(urlBar);
    container.appendChild(toolbar);
    container.appendChild(el('div', { class:'browser-hint', text:'Some sites block embedding in iframes for security reasons — if a page stays blank, that\'s why.' }));
    const content = el('div', { class:'browser-content' });
    const tab = this.tabs[this.activeTab];
    if (tab?.isNewTab) {
      content.appendChild(el('div', { class:'browser-newtab' }, [
        el('h2', { text:'New Tab' }),
        el('input', { class:'browser-newtab-search', placeholder:'Search the web...', 'aria-label':'Search',
          onKeyDown:(e) => {
            if (e.key==='Enter' && e.target.value) {
              const q = encodeURIComponent(e.target.value);
              this._navigate('https://www.google.com/search?igu=1&q='+q);
            }
          },
        }),
        el('div', { class:'browser-bookmarks' },
          this.bookmarks.map(b => el('div', { class:'browser-bookmark', onClick:() => this._navigate(b.url) }, [
            el('div', { class:'browser-bookmark-icon', style:{background:b.bg}, html:`<i class="${b.icon}"></i>` }),
            el('span', { text:b.name }),
          ]))
        ),
      ]));
    } else if (tab?.url) {
      const iframe = el('iframe', {
        src:tab.url,
        sandbox:'allow-same-origin allow-scripts allow-forms allow-popups',
        loading:'lazy',
      });
      let loadTimer = setTimeout(() => {
        // If iframe hasn't loaded in 8s, show fallback
        if (!iframe.contentDocument || !iframe.contentDocument.body) {
          this._showBlockedFallback(content, tab.url);
        }
      }, 8000);
      iframe.addEventListener('load', () => {
        clearTimeout(loadTimer);
        try {
          const title = iframe.contentDocument?.title;
          if (title) wm.setTitle(this.wid.id, 'Browser — ' + title);
        } catch(e) {
          // Cross-origin - show fallback
          this._showBlockedFallback(content, tab.url);
        }
      });
      iframe.addEventListener('error', () => {
        clearTimeout(loadTimer);
        this._showBlockedFallback(content, tab.url);
      });
      content.appendChild(iframe);
    }
    container.appendChild(content);
    this.body.appendChild(container);
  }
  _showBlockedFallback(container, url) {
    if (container.querySelector('.browser-blocked')) return;
    const iframe = container.querySelector('iframe');
    if (iframe) iframe.style.display = 'none';
    container.appendChild(el('div', { class:'browser-blocked' }, [
      el('i', { class:'fa-solid fa-shield-halved', style:{fontSize:'32px',color:'var(--text-tertiary)'} }),
      el('div', { style:{fontSize:'14px',fontWeight:'600',marginTop:'8px'}, text:'This site cannot be embedded' }),
      el('div', { style:{fontSize:'12px',color:'var(--text-secondary)',marginTop:'4px',maxWidth:'300px',lineHeight:'1.5'}, text:'The website blocks embedding in iframes for security reasons.' }),
      el('button', {
        style:{
          marginTop:'12px',padding:'8px 20px',background:'var(--accent)',color:'#fff',
          border:'none',borderRadius:'var(--radius-md)',fontSize:'13px',fontWeight:'500',
          cursor:'pointer'
        },
        onClick:() => window.open(url, '_blank'),
        text:'Open in New Tab',
      }),
    ]));
  }
  _navigate(url) {
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    this.tabs[this.activeTab] = { id:uid(), title:url, url, isNewTab:false };
    wm.setTitle(this.wid.id, 'Browser — ' + url);
    this.render();
  }
  _newTab() {
    this.tabs.push({ id:uid(), title:'New Tab', url:'', isNewTab:true });
    this.activeTab = this.tabs.length - 1;
    this.render();
  }
  _closeTab(idx) {
    if (this.tabs.length <= 1) { wm.close(this.wid.id); return; }
    this.tabs.splice(idx, 1);
    if (this.activeTab >= this.tabs.length) this.activeTab = this.tabs.length - 1;
    this.render();
  }
  _goBack() {
    const tab = this.tabs[this.activeTab];
    if (tab && !tab.isNewTab) { tab.isNewTab = true; tab.url = ''; tab.title = 'New Tab'; this.render(); }
  }
  _reload() {
    const tab = this.tabs[this.activeTab];
    if (tab?.url) this.render();
  }
}

// ── Notes App (notes persist for the session via a shared store) ──
let sharedNotesStore = null;
class NotesApp {
  constructor() {
    this.activeNote = null;
    this.loadNotes();
  }
  loadNotes() {
    if (!sharedNotesStore) {
      sharedNotesStore = [
        { id:uid(), title:'Getting Started', content:'Welcome to LazyOS Notes!\n\nStart typing to create your first note.', modified:Date.now() },
        { id:uid(), title:'Quick Tips', content:'- Click + to create a new note\n- Notes are auto-saved for this session\n- Use the toolbar for formatting', modified:Date.now()-1000 },
      ];
    }
    this.notes = sharedNotesStore;
  }
  saveNotes() { /* notes live in the shared in-memory store already */ }
  launch(opts={}) {
    this.wid = wm.create({ title:'Notes', width:680, height:460, appId:'notes' });
    this.body = this.wid.body;
    if (this.notes.length > 0) this.activeNote = this.notes[0].id;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'notes-container' });
    const sidebar = el('div', { class:'notes-sidebar' });
    sidebar.appendChild(el('div', { class:'notes-sidebar-header' }, [
      el('span', { text:'Notes' }),
      el('button', { class:'notes-toolbar-btn', 'aria-label':'New note', onClick:() => this._newNote(), html:'<i class="fa-solid fa-plus"></i>' }),
    ]));
    const list = el('div', { class:'notes-list' });
    this.notes.forEach(n => {
      list.appendChild(el('div', {
        class:'note-list-item' + (n.id === this.activeNote ? ' active' : ''),
        onClick:() => { this.activeNote = n.id; this.render(); },
      }, [
        el('div', { class:'note-item-title', text:n.title || 'Untitled' }),
        el('div', { class:'note-item-preview', text:(n.content || '').split('\n')[0].slice(0,50) }),
        el('div', { class:'note-item-date', text:new Date(n.modified).toLocaleDateString() }),
      ]));
    });
    sidebar.appendChild(list);
    container.appendChild(sidebar);
    const note = this.notes.find(n => n.id === this.activeNote);
    if (note) {
      const editor = el('div', { class:'notes-editor' });
      const toolbar = el('div', { class:'notes-editor-toolbar' });
      [
        { icon:'fa-solid fa-bold', cmd:'bold' },
        { icon:'fa-solid fa-italic', cmd:'italic' },
        { icon:'fa-solid fa-underline', cmd:'underline' },
        { icon:'fa-solid fa-strikethrough', cmd:'strikeThrough' },
        '---',
        { icon:'fa-solid fa-list-ul', cmd:'insertUnorderedList' },
        { icon:'fa-solid fa-list-ol', cmd:'insertOrderedList' },
      ].forEach(btn => {
        if (btn === '---') { toolbar.appendChild(el('div', { style:{width:'1px',height:'20px',background:'var(--divider)',margin:'0 4px'} })); return; }
        toolbar.appendChild(el('button', {
          class:'notes-toolbar-btn', 'aria-label':btn.cmd,
          html:`<i class="${btn.icon}"></i>`,
          onClick:() => document.execCommand(btn.cmd, false, null),
        }));
      });
      editor.appendChild(toolbar);
      const area = el('div', {
        class:'notes-editor-area', contenteditable:'true',
        'aria-label':'Note content',
        onInput:() => {
          note.content = area.innerText;
          note.title = area.innerText.split('\n')[0].slice(0,50) || 'Untitled';
          note.modified = Date.now();
          wm.setTitle(this.wid.id, 'Notes — ' + note.title);
          const listItem = list.querySelector(`.note-list-item:nth-child(${this.notes.indexOf(note)+1})`);
          if (listItem) {
            listItem.querySelector('.note-item-title').textContent = note.title;
            listItem.querySelector('.note-item-preview').textContent = note.content.split('\n').slice(1).join(' ').slice(0,50);
            listItem.querySelector('.note-item-date').textContent = new Date(note.modified).toLocaleDateString();
          }
        },
      });
      area.innerText = note.content;
      editor.appendChild(area);
      container.appendChild(editor);
    } else {
      container.appendChild(el('div', { class:'notes-empty', text:'Select a note or create a new one' }));
    }
    this.body.appendChild(container);
  }
  _newNote() {
    const n = { id:uid(), title:'New Note', content:'', modified:Date.now() };
    this.notes.unshift(n);
    this.activeNote = n.id;
    this.render();
    setTimeout(() => { const area = this.body.querySelector('.notes-editor-area'); if (area) area.focus(); }, 50);
  }
}

// ── Calculator App ─────────────────────────────────────────
class CalculatorApp {
  constructor() {
    this.display = '0';
    this.expression = '';
    this.prevResult = null;
    this.newNumber = true;
    this.mode = 'standard';
    this.history = [];
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Calculator', width:320, height:480, appId:'calculator' });
    this.body = this.wid.body;
    this.display = '0'; this.expression = ''; this.newNumber = true;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'calc-container' });
    container.appendChild(el('div', { class:'calc-display' }, [
      el('div', { class:'calc-expression', text:this.expression }),
      el('div', { class:'calc-result', text:this.display }),
    ]));
    const modeToggle = el('div', { class:'calc-mode-toggle' });
    modeToggle.appendChild(el('button', { class:'calc-mode-btn'+(this.mode==='standard'?' active':''), text:'Standard', onClick:() => { this.mode='standard'; this.render(); } }));
    modeToggle.appendChild(el('button', { class:'calc-mode-btn'+(this.mode==='scientific'?' active':''), text:'Scientific', onClick:() => { this.mode='scientific'; this.render(); } }));
    container.appendChild(modeToggle);
    const grid = el('div', { class:'calc-buttons ' + this.mode });
    const stdBtns = [
      { t:'AC', cls:'clear', fn:() => { this.display='0'; this.expression=''; this.newNumber=true; this._updateDisplay(); } },
      { t:'±', cls:'fn', fn:() => this._negate() }, { t:'%', cls:'fn', fn:() => this._percent() }, { t:'÷', cls:'op', fn:() => this._op('/') },
      { t:'7' }, { t:'8' }, { t:'9' }, { t:'×', cls:'op', fn:() => this._op('*') },
      { t:'4' }, { t:'5' }, { t:'6' }, { t:'−', cls:'op', fn:() => this._op('-') },
      { t:'1' }, { t:'2' }, { t:'3' }, { t:'+', cls:'op', fn:() => this._op('+') },
      { t:'0', span:2 }, { t:'.' }, { t:'=', cls:'equals', fn:() => this._equals() },
    ];
    const sciBtns = [
      { t:'AC', cls:'clear', fn:() => { this.display='0'; this.expression=''; this.newNumber=true; this._updateDisplay(); } },
      { t:'(', cls:'fn', fn:() => this._input('(') }, { t:')', cls:'fn', fn:() => this._input(')') }, { t:'mc', cls:'fn' }, { t:'mr', cls:'fn' },
      { t:'sin', cls:'fn', fn:() => this._sciFunc('sin') }, { t:'7' }, { t:'8' }, { t:'9' }, { t:'÷', cls:'op', fn:() => this._op('/') },
      { t:'cos', cls:'fn', fn:() => this._sciFunc('cos') }, { t:'4' }, { t:'5' }, { t:'6' }, { t:'×', cls:'op', fn:() => this._op('*') },
      { t:'tan', cls:'fn', fn:() => this._sciFunc('tan') }, { t:'1' }, { t:'2' }, { t:'3' }, { t:'−', cls:'op', fn:() => this._op('-') },
      { t:'log', cls:'fn', fn:() => this._sciFunc('log') }, { t:'0' }, { t:'.' }, { t:'π', cls:'fn', fn:() => { this.display = String(Math.PI); this.newNumber = true; this._updateDisplay(); } }, { t:'+', cls:'op', fn:() => this._op('+') },
      { t:'ln', cls:'fn', fn:() => this._sciFunc('ln') }, { t:'√', cls:'fn', fn:() => this._sciFunc('sqrt') }, { t:'x²', cls:'fn', fn:() => this._sciFunc('sq') }, { t:'xʸ', cls:'fn', fn:() => this._op('**') }, { t:'=', cls:'equals', fn:() => this._equals() },
    ];
    const btns = this.mode === 'standard' ? stdBtns : sciBtns;
    btns.forEach(b => {
      const btn = el('button', {
        class:'calc-btn ' + (b.cls || ''),
        text:b.t,
        style: b.span ? { gridColumn:`span ${b.span}` } : {},
        onClick:() => { if (b.fn) b.fn(); else this._input(b.t); },
      });
      grid.appendChild(btn);
    });
    container.appendChild(grid);
    this.body.appendChild(container);
  }
  _updateDisplay() {
    const resultEl = this.body.querySelector('.calc-result');
    if (resultEl) resultEl.textContent = this.display;
    const exprEl = this.body.querySelector('.calc-expression');
    if (exprEl) exprEl.textContent = this.expression;
  }
  _input(ch) {
    if (this.newNumber && ch !== '.') { this.display = ch; this.newNumber = false; }
    else {
      if (ch === '.' && this.display.includes('.')) return;
      this.display += ch;
    }
    this._updateDisplay();
  }
  _op(op) {
    this.expression += this.display + ' ' + op + ' ';
    this.newNumber = true;
    this._updateDisplay();
  }
  _equals() {
    const expr = this.expression + this.display;
    try {
      const sanitized = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
      if (!/^[\d\s+\-*/.()%]*$/.test(sanitized.replace(/\*\*/g,''))) throw new Error('invalid');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      this.history.push({ expr, result: String(result) });
      this.expression = '';
      this.display = String(parseFloat(Number(result).toFixed(10)));
      this.newNumber = true;
    } catch {
      this.display = 'Error';
      this.expression = '';
      this.newNumber = true;
    }
    this._updateDisplay();
  }
  _negate() { if (this.display !== '0') this.display = this.display.startsWith('-') ? this.display.slice(1) : '-'+this.display; this._updateDisplay(); }
  _percent() { this.display = String(parseFloat(this.display) / 100); this._updateDisplay(); }
  _sciFunc(fn) {
    const v = parseFloat(this.display);
    switch(fn) {
      case 'sin': this.display = String(Math.sin(v * Math.PI / 180).toFixed(8)); break;
      case 'cos': this.display = String(Math.cos(v * Math.PI / 180).toFixed(8)); break;
      case 'tan': this.display = String(Math.tan(v * Math.PI / 180).toFixed(8)); break;
      case 'log': this.display = String(Math.log10(v).toFixed(8)); break;
      case 'ln': this.display = String(Math.log(v).toFixed(8)); break;
      case 'sqrt': this.display = String(Math.sqrt(v).toFixed(8)); break;
      case 'sq': this.display = String((v*v).toFixed(8)); break;
    }
    this.newNumber = true;
    this._updateDisplay();
  }
}

// ── Music App (Real Audio Player) ─────────────────────────
class MusicApp {
  constructor() {
    this.playlist = [];
    this.currentIdx = -1;
    this.audio = null;
    this.audioCtx = null;
    this.currentSource = null;
    this.currentBuffer = null;
    this.isPlaying = false;
    this.paused = false;
    this.duration = 0;
    this.currentTime = 0;
    this.volume = 0.8;
    this.repeatMode = 'off';
    this.progressRaf = null;
    this.pauseOffset = 0;
    this._initDemoTracks();
  }
  _initDemoTracks() {
    const now = Date.now();
    this.playlist = [
      { id:uid(), title:'Aurora Pulse', artist:'Luna Echo', duration:'3:24', src:'demo1', added:now-86400000*3, art:'linear-gradient(135deg,#8b5cf6,#ec4899)' },
      { id:uid(), title:'Midnight Drive', artist:'Nova Lane', duration:'4:12', src:'demo2', added:now-86400000*2, art:'linear-gradient(135deg,#0f766e,#22d3ee)' },
      { id:uid(), title:'Velvet Orbit', artist:'Cosmos', duration:'5:08', src:'demo3', added:now-86400000, art:'linear-gradient(135deg,#f97316,#facc15)' },
      { id:uid(), title:'City Bloom', artist:'Kairo', duration:'2:56', src:'demo4', added:now, art:'linear-gradient(135deg,#ef4444,#fb923c)' },
    ];
    this._generateDemoAudio();
  }
  _generateDemoAudio() {
    this.demoBuffers = {};
    const demos = {
      demo1: { notes:[262,294,330,349,392,440,494,523], bpm:82, wave:'sine' },
      demo2: { notes:[220,277,330,440,554,660], bpm:118, wave:'sawtooth' },
      demo3: { notes:[130,196,262,349,392,523], bpm:68, wave:'sine' },
      demo4: { notes:[262,330,392,523,659,784], bpm:96, wave:'triangle' },
    };
    try {
      const ctx = this._ensureAudioCtx();
      Object.entries(demos).forEach(([id, d]) => {
        const sr = ctx.sampleRate;
        const beatLen = 60 / d.bpm;
        const totalBeats = 16;
        const len = sr * beatLen * totalBeats;
        const buffer = ctx.createBuffer(2, len, sr);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        for (let i = 0; i < len; i++) {
          const t = i / sr;
          const beatIdx = Math.floor(t / beatLen) % d.notes.length;
          const note = d.notes[beatIdx];
          const localT = (t % beatLen) / beatLen;
          const env = Math.max(0, 1 - localT * 1.7) * Math.min(1, localT * 9);
          const melody = Math.sin(2 * Math.PI * note * t) * 0.22;
          const bass = Math.sin(2 * Math.PI * (note / 2) * t) * 0.14 * (beatIdx % 2 === 0 ? 1 : 0.45);
          const noise = ((Math.random() - 0.5) * 2) * 0.02 * ((i / sr) % 0.08 < 0.015 ? 1 : 0);
          left[i] = (melody + bass + noise) * env;
          right[i] = (melody * 0.7 + bass * 0.5 + noise * 0.6) * env;
        }
        this.demoBuffers[id] = buffer;
      });
    } catch (e) {}
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Music', width:700, height:520, appId:'music' });
    this.body = this.wid.body;
    this._ensureAudioCtx();
    this.render();
  }
  _ensureAudioCtx() {
    if (!this.audioCtx) {
      try { this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
    return this.audioCtx;
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'music-container' });
    const nowPlaying = this.currentIdx >= 0 ? this.playlist[this.currentIdx] : null;
    container.appendChild(el('div', { class:'music-hero' }, [
      el('div', { class:'music-hero-art', style:{background: nowPlaying?.art || 'linear-gradient(135deg,#4f46e5,#22d3ee)'} }, [
        el('i', { class:'fa-solid fa-music', style:{fontSize:'24px', color:'#fff'} }),
      ]),
      el('div', { class:'music-hero-info' }, [
        el('div', { class:'music-hero-title', text: nowPlaying ? nowPlaying.title : 'Pick a track' }),
        el('div', { class:'music-hero-subtitle', text: nowPlaying ? nowPlaying.artist : 'Built-in studio mix' }),
        el('div', { class:'music-status-pill', text: this.isPlaying ? 'Playing' : this.paused ? 'Paused' : 'Ready' }),
      ]),
      el('button', { class:'music-btn', html:'<i class="fa-solid fa-shuffle"></i>', title:'Shuffle', onClick:() => this._shuffle() }),
    ]));
    this.fileInput = el('input', { type:'file', accept:'audio/*', multiple:true, style:{display:'none'}, onChange:(e) => this._handleFiles(e.target.files) });
    container.appendChild(this.fileInput);
    const list = el('div', { class:'music-track-list' });
    if (this.playlist.length === 0) {
      list.innerHTML = '<div class="music-empty"><i class="fa-solid fa-music"></i><span>No tracks. Click + to add music.</span></div>';
    } else {
      this.playlist.forEach((track, i) => {
        list.appendChild(el('div', {
          class:'music-track' + (i === this.currentIdx ? ' active' : ''),
          onClick:() => this._play(i),
        }, [
          el('div', { class:'music-track-icon', style:{background: track.art || 'linear-gradient(135deg,#4f46e5,#22d3ee)'} }, [
            el('i', { class:'fa-solid fa-music', style:{fontSize:'12px', color:'#fff'} }),
          ]),
          el('div', { class:'music-track-info' }, [
            el('div', { class:'music-track-title', text:track.title }),
            el('div', { class:'music-track-artist', text:track.artist }),
          ]),
          el('div', { class:'music-track-dur', text:track.duration }),
        ]));
      });
    }
    container.appendChild(list);
    const controls = el('div', { class:'music-controls' });
    const progRow = el('div', { class:'music-progress-row' });
    progRow.appendChild(el('span', { class:'music-time', text:this._fmtTime(this.currentTime) }));
    this.progEl = el('input', { type:'range', class:'music-progress', min:0, max:100, value: this.duration ? (this.currentTime / this.duration) * 100 : 0, onInput:(e) => this._seek(e.target.value) });
    progRow.appendChild(this.progEl);
    this.timeEl = el('span', { class:'music-time', text:this._fmtTime(this.duration) });
    progRow.appendChild(this.timeEl);
    controls.appendChild(progRow);
    const btnRow = el('div', { class:'music-btn-row' });
    btnRow.appendChild(el('button', { class:'music-ctrl-btn', html:'<i class="fa-solid fa-backward-step"></i>', onClick:() => this._prev() }));
    btnRow.appendChild(el('button', { class:'music-ctrl-btn music-play-btn', html:`<i class="fa-solid ${this.isPlaying ? 'fa-pause' : 'fa-play'}"></i>`, onClick:() => this._togglePlay() }));
    btnRow.appendChild(el('button', { class:'music-ctrl-btn', html:'<i class="fa-solid fa-stop"></i>', onClick:() => this._stop() }));
    btnRow.appendChild(el('button', { class:'music-ctrl-btn', html:'<i class="fa-solid fa-forward-step"></i>', onClick:() => this._next() }));
    btnRow.appendChild(el('div', { class:'music-volume-wrap' }, [
      el('i', { class:'fa-solid fa-volume-high' }),
      el('input', { type:'range', class:'music-volume', min:0, max:100, value:this.volume * 100, onInput:(e) => { this.volume = e.target.value / 100; if (this.audio) this.audio.volume = this.volume; if (this.currentGain) this.currentGain.gain.value = this.volume; } }),
    ]));
    controls.appendChild(btnRow);
    container.appendChild(controls);
    this.body.appendChild(container);
    if (this.currentIdx < 0 && this.playlist.length > 0) this._play(0);
  }
  _play(idx) {
    if (idx < 0 || idx >= this.playlist.length) return;
    this._ensureAudioCtx();
    this.currentIdx = idx;
    this._stopPlayback();
    const track = this.playlist[idx];
    if (track.src.startsWith('demo') && this.demoBuffers[track.src]) {
      this._playBuffer(this.demoBuffers[track.src], 0);
    } else if (track.src.startsWith('blob:')) {
      this.audio = new Audio(track.src);
      this.audio.volume = this.volume;
      this.audio.play().catch(() => {});
      this._attachAudioEvents();
    }
    this.paused = false;
    this.render();
  }
  _clearProgressLoop() {
    if (this.progressRaf) {
      cancelAnimationFrame(this.progressRaf);
      this.progressRaf = null;
    }
  }
  _playBuffer(buffer, offset=0) {
    if (!this.audioCtx) return;
    this.currentBuffer = buffer;
    this.duration = buffer.duration;
    this.pauseOffset = offset;
    this.currentTime = offset;
    this._clearProgressLoop();
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
    }
    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    const gain = this.audioCtx.createGain();
    gain.gain.value = this.volume;
    source.connect(gain);
    gain.connect(this.audioCtx.destination);
    this.currentSource = source;
    this.currentGain = gain;
    source.start(0, offset);
    this.startTime = this.audioCtx.currentTime - offset;
    this.isPlaying = true;
    this.paused = false;
    this._startProgressLoop();
    source.onended = () => {
      this.isPlaying = false;
      this.paused = false;
      this.currentTime = 0;
      this.pauseOffset = 0;
      this._clearProgressLoop();
      this._next();
    };
  }
  _startProgressLoop() {
    this._clearProgressLoop();
    const step = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      if (this.currentSource && this.currentBuffer) {
        const elapsed = this.audioCtx.currentTime - this.startTime;
        this.currentTime = Math.min(elapsed, this.currentBuffer.duration);
        this._syncProgressUi();
        if (this.currentTime >= this.currentBuffer.duration) {
          this._clearProgressLoop();
          this._next();
          return;
        }
        this.progressRaf = requestAnimationFrame(step);
      } else if (this.audio && !this.audio.paused) {
        this.currentTime = this.audio.currentTime;
        this._syncProgressUi();
        this.progressRaf = requestAnimationFrame(step);
      }
    };
    this.progressRaf = requestAnimationFrame(step);
  }
  _syncProgressUi() {
    if (this.progEl) this.progEl.value = this.duration ? (this.currentTime / this.duration) * 100 : 0;
    if (this.timeEl) this.timeEl.textContent = this._fmtTime(this.currentTime);
    if (this.currentIdx >= 0 && this.playlist[this.currentIdx]) {
      const now = this.playlist[this.currentIdx];
      const totalEl = document.getElementById('music-dur');
      if (totalEl) totalEl.textContent = this._fmtTime(this.duration || 0);
    }
  }
  _attachAudioEvents() {
    if (!this.audio) return;
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this._syncProgressUi();
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this._syncProgressUi();
    });
    this.audio.addEventListener('ended', () => this._next());
  }
  _togglePlay() {
    if (this.currentIdx < 0 && this.playlist.length > 0) { this._play(0); return; }
    if (this.currentSource && this.audioCtx) {
      if (this.isPlaying) {
        this.pauseOffset = this.currentTime;
        try { this.currentSource.stop(); } catch (e) {}
        this.currentSource = null;
        this.isPlaying = false;
        this.paused = true;
      } else {
        this._playBuffer(this.currentBuffer, this.pauseOffset);
      }
    } else if (this.audio) {
      if (this.isPlaying) { this.audio.pause(); this.isPlaying = false; this.paused = true; }
      else { this.audio.play().catch(() => {}); this.isPlaying = true; this.paused = false; }
    } else if (this.currentBuffer) {
      this._playBuffer(this.currentBuffer, this.pauseOffset);
    }
    this.render();
  }
  _stop() {
    this._stopPlayback(true);
    this.render();
  }
  _stopPlayback(reset=false) {
    this._clearProgressLoop();
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch (e) {}
      this.currentSource = null;
      this.currentGain = null;
    }
    if (this.audio) {
      this.audio.pause();
      if (reset) this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.paused = false;
    if (reset) {
      this.currentTime = 0;
      this.pauseOffset = 0;
    }
    this.currentBuffer = reset ? null : this.currentBuffer;
  }
  _prev() {
    if (this.currentIdx > 0) this._play(this.currentIdx - 1);
    else this._play(this.playlist.length - 1);
  }
  _next() {
    if (this.repeatMode === 'one') this._play(this.currentIdx);
    else if (this.currentIdx < this.playlist.length - 1) this._play(this.currentIdx + 1);
    else this._play(0);
  }
  _seek(val) {
    const pct = parseFloat(val) / 100;
    if (this.audio && this.audio.duration) {
      this.audio.currentTime = pct * this.audio.duration;
      this.currentTime = this.audio.currentTime;
      this._syncProgressUi();
    } else if (this.audioCtx && this.currentBuffer) {
      const target = pct * this.currentBuffer.duration;
      this._playBuffer(this.currentBuffer, target);
    }
  }
  _importFile() { this.fileInput?.click(); }
  _handleFiles(files) {
    for (const f of files) {
      const url = URL.createObjectURL(f);
      const name = f.name.replace(/\.[^.]+$/, '');
      this.playlist.push({ id:uid(), title:name, artist:'Local File', duration:'—', src:url, added:Date.now(), art:'linear-gradient(135deg,#6366f1,#14b8a6)' });
    }
    this.render();
    if (this.currentIdx < 0) this._play(0);
  }
  _shuffle() {
    for (let i = this.playlist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
    }
    this.currentIdx = -1;
    this.render();
  }
  _fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }
}

// ── Photos App (Image Viewer) ─────────────────────────────
class PhotosApp {
  constructor() {
    this.images = [];
    this.currentIdx = -1;
    this._loadDemoImages();
  }
  _loadDemoImages() {
    const gallery = [
      { name:'Aurora Drift', svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#07131f"/><path fill="#142f4a" d="M0 530 C180 470 260 430 430 470 C610 510 760 420 960 430 C1040 434 1110 450 1200 490 V800 H0 Z"/><path fill="#2cb5ff" opacity="0.7" d="M0 380 C220 300 400 280 620 330 C820 380 1030 410 1200 350 V800 H0 Z"/><circle cx="900" cy="250" r="120" fill="#fbbf24" opacity="0.9"/></svg>' },
      { name:'Canyon Glow', svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#140b0c"/><path fill="#4c2a1b" d="M0 560 L220 340 L360 460 L520 300 L690 530 L890 250 L1200 500 V800 H0 Z"/><path fill="#d97706" opacity="0.8" d="M0 620 L240 430 L370 520 L560 360 L740 580 L950 350 L1200 620 V800 H0 Z"/></svg>' },
      { name:'Bloom Field', svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#0f172a"/><path fill="#14532d" d="M0 520 C180 480 320 470 460 500 C590 530 760 600 910 560 C1040 530 1120 500 1200 470 V800 H0 Z"/><path fill="#4ade80" opacity="0.65" d="M0 460 C160 420 300 410 470 440 C620 468 860 530 1200 440 V800 H0 Z"/><circle cx="300" cy="250" r="90" fill="#fde68a" opacity="0.9"/><circle cx="900" cy="220" r="110" fill="#f9a8d4" opacity="0.8"/></svg>' },
      { name:'Neon Coast', svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#020617"/><rect y="560" width="1200" height="240" fill="#0f172a"/><path fill="#1d4ed8" opacity="0.8" d="M0 600 C180 540 320 530 470 560 C620 590 790 640 1040 580 C1110 566 1160 560 1200 558 V800 H0 Z"/><path fill="#38bdf8" opacity="0.7" d="M0 520 C180 470 340 470 520 500 C660 524 840 590 1200 470 V800 H0 Z"/><circle cx="860" cy="220" r="120" fill="#f472b6" opacity="0.8"/></svg>' },
    ];
    this.images = gallery.map((item, i) => ({
      id: uid(), name: item.name, src: createSvgDataUri(item.svg), gradient: null, width: 1200, height: 800,
      added: Date.now() - i * 86400000,
    }));
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Photos', width:720, height:520, appId:'photos' });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'photos-container' });
    container.appendChild(el('div', { class:'photos-header' }, [
      el('span', { style:{fontWeight:700,fontSize:'14px'}, text:'Photos' }),
      el('button', { class:'photos-import-btn', html:'<i class="fa-solid fa-plus"></i> Import', onClick:() => this._importImages() }),
    ]));
    this.fileInput = el('input', { type:'file', accept:'image/*', multiple:true, style:{display:'none'}, onChange:(e) => this._handleFiles(e.target.files) });
    container.appendChild(this.fileInput);
    const grid = el('div', { class:'photos-grid' });
    if (this.images.length === 0) {
      grid.innerHTML = '<div class="photos-empty">No photos yet. Click Import to add images.</div>';
    } else {
      this.images.forEach((img, i) => {
        const card = el('div', { class:'photos-card', onClick:() => this._viewImage(i) }, [
          el('div', { class:'photos-thumb', style:{backgroundImage: `url(${img.src})`, backgroundSize:'cover', backgroundPosition:'center'} }),
          el('div', { class:'photos-card-name', text:img.name }),
        ]);
        grid.appendChild(card);
      });
    }
    container.appendChild(grid);
    this.body.appendChild(container);
  }
  _viewImage(idx) {
    if (idx < 0 || idx >= this.images.length) return;
    this.currentIdx = idx;
    const img = this.images[idx];
    this.body.innerHTML = '';
    const viewer = el('div', { class:'photos-viewer' });
    const topBar = el('div', { class:'photos-viewer-top' }, [
      el('button', { class:'photos-nav-btn', html:'<i class="fa-solid fa-arrow-left"></i>', onClick:() => this.render() }),
      el('span', { style:{fontWeight:600}, text:img.name }),
      el('div', { style:{display:'flex',gap:'8px'} }, [
        el('button', { class:'photos-nav-btn', html:'<i class="fa-solid fa-image"></i> Use as wallpaper', onClick:() => { themeManager.setWallpaperImage(img.src); } }),
        el('button', { class:'photos-nav-btn', html:'<i class="fa-solid fa-trash"></i>', onClick:() => { this.images.splice(idx,1); this.render(); } }),
      ]),
    ]);
    viewer.appendChild(topBar);
    const imgArea = el('div', { class:'photos-viewer-img' });
    imgArea.appendChild(el('img', { src:img.src, style:{maxWidth:'100%',maxHeight:'100%',objectFit:'cover',borderRadius:'16px',boxShadow:'0 14px 40px rgba(0,0,0,0.2)'} }));
    viewer.appendChild(imgArea);
    const navRow = el('div', { class:'photos-viewer-nav' });
    navRow.appendChild(el('button', { class:'photos-nav-btn'+(idx<=0?' disabled':''), html:'<i class="fa-solid fa-chevron-left"></i> Previous', onClick:() => idx>0 && this._viewImage(idx-1) }));
    navRow.appendChild(el('span', { style:{fontSize:'12px',color:'var(--text-tertiary)'}, text:`${idx+1} of ${this.images.length}` }));
    navRow.appendChild(el('button', { class:'photos-nav-btn'+(idx>=this.images.length-1?' disabled':''), html:'Next <i class="fa-solid fa-chevron-right"></i>', onClick:() => idx<this.images.length-1 && this._viewImage(idx+1) }));
    viewer.appendChild(navRow);
    this.body.appendChild(viewer);
  }
  _importImages() { this.fileInput?.click(); }
  _handleFiles(files) {
    for (const f of files) {
      const url = URL.createObjectURL(f);
      this.images.push({ id:uid(), name:f.name, src:url, gradient:null, width:0, height:0, added:Date.now() });
    }
    this.render();
  }
}

// ── Weather App ────────────────────────────────────────────
class WeatherApp {
  constructor() {
    this.locations = [
      { name:'New York', temp:22, cond:'Partly Cloudy', icon:'fa-solid fa-cloud-sun', high:26, low:18, humidity:58, wind:'12 km/h' },
      { name:'London', temp:15, cond:'Light Rain', icon:'fa-solid fa-cloud-rain', high:17, low:12, humidity:72, wind:'18 km/h' },
      { name:'Tokyo', temp:28, cond:'Clear Sky', icon:'fa-solid fa-sun', high:31, low:24, humidity:45, wind:'8 km/h' },
      { name:'Dubai', temp:38, cond:'Hot', icon:'fa-solid fa-temperature-high', high:42, low:32, humidity:15, wind:'22 km/h' },
    ];
    this.currentLoc = 0;
    this._fetchWeather();
  }
  _fetchWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.lat = pos.coords.latitude.toFixed(2);
          this.lon = pos.coords.longitude.toFixed(2);
          this.locations.unshift({ name:`${this.lat}°N, ${this.lon}°E`, temp:24, cond:'Local', icon:'fa-solid fa-location-dot', high:27, low:20, humidity:52, wind:'10 km/h' });
        },
        () => {}
      );
    }
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Weather', width:520, height:460, appId:'weather' });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const w = this.locations[this.currentLoc];
    const container = el('div', { class:'weather-container' });
    // Main card
    const main = el('div', { class:'weather-main' }, [
      el('div', { class:'weather-loc', text:w.name }),
      el('div', { class:'weather-temp', text:`${w.temp}°` }),
      el('div', { class:'weather-cond', html:`<i class="${w.icon}"></i> ${w.cond}` }),
      el('div', { class:'weather-hilo', text:`H:${w.high}° L:${w.low}°` }),
    ]);
    container.appendChild(main);
    // Details
    const dets = el('div', { class:'weather-details' }, [
      el('div', { class:'weather-detail' }, [el('i', { class:'fa-solid fa-droplet' }), el('span', { text:`${w.humidity}%` }), el('small', { text:'Humidity' })]),
      el('div', { class:'weather-detail' }, [el('i', { class:'fa-solid fa-wind' }), el('span', { text:w.wind }), el('small', { text:'Wind' })]),
      el('div', { class:'weather-detail' }, [el('i', { class:'fa-solid fa-eye' }), el('span', { text:'10 km' }), el('small', { text:'Visibility' })]),
      el('div', { class:'weather-detail' }, [el('i', { class:'fa-solid fa-compress' }), el('span', { text:'1013 hPa' }), el('small', { text:'Pressure' })]),
    ]);
    container.appendChild(dets);
    // Forecast
    const forecast = el('div', { class:'weather-forecast' });
    ['Mon','Tue','Wed','Thu','Fri'].forEach((d, i) => {
      forecast.appendChild(el('div', { class:'weather-fday' }, [
        el('span', { text:d }),
        el('i', { class:['fa-solid',i%2===0?'fa-cloud-sun':'fa-sun'] }),
        el('span', { text:`${20+i*2}°` }),
      ]));
    });
    container.appendChild(forecast);
    // Location switcher
    const locBar = el('div', { class:'weather-loc-bar' });
    this.locations.forEach((l, i) => {
      locBar.appendChild(el('button', { class:'weather-loc-btn'+(i===this.currentLoc?' active':''), text:l.name, onClick:() => { this.currentLoc=i; this.render(); } }));
    });
    container.appendChild(locBar);
    this.body.appendChild(container);
  }
}

// ── Clock App ──────────────────────────────────────────────
class ClockApp {
  constructor() {
    this.mode = 'clock';
    this.timerSeconds = 0;
    this.timerRunning = false;
    this.stopwatchSeconds = 0;
    this.stopwatchRunning = false;
    this.alarms = [];
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Clock', width:480, height:420, appId:'clock' });
    this.body = this.wid.body;
    this.render();
    this._startTicking();
  }
  _startTicking() {
    if (this._tickInterval) clearInterval(this._tickInterval);
    this._tickInterval = setInterval(() => {
      if (!this.body) { clearInterval(this._tickInterval); return; }
      if (this.mode === 'clock') {
        const now = new Date();
        const timeEl = this.body.querySelector('.clock-digital');
        if (timeEl) timeEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
        const dateEl = this.body.querySelector('.clock-date');
        if (dateEl) dateEl.textContent = now.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'});
        const analog = this.body.querySelector('.clock-analog');
        if (analog) this._updateAnalog(analog);
      }
      if (this.mode === 'timer' && this.timerRunning) {
        this.timerSeconds--;
        if (this.timerSeconds <= 0) { this.timerSeconds = 0; this.timerRunning = false; }
        this._updateTimerDisplay();
      }
      if (this.mode === 'stopwatch' && this.stopwatchRunning) {
        this.stopwatchSeconds += 0.1;
        this._updateStopwatchDisplay();
      }
    }, 100);
  }
  _updateAnalog(canvas) {
    const ctx = canvas.getContext('2d');
    const r = canvas.width/2;
    const now = new Date();
    const h = now.getHours()%12, m = now.getMinutes(), s = now.getSeconds();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--text');
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r,r,r-4,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<12;i++){ const a=i*Math.PI/6-Math.PI/2; ctx.fillRect(r+Math.cos(a)*(r-14)-1.5,r+Math.sin(a)*(r-14)-1.5,3,3); }
    ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(r,r); ctx.lineTo(r+Math.cos((h+m/60)*Math.PI/6-Math.PI/2)*(r*0.5), r+Math.sin((h+m/60)*Math.PI/6-Math.PI/2)*(r*0.5)); ctx.stroke();
    ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(r,r); ctx.lineTo(r+Math.cos((m)*Math.PI/30-Math.PI/2)*(r*0.65), r+Math.sin((m)*Math.PI/30-Math.PI/2)*(r*0.65)); ctx.stroke();
    ctx.strokeStyle = 'var(--accent)';
    ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(r,r); ctx.lineTo(r+Math.cos((s)*Math.PI/30-Math.PI/2)*(r*0.7), r+Math.sin((s)*Math.PI/30-Math.PI/2)*(r*0.7)); ctx.stroke();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'clock-container' });
    // Tabs
    const tabs = el('div', { class:'clock-tabs' });
    ['clock','timer','stopwatch'].forEach(m => {
      tabs.appendChild(el('button', { class:'clock-tab'+(this.mode===m?' active':''), text:m.charAt(0).toUpperCase()+m.slice(1), onClick:() => { this.mode=m; this.render(); } }));
    });
    container.appendChild(tabs);
    // Content
    const content = el('div', { class:'clock-content' });
    if (this.mode === 'clock') {
      const now = new Date();
      const analog = el('canvas', { class:'clock-analog', width:160, height:160 });
      content.appendChild(el('div', { style:{display:'flex',alignItems:'center',gap:'24px',padding:'20px'} }, [
        analog,
        el('div', {}, [
          el('div', { class:'clock-digital', text:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) }),
          el('div', { class:'clock-date', text:now.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'}) }),
        ]),
      ]));
      setTimeout(() => this._updateAnalog(analog), 50);
    } else if (this.mode === 'timer') {
      const mins = Math.floor(this.timerSeconds/60);
      const secs = this.timerSeconds%60;
      content.appendChild(el('div', { class:'clock-digit-display', text:`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}` }));
      const btnRow = el('div', { class:'clock-btn-row' });
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn primary', text:this.timerRunning?'Pause':'Start', onClick:() => { if(this.timerSeconds<=0)this.timerSeconds=300; this.timerRunning=!this.timerRunning; this.render(); } }));
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn', text:'Reset', onClick:() => { this.timerRunning=false; this.timerSeconds=0; this.render(); } }));
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn', text:'+1 min', onClick:() => { this.timerSeconds+=60; this.render(); } }));
      content.appendChild(btnRow);
    } else if (this.mode === 'stopwatch') {
      const totalSecs = Math.floor(this.stopwatchSeconds);
      const mins = Math.floor(totalSecs/60);
      const secs = totalSecs%60;
      const tenths = Math.floor((this.stopwatchSeconds%1)*10);
      content.appendChild(el('div', { class:'clock-digit-display', text:`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}.${tenths}` }));
      const btnRow = el('div', { class:'clock-btn-row' });
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn primary', text:this.stopwatchRunning?'Stop':'Start', onClick:() => { this.stopwatchRunning=!this.stopwatchRunning; this.render(); } }));
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn', text:'Lap', onClick:() => {} }));
      btnRow.appendChild(el('button', { class:'clock-ctrl-btn', text:'Reset', onClick:() => { this.stopwatchRunning=false; this.stopwatchSeconds=0; this.render(); } }));
      content.appendChild(btnRow);
    }
    container.appendChild(content);
    this.body.appendChild(container);
  }
  _updateTimerDisplay() {
    const d = this.body.querySelector('.clock-digit-display');
    if (d) { const m=Math.floor(this.timerSeconds/60), s=this.timerSeconds%60; d.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  }
  _updateStopwatchDisplay() {
    const d = this.body.querySelector('.clock-digit-display');
    if (d) { const t=Math.floor(this.stopwatchSeconds), m=Math.floor(t/60), s=t%60, ts=Math.floor((this.stopwatchSeconds%1)*10); d.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${ts}`; }
  }
}

// ── TextEdit App ───────────────────────────────────────────
class TextEditApp {
  constructor() {
    this.files = [];
    this.activeFile = null;
    this._initDemo();
  }
  _initDemo() {
    const now = Date.now();
    this.files = [
      { id:uid(), name:'Shopping List.txt', content:'Milk\nEggs\nBread\nButter\nApples', modified:now },
      { id:uid(), name:'Ideas.txt', content:'- Build a web OS\n- Learn Rust\n- Travel to Japan', modified:now-3600000 },
      { id:uid(), name:'Readme.txt', content:'Welcome to TextEdit!\n\nThis is a simple text editor for quick notes.', modified:now-7200000 },
    ];
    this.activeFile = this.files[0].id;
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'TextEdit', width:600, height:440, appId:'textedit' });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'textedit-container' });
    const file = this.files.find(f => f.id === this.activeFile);
    // Sidebar
    const sidebar = el('div', { class:'textedit-sidebar' }, [
      el('div', { class:'textedit-sidebar-header' }, [
        el('span', { text:'Documents' }),
        el('button', { class:'textedit-btn', html:'<i class="fa-solid fa-plus"></i>', onClick:() => this._newFile() }),
      ]),
    ]);
    const list = el('div', { class:'textedit-list' });
    this.files.forEach(f => {
      list.appendChild(el('div', { class:'textedit-list-item'+(f.id===this.activeFile?' active':''), onClick:() => { this.activeFile=f.id; this.render(); } }, [
        el('div', { class:'textedit-list-name', text:f.name }),
        el('div', { class:'textedit-list-preview', text:f.content.split('\n')[0] }),
      ]));
    });
    sidebar.appendChild(list);
    sidebar.appendChild(el('div', { style:{padding:'8px 12px',fontSize:'10px',color:'var(--text-tertiary)',borderTop:'1px solid var(--divider)'}, text:`${this.files.length} documents` }));
    container.appendChild(sidebar);
    // Editor
    const editor = el('div', { class:'textedit-editor' });
    if (file) {
      const nameRow = el('div', { class:'textedit-name-row' }, [
        el('input', { class:'textedit-name-input', value:file.name, onInput:(e) => file.name=e.target.value }),
        el('button', { class:'textedit-btn', html:'<i class="fa-solid fa-trash"></i>', onClick:() => { this.files=this.files.filter(f=>f.id!==file.id); this.activeFile=this.files[0]?.id; this.render(); } }),
      ]);
      editor.appendChild(nameRow);
      const textarea = el('textarea', { class:'textedit-textarea', spellcheck:'false', text:file.content, onInput:(e) => { file.content=e.target.value; file.modified=Date.now(); } });
      editor.appendChild(textarea);
    } else {
      editor.appendChild(el('div', { class:'textedit-empty', text:'Create a new document' }));
    }
    container.appendChild(editor);
    this.body.appendChild(container);
  }
  _newFile() {
    const f = { id:uid(), name:'Untitled.txt', content:'', modified:Date.now() };
    this.files.push(f);
    this.activeFile = f.id;
    this.render();
    setTimeout(() => this.body.querySelector('.textedit-name-input')?.select(), 50);
  }
}

// ── Calendar App ───────────────────────────────────────────
class CalendarApp {
  constructor() {
    this.viewDate = new Date();
    this.events = [
      { id:uid(), title:'Team Meeting', date:'2026-07-15', time:'10:00', color:'var(--accent)' },
      { id:uid(), title:'Lunch with Sara', date:'2026-07-15', time:'12:30', color:'#f43f5e' },
      { id:uid(), title:'Design Review', date:'2026-07-16', time:'14:00', color:'#3b82f6' },
      { id:uid(), title:'Gym', date:'2026-07-17', time:'07:00', color:'#22c55e' },
      { id:uid(), title:'Weekend Trip', date:'2026-07-19', time:'', color:'#8b5cf6' },
    ];
  }
  launch(opts={}) {
    this.wid = wm.create({ title:'Calendar', width:640, height:480, appId:'calendarapp' });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'calapp-container' });
    const d = this.viewDate;
    const year = d.getFullYear(), month = d.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    // Header
    const header = el('div', { class:'calapp-header' }, [
      el('button', { class:'calapp-nav', html:'<i class="fa-solid fa-chevron-left"></i>', onClick:() => { this.viewDate.setMonth(month-1); this.render(); } }),
      el('span', { style:{fontWeight:700,fontSize:'16px'}, text:`${monthNames[month]} ${year}` }),
      el('div', {}, [
        el('button', { class:'calapp-nav', html:'<i class="fa-solid fa-chevron-right"></i>', onClick:() => { this.viewDate.setMonth(month+1); this.render(); } }),
        el('button', { class:'calapp-nav', text:'Today', style:{marginLeft:'8px'}, onClick:() => { this.viewDate=new Date(); this.render(); } }),
      ]),
    ]);
    container.appendChild(header);
    // Grid
    const grid = el('div', { class:'calapp-grid' });
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(n => grid.appendChild(el('div', { class:'calapp-day-name', text:n })));
    for (let i=firstDay-1; i>=0; i--) { const p = new Date(year,month,0); p.setDate(p.getDate()-i); grid.appendChild(el('div', { class:'calapp-day other', text:p.getDate() })); }
    for (let i=1; i<=daysInMonth; i++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
      const isToday = i===today.getDate() && month===today.getMonth() && year===today.getFullYear();
      const dayEvents = this.events.filter(e => e.date === dateStr);
      const dayEl = el('div', { class:'calapp-day'+(isToday?' today':'') }, [
        el('span', { text:i }),
        ...dayEvents.slice(0,2).map(e => el('div', { class:'calapp-dot', style:{background:e.color} })),
        dayEvents.length>2 ? el('span', { style:{fontSize:'9px',color:'var(--text-tertiary)'}, text:`+${dayEvents.length-2}` }) : null,
      ]);
      grid.appendChild(dayEl);
    }
    const remaining = 42 - (firstDay + daysInMonth);
    for (let i=1; i<=remaining; i++) grid.appendChild(el('div', { class:'calapp-day other', text:i }));
    container.appendChild(grid);
    // Events list
    const eventsEl = el('div', { class:'calapp-events' });
    this.events.sort((a,b) => a.date.localeCompare(b.date)).slice(0,5).forEach(e => {
      eventsEl.appendChild(el('div', { class:'calapp-event' }, [
        el('div', { class:'calapp-event-dot', style:{background:e.color} }),
        el('div', { class:'calapp-event-info' }, [
          el('span', { text:e.title }),
          el('small', { text:`${e.date}${e.time?' at '+e.time:''}` }),
        ]),
      ]));
    });
    if (this.events.length === 0) eventsEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-tertiary)">No events</div>';
    container.appendChild(eventsEl);
    this.body.appendChild(container);
  }
}

// ── Code Editor App ────────────────────────────────────────
class CodeEditorApp {
  constructor() {
    this.openFiles = [];
    this.activeFile = null;
    this.filePath = null;
  }
  launch(opts={}) {
    this.filePath = opts.filePath || null;
    this.wid = wm.create({ title:'Code Editor', width:850, height:560, appId:'code' });
    this.body = this.wid.body;
    if (this.filePath) {
      this._openFile(this.filePath);
    } else {
      this.openFiles = [
        { path:'/Projects/hello.js', content: auraOS.fs.read('/Projects/hello.js') || '' },
        { path:'/Projects/index.html', content: auraOS.fs.read('/Projects/index.html') || '' },
        { path:'/Projects/style.css', content: auraOS.fs.read('/Projects/style.css') || '' },
      ];
      this.activeFile = this.openFiles[0].path;
    }
    this.render();
  }
  _openFile(path) {
    const content = auraOS.fs.read(path) || '';
    if (!this.openFiles.find(f => f.path === path)) {
      this.openFiles.push({ path, content });
    }
    this.activeFile = path;
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'code-container' });
    const sidebar = el('div', { class:'code-sidebar' });
    sidebar.appendChild(el('div', { class:'code-sidebar-header', text:'Explorer' }));
    const tree = el('div', { class:'code-file-tree' });
    this._renderTree(tree, '/', 0);
    sidebar.appendChild(tree);
    container.appendChild(sidebar);
    const main = el('div', { class:'code-main' });
    const tabs = el('div', { class:'code-tabs' });
    this.openFiles.forEach(f => {
      const name = f.path.split('/').pop();
      tabs.appendChild(el('div', {
        class:'code-tab' + (f.path === this.activeFile ? ' active' : ''),
        onClick:() => { this.activeFile = f.path; this.render(); },
      }, [
        el('span', { text:name }),
        el('button', { class:'tab-close', 'aria-label':'Close tab', onClick:(e) => { e.stopPropagation(); this.openFiles = this.openFiles.filter(ff => ff.path !== f.path); if (this.activeFile === f.path) this.activeFile = this.openFiles[0]?.path; this.render(); } }, [el('i', { class:'fa-solid fa-xmark' })]),
      ]));
    });
    main.appendChild(tabs);
    const editorArea = el('div', { class:'code-editor-area' });
    const file = this.openFiles.find(f => f.path === this.activeFile);
    if (file) {
      const lines = file.content.split('\n');
      const lineNumbers = el('div', { class:'code-line-numbers', text:lines.map((_,i) => i+1).join('\n') });
      const textarea = el('textarea', {
        class:'code-textarea', spellcheck:'false', 'aria-label':'Code editor',
        text:file.content,
        onInput:(e) => {
          file.content = e.target.value;
          auraOS.fs.write(file.path, file.content);
          lineNumbers.textContent = file.content.split('\n').map((_,i) => i+1).join('\n');
        },
        onScroll:(e) => { lineNumbers.scrollTop = e.target.scrollTop; },
        onKeydown:(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart, end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0,start) + '  ' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 2;
            file.content = textarea.value;
            lineNumbers.textContent = file.content.split('\n').map((_,i) => i+1).join('\n');
          }
        },
      });
      editorArea.appendChild(lineNumbers);
      editorArea.appendChild(textarea);
      const status = el('div', { class:'code-statusbar' }, [
        el('span', { text:file.path }),
        el('span', { text:`Lines: ${lines.length} | ${file.path.split('.').pop().toUpperCase()}` }),
      ]);
      main.appendChild(editorArea);
      main.appendChild(status);
      wm.setTitle(this.wid.id, 'Code — ' + file.path.split('/').pop());
    } else {
      main.appendChild(el('div', { class:'notes-empty', text:'Open a file from the explorer' }));
    }
    container.appendChild(main);
    this.body.appendChild(container);
  }
  _renderTree(container, path, depth) {
    const node = auraOS.fs.resolve(path);
    if (!node || node.type !== 'dir') return;
    const entries = Object.entries(node.children).sort((a,b) => {
      if (a[1].type !== b[1].type) return a[1].type === 'dir' ? -1 : 1;
      return a[0].localeCompare(b[0]);
    });
    entries.forEach(([name, child]) => {
      const childPath = path === '/' ? '/'+name : path+'/'+name;
      const isActive = childPath === this.activeFile;
      const item = el('div', {
        class:'code-tree-item' + (isActive ? ' active' : ''),
        style:{ paddingLeft: (depth * 12 + 8) + 'px' },
        onClick:() => {
          if (child.type === 'file') {
            this._openFile(childPath);
            this.render();
          } else {
            this._renderTree(container, childPath, depth + 1);
          }
        },
      }, [
        el('i', { class: child.type === 'dir' ? 'fa-solid fa-chevron-right folder-icon' : 'fa-solid fa-file file-icon' }),
        el('span', { text:name }),
      ]);
      container.appendChild(item);
      if (child.type === 'dir') this._renderTree(container, childPath, depth + 1);
    });
  }
}

// ── Settings App ───────────────────────────────────────────
class SettingsApp {
  constructor() {
    this.activeTab = 'appearance';
  }
  launch(opts={}) {
    this.activeTab = opts.tab || 'appearance';
    this.wid = wm.create({ title:'Settings', width:720, height:500, appId:'settings' });
    this.body = this.wid.body;
    this.render();
  }
  render() {
    this.body.innerHTML = '';
    const container = el('div', { class:'settings-container' });
    const sidebar = el('div', { class:'settings-sidebar' });
    const navItems = [
      { id:'appearance', name:'Appearance', icon:'fa-solid fa-palette' },
      { id:'wallpaper', name:'Wallpaper', icon:'fa-solid fa-image' },
      { id:'dock', name:'Dock', icon:'fa-solid fa-ellipsis' },
      { id:'about', name:'About', icon:'fa-solid fa-circle-info' },
    ];
    navItems.forEach(n => {
      sidebar.appendChild(el('div', {
        class:'settings-nav-item' + (n.id === this.activeTab ? ' active' : ''),
        onClick:() => { this.activeTab = n.id; this.render(); },
      }, [el('i', { class:n.icon }), el('span', { text:n.name })]));
    });
    container.appendChild(sidebar);
    const main = el('div', { class:'settings-main' });
    switch(this.activeTab) {
      case 'appearance': this._renderAppearance(main); break;
      case 'wallpaper': this._renderWallpaper(main); break;
      case 'dock': this._renderDock(main); break;
      case 'about': this._renderAbout(main); break;
    }
    container.appendChild(main);
    this.body.appendChild(container);
  }
  _renderAppearance(main) {
    main.appendChild(el('div', { class:'settings-section' }, [
      el('h3', { text:'Appearance' }),
      el('div', { class:'settings-group' }, [
        el('div', { class:'settings-label', text:'Theme' }),
        el('div', { class:'radio-cards' }, [
          el('div', { class:'radio-card'+(themeManager.theme==='dark'?' active':''), onClick:() => { themeManager.setTheme('dark'); controlCenter.darkMode=true; this.render(); } }, [el('i', { class:'fa-solid fa-moon', style:{fontSize:'20px',marginBottom:'4px',display:'block'} }), el('span', { text:'Dark' })]),
          el('div', { class:'radio-card'+(themeManager.theme==='light'?' active':''), onClick:() => { themeManager.setTheme('light'); controlCenter.darkMode=false; this.render(); } }, [el('i', { class:'fa-solid fa-sun', style:{fontSize:'20px',marginBottom:'4px',display:'block'} }), el('span', { text:'Light' })]),
        ]),
      ]),
      el('div', { class:'settings-group' }, [
        el('div', { class:'settings-label', text:'Accent Color' }),
        el('div', { class:'color-swatches' },
          ACCENT_COLORS.map(c => el('div', {
            class:'color-swatch'+(themeManager.accent.h===c.h?' active':''),
            style:{background:`hsl(${c.h},${c.s}%,${c.l}%)`},
            title:c.name,
            onClick:() => { themeManager.setAccent(c); this.render(); },
          }))
        ),
      ]),
    ]));
  }
  _renderWallpaper(main) {
    main.appendChild(el('div', { class:'settings-section' }, [
      el('h3', { text:'Wallpaper' }),
      el('div', { class:'wallpaper-options' },
        Object.entries(WALLPAPERS).map(([key, wp]) =>
          el('div', {
            class:'wallpaper-thumb' + (themeManager.wallpaper===key ? ' active' : ''),
            style:{ backgroundImage: wp.image ? `url(${wp.image})` : '', backgroundColor: wp.class ? '' : '#111827' },
            onClick:() => { themeManager.setWallpaper(key); this.render(); },
            title:wp.name,
          }, [
            el('span', { class:'wallpaper-thumb-label', text:wp.name }),
          ])
        )
      ),
    ]));
  }
  _renderDock(main) {
    main.appendChild(el('div', { class:'settings-section' }, [
      el('h3', { text:'Dock' }),
      el('div', { class:'settings-row' }, [
        el('div', {}, [
          el('div', { class:'settings-row-label', text:'Dock Size' }),
          el('div', { class:'settings-row-desc', text:themeManager.dockSize + 'px' }),
        ]),
        el('input', { type:'range', class:'settings-slider', min:'40', max:'90', value:themeManager.dockSize,
          onInput:(e) => { themeManager.setDockSize(parseInt(e.target.value)); this.render(); },
        }),
      ]),
      el('div', { class:'settings-row' }, [
        el('div', {}, [
          el('div', { class:'settings-row-label', text:'Animations' }),
          el('div', { class:'settings-row-desc', text:'Enable dock and window animations' }),
        ]),
        el('label', { class:'toggle' }, [
          el('input', { type:'checkbox', checked:themeManager.animations, onChange:(e) => { themeManager.animations = e.target.checked; themeManager.apply(); } }),
          el('div', { class:'toggle-track' }),
          el('div', { class:'toggle-thumb' }),
        ]),
      ]),
    ]));
  }
  _renderAbout(main) {
    main.appendChild(el('div', { class:'settings-section' }, [
      el('div', { class:'about-card' }, [
        el('div', { class:'about-logo' }, [el('span', { text:'⬡ ' }), el('span', { text:'Lazy' }), el('span', { text:'OS' })]),
        el('div', { class:'about-version', text:'Version 1.0.0 (Build 2024.1)' }),
        el('p', { style:{marginTop:'16px',fontSize:'13px',color:'var(--text-secondary)',lineHeight:'1.6'}, text:'A browser-based desktop environment built with HTML, CSS, and JavaScript — an original UI inspired by modern desktop conventions (menu bar, dock, windows), not a copy of any specific vendor\'s assets.' }),
        el('p', { style:{marginTop:'12px',fontSize:'12px',color:'var(--text-tertiary)'}, text:'No frameworks. No backend. State resets each time the page reloads.' }),
      ]),
    ]));
  }
}

// ══════════════════════════════════════════════════════════
// GLOBAL INSTANCES & INITIALIZATION
// ══════════════════════════════════════════════════════════

let auraOS, themeManager, notify, ctxMenu, spotlight, wm, menuBar, dockManager, workspaceManager, appGrid, controlCenter, calendarPopup, desktopManager, appManager;

// ── Workspace Manager ──────────────────────────────────────
class WorkspaceManager {
  constructor() {
    this.current = 0;
    this.count = 3;
    this.windowsByWs = { 0: new Set(), 1: new Set(), 2: new Set() };
    this.desktopHidden = false;
  }
  switchTo(idx) {
    if (idx === this.current || idx < 0 || idx >= this.count) return;
    // Hide all windows of current workspace
    wm.windows.forEach((win, wid) => {
      if (win.ws === this.current) {
        win.el.style.display = 'none';
      }
    });
    this.current = idx;
    // Show windows of new workspace
    wm.windows.forEach((win, wid) => {
      if (win.ws === this.current || win.ws === undefined) {
        win.el.style.display = '';
      }
    });
    this._updateUI();
  }
  _updateUI() {
    $$('.dock-ws-dot').forEach(dot => {
      const ws = parseInt(dot.dataset.ws, 10);
      dot.classList.toggle('active', ws === this.current);
    });
    const wsLabel = $('#ws-label');
    if (wsLabel) wsLabel.textContent = this.current + 1;
  }
  showDesktop() {
    if (this.desktopHidden) {
      // Restore all windows
      wm.windows.forEach((win) => {
        if (win.ws === this.current || win.ws === undefined) {
          win.el.style.display = '';
        }
      });
      this.desktopHidden = false;
    } else {
      // Hide all windows
      wm.windows.forEach((win) => {
        win.el.style.display = 'none';
      });
      this.desktopHidden = true;
    }
  }
  assignWindow(winId, ws) {
    const win = wm.windows.get(winId);
    if (!win) return;
    win.ws = ws;
    this.windowsByWs[ws].add(winId);
  }
}

// ── App Grid Launcher ──────────────────────────────────────
class AppGridLauncher {
  constructor() {
    this.el = $('#app-grid');
    this.itemsEl = $('#app-grid-items');
    this.isOpen = false;
    this.render();
    $('#app-menu-launcher').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && !this.el.contains(e.target) && !e.target.closest('#app-menu-launcher') && !e.target.closest('#dock-show-apps')) {
        this.close();
      }
    });
  }
  render() {
    this.itemsEl.innerHTML = '';
    const dockIds = new Set(dockManager.items.filter(i => i !== '---').map(i => i.id));
    const appList = Object.entries(appManager.registry).filter(([id]) => !dockIds.has(id));
    if (appList.length === 0) {
      this.itemsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-tertiary);font-size:13px">All apps are in the dock</div>';
      return;
    }
    appList.forEach(([id, def]) => {
      const iconData = APP_ICONS[id] || APP_ICONS.file;
      const item = el('div', {
        class:'app-grid-item',
        onClick:() => { this.close(); appManager.open(id); },
      }, [
        el('div', { class:'agi-icon', style:{background:iconData.bg}, html:`<i class="${iconData.icon}"></i>` }),
        el('div', { class:'agi-name', text:def.name }),
      ]);
      this.itemsEl.appendChild(item);
    });
  }
  toggle() { this.isOpen ? this.close() : this.open(); }
  open() { this.isOpen = true; this.el.classList.add('open'); }
  close() { this.isOpen = false; this.el.classList.remove('open'); }
}

// ── Keyboard Shortcuts ─────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key === ' ') { e.preventDefault(); spotlight.toggle(); }
  else if (mod && e.key === 'n') { e.preventDefault(); appManager.open('finder', { reuse:false }); }
  else if (mod && e.key === 'w') { e.preventDefault(); if (wm.focusedId) wm.close(wm.focusedId); }
  else if (mod && e.key === 'm') { e.preventDefault(); if (wm.focusedId) wm.minimize(wm.focusedId); }
  else if (mod && e.key === ',') { e.preventDefault(); appManager.open('settings'); }
  else if (mod && e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = clamp(workspaceManager.current + dir, 0, workspaceManager.count - 1);
    workspaceManager.switchTo(next);
  }
  else if (e.key === 'Escape') {
    if (spotlight.isOpen) spotlight.close();
    if (controlCenter.isOpen) controlCenter.close();
    if (calendarPopup.isOpen) calendarPopup.close();
    if (ctxMenu.isOpen) ctxMenu.close();
    if (appGrid.isOpen) appGrid.close();
    menuBar.close();
  }
});

// ── Boot Sequence ──────────────────────────────────────────
function boot() {
  auraOS = { fs: new FileSystem() };
  themeManager = new ThemeManager();
  notify = new NotificationManager();
  ctxMenu = new ContextMenuManager();
  wm = new WindowManager();
  menuBar = new MenuBarManager();
  appManager = new AppManager();
  dockManager = new DockManager();
  workspaceManager = new WorkspaceManager();
  appGrid = new AppGridLauncher();
  controlCenter = new ControlCenterManager();
  calendarPopup = new CalendarPopupManager();
  desktopManager = new DesktopManager();
  spotlight = new SpotlightManager();

  // Workspace indicator click to cycle
  const wsIndicator = $('#workspace-indicator');
  if (wsIndicator) {
    wsIndicator.addEventListener('click', () => {
      const next = (workspaceManager.current + 1) % workspaceManager.count;
      workspaceManager.switchTo(next);
    });
  }

  const bootScreen = $('#boot-screen');
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    setTimeout(() => {
      bootScreen.remove();
      setTimeout(() => {
        notify.send('Welcome to LazyOS', 'Your desktop is ready. Press Cmd+Space to search.', 'fa-solid fa-sparkles');
      }, 500);
    }, 800);
  }, 2800);
}

// Start
boot();