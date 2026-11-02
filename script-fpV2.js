/* ══════════════════════════════════════════════════════════════════════════
   YACHT EXPLORER V2 — SUPERYACHT DIGITAL SHOWROOM & CONFIGURATOR ENGINE
   Designed for Yacht Shipyards, Naval Architects & Luxury Marine Media Studios.
   Double-buffered MP4 playback (#main-video & #ab-video-b) for zero-black-frame
   transitions across all 29 bespoke yacht videos.
   ══════════════════════════════════════════════════════════════════════════ */

const videoA = document.getElementById("main-video");
const videoB = document.getElementById("ab-video-b");
const seqCanvas = document.getElementById("seq-canvas");
const poiLayer = document.getElementById("poi-layer");
const trackEl = document.getElementById("track");
const loaderEl = document.getElementById("loader");
const ctx = seqCanvas.getContext("2d", { alpha: false });
const MOBILE = window.matchMedia("(hover: none)").matches || window.innerWidth < 768;

let activeSlot = "A";
let currentScene = CONFIG_V2.defaultScene || "exterior";
let currentClipCode = "97757";
let currentClipName = "Yacht Exterior Static Loop";
let currentClipSrc = "";
let forceLoopMode = false;
let globalSpeedMultiplier = 2.0; // Default 2.0x so 10s AI clips feel snappy (~5s)
let currentBaseIsLoop = true;
let poisVisible = true;
let busy = false;
let navGen = 0;
let poiTimer = null;
const videoBlobs = new Map();

function preloadMp4Blob(rawSrc) {
  const src = resolveBestVideoFormat(rawSrc);
  if (!src || videoBlobs.has(src)) return Promise.resolve();
  const p = fetch(src)
    .then(r => r.blob())
    .then(b => {
      const url = URL.createObjectURL(b);
      videoBlobs.set(src, url);
      return url;
    })
    .catch(() => {});
  videoBlobs.set(src, null);
  return p;
}

// Background preloads run through a small queue so they never compete with the
// clip that is currently starting (downloading everything at once stalled playback).
const preloadQueue = [];
let preloadActive = 0;
const PRELOAD_CONCURRENCY = MOBILE ? 1 : 2;

function pumpPreloadQueue() {
  while (preloadActive < PRELOAD_CONCURRENCY && preloadQueue.length) {
    const src = preloadQueue.shift();
    preloadActive++;
    preloadMp4Blob(src).finally(() => {
      preloadActive--;
      pumpPreloadQueue();
    });
  }
}

function queuePreload(urls) {
  const saveData = navigator.connection?.saveData;
  if (saveData) return;
  urls.filter(Boolean).forEach(src => {
    if (!videoBlobs.has(resolveBestVideoFormat(src)) && !preloadQueue.includes(src)) preloadQueue.push(src);
  });
  pumpPreloadQueue();
}

function preloadNeighborsAndScene(sceneId) {
  const sc = CONFIG_V2.scenes[sceneId];
  if (!sc) return;
  // Navigation transitions first: they are what the visitor most likely clicks next.
  preloadQueue.length = 0;
  const urls = new Set([sc.video]);
  const trans = CONFIG_V2.transitions?.[sceneId] || {};
  Object.values(trans).forEach(t => t?.src && urls.add(t.src));
  urls.add(sc.orbitVideo);
  if (!MOBILE) {
    if (sceneId === "exterior") {
      CONFIG_V2.catalog.materials.hull.forEach(m => urls.add(m.src));
      CONFIG_V2.catalog.moods.forEach(m => urls.add(m.src));
    } else if (sceneId === "deck") {
      CONFIG_V2.catalog.materials.deck.forEach(m => urls.add(m.src));
    } else if (sceneId === "salon") {
      CONFIG_V2.catalog.materials.salon.forEach(m => urls.add(m.src));
    }
  }
  queuePreload([...urls]);
}

function applyVideoSpeed(vid, isLoopClip) {
  if (!vid) return;
  // Static water loops play nicely at 75% of the transition speed (e.g. 1.5x when transitions are 2.0x)
  const effectiveRate = isLoopClip
    ? Math.max(1.0, +(globalSpeedMultiplier * 0.75).toFixed(2))
    : globalSpeedMultiplier;
  vid.defaultPlaybackRate = effectiveRate;
  vid.playbackRate = effectiveRate;
}

window.setGlobalVideoSpeed = function setGlobalVideoSpeed(speed) {
  globalSpeedMultiplier = Number(speed) || 2.0;
  const vid = getActiveVideo();
  applyVideoSpeed(vid, currentBaseIsLoop);
  document.querySelectorAll(".speed-pill-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.speed) === globalSpeedMultiplier);
  });
};

/* Track active bespoke configuration for the Shipyard Specification Dossier */
const yachtConfigState = {
  hull: "Titanium Silver Metallic",
  deckSofa: "Loro Piana Cream Ivory Bouclé",
  deckFloor: "Burmese Blonde Teak Planking",
  salonSuite: "Sand Linen & Smoked Walnut",
  atmosphere: "Mediterranean Noon"
};

function getActiveVideo() {
  return activeSlot === "A" ? videoA : videoB;
}

function getStandbyVideo() {
  return activeSlot === "A" ? videoB : videoA;
}

function sessionId() {
  let s = sessionStorage.getItem("sid_v2");
  if (!s) {
    s = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    sessionStorage.setItem("sid_v2", s);
  }
  return s;
}

function track(event, data = {}) {
  const payload = {
    event,
    ...data,
    slug: CONFIG_V2.slug,
    ts: Date.now(),
    session: sessionId(),
    device: MOBILE ? "mobile" : "desktop"
  };
  if (window.gtag) gtag("event", event, data);
  try { navigator.sendBeacon?.("/api/track", JSON.stringify(payload)); } catch (e) {}
}

function viewportSize() {
  const v = window.visualViewport;
  return v ? { w: v.width, h: v.height } : { w: innerWidth, h: innerHeight };
}

function resizeCanvas() {
  const { w, h } = viewportSize();
  const dpr = MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  seqCanvas.width = w * dpr;
  seqCanvas.height = h * dpr;
  seqCanvas.style.width = w + "px";
  seqCanvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function sceneFromHash() {
  const s = new URLSearchParams(location.hash.slice(1)).get("scene");
  return CONFIG_V2.scenes[s] ? s : CONFIG_V2.defaultScene;
}

function syncHash(sceneId) {
  history.replaceState(null, "", `#scene=${sceneId}`);
}

/* ── SEAMLESS FRAME-ACCURATE VIDEO ENGINE (ZERO BLACK FLASH) ── */
function drawVideoToCanvas(vid) {
  if (!vid || vid.readyState < 2 || !vid.videoWidth) return false;
  const { w, h } = viewportSize();
  const vw = vid.videoWidth;
  const vh = vid.videoHeight;
  const scale = Math.max(w / vw, h / vh);
  const dw = Math.round(vw * scale);
  const dh = Math.round(vh * scale);
  const dx = Math.round((w - dw) / 2);
  const dy = Math.round((h - dh) / 2);
  ctx.drawImage(vid, dx, dy, dw, dh);
  return true;
}

function waitFirstPaintedFrame(vid, timeoutMs = 4000) {
  return new Promise(resolve => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      vid.removeEventListener("playing", onPlaying);
      vid.removeEventListener("timeupdate", finish);
      vid.removeEventListener("error", finish);
      resolve();
    };
    const onPlaying = () => {
      if ("requestVideoFrameCallback" in vid) {
        vid.requestVideoFrameCallback(() => finish());
      } else {
        requestAnimationFrame(() => requestAnimationFrame(finish));
      }
    };
    if (!vid.paused && vid.readyState >= 3) {
      onPlaying();
    } else {
      vid.addEventListener("playing", onPlaying, { once: true });
      vid.addEventListener("timeupdate", finish, { once: true });
      vid.addEventListener("error", finish, { once: true });
    }
    setTimeout(finish, timeoutMs);
  });
}

async function playMp4Clip(options) {
  const {
    src,
    code = "",
    name = "",
    loop = false,
    holdLastFrame = false,
    followUpSrc = null,
    followUpCode = "",
    followUpName = "",
    targetScene = null,
    showPoisAfter = true
  } = options;

  if (!src) return;
  const actualSrc = resolveBestVideoFormat(src);
  const gen = ++navGen;
  busy = true;

  const standby = getStandbyVideo();
  const current = getActiveVideo();

  // 1. Lock the current video's exact frame onto #seq-canvas so the screen
  //    NEVER dips to black or flashes while the next video loads and decodes!
  if (drawVideoToCanvas(current)) {
    seqCanvas.classList.add("active");
  }

  const resolvedSrc = videoBlobs.get(actualSrc) || actualSrc;
  const shouldLoop = forceLoopMode || (loop && !followUpSrc);
  currentBaseIsLoop = !!(loop && !followUpSrc);

  const loaderTimer = setTimeout(() => loaderEl?.classList.add("visible"), 450);

  standby.onended = null;
  standby.loop = shouldLoop;
  standby.removeAttribute("poster");

  if (standby.dataset.rawSrc !== actualSrc) {
    standby.src = resolvedSrc;
    standby.dataset.rawSrc = actualSrc;
    standby.load();
  } else {
    try { standby.currentTime = 0; } catch (e) {}
  }

  applyVideoSpeed(standby, currentBaseIsLoop);

  // Start playback and wait until the GPU has painted the first frame of standby
  const playPromise = standby.play().catch(err => console.warn("Autoplay fallback:", err));
  await waitFirstPaintedFrame(standby);
  await playPromise;
  applyVideoSpeed(standby, currentBaseIsLoop);

  clearTimeout(loaderTimer);
  loaderEl?.classList.remove("visible");

  if (gen !== navGen) return;

  currentClipSrc = src;
  currentClipCode = code || extractCodeFromSrc(src);
  currentClipName = name || currentClipCode;

  if (targetScene && CONFIG_V2.scenes[targetScene]) {
    currentScene = targetScene;
    syncHash(targetScene);
    updateSceneHeader(targetScene);
    setActiveTimeline(targetScene);
    renderContextConfigBar(targetScene);
    preloadNeighborsAndScene(targetScene);
  }

  updateTelemetryHud({
    code: currentClipCode,
    name: currentClipName,
    isLoop: shouldLoop,
    isTransition: !shouldLoop
  });
  highlightActiveCatalogButtons(currentClipCode);

  // 2. Instant, zero-fade swap: standby is already playing and decoded on GPU.
  standby.classList.add("vid-active");
  current.classList.remove("vid-active");
  seqCanvas.classList.remove("active");
  current.pause();
  current.removeAttribute("poster");

  activeSlot = activeSlot === "A" ? "B" : "A";
  busy = false;

  if (showPoisAfter && targetScene) {
    renderPOIs(CONFIG_V2.scenes[targetScene]?.pois || []);
  }

  // Preload followUpSrc immediately so when this transition ends, the followUp is in RAM
  if (followUpSrc) {
    preloadMp4Blob(followUpSrc);
  }

  standby.onended = () => {
    if (gen !== navGen) return;
    if (forceLoopMode) {
      standby.currentTime = 0;
      standby.play().catch(() => {});
      return;
    }
    if (followUpSrc) {
      playMp4Clip({
        src: followUpSrc,
        code: followUpCode || extractCodeFromSrc(followUpSrc),
        name: followUpName || `${name} (Loop)`,
        loop: true,
        targetScene: targetScene || currentScene,
        showPoisAfter: true
      });
    } else if (holdLastFrame) {
      updateTelemetryHud({
        code: currentClipCode,
        name: `${currentClipName}`,
        isLoop: false,
        isTransition: false
      });
    }
  };
}

function extractCodeFromSrc(src) {
  const m = String(src).match(/_(\d{5})\.(webm|mp4|mov)/i);
  return m ? m[1] : "WEBM";
}

// All clips are H.264 MP4 (plays on every browser, hardware-decoded).
// Phones get the 720p copies from videos_web_m/.
function resolveBestVideoFormat(src) {
  if (!src) return src;
  return MOBILE ? src.replace("videos_web/", "videos_web_m/") : src;
}

/* ── SCENE NAVIGATION (Bottom Dock & Hotspots) ── */
async function navigateTo(destSceneId, forceDirect = false) {
  if (!CONFIG_V2.scenes[destSceneId]) return;
  const destScene = CONFIG_V2.scenes[destSceneId];
  const fromSceneId = currentScene;

  const trans = !forceDirect && fromSceneId !== destSceneId
    ? CONFIG_V2.transitions?.[fromSceneId]?.[destSceneId]
    : null;

  hidePOIs();

  if (trans && trans.src) {
    const followUp = trans.endBehavior === "startSceneLoop" ? destScene.video : null;
    await playMp4Clip({
      src: trans.src,
      code: extractCodeFromSrc(trans.src),
      name: `${CONFIG_V2.scenes[fromSceneId]?.title || fromSceneId} → ${destScene.title}`,
      loop: false,
      holdLastFrame: trans.endBehavior === "holdEndFrame",
      followUpSrc: followUp,
      followUpCode: destScene.videoId,
      followUpName: destScene.title,
      targetScene: destSceneId,
      showPoisAfter: true
    });
  } else {
    await playMp4Clip({
      src: destScene.video,
      code: destScene.videoId,
      name: destScene.title,
      loop: !!destScene.loop,
      holdLastFrame: !!destScene.holdLastFrame,
      targetScene: destSceneId,
      showPoisAfter: true
    });
  }
  track("navigate_v2", { from: fromSceneId, to: destSceneId });
}

/* ── TRIGGER ANY OF THE 29 CLIPS BY CATALOG ID OR CODE ── */
function findCatalogItem(idOrCode) {
  const cat = CONFIG_V2.catalog;
  const all = [
    ...cat.moods,
    ...cat.materials.hull,
    ...cat.materials.deck,
    ...cat.materials.salon,
    ...cat.orbits,
    ...cat.cameraTransitions
  ];
  return all.find(item => item.id === idOrCode || item.code === idOrCode);
}

window.triggerCatalogClip = function triggerCatalogClip(idOrCode) {
  const item = findCatalogItem(idOrCode);
  if (!item) return;

  // Record bespoke selection for the Shipyard Dossier
  if (item.id.startsWith("mat-hull-")) yachtConfigState.hull = item.name;
  else if (item.id === "mat-deck-sofa") yachtConfigState.deckSofa = "Anthracite Marine Bouclé";
  else if (item.id === "mat-deck-floor") yachtConfigState.deckFloor = "Dark Slate Thermo-Ash Decking";
  else if (item.id.startsWith("mat-salon-")) yachtConfigState.salonSuite = item.name;
  else if (item.id.startsWith("mood-")) yachtConfigState.atmosphere = item.name;

  const targetScene = item.to || item.scene || currentScene;
  playMp4Clip({
    src: item.src,
    code: item.code,
    name: item.name,
    loop: !!item.loop,
    holdLastFrame: !!item.holdLastFrame,
    followUpSrc: item.followUpSrc || null,
    followUpCode: item.followUpCode || "",
    followUpName: item.name + " (Loop)",
    targetScene,
    showPoisAfter: true
  });

  track("clip_trigger_v2", { id: item.id, code: item.code, name: item.name });
};

window.triggerCurrentOrbit = function triggerCurrentOrbit() {
  const sc = CONFIG_V2.scenes[currentScene];
  if (sc && sc.orbitVideo) {
    playMp4Clip({
      src: sc.orbitVideo,
      code: sc.orbitId || extractCodeFromSrc(sc.orbitVideo),
      name: sc.orbitLabel || `${sc.title} Orbit`,
      loop: true,
      targetScene: currentScene,
      showPoisAfter: true
    });
  } else {
    window.triggerCatalogClip("orbit-yacht-360");
  }
};

window.replayCurrentClip = function replayCurrentClip() {
  const vid = getActiveVideo();
  if (!vid) return;
  vid.currentTime = 0;
  vid.play().catch(() => {});
};

window.toggleForceLoop = function toggleForceLoop() {
  forceLoopMode = !forceLoopMode;
  const vid = getActiveVideo();
  if (vid) vid.loop = forceLoopMode || vid.loop;
  const btn = document.getElementById("hud-loop-btn");
  if (btn) {
    btn.classList.toggle("active", forceLoopMode);
    btn.setAttribute("aria-pressed", String(forceLoopMode));
  }
};

window.togglePoisVisibility = function togglePoisVisibility() {
  poisVisible = !poisVisible;
  poiLayer.classList.toggle("pois-hidden", !poisVisible);
  const btn = document.getElementById("hud-poi-toggle");
  if (btn) btn.classList.toggle("active", poisVisible);
};

/* ── CONTEXT-AWARE ON-STAGE QUICK CONFIGURATOR BAR (#context-config-bar) ──
   Gives Yacht Builders & buyers 1-click access to Hull Colors, Deck Materials,
   Salon Finishes, and Camera Flights relevant to the current camera angle! */
function renderContextConfigBar(sceneId) {
  const bar = document.getElementById("context-config-bar");
  if (!bar) return;
  const cat = CONFIG_V2.catalog;

  let label = "";
  let pillsHtml = "";

  if (sceneId === "exterior") {
    label = "HULL FINISH & ORBIT";
    pillsHtml = cat.materials.hull.map(h => `
      <button class="ctx-swatch-btn" data-clip-code="${h.code}" onclick="triggerCatalogClip('${h.id}')" title="${h.name}">
        <span class="ctx-swatch-dot" style="background:${h.swatch}"></span>
        <span class="ctx-swatch-lbl">${h.name.replace(" Metallic", "").replace(" & Obsidian", "")}</span>
      </button>
    `).join("") + `
      <button class="ctx-action-btn" data-clip-code="97756" onclick="triggerCatalogClip('orbit-yacht-360')">
        <span>↻ 360° Yacht Orbit</span>
      </button>
    `;
  } else if (sceneId === "deck") {
    label = "AFT DECK BESPOKE";
    pillsHtml = cat.materials.deck.map(d => `
      <button class="ctx-swatch-btn" data-clip-code="${d.code}" onclick="triggerCatalogClip('${d.id}')" title="${d.desc}">
        <span class="ctx-swatch-dot" style="background:${d.swatch}"></span>
        <span class="ctx-swatch-lbl">${d.name}</span>
      </button>
    `).join("") + `
      <button class="ctx-action-btn" data-clip-code="97755" onclick="triggerCatalogClip('orbit-deck-sofas')">
        <span>↻ Orbit Loungers</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97732" onclick="triggerCatalogClip('cam-deck-to-salon-a')">
        <span>→ Salon Glide A</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97735" onclick="triggerCatalogClip('cam-deck-to-salon-b')">
        <span>→ Salon Walk B</span>
      </button>
    `;
  } else if (sceneId === "salon") {
    label = "MAIN SALON MILLWORK & UPHOLSTERY";
    pillsHtml = cat.materials.salon.map(s => `
      <button class="ctx-swatch-btn" data-clip-code="${s.code}" onclick="triggerCatalogClip('${s.id}')" title="${s.desc}">
        <span class="ctx-swatch-dot" style="background:${s.swatch}"></span>
        <span class="ctx-swatch-lbl">${s.name}</span>
      </button>
    `).join("");
  } else if (sceneId === "flybridge") {
    label = "UPPER DECK CAMERA FLIGHTS";
    pillsHtml = `
      <button class="ctx-action-btn" data-clip-code="97733" onclick="triggerCatalogClip('cam-flybridge-to-salon-a')">
        <span>↘ Side Glass Dive to Salon</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97736" onclick="triggerCatalogClip('cam-flybridge-to-salon-b')">
        <span>↘ Stern Overhang Sweep to Salon</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97743" onclick="triggerCatalogClip('cam-exterior-to-flybridge')">
        <span>↺ Replay Approach</span>
      </button>
    `;
  } else if (sceneId === "horizon") {
    label = "AERIAL COVE PERSPECTIVES";
    pillsHtml = `
      <button class="ctx-action-btn" data-clip-code="97740" onclick="triggerCatalogClip('cam-horizon-static')">
        <span>⚓ Cove Static Vista</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97739" onclick="triggerCatalogClip('orbit-horizon')">
        <span>↻ 360° Cove & Horizon Orbit</span>
      </button>
      <button class="ctx-action-btn" data-clip-code="97734" onclick="triggerCatalogClip('cam-horizon-to-salon')">
        <span>↘ Epic Drone Dive into Salon</span>
      </button>
    `;
  }

  bar.innerHTML = `
    <span class="ctx-bar-eyebrow">${label}</span>
    <div class="ctx-bar-items">${pillsHtml}</div>
  `;
  highlightActiveCatalogButtons(currentClipCode);
}

/* ── RENDER INTERACTIVE HOTSPOTS (POIs) ON STAGE ── */
function renderPOIs(pois = []) {
  updatePanoBtn(true);
  clearTimeout(poiTimer);
  poiLayer.classList.remove("out");
  poiLayer.innerHTML = "";

  pois.forEach((p, idx) => {
    const el = document.createElement("div");
    el.className = "poi" + (p.type === "clip" ? " poi--clip" : "") + (p.type === "drawer" ? " poi--drawer" : "");
    el.style.left = p.x + "%";
    el.style.top = p.y + "%";
    el.style.animationDelay = idx * 70 + "ms";

    let iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    if (p.type === "clip") {
      iconSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    } else if (p.type === "drawer") {
      iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/></svg>';
    }

    el.innerHTML = `
      <div class="poi-btn">${iconSvg}<span class="poi-pulse"></span></div>
      <div class="poi-name">${p.label.replace(/\s*\(\d+\)$/, "")}</div>
    `;

    const activate = () => {
      if (p.type === "nav" && p.target) {
        navigateTo(p.target);
      } else if (p.type === "clip" && p.clipId) {
        window.triggerCatalogClip(p.clipId);
      } else if (p.type === "drawer") {
        openExplorerDrawer(p.drawerTab || "materials");
      }
    };

    el.addEventListener("click", activate);
    el.addEventListener("touchstart", e => {
      e.preventDefault();
      activate();
    }, { passive: false });

    poiLayer.appendChild(el);
  });
}

function hidePOIs() {
  updatePanoBtn(false);
  clearTimeout(poiTimer);
  poiLayer.classList.add("out");
  poiTimer = setTimeout(() => {
    poiLayer.innerHTML = "";
    poiLayer.classList.remove("out");
  }, 260);
}

/* ── BUILD BOTTOM CAMERA DOCK (#track) ── */
function buildTrack() {
  trackEl.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.id = "track-pts";

  CONFIG_V2.timeline.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "t-pt";
    btn.dataset.id = item.id;
    btn.setAttribute("aria-label", item.label);
    btn.setAttribute("data-label", `${item.badge} · ${item.label}`);
    btn.innerHTML = `
      ${item.icon}
      <div class="t-text">
        <span class="t-badge">${item.badge}</span>
        <span class="t-label">${item.shortLabel || item.label}</span>
      </div>
    `;
    btn.addEventListener("click", () => navigateTo(item.id));
    wrap.appendChild(btn);
  });

  const orbitBtn = document.createElement("button");
  orbitBtn.id = "dock-orbit-btn";
  orbitBtn.className = "t-pt t-pt--orbit";
  orbitBtn.setAttribute("data-label", "360° Aerial / Deck Orbit");
  orbitBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
    <div class="t-text">
      <span class="t-badge">MOTION</span>
      <span class="t-label">Orbit 360°</span>
    </div>
  `;
  orbitBtn.addEventListener("click", () => window.triggerCurrentOrbit());
  wrap.appendChild(orbitBtn);

  trackEl.appendChild(wrap);
  trackEl.classList.add("show");
}

function setActiveTimeline(sceneId) {
  document.querySelectorAll(".t-pt[data-id]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === sceneId);
  });
}

function updateSceneHeader(sceneId) {
  const sc = CONFIG_V2.scenes[sceneId];
  const tl = CONFIG_V2.timeline.find(t => t.id === sceneId);
  if (!sc) return;

  const badgeEl = document.getElementById("brand-scene-badge");
  const titleEl = document.getElementById("brand-scene-title");
  const coordsEl = document.getElementById("brand-scene-coords");
  if (badgeEl && tl) badgeEl.textContent = tl.badge;
  if (titleEl) titleEl.textContent = sc.title;
  if (coordsEl && tl) coordsEl.textContent = `${tl.coords} · ${tl.elevation}`;
}

/* ── BUILD EXPLORER DRAWER & MOOD PILLS (ALL 29 VIDEOS) ── */
function buildExplorerMenus() {
  const cat = CONFIG_V2.catalog;

  // 1. Top Mood Quick-Bar (#mood-quick-bar)
  const moodBar = document.getElementById("mood-quick-bar");
  if (moodBar) {
    const quickMoods = [
      { id: "mood-day-sunny", label: "Noon Sun", code: "97757" },
      { id: "mood-soft-lighting", label: "Coastal Mist", code: "97750" },
      { id: "mood-day-to-rain", label: "Sun → Rain", code: "97748" },
      { id: "mood-rain-loop", label: "Storm Loop", code: "97749" },
      { id: "mood-day-to-night", label: "Dusk Cycle", code: "97753" },
      { id: "mood-night-loop", label: "Night LEDs", code: "97754" }
    ];
    moodBar.innerHTML = quickMoods.map(m => `
      <button class="mood-pill" data-clip-code="${m.code}" data-clip-id="${m.id}" onclick="triggerCatalogClip('${m.id}')" title="${m.label}">
        <span class="mood-pill-dot" data-mood="${m.id}"></span>
        <span class="mood-pill-lbl">${m.label}</span>
      </button>
    `).join("");
  }

  // 2. Explorer Drawer — Tab 1: MATERIALS & COLORS (8 videos)
  const matContainer = document.getElementById("exp-tab-materials");
  if (matContainer) {
    const renderMatGroup = (title, subtitle, items) => `
      <div class="exp-section">
        <div class="exp-section-head">
          <h4>${title}</h4>
          <span>${subtitle}</span>
        </div>
        <div class="exp-cards-grid">
          ${items.map(item => `
            <button class="exp-card" data-clip-code="${item.code}" data-clip-id="${item.id}" onclick="triggerCatalogClip('${item.id}')">
              <div class="exp-swatch" style="background: ${item.swatch}">
                <span class="exp-code-badge">CLIP #${item.code}</span>
              </div>
              <div class="exp-card-body">
                <div class="exp-card-cat">${item.category}</div>
                <div class="exp-card-title">${item.name}</div>
                <div class="exp-card-desc">${item.desc}</div>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    matContainer.innerHTML =
      renderMatGroup("Exterior Hull Paint", "Aerodynamic Superstructure & Hull Finishes", cat.materials.hull) +
      renderMatGroup("Aft Deck Planking & Loungers", "Marine Teak & Weatherproof Loro Piana Bouclé", cat.materials.deck) +
      renderMatGroup("Main Salon Bespoke Interior", "Italian Velvet, Linen & Bianco Carrara Stone", cat.materials.salon);
  }

  // 3. Explorer Drawer — Tab 2: CAMERA TRANSITIONS (11 videos)
  const camContainer = document.getElementById("exp-tab-cameras");
  if (camContainer) {
    camContainer.innerHTML = `
      <div class="exp-section">
        <div class="exp-section-head">
          <h4>Cinematic Camera Flights</h4>
          <span>11 Bespoke Aerial & Interior Tracking Shots</span>
        </div>
        <div class="exp-list">
          ${cat.cameraTransitions.map(c => `
            <button class="exp-list-item" data-clip-code="${c.code}" data-clip-id="${c.id}" onclick="triggerCatalogClip('${c.id}')">
              <div class="exp-list-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
              <div class="exp-list-info">
                <div class="exp-list-title">${c.name}</div>
                <div class="exp-list-sub">${c.sub}</div>
              </div>
              <div class="exp-list-meta">
                <span class="exp-code-pill">#${c.code}</span>
                <span class="exp-play-tag">FLY ▶</span>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 4. Explorer Drawer — Tab 3: ORBITS & LOOPS (5 videos)
  const orbitContainer = document.getElementById("exp-tab-orbits");
  if (orbitContainer) {
    orbitContainer.innerHTML = `
      <div class="exp-section">
        <div class="exp-section-head">
          <h4>360° Orbits & Living Loops</h4>
          <span>5 Continuous Marine Perspectives</span>
        </div>
        <div class="exp-list">
          ${cat.orbits.map(o => `
            <button class="exp-list-item" data-clip-code="${o.code}" data-clip-id="${o.id}" onclick="triggerCatalogClip('${o.id}')">
              <div class="exp-list-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="12" rx="10" ry="4.2"/><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z"/></svg>
              </div>
              <div class="exp-list-info">
                <div class="exp-list-title">${o.name}</div>
                <div class="exp-list-sub">${o.sub}</div>
              </div>
              <div class="exp-list-meta">
                <span class="exp-badge-type">${o.badge}</span>
                <span class="exp-code-pill">#${o.code}</span>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  // 5. Explorer Drawer — Tab 4: LIGHTING & WEATHER MOODS (6 videos)
  const moodContainer = document.getElementById("exp-tab-moods");
  if (moodContainer) {
    moodContainer.innerHTML = `
      <div class="exp-section">
        <div class="exp-section-head">
          <h4>Atmosphere, Weather & Marine Illumination</h4>
          <span>6 Environmental Simulations · Sun, Mist, Rain & Night Underwater LEDs</span>
        </div>
        <div class="exp-cards-grid">
          ${cat.moods.map(m => `
            <button class="exp-card" data-clip-code="${m.code}" data-clip-id="${m.id}" onclick="triggerCatalogClip('${m.id}')">
              <div class="exp-swatch" style="background: ${m.swatch}">
                <span class="exp-code-badge">CLIP #${m.code}</span>
                <span class="exp-type-tag">${m.badge}</span>
              </div>
              <div class="exp-card-body">
                <div class="exp-card-title">${m.name}</div>
                <div class="exp-card-desc">${m.sub}</div>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }
}

function highlightActiveCatalogButtons(code) {
  document.querySelectorAll("[data-clip-code]").forEach(el => {
    el.classList.toggle("active", el.dataset.clipCode === String(code));
  });
  // Mirror the active atmosphere on the collapsed dropdown button
  const activeMood = document.querySelector(".mood-pill.active");
  if (activeMood) {
    const lbl = document.getElementById("mood-toggle-lbl");
    const dot = document.getElementById("mood-toggle-dot");
    if (lbl) lbl.textContent = activeMood.querySelector(".mood-pill-lbl")?.textContent || "";
    if (dot) dot.dataset.mood = activeMood.dataset.clipId;
  }
}

/* ── GROUPED CONTROLS: DROPDOWN POPOVERS & COLLAPSIBLE HUD ── */
function closePopovers(except) {
  document.querySelectorAll(".pop-wrap.open").forEach(wrap => {
    if (wrap === except) return;
    wrap.classList.remove("open");
    wrap.querySelector("[data-pop]")?.setAttribute("aria-expanded", "false");
  });
}

function initPopovers() {
  document.querySelectorAll("[data-pop]").forEach(btn => {
    const wrap = document.getElementById(btn.dataset.pop);
    if (!wrap) return;
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = !wrap.classList.contains("open");
      closePopovers(wrap);
      wrap.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    // Picking an item closes the menu
    wrap.querySelector(".pop-menu")?.addEventListener("click", e => {
      if (e.target.closest("button")) closePopovers();
    });
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".pop-wrap")) closePopovers();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePopovers();
  });
}

window.toggleHudExpanded = function toggleHudExpanded() {
  const hud = document.getElementById("telemetry-hud");
  const btn = document.getElementById("hud-expand");
  if (!hud) return;
  const expanded = hud.classList.toggle("expanded");
  btn?.setAttribute("aria-expanded", String(expanded));
};

/* ── EXPLORER DRAWER & SHIPYARD DOSSIER MODAL ── */
let explorerOpen = false;
window.toggleExplorerDrawer = function toggleExplorerDrawer(forceState) {
  explorerOpen = typeof forceState === "boolean" ? forceState : !explorerOpen;
  document.getElementById("explorer-drawer")?.classList.toggle("open", explorerOpen);
  document.getElementById("explorer-toggle-btn")?.classList.toggle("active", explorerOpen);
};

window.openExplorerDrawer = function openExplorerDrawer(tabName) {
  if (tabName) window.switchExplorerTab(tabName);
  window.toggleExplorerDrawer(true);
};

window.switchExplorerTab = function switchExplorerTab(tabName) {
  document.querySelectorAll(".exp-tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });
  document.querySelectorAll(".exp-tab-panel").forEach(p => {
    p.classList.toggle("active", p.id === `exp-tab-${tabName}`);
  });
};

window.toggleDossierModal = function toggleDossierModal(force) {
  const modal = document.getElementById("dossier-modal");
  if (!modal) return;
  const open = typeof force === "boolean" ? force : !modal.classList.contains("open");
  if (open) {
    document.getElementById("dos-hull").textContent = yachtConfigState.hull;
    document.getElementById("dos-deck-sofa").textContent = yachtConfigState.deckSofa;
    document.getElementById("dos-deck-floor").textContent = yachtConfigState.deckFloor;
    document.getElementById("dos-salon").textContent = yachtConfigState.salonSuite;
    document.getElementById("dos-mood").textContent = yachtConfigState.atmosphere;
  }
  modal.classList.toggle("open", open);
};

window.submitDossierLead = function submitDossierLead(e) {
  if (e) e.preventDefault();
  const btn = document.getElementById("dos-submit-btn");
  if (btn) {
    btn.textContent = "✓ Private Consultation & Dossier Requested";
    btn.classList.add("confirmed");
  }
};

/* ── TELEMETRY & VIDEO PROGRESS HUD ── */
function updateTelemetryHud({ code, name, isLoop, isTransition }) {
  const codeEl = document.getElementById("hud-clip-code");
  const nameEl = document.getElementById("hud-clip-name");
  const modeEl = document.getElementById("hud-clip-mode");
  if (codeEl) codeEl.textContent = `#${code}`;
  if (nameEl) nameEl.textContent = name;
  if (modeEl) {
    modeEl.textContent = isLoop ? "LOOP" : (isTransition ? "MOTION" : "READY");
    modeEl.className = "hud-mode-badge " + (isLoop ? "is-loop" : "is-once");
  }
}

function initHudProgressTicker() {
  const fillEl = document.getElementById("hud-progress-fill");
  const timeEl = document.getElementById("hud-timecode");
  const barEl = document.getElementById("hud-progress-bar");

  if (barEl) {
    barEl.addEventListener("click", e => {
      const vid = getActiveVideo();
      if (!vid || !vid.duration) return;
      const rect = barEl.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      vid.currentTime = ratio * vid.duration;
      vid.play().catch(() => {});
    });
  }

  function tick() {
    const vid = getActiveVideo();
    if (vid && vid.duration && isFinite(vid.duration)) {
      const pct = Math.min(100, (vid.currentTime / vid.duration) * 100);
      if (fillEl) fillEl.style.width = pct.toFixed(1) + "%";
      if (timeEl) {
        timeEl.textContent = `${vid.currentTime.toFixed(1)}s / ${vid.duration.toFixed(1)}s`;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── 360° BUTTON ── */
function updatePanoBtn(visible) {
  const btn = document.getElementById("pano-btn");
  if (!btn) return;
  btn.classList.toggle("show", !!visible);
}

function initPanoBtn() {
  const btn = document.getElementById("pano-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (window.openPanoModal) window.openPanoModal(currentScene);
  });
}

/* ── CUSTOM CURSOR ── */
function initCursor() {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("ring");
  if (!cursor || !ring || MOBILE) return;
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  document.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function loop() {
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener("mouseover", e => {
    cursor.classList.toggle("on", !!e.target.closest("button, a, .t-pt, .poi, input, select, textarea"));
  });
}

/* ── CAPTURE CURRENT VIDEO FRAME FOR AI STUDIO & BESPOKE SHOP ── */
async function captureSceneFrame() {
  try {
    const w = innerWidth, h = innerHeight;
    const scale = Math.min(1, 1024 / w);
    const cw = Math.round(w * scale), ch = Math.round(h * scale);
    const c = document.createElement("canvas");
    c.width = cw;
    c.height = ch;
    const cctx = c.getContext("2d");
    const vid = getActiveVideo();
    if (vid && vid.readyState >= 2 && vid.videoWidth > 0) {
      const vw = vid.videoWidth, vh = vid.videoHeight;
      const r = Math.max(cw / vw, ch / vh);
      const dw = vw * r, dh = vh * r;
      cctx.drawImage(vid, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      return c.toDataURL("image/jpeg", 0.85).split(",")[1];
    }
    return null;
  } catch (e) {
    return null;
  }
}

/* ── AI STUDIO & GALLERY ── */
function aiKey() {
  return document.getElementById("ai-key")?.value.trim() || "";
}

function aiTogglePanel() {
  const panel = document.getElementById("ai-panel");
  const btn = document.getElementById("ai-trigger-btn");
  if (!panel) return;
  const isOpen = panel.classList.contains("open");
  if (!isOpen) {
    panel.style.top = "50%";
    panel.style.left = "50%";
    panel.style.transform = "translate(-50%, -50%) scale(0.97)";
  }
  panel.classList.toggle("open", !isOpen);
  btn?.classList.toggle("active", !isOpen);
}

function aiSwitchTab(tab) {
  document.querySelectorAll(".ai-tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".ai-tab-panel").forEach(p => p.classList.toggle("active", p.id === "ai-tab-" + tab));
}

let _aiImages = [], _aiCapturedB64 = null, _aiImgIdx = 0;
function aiSetStatus(msg) {
  const el = document.getElementById("ai-img-status");
  if (el) el.textContent = msg;
}
function aiShowImage(idx) {
  _aiImgIdx = idx;
  const item = _aiImages[idx];
  if (!item) return;
  document.getElementById("ai-result-img").src = item.url || "data:image/png;base64," + item.b64;
  document.getElementById("ai-img-wrap")?.classList.add("visible");
  document.getElementById("ai-img-dl-btn")?.classList.add("visible");
}
function aiCloseImage() {
  _aiImages = [];
  _aiImgIdx = 0;
  document.getElementById("ai-img-wrap")?.classList.remove("visible");
  document.getElementById("ai-img-dl-btn")?.classList.remove("visible");
  aiSetStatus("");
}
function aiOpenLightbox() {
  const src = document.getElementById("ai-result-img")?.src;
  if (!src) return;
  const v = document.getElementById("ai-lightbox-video");
  v.pause();
  v.classList.remove("open");
  const img = document.getElementById("ai-lightbox-img");
  img.src = src;
  img.classList.add("open");
  document.getElementById("ai-lightbox")?.classList.add("open");
}
function aiCloseLightbox() {
  document.getElementById("ai-lightbox")?.classList.remove("open");
  document.getElementById("ai-lightbox-video")?.pause();
}
function aiDownload() {
  if (!_aiImages.length) return;
  const item = _aiImages[_aiImgIdx];
  const a = document.createElement("a");
  a.href = item.url || "data:image/png;base64," + item.b64;
  a.download = "yacht-ai-render.png";
  a.click();
}
async function aiManualCapture() {
  const btn = document.querySelector("#ai-tab-image .ai-capture-btn");
  const thumb = document.getElementById("ai-img-capture-thumb");
  if (!btn || !thumb) return;
  btn.textContent = "⏳ Capturing...";
  btn.disabled = true;
  const b64 = await captureSceneFrame();
  btn.disabled = false;
  if (!b64) {
    btn.textContent = "📷 Capture view";
    thumb.innerHTML = '<span style="color:rgba(255,80,80,0.7)">Failed — try again</span>';
    return;
  }
  _aiCapturedB64 = b64;
  btn.textContent = "✓ Recapture";
  thumb.innerHTML = `<img src="data:image/jpeg;base64,${b64}" alt="capture" />`;
}

async function aiGenerate() {
  const key = aiKey();
  const promptText = document.getElementById("ai-img-prompt")?.value.trim() || "";
  const hasCap = _aiCapturedB64 && _aiCapturedB64.length >= 500;
  const ratio = document.getElementById("ai-img-ratio")?.value || "16:9";
  if (!key) return aiSetStatus("Enter your Gemini API Key");
  if (!promptText && !hasCap) return aiSetStatus("Enter a prompt or capture the current yacht view");

  const finalPrompt = (promptText || "Enhance this superyacht scene into an ultra-photorealistic luxury marine visualization, preserving the exact yacht geometry and camera angle") + ", photorealistic style";
  const btn = document.getElementById("ai-img-generate-btn");
  btn.disabled = true;
  _aiImages = [];
  aiSetStatus("Generating yacht visualization...");
  try {
    await aiGemini(key, finalPrompt, ratio);
    if (_aiImages.length) {
      aiShowImage(0);
      aiSetStatus("Done!");
    } else {
      aiSetStatus("No image returned.");
    }
  } catch (e) {
    aiSetStatus("Error: " + e.message);
  }
  btn.disabled = false;
}

async function aiGemini(key, prompt, ratio = "16:9") {
  const headers = { "Content-Type": "application/json" };
  let cap = _aiCapturedB64;
  if (!cap || cap.length < 500) cap = await captureSceneFrame();
  const imageModels = ["gemini-3.1-flash-image", "gemini-3-pro-image"];
  const errs = [];
  for (const model of imageModels) {
    try {
      const parts = [{ text: prompt }];
      if (cap && cap.length >= 500) parts.push({ inlineData: { mimeType: "image/jpeg", data: cap } });
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: { responseModalities: ["IMAGE", "TEXT"], imageConfig: { aspectRatio: ratio } }
        })
      });
      const d = await resp.json();
      if (!resp.ok) {
        errs.push(`[${model}] ${d?.error?.message || resp.status}`);
        continue;
      }
      const imgs = (d?.candidates?.[0]?.content?.parts || []).filter(p => p.inlineData?.data);
      if (imgs.length) {
        imgs.forEach(p => {
          _aiImages.push({ b64: p.inlineData.data });
          galleryAdd(p.inlineData.data, "image/png", "AI Studio Yacht");
        });
        return;
      }
    } catch (err) {
      errs.push(`[${model}] ${err.message}`);
    }
  }
  throw new Error(errs.join("\n") || "Image generation failed.");
}

/* ── VEO VIDEO GENERATION HELPERS ── */
let _aiVideoB64Frame = null, _aiVideoMime = "image/jpeg", _aiVideoUrl = null;
async function aiSetVideoSource(srcType) {
  const thumb = document.getElementById("ai-vid-capture-thumb");
  document.querySelectorAll("#ai-tab-video .ai-capture-btn").forEach(b => b.classList.toggle("active", b.dataset.src === srcType));
  if (srcType === "capture") {
    thumb.textContent = "⏳ Capturing...";
    const b64 = await captureSceneFrame();
    if (!b64) {
      thumb.textContent = "Capture failed";
      _aiVideoB64Frame = null;
      return;
    }
    _aiVideoB64Frame = b64;
    _aiVideoMime = "image/jpeg";
    thumb.innerHTML = `<img src="data:image/jpeg;base64,${b64}" alt="capture" />`;
  } else if (srcType === "generated") {
    if (!_aiImages.length) {
      thumb.textContent = "Generate an image in the Image tab first";
      _aiVideoB64Frame = null;
      return;
    }
    _aiVideoB64Frame = _aiImages[_aiImgIdx].b64;
    _aiVideoMime = "image/png";
    thumb.innerHTML = `<img src="data:image/png;base64,${_aiVideoB64Frame}" alt="generated" />`;
  }
}
function aiSetVideoStatus(msg) {
  const el = document.getElementById("ai-vid-status");
  if (el) el.textContent = msg;
}
function aiCloseVideo() {
  const wrap = document.getElementById("ai-vid-wrap");
  const vid = document.getElementById("ai-result-video");
  if (vid) {
    vid.pause();
    vid.removeAttribute("src");
    vid.load();
  }
  if (_aiVideoUrl) {
    URL.revokeObjectURL(_aiVideoUrl);
    _aiVideoUrl = null;
  }
  wrap?.classList.remove("visible");
  document.getElementById("ai-vid-dl-btn")?.classList.remove("visible");
}
function aiDownloadVideo() {
  if (!_aiVideoUrl) return;
  const a = document.createElement("a");
  a.href = _aiVideoUrl;
  a.download = "yacht-ai-video.mp4";
  a.click();
}
function extractVideoResult(e) {
  const t = e?.response;
  if (!t) return null;
  const list = [
    t?.generateVideoResponse?.generatedSamples?.[0]?.video,
    t?.generatedVideos?.[0]?.video,
    t?.videos?.[0]?.video,
    t?.videos?.[0],
    t?.generateVideoResponse?.generatedSamples?.[0]
  ].filter(Boolean);
  for (const item of list) {
    if (item?.uri) return { uri: item.uri };
    if (item?.videoBytes) return { b64: item.videoBytes, mime: item.mimeType || "video/mp4" };
    if (item?.bytesBase64Encoded) return { b64: item.bytesBase64Encoded, mime: item.mimeType || "video/mp4" };
  }
  return null;
}
async function aiStartVeoOperation(key, ver, model, instance, ratio) {
  const resp = await fetch(`https://generativelanguage.googleapis.com/${ver}/models/${model}:predictLongRunning?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instances: [instance], parameters: { aspectRatio: ratio } })
  });
  const d = await resp.json();
  if (!resp.ok) throw new Error(d?.error?.message || String(resp.status));
  if (!d.name) throw new Error("No operation name returned.");
  return { ver, name: d.name };
}
async function aiPollVeoOperation(key, ver, name) {
  let done = false, tries = 0, result = null;
  while (!done && tries < 60) {
    await new Promise(r => setTimeout(r, 10000));
    tries++;
    const resp = await fetch(`https://generativelanguage.googleapis.com/${ver}/${name}?key=${key}`);
    const d = await resp.json();
    if (!resp.ok) throw new Error(d?.error?.message || String(resp.status));
    result = d;
    done = !!d.done;
  }
  if (!done) throw new Error("Timed out waiting for video.");
  if (result.error) throw new Error(result.error.message || "Generation error.");
  return result;
}
async function aiGenerateVideo() {
  const key = aiKey();
  const prompt = document.getElementById("ai-vid-prompt")?.value.trim() || "";
  const ratio = document.getElementById("ai-vid-ratio")?.value || "16:9";
  if (!key) return aiSetVideoStatus("Enter your API Key");
  if (!prompt) return aiSetVideoStatus("Enter a video description");
  const btn = document.getElementById("ai-vid-generate-btn");
  btn.disabled = true;
  aiCloseVideo();
  aiSetVideoStatus("Starting Veo 3.1 video generation...");
  try {
    const instance = { prompt };
    if (_aiVideoB64Frame) instance.image = { bytesBase64Encoded: _aiVideoB64Frame, mimeType: _aiVideoMime };
    const veoModels = ["veo-3.1-generate-preview", "veo-3.0-generate-preview", "veo-3.0-fast-generate-preview", "veo-2.0-generate-001"];
    let op = null;
    const errs = [];
    outer: for (const m of veoModels) {
      for (const v of ["v1beta", "v1"]) {
        try { op = await aiStartVeoOperation(key, v, m, instance, ratio); break outer; }
        catch (err) { errs.push(`[${v}/${m}] ${err.message}`); }
      }
    }
    if (!op) throw new Error("No Veo model available.\n" + errs.join("\n"));
    aiSetVideoStatus("Rendering video (1 to 3 minutes)...");
    const res = await aiPollVeoOperation(key, op.ver, op.name);
    const d = extractVideoResult(res);
    if (!d) throw new Error("No video in response.");
    let blob;
    if (d.uri) {
      const r = await fetch(d.uri, { headers: { "x-goog-api-key": key } });
      blob = await r.blob();
    } else {
      const bin = atob(d.b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      blob = new Blob([arr], { type: d.mime || "video/mp4" });
    }
    _aiVideoUrl = URL.createObjectURL(blob);
    document.getElementById("ai-result-video").src = _aiVideoUrl;
    document.getElementById("ai-vid-wrap")?.classList.add("visible");
    document.getElementById("ai-vid-dl-btn")?.classList.add("visible");
    aiSetVideoStatus("Done!");
    galleryAddVideoBlob(blob, "AI Yacht Video");
  } catch (e) {
    aiSetVideoStatus("Error: " + e.message);
  }
  btn.disabled = false;
}

/* ── SESSION GALLERY ── */
let galleryImages = [];
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result).split(",")[1]);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}
function galleryAdd(b64, mime, label) {
  const type = (mime || "").startsWith("video/") ? "video" : "image";
  galleryImages.unshift({ b64, mime: mime || "image/png", label: label || "Generated", ts: Date.now(), type });
  const badge = document.getElementById("gallery-btn-badge");
  if (badge) {
    badge.textContent = galleryImages.length;
    badge.classList.add("show");
  }
  if (document.getElementById("gallery-modal")?.classList.contains("open")) galleryRender();
}
async function galleryAddVideoBlob(blob, label) {
  try {
    const b64 = await blobToBase64(blob);
    galleryAdd(b64, blob.type || "video/mp4", label);
  } catch (e) {}
}
function galleryRender() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  if (!galleryImages.length) {
    grid.innerHTML = '<div id="gallery-empty">No renders yet — generate an image or video from AI Studio or the Bespoke Outfitting panel.</div>';
    return;
  }
  grid.innerHTML = galleryImages.map((img, i) => `
    <div class="gallery-item">
      ${img.type === "video"
        ? `<video src="data:${img.mime};base64,${img.b64}" muted loop playsinline preload="metadata" onclick="galleryPreview(${i})"></video><div class="gallery-item-play">▶</div>`
        : `<img src="data:${img.mime};base64,${img.b64}" alt="${img.label}" onclick="galleryPreview(${i})" />`}
      <div class="gallery-item-label">${img.label}</div>
      <button class="gallery-dl-btn" title="Download" onclick="event.stopPropagation();galleryDownload(${i})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
      </button>
    </div>
  `).join("");
}
function galleryToggle() {
  const el = document.getElementById("gallery-modal");
  if (!el) return;
  const opening = !el.classList.contains("open");
  el.classList.toggle("open", opening);
  if (opening) galleryRender();
}
function galleryPreview(i) {
  const img = galleryImages[i];
  if (!img) return;
  const lightboxImg = document.getElementById("ai-lightbox-img");
  const lightboxVideo = document.getElementById("ai-lightbox-video");
  if (img.type === "video") {
    lightboxVideo.src = `data:${img.mime};base64,${img.b64}`;
    lightboxVideo.classList.add("open");
    lightboxImg.classList.remove("open");
    lightboxVideo.play().catch(() => {});
  } else {
    lightboxImg.src = `data:${img.mime};base64,${img.b64}`;
    lightboxImg.classList.add("open");
    lightboxVideo.classList.remove("open");
    lightboxVideo.pause();
  }
  document.getElementById("ai-lightbox")?.classList.add("open");
}
function galleryDownload(i) {
  const img = galleryImages[i];
  if (!img) return;
  const ext = img.type === "video" ? "mp4" : "png";
  const a = document.createElement("a");
  a.href = `data:${img.mime};base64,${img.b64}`;
  a.download = `yacht-${img.ts}.${ext}`;
  a.click();
}

/* ── INITIALIZATION ── */
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
  resizeCanvas();
  initCursor();
  buildTrack();
  buildExplorerMenus();
  initPopovers();
  initPanoBtn();
  initHudProgressTicker();

  const initialScene = sceneFromHash();
  updateSceneHeader(initialScene);
  setActiveTimeline(initialScene);
  renderContextConfigBar(initialScene);
  navigateTo(initialScene, true);
});
