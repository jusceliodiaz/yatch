/* ══════════════════════════════════════════════════════════════════════════
   SHOP V2 — Bespoke Superyacht FF&E Outfitting & Live Video Material Link
   Connects curated yacht furniture & finishes with:
   1. Live MP4 Video Preview on the main Yacht stage (triggers real MP4s!)
   2. 3D Model Viewer (Three.js) & Mobile AR (model-viewer)
   3. Gemini AI Scene Placement + Veo Video Generation
   ══════════════════════════════════════════════════════════════════════════ */

const SHOP_PRODUCTS = [
  {
    id: "bondholmen",
    cat: "sofas",
    name: "MARE LORO PIANA LOUNGER",
    variant: "Cockpit modular sofa · Cream Ivory → Anthracite Charcoal",
    size: "240×95×74 cm",
    price: 6800,
    liveClipId: "mat-deck-sofa",
    liveClipCode: "97751",
    img: "https://www.ikea.com/it/it/images/products/bondholmen-divano-a-2-posti-da-esterno-bianco-beige__1333145_pe946396_s5.jpg",
    url: "https://www.ikea.com/it/it/p/bondholmen-divano-a-2-posti-da-esterno-bianco-beige-50558185/",
    model: "glb/bondholmen.glb",
    store: "Custom",
    desc: "Marine-grade cockpit sofa upholstered in weather-resistant bouclé with quick-dry reticulated foam."
  },
  {
    id: "lacko",
    cat: "sofas",
    name: "RIVA SALON VELVET SUITE",
    variant: "Main Salon L-Sofa · Sand Linen → Deep Midnight Velvet",
    size: "360×185×78 cm",
    price: 14500,
    liveClipId: "mat-salon-harmony",
    liveClipCode: "97729",
    img: "https://www.ikea.com/it/it/images/products/laeckoe-divano-a-2-posti-da-esterno-grigio__1138955_pe880166_s5.jpg",
    url: "https://www.ikea.com/it/it/p/laeckoe-divano-a-2-posti-da-esterno-grigio-50522733/",
    model: "glb/lacko.glb",
    store: "Custom",
    desc: "Bespoke panoramic salon L-shaped lounge with navy velvet upholstery and terracotta accent cushions."
  },
  {
    id: "salon-duo-sofa",
    cat: "sofas",
    name: "MINOTTI NAUTICAL DUO",
    variant: "Port & Starboard Sofas · Slate Grey & Ocean Blue",
    size: "320×110×76 cm",
    price: 12900,
    liveClipId: "mat-salon-sofas",
    liveClipCode: "97730",
    img: "https://www.ikea.com/it/it/images/products/bondholmen-divano-a-2-posti-da-esterno-bianco-beige__1333145_pe946396_s5.jpg",
    url: "https://www.ikea.com/it/it/p/bondholmen-divano-a-2-posti-da-esterno-bianco-beige-50558185/",
    model: "glb/bondholmen.glb",
    store: "Custom",
    desc: "Dual opposing yacht salon sofas in brushed slate grey and deep ocean blue linen-blend fabric."
  },
  {
    id: "tallskar",
    cat: "chairs",
    name: "CARRARA MARBLE CENTER TABLE",
    variant: "Salon Low Table · Smoked Walnut ↔ White Carrara Marble",
    size: "140×140×36 cm",
    price: 5400,
    liveClipId: "mat-salon-table",
    liveClipCode: "97731",
    img: "https://www.ikea.com/it/it/images/products/tallskaer-poltrona-da-giardino-antracite__1385516_pe963345_s5.jpg",
    url: "https://www.ikea.com/it/it/p/tallskaer-poltrona-da-giardino-antracite-60575146/",
    model: "glb/tallskar.glb",
    store: "Custom",
    desc: "Low architectural yacht salon table crafted in bookmatched Bianco Carrara marble and smoked walnut."
  },
  {
    id: "skarpo",
    cat: "chairs",
    name: "SKARPÖ HELM LOUNGE",
    variant: "Sculpted marine deck armchair · Matte White",
    size: "81×79×71 cm",
    price: 1890,
    img: "https://www.ikea.com/it/it/images/products/skarpoe-poltrona-da-giardino-bianco__0729491_pe737010_s5.jpg",
    url: "https://www.ikea.com/it/it/p/skarpoe-poltrona-da-giardino-bianco-50575811/",
    model: "glb/skarpo.glb",
    store: "Custom",
    desc: "UV-stabilized sculpted marine lounge armchair with integrated water drainage for aft deck use."
  },
  {
    id: "nammaro",
    cat: "chairs",
    name: "NÄMMARÖ TEAK RECLINER",
    variant: "Folding Burmese teak deck chair · Warm Beige Cushion",
    size: "60×71×107 cm",
    price: 1250,
    img: "https://www.ikea.com/it/it/images/products/naemmaroe-sedia-relax-da-giardino-mordente-marrone-chiaro-kuddarna-grigio-beige-chiaro__1437400_pe984434_s5.jpg",
    url: "https://www.ikea.com/it/it/p/naemmaroe-sedia-relax-da-giardino-mordente-marrone-chiaro-kuddarna-grigio-beige-chiaro-s09607711/",
    model: "glb/nammaro.glb",
    store: "Custom",
    desc: "Foldable solid teak reclining deck chair with salt-resistant brass hardware and marine cushion."
  },
  {
    id: "fejka-ulivo",
    cat: "plants",
    name: "MEDITERRANEAN OLIVE BONSAI",
    variant: "Weighted ceramic marine planter · 150 cm",
    size: "pot 24 cm · h. 150 cm",
    price: 680,
    img: "https://www.ikea.com/it/it/images/products/fejka-pianta-artificiale-in-vaso-da-interno-esterno-ulivo-verde__1485471_pe1001980_s5.jpg",
    url: "https://www.ikea.com/it/it/p/fejka-pianta-artificiale-in-vaso-da-interno-esterno-ulivo-verde-40617699/",
    model: "glb/fejka-ulivo.glb",
    store: "Custom",
    desc: "Preserved Mediterranean olive tree in a non-slip weighted marine vessel for aft deck or salon styling."
  },
  {
    id: "fejka-succulenta",
    cat: "plants",
    name: "COASTAL AGAVE TRIO",
    variant: "Low-center-of-gravity stone planters (set of 3)",
    size: "pot 10 cm · h. 18 cm",
    price: 290,
    unit: "set of 3",
    img: "https://www.ikea.com/it/it/images/products/fejka-pianta-artificiale-in-vaso-da-interno-esterno-succulenta__0614187_pe686812_s5.jpg",
    url: "https://www.ikea.com/it/it/p/fejka-pianta-artificiale-in-vaso-da-interno-esterno-succulenta-50519764/",
    model: "glb/fejka-succulenta.glb",
    store: "Custom",
    desc: "Set of three sculptural coastal succulents in weighted travertine vessels for salon coffee tables."
  },
  {
    id: "runnen-acacia",
    cat: "floor",
    name: "BURMESE BLONDE TEAK DECK",
    variant: "Quarter-sawn marine teak planking · Black Sika caulking",
    size: "Full Aft Deck · 42 m²",
    price: 18500,
    unit: "deck",
    liveClipId: "mat-deck-floor",
    liveClipCode: "97752",
    img: "https://www.ikea.com/it/it/images/products/runnen-pedana-pavimentazione-da-esterno-acacia__1151157_pe884806_s5.jpg",
    url: "https://www.ikea.com/it/it/p/runnen-pedana-pavimentazione-da-esterno-acacia-60518486/",
    model: "glb/runnen-acacia.glb",
    store: "Custom",
    desc: "Vacuum-bonded 12mm Burmese teak deck planking morphing to dark brushed slate thermo-ash (Video 97752)."
  },
  {
    id: "runnen-grigio",
    cat: "floor",
    name: "ANTHRACITE THERMO-ASH DECK",
    variant: "Brushed dark slate marine decking · Silver caulking",
    size: "Full Aft Deck · 42 m²",
    price: 21400,
    unit: "deck",
    liveClipId: "mat-deck-floor",
    liveClipCode: "97752",
    img: "https://www.ikea.com/it/it/images/products/runnen-pedana-pavimentazione-da-esterno-grigio-scuro__0237434_pe376790_s5.jpg",
    url: "https://www.ikea.com/it/it/p/runnen-pedana-pavimentazione-da-esterno-grigio-scuro-90238111/",
    model: "glb/runnen-grigio.glb",
    store: "Custom",
    desc: "Contemporary dark slate thermally modified ash decking for superyacht aft terraces."
  }
];

const SHOP_FALLBACK_MODELS = [
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb",
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb"
];

const shopState = {
  open: false,
  tab: "sofas",
  cart: new Set(JSON.parse(localStorage.getItem("yacht-v2-shop-cart") || "[]")),
  preloaded: false,
  captureB64: null,
  resultB64: null,
  confirmed: false,
  placeId: null,
  videoUrl: null
};

function shopProduct(id) { return SHOP_PRODUCTS.find(p => p.id === id); }
function shopCartItems() { return SHOP_PRODUCTS.filter(p => shopState.cart.has(p.id)); }
function shopTotal() { return shopCartItems().reduce((s, p) => s + p.price, 0); }
function shopFmt(n) {
  const dec = n % 1 === 0 ? 0 : 2;
  return "€ " + n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: 2 });
}
function shopSaveCart() {
  localStorage.setItem("yacht-v2-shop-cart", JSON.stringify([...shopState.cart]));
}

function shopToggle() {
  shopState.open = !shopState.open;
  document.getElementById("shop-panel")?.classList.toggle("open", shopState.open);
  document.getElementById("shop-btn")?.classList.toggle("active", shopState.open);
  if (shopState.open) {
    shopRenderGrid();
    shopPreloadModels();
  }
}

function shopSwitchTab(cat) {
  shopState.tab = cat;
  document.querySelectorAll(".shop-tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === cat));
  shopRenderGrid();
}

function shopRenderGrid() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;
  const items = SHOP_PRODUCTS.filter(p => p.cat === shopState.tab);
  grid.innerHTML = items.map(p => {
    const inCart = shopState.cart.has(p.id);
    const liveBtn = p.liveClipId ? `
      <button class="shop-live-mp4-btn" title="Trigger real MP4 material animation (${p.liveClipCode}) on stage" onclick="event.stopPropagation();window.triggerCatalogClip && window.triggerCatalogClip('${p.liveClipId}')">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <span>Play MP4 #${p.liveClipCode}</span>
      </button>` : "";
    return `
    <div class="shop-card${inCart ? " selected" : ""}" data-id="${p.id}" data-cat="${p.cat}" onclick="shopToggleItem('${p.id}')">
      <div class="shop-card-imgwrap">
        <img src="${p.img}" alt="${p.name} — ${p.variant}" loading="lazy" />
        <button class="shop-ai-btn" title="Place in your scene with AI" onclick="event.stopPropagation();shopPlaceOpen('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4z"/>
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>
          </svg>
          <span>AI</span>
        </button>
        ${p.cat === "floor" ? "" : `
        <button class="shop-3d-btn" title="View in 3D" onclick="event.stopPropagation();shop3dOpen('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z"/>
            <path d="M12 22V12M12 12L3.5 7M12 12l8.5-5"/>
          </svg>
          <span>3D</span>
        </button>
        <button class="shop-ar-btn" title="See it in your space (AR)" onclick="event.stopPropagation();shopArOpen('${p.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/>
            <path d="M12 8l3.5 2v4L12 16l-3.5-2v-4L12 8z"/>
          </svg>
          <span>AR</span>
        </button>`}
        ${inCart ? '<div class="shop-card-check">✓</div>' : ""}
      </div>
      <div class="shop-card-body">
        <div class="shop-card-name">${p.name}</div>
        <div class="shop-card-variant">${p.variant}</div>
        <div class="shop-card-size">${p.size}</div>
        ${liveBtn}
        <div class="shop-card-footer">
          <div class="shop-card-price">${shopFmt(p.price)}${p.unit ? `<span class="shop-price-unit"> /${p.unit}</span>` : ""}</div>
          <div class="shop-card-actions">
            <span class="shop-buy-link shop-buy-link--static">Bespoke</span>
            <button class="shop-add-btn${inCart ? " added" : ""}" onclick="event.stopPropagation();shopToggleItem('${p.id}')">
              ${inCart ? "Selected ✓" : "Select"}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
}

function shopToggleItem(id) {
  if (shopState.cart.has(id)) shopState.cart.delete(id);
  else shopState.cart.add(id);
  shopState.confirmed = false;
  shopSaveCart();
  shopRenderGrid();
  shopUpdateTotals();
  const orderOpen = document.getElementById("shop-order-modal")?.classList.contains("open");
  if (orderOpen) shopRenderOrder();
}

function shopUpdateTotals() {
  const total = shopTotal();
  const count = shopState.cart.size;
  const pill = document.getElementById("shop-total-pill");
  if (pill) {
    pill.classList.toggle("show", count > 0);
    pill.innerHTML = `<span class="shop-pill-lbl">Spec Total</span><span class="shop-pill-val">${shopFmt(total)}</span>`;
    pill.onclick = shopOpenOrder;
  }
  const badge = document.getElementById("shop-btn-badge");
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  }
  const foot = document.getElementById("shop-panel-total");
  if (foot) foot.textContent = shopFmt(total);
  const orderBtn = document.getElementById("shop-order-btn");
  if (orderBtn) orderBtn.disabled = count === 0;
}

function shop3dOpen(id) {
  const p = shopProduct(id);
  if (!p || !window.Shop3D) return;
  window.Shop3D.open(p, SHOP_FALLBACK_MODELS);
}

function shopPreloadModels() {
  if (shopState.preloaded || !window.Shop3D) return;
  shopState.preloaded = true;
  const run = () => SHOP_PRODUCTS.forEach(p => window.Shop3D.preload(p, SHOP_FALLBACK_MODELS));
  window.requestIdleCallback ? requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 800);
}

function shopArOpen(id) {
  const p = shopProduct(id);
  const viewer = document.getElementById("shop-ar-viewer");
  if (!p || !viewer) return;
  viewer.dataset.fallbackTried = "";
  if (p.usdz) viewer.setAttribute("ios-src", p.usdz);
  else viewer.removeAttribute("ios-src");
  viewer.alt = `${p.name} — ${p.variant}`;
  viewer.src = p.model;
  document.getElementById("shop-ar-name").textContent = p.name;
  document.getElementById("shop-ar-variant").textContent = p.variant;
  document.getElementById("shop-ar-price").textContent = shopFmt(p.price);
  document.getElementById("shop-ar-modal").classList.add("open");
  requestAnimationFrame(() => {
    const hint = document.getElementById("shop-ar-hint");
    if (hint) {
      hint.textContent = viewer.canActivateAR
        ? 'Tap "View in AR" and point your camera at the deck or floor.'
        : "AR available on smartphones — on desktop you can orbit the 3D model directly.";
    }
  });
}

function shopArClose() {
  document.getElementById("shop-ar-modal")?.classList.remove("open");
}

(function shopArInit() {
  const viewer = document.getElementById("shop-ar-viewer");
  if (!viewer) return;
  viewer.addEventListener("error", () => {
    if (viewer.dataset.fallbackTried) return;
    viewer.dataset.fallbackTried = "1";
    viewer.src = SHOP_FALLBACK_MODELS[0];
  });
})();

function shopOpenOrder() {
  shopRenderOrder();
  document.getElementById("shop-order-modal")?.classList.add("open");
}

function shopCloseOrder() {
  document.getElementById("shop-order-modal")?.classList.remove("open");
}

function shopRenderOrder() {
  const listEl = document.getElementById("shop-order-list");
  if (!listEl) return;
  const cats = [["sofas", "Loungers & Sofas"], ["chairs", "Tables & Chairs"], ["plants", "Marine Botanicals"], ["floor", "Deck Planking"]];
  let html = "";
  cats.forEach(([cat, label]) => {
    const items = shopCartItems().filter(p => p.cat === cat);
    if (!items.length) return;
    const sub = items.reduce((s, p) => s + p.price, 0);
    html += `<div class="shop-order-cat"><span>${label}</span><span>${shopFmt(sub)}</span></div>`;
    items.forEach(p => {
      html += `
      <div class="shop-order-line">
        <img src="${p.img}" alt="" />
        <div class="shop-order-line-info">
          <div class="shop-order-line-name">${p.name}</div>
          <div class="shop-order-line-variant">${p.variant} · ${p.size}</div>
        </div>
        <div class="shop-order-line-price">${shopFmt(p.price)}${p.unit ? `<span class="shop-price-unit"> /${p.unit}</span>` : ""}</div>
        <button class="shop-order-remove" title="Remove" onclick="shopToggleItem('${p.id}')">
          <svg viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>
        </button>
      </div>`;
    });
  });
  if (!html) html = `<div class="shop-order-empty">No bespoke outfitting selected yet.</div>`;
  listEl.innerHTML = html;
  document.getElementById("shop-order-total").textContent = shopFmt(shopTotal());

  const confirmBtn = document.getElementById("shop-confirm-btn");
  if (confirmBtn) {
    confirmBtn.textContent = shopState.confirmed ? "✓ Specification Saved" : "Confirm Specification";
    confirmBtn.classList.toggle("confirmed", shopState.confirmed);
    confirmBtn.disabled = shopState.cart.size === 0;
  }
}

function shopConfirmOrder() {
  if (!shopState.cart.size) return;
  shopState.confirmed = true;
  shopRenderOrder();
}

function shopAiStatus(msg) {
  const el = document.getElementById("shop-ai-status");
  if (el) el.textContent = msg;
}

const SHOP_AI_ACTION_LABELS = {
  plants: { button: "Place botanical in yacht scene", status: "Placing botanical in yacht scene..." },
  floor: { button: "Apply decking in yacht scene", status: "Applying marine decking..." }
};
const SHOP_AI_ACTION_DEFAULT = { button: "Place furniture in yacht scene", status: "Placing bespoke furniture in scene..." };
function shopAiActionLabels(cat) {
  return SHOP_AI_ACTION_LABELS[cat] || SHOP_AI_ACTION_DEFAULT;
}

function shopPlaceOpen(id, originX, originY) {
  const p = shopProduct(id);
  if (!p) return;
  const modal = document.getElementById("shop-place-modal");
  modal.style.setProperty("--drop-x", (originX != null ? originX : window.innerWidth / 2) + "px");
  modal.style.setProperty("--drop-y", (originY != null ? originY : window.innerHeight / 2) + "px");
  document.getElementById("shop-ai-generate-btn").textContent = shopAiActionLabels(p.cat).button;
  if (shopState.placeId !== id) {
    shopState.resultB64 = null;
    document.getElementById("shop-ai-result")?.classList.remove("visible");
    document.getElementById("shop-ai-dl-btn")?.classList.remove("visible");
    shopAiStatus("");
    shopAiCloseVideo();
    shopAiVideoStatus("");
  }
  shopState.placeId = id;
  document.getElementById("shop-place-img").src = p.img;
  document.getElementById("shop-place-name").textContent = p.name;
  document.getElementById("shop-place-variant").textContent = p.variant;
  document.getElementById("shop-place-price").textContent = shopFmt(p.price);
  modal.classList.add("open");
}

function shopPlaceClose() {
  document.getElementById("shop-place-modal")?.classList.remove("open");
  document.getElementById("shop-ai-video")?.pause();
}

async function shopOrderCapture() {
  const btn = document.getElementById("shop-ai-capture-btn");
  const thumb = document.getElementById("shop-ai-capture-thumb");
  btn.disabled = true;
  btn.textContent = "⏳ Capturing...";
  const b64 = await captureSceneFrame();
  btn.disabled = false;
  if (!b64) {
    btn.textContent = "📷 Capture scene";
    thumb.innerHTML = '<span style="color:rgba(255,80,80,0.7)">Failed — try again</span>';
    return;
  }
  shopState.captureB64 = b64;
  btn.textContent = "✓ Recapture";
  thumb.innerHTML = `<img src="data:image/jpeg;base64,${b64}" alt="scene capture" />`;
}

const shopImgB64Cache = new Map();
async function shopProductImageB64(p) {
  if (shopImgB64Cache.has(p.id)) return shopImgB64Cache.get(p.id);
  try {
    const resp = await fetch(p.img);
    if (!resp.ok) throw new Error(String(resp.status));
    const blob = await resp.blob();
    const b64 = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result).split(",")[1]);
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
    const out = { b64, mime: blob.type || "image/jpeg" };
    shopImgB64Cache.set(p.id, out);
    return out;
  } catch (e) {
    shopImgB64Cache.set(p.id, null);
    return null;
  }
}

async function shopAiGenerate() {
  const key = aiKey();
  if (!key) return shopAiStatus("No API Key — open the AI Studio panel and paste your Gemini API key first.");
  const p = shopProduct(shopState.placeId);
  if (!p) return shopAiStatus("Open the AI simulation from a product card first.");

  let scene = shopState.captureB64;
  if (!scene || scene.length < 500) {
    await shopOrderCapture();
    scene = shopState.captureB64;
  }
  if (!scene || scene.length < 500) return shopAiStatus("Unable to capture the current yacht frame.");

  const btn = document.getElementById("shop-ai-generate-btn");
  btn.disabled = true;
  shopAiStatus(shopAiActionLabels(p.cat).status);

  try {
    const prodImg = await shopProductImageB64(p);
    const userPrompt = document.getElementById("shop-ai-prompt").value.trim();
    const refImg = prodImg ? " shown in the SECOND image" : "";
    const instruction =
      `Edit the FIRST image of this luxury superyacht scene. Integrate ${p.name} (${p.variant})${refImg}. ${p.desc} ` +
      (userPrompt ? `User instruction: ${userPrompt}. ` : "") +
      `Maintain the exact yacht architecture, sea reflections, camera perspective, and photorealistic lighting. Return ONLY the edited image.`;

    const parts = [{ text: instruction }, { inlineData: { mimeType: "image/jpeg", data: scene } }];
    if (prodImg) parts.push({ inlineData: { mimeType: prodImg.mime, data: prodImg.b64 } });

    const models = ["gemini-3.1-flash-image", "gemini-3-pro-image"];
    const errs = [];
    let imgB64 = null;
    for (const model of models) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts }],
              generationConfig: { responseModalities: ["IMAGE", "TEXT"], imageConfig: { aspectRatio: "16:9" } }
            })
          });
        const d = await resp.json();
        if (!resp.ok) { errs.push(`[${model}] ${d?.error?.message || resp.status}`); continue; }
        const found = (d?.candidates?.[0]?.content?.parts || []).find(pt => pt.inlineData?.data);
        if (found) { imgB64 = found.inlineData.data; break; }
        errs.push(`[${model}] response had no image`);
      } catch (err) { errs.push(`[${model}] ${err.message}`); }
    }
    if (!imgB64) throw new Error(errs.join("\n") || "No image returned.");

    shopState.resultB64 = imgB64;
    document.getElementById("shop-ai-result-img").src = "data:image/png;base64," + imgB64;
    document.getElementById("shop-ai-result").classList.add("visible");
    document.getElementById("shop-ai-dl-btn").classList.add("visible");
    galleryAdd(imgB64, "image/png", p.name);
    shopAiStatus("Done! " + p.name + " rendered into your yacht view.");
  } catch (e) {
    console.error(e);
    shopAiStatus("Error: " + e.message);
  }
  btn.disabled = false;
}

function shopAiDownload() {
  if (!shopState.resultB64) return;
  const a = document.createElement("a");
  a.href = "data:image/png;base64," + shopState.resultB64;
  a.download = "yacht-bespoke-render.png";
  a.click();
}

function shopAiOpenResult() {
  const src = document.getElementById("shop-ai-result-img")?.src;
  if (!src) return;
  const v = document.getElementById("ai-lightbox-video");
  v.pause();
  v.classList.remove("open");
  const img = document.getElementById("ai-lightbox-img");
  img.src = src;
  img.classList.add("open");
  document.getElementById("ai-lightbox").classList.add("open");
}

function shopAiVideoStatus(msg) {
  const el = document.getElementById("shop-ai-video-status");
  if (el) el.textContent = msg;
}

function shopAiCloseVideo() {
  const vid = document.getElementById("shop-ai-video");
  if (!vid) return;
  vid.pause();
  vid.removeAttribute("src");
  vid.load();
  if (shopState.videoUrl) { URL.revokeObjectURL(shopState.videoUrl); shopState.videoUrl = null; }
  document.getElementById("shop-ai-video-result")?.classList.remove("visible");
  document.getElementById("shop-ai-video-dl-btn")?.classList.remove("visible");
}

async function shopAiGenerateVideo() {
  const key = aiKey();
  if (!key) return shopAiVideoStatus("No API Key — open the AI Studio panel and paste your key first.");
  const p = shopProduct(shopState.placeId);
  if (!p) return shopAiVideoStatus("Open the AI simulation from a product card first.");

  const frameB64 = shopState.resultB64, frameMime = "image/png";
  if (!frameB64) return shopAiVideoStatus(`Generate the image first with "${shopAiActionLabels(p.cat).button}".`);

  const userPrompt = document.getElementById("shop-ai-prompt").value.trim();
  const prompt =
    `Cinematic luxury yacht film shot featuring ${p.name} (${p.variant}). ` +
    (userPrompt ? userPrompt + ". " : "") +
    `Gentle Mediterranean water caustics and soft natural light, ultra-photorealistic.`;

  const btn = document.getElementById("shop-ai-video-btn");
  btn.disabled = true;
  shopAiCloseVideo();
  shopAiVideoStatus("Starting Veo video generation...");

  try {
    const instance = { prompt, image: { bytesBase64Encoded: frameB64, mimeType: frameMime } };
    const veoModels = ["veo-3.1-generate-preview", "veo-3.0-generate-preview", "veo-3.0-fast-generate-preview", "veo-2.0-generate-001"];
    const errs = [];
    let op = null;
    outer:
    for (const model of veoModels)
      for (const ver of ["v1beta", "v1"]) {
        try { op = await aiStartVeoOperation(key, ver, model, instance, "16:9"); break outer; }
        catch (err) { errs.push(`[${ver}/${model}] ${err.message}`); }
      }
    if (!op) throw new Error("No Veo model available for this key.\n" + errs.join("\n"));

    shopAiVideoStatus("Rendering video (1 to 3 minutes)...");
    const result = await aiPollVeoOperation(key, op.ver, op.name);
    const d = extractVideoResult(result);
    if (!d) throw new Error("The response did not contain a video.");

    let blob;
    if (d.uri) {
      const resp = await fetch(d.uri, { headers: { "x-goog-api-key": key } });
      if (!resp.ok) throw new Error("Unable to download the generated video.");
      blob = await resp.blob();
    } else {
      const bin = atob(d.b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      blob = new Blob([bytes], { type: d.mime || "video/mp4" });
    }

    shopState.videoUrl = URL.createObjectURL(blob);
    document.getElementById("shop-ai-video").src = shopState.videoUrl;
    document.getElementById("shop-ai-video-result").classList.add("visible");
    document.getElementById("shop-ai-video-dl-btn").classList.add("visible");
    shopAiVideoStatus("Done! Yacht video ready.");
    galleryAddVideoBlob(blob, p.name + " video");
  } catch (e) {
    console.error(e);
    shopAiVideoStatus("Error: " + e.message);
  }
  btn.disabled = false;
}

function shopAiDownloadVideo() {
  if (!shopState.videoUrl) return;
  const a = document.createElement("a");
  a.href = shopState.videoUrl;
  a.download = "yacht-bespoke-video.mp4";
  a.click();
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (window.Shop3D) window.Shop3D.close();
  shopPlaceClose();
  shopCloseOrder();
  shopArClose();
});
shopUpdateTotals();
