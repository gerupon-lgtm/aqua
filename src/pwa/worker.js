// 通信なしで遊ぶための仕組み（F-022）。前作と同じく、版ごとのフォルダに置いた資材を先に保存しておく。
// 版の値と資材の一覧はビルドで書き込む。古い版の保存は、新しい版が使えるようになってから消す。
const VERSION = '__AQUA_VERSION__';
const ASSETS = __AQUA_ASSETS__;
const CACHE = `aqua-notes-${VERSION}`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('aqua-notes-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 画面からの「新しい版を使う」で、待っている版に切り替える
self.addEventListener('message', event => {
  if (event.data === 'activate-update') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // 入口のページは通信を優先し、つながらないときだけ保存した版を使う
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put('./index.html', copy));
        return res;
      }).catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }
  // 版ごとのフォルダの資材は中身が変わらないので、保存した物を先に使う
  event.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
