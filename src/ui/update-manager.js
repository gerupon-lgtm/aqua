// 待機中のworkerの版と資材の準備を確認する。画面の版と同じなら更新を勧めない。
export function newerVersion(candidate, current) {
  if (![candidate, current].every(v => typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v))) return false;
  const a = candidate.split('.').map(BigInt), b = current.split('.').map(BigInt);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
}

export function workerStatus(worker, { timeoutMs = 1500, makeChannel = () => new MessageChannel() } = {}) {
  if (!worker) return Promise.resolve(null);
  return new Promise(resolve => {
    let channel, timer;
    const finish = value => {
      clearTimeout(timer);
      if (channel) { channel.port1.onmessage = null; channel.port1.close(); channel.port2.close(); }
      resolve(value);
    };
    try {
      channel = makeChannel();
      timer = setTimeout(() => finish(null), timeoutMs);
      channel.port1.onmessage = event => {
        const info = event.data;
        finish(info && typeof info.version === 'string' && typeof info.ready === 'boolean' ? info : null);
      };
      worker.postMessage({ type: 'AQUA_UPDATE_STATUS' }, [channel.port2]);
    } catch { finish(null); }
  });
}

export function createUpdateManager({ serviceWorker, currentVersion, onChange, canApply, reload, timeoutMs }) {
  let registration, starting, generation = 0, readyWorker = null;
  let state = { status: 'current' }, reloadPending = false, reloading = false;
  const watched = new WeakSet();
  const publish = next => { state = next; onChange(state); return state; };
  const reloadWhenAllowed = () => {
    if (reloadPending && !reloading && canApply()) { reloading = true; reload(); }
  };
  async function refresh() {
    const id = ++generation, worker = registration?.waiting;
    readyWorker = null;
    if (!worker) return publish({ status: registration?.installing ? 'checking' : 'current' });
    const info = await workerStatus(worker, { timeoutMs });
    if (id !== generation || registration.waiting !== worker) return state;
    if (!info || !/^\d+\.\d+\.\d+$/.test(info.version)) return publish({ status: 'unavailable' });
    if (!newerVersion(info.version, currentVersion)) return publish({ status: registration.installing ? 'checking' : 'current' });
    if (!info.ready || worker.state !== 'installed') return publish({ status: 'checking' });
    readyWorker = worker;
    return publish({ status: 'ready', version: info.version });
  }
  function watchInstalling() {
    const worker = registration.installing;
    if (!worker || watched.has(worker)) return;
    watched.add(worker);
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' || worker.state === 'redundant') void refresh();
    });
  }
  async function controllerChanged() {
    const controller = serviceWorker.controller;
    const info = await workerStatus(controller, { timeoutMs });
    if (serviceWorker.controller !== controller) return;
    // 初回の取得や、すでに同じ版の画面を表示している場合は再読込しない。
    if (info && newerVersion(info.version, currentVersion)) {
      reloadPending = true;
      reloadWhenAllowed();
    }
    void refresh();
  }
  async function start() {
    if (!starting) starting = (async () => {
      registration = await serviceWorker.register('./sw.js');
      serviceWorker.addEventListener('controllerchange', controllerChanged);
      registration.addEventListener('updatefound', () => { watchInstalling(); void refresh(); });
      watchInstalling();
      await refresh();
      return registration;
    })();
    return starting;
  }
  return {
    get state() { return state; },
    start,
    async check() { await start(); publish({ status: 'checking' }); await registration.update(); return refresh(); },
    async apply() {
      const worker = readyWorker;
      if (!worker || !canApply()) return false;
      await refresh();
      if (readyWorker !== worker || !canApply()) return false;
      try { worker.postMessage('activate-update'); return true; }
      catch { void refresh(); return false; }
    },
    refreshControls() { onChange(state); reloadWhenAllowed(); }
  };
}
