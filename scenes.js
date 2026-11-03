/* ══════════════════════════════════════════════════════════════════════════
   YACHT EXPLORER V2 — SCENE, CAMERA, MATERIAL, LIGHTING & MOOD CONFIGURATION
   Maps the yacht clips in /videos_webm (VP9 WebM, one file per master in /videos) to interactive triggers.
   ══════════════════════════════════════════════════════════════════════════ */

const CONFIG_V2 = {
  slug: "yacht-explorer-v2",
  yachtName: "MAGNIFIC 68'",
  yachtSub: "Bespoke Mediterranean Flybridge Explorer",
  defaultScene: "exterior",
  // Frame 0 of the default scene's idle video: shown while it starts, so the first paint already matches it.
  poster: "images/poster_main_idle.jpg?v=1",
  posterMobile: "images/poster_main_idle_m.jpg?v=1",

  /* ── 1. MAIN CAMERA VIEWPOINTS (Bottom Dock Timeline) ── */
  timeline: [
    {
      id: "horizon",
      label: "Aerial",
      shortLabel: "Aerial",
      badge: "AERIAL 01",
      coords: "41°08'N · 09°32'E",
      elevation: "48m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 2v2M4.93 4.93l1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
    },
    {
      id: "exterior",
      label: "Exterior",
      shortLabel: "Exterior",
      badge: "EXTERIOR 02",
      coords: "Port Quarter · 18m",
      elevation: "8.5m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M4 16l3-6h10l4 6H4z"/><path d="M9 10l2-4h5l1 4"/></svg>'
    },
    {
      id: "deck",
      label: "Deck",
      shortLabel: "Deck",
      badge: "COCKPIT 03",
      coords: "Stern Terrace",
      elevation: "3.2m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/><path d="M6 13V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M2 15h20"/></svg>'
    },
    {
      id: "flybridge",
      label: "Antenna",
      shortLabel: "Antenna",
      badge: "UPPER DECK 04",
      coords: "Carbon Hardtop",
      elevation: "5.4m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>'
    },
    {
      id: "salon",
      label: "Interior",
      shortLabel: "Interior",
      badge: "INTERIOR 05",
      coords: "Panoramic Lounge",
      elevation: "2.1m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>'
    }
  ],

  /* ── 2. SCENE DEFINITIONS ── */
  scenes: {
    horizon: {
      title: "Aerial",
      subtitle: "The yacht at anchor in the cove",
      video: "videos_webm/horizon_idle.webm",
      loop: true,
      videoId: "97740",
      orbitVideo: "videos_webm/horizon_360.webm",
      orbitId: "97739",
      orbitLabel: "Orbit the cove"
    },

    exterior: {
      title: "Exterior",
      subtitle: "Three-quarter stern view",
      video: "videos_webm/main_idle.webm",
      loop: true,
      videoId: "97757",
      orbitVideo: "videos_webm/main_around.webm",
      orbitId: "97756",
      orbitLabel: "Orbit the yacht"
    },

    deck: {
      title: "Deck",
      subtitle: "Teak deck and lounge sofas",
      video: "videos_webm/deck_around.webm",
      loop: true,
      videoId: "97755",
      orbitVideo: "videos_webm/deck_around.webm",
      orbitId: "97755",
      orbitLabel: "Orbit the deck"
    },

    flybridge: {
      title: "Antenna",
      subtitle: "Hardtop, radar and antenna domes",
      video: "videos_webm/main_antena.webm",
      loop: false,
      holdLastFrame: true,
      videoId: "97743"
    },

    salon: {
      title: "Interior",
      subtitle: "Glazed main living area",
      video: "videos_webm/deck_interior.webm",
      loop: false,
      holdLastFrame: true,
      videoId: "97732"
    }
  },

  /* ── 3. IMAGE-SEQUENCE TRANSITIONS ──
     Pre-rendered frames drawn on #seq-canvas between two views.
       folder   desktop frames; phones read the same names from folder + "_m"
                (e.g. images/seq/ -> images/seq_m/), half resolution
       prefix   file name before the frame number: <prefix><NN>.<ext>
       from/to  first and last frame number (inclusive); pad = digits in NN
       fps      desktop playback rate; phones load every other frame at half the
                rate, so the duration is the same
       reverse  play the frames backwards (reuse one render for the way back)
     Rule: the first frame must match what is on screen in the source view and
     the last frame must match frame 0 of the destination view's idle video.
     Example:
       "exterior-to-deck": { folder: "images/seq/", prefix: "exterior_to_deck_", from: 0, to: 72, pad: 2, ext: "jpg", fps: 60 },
       "deck-to-exterior": { folder: "images/seq/", prefix: "exterior_to_deck_", from: 0, to: 72, pad: 2, ext: "jpg", fps: 60, reverse: true } */
  sequences: {},

  /* ── 4. SCENE-TO-SCENE TRANSITION MATRIX ──
     transitions[from][to] is either
       { sequence: "<id in sequences>" }               -> frames, then the destination idle video
       { src: "<video>", endBehavior: "startSceneLoop" | "holdEndFrame" }
     An entry may carry both: the video is the fallback if the frames fail to load. */
  transitions: {
    exterior: {
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_webm/horizon_main.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/main_deck.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/main_antena.webm",
        endBehavior: "holdEndFrame"
      },
      salon: {
        clipId: "cam-exterior-to-salon",
        src: "videos_webm/main_interior.webm",
        endBehavior: "holdEndFrame"
      }
    },
    horizon: {
      salon: {
        clipId: "cam-horizon-to-salon",
        src: "videos_webm/horizon_interior.webm",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/main_idle.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/main_deck.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/main_antena.webm",
        endBehavior: "holdEndFrame"
      }
    },
    deck: {
      salon: {
        clipId: "cam-deck-to-salon-a",
        src: "videos_webm/deck_interior.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-deck-to-flybridge",
        src: "videos_webm/deck_antena.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_webm/horizon_deck.webm",
        endBehavior: "startSceneLoop"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/main_idle.webm",
        endBehavior: "startSceneLoop"
      }
    },
    flybridge: {
      salon: {
        clipId: "cam-flybridge-to-salon-a",
        src: "videos_webm/antena_interior.webm",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/main_idle.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/main_deck.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_webm/horizon_main.webm",
        endBehavior: "startSceneLoop"
      }
    },
    salon: {
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/main_idle.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "orbit-deck-sofas",
        src: "videos_webm/deck_around.webm",
        endBehavior: "startSceneLoop"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/main_antena.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_webm/horizon_deck.webm",
        endBehavior: "startSceneLoop"
      }
    }
  },

  /* ── 5. CATALOG BY CATEGORY ── */
  catalog: {
    /* A) LIGHTING & MOOD */
    moods: [
      {
        id: "mood-day-sunny",
        code: "97757",
        name: "Midday sun",
        sub: "Clear sky, turquoise water",
        scene: "exterior",
        src: "videos_webm/main_idle.webm",
        loop: true,
        badge: "Loop",
        swatch: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #facc15 100%)"
      },
      {
        id: "mood-day-to-rain",
        code: "97748",
        name: "Rain shower",
        sub: "Sun turns to rain",
        scene: "exterior",
        src: "videos_webm/main_idle_rain.webm",
        followUpSrc: "videos_webm/main_rain_around.webm",
        followUpCode: "97749",
        loop: false,
        badge: "Transition",
        swatch: "linear-gradient(135deg, #0ea5e9 0%, #475569 55%, #1e293b 100%)"
      },
      {
        id: "mood-rain-loop",
        code: "97749",
        name: "Rain",
        sub: "Steady rain in the cove",
        scene: "exterior",
        src: "videos_webm/main_rain_around.webm",
        loop: true,
        badge: "Loop",
        swatch: "linear-gradient(135deg, #64748b 0%, #334155 60%, #0f172a 100%)"
      },
      {
        id: "mood-day-to-night",
        code: "97753",
        name: "Sunset to night",
        sub: "Day fades, the yacht lights come on",
        scene: "exterior",
        src: "videos_webm/main_night.webm",
        followUpSrc: "videos_webm/main_night_idle.webm",
        followUpCode: "97754",
        loop: false,
        badge: "Transition",
        swatch: "linear-gradient(135deg, #f59e0b 0%, #1e3a8a 55%, #06b6d4 100%)"
      },
      {
        id: "mood-night-loop",
        code: "97754",
        name: "Night",
        sub: "Cabin and underwater lights",
        scene: "exterior",
        src: "videos_webm/main_night_idle.webm",
        loop: true,
        badge: "Loop",
        swatch: "linear-gradient(135deg, #090d16 0%, #0e7490 55%, #f59e0b 100%)"
      }
    ],

    /* B) MATERIALS & HULL FINISHES */
    materials: {
      hull: [
        {
          id: "mat-hull-default",
          code: "97757",
          name: "Titanium silver",
          category: "Hull",
          desc: "Standard satin-metallic finish",
          scene: "exterior",
          src: "videos_webm/main_idle.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)"
        },
        {
          id: "mat-hull-cobalt",
          code: "97746",
          name: "Cobalt blue",
          category: "Hull",
          desc: "Titanium to cobalt blue and back",
          scene: "exterior",
          src: "videos_webm/main_cor_blue.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #64748b 0%, #1d4ed8 50%, #3b82f6 100%)"
        }
      ],
      deck: [
        {
          id: "mat-deck-sofa",
          code: "97751",
          name: "Anthracite sofas",
          category: "Deck sofas",
          desc: "Cream bouclé to charcoal grey",
          scene: "deck",
          src: "videos_webm/deck_color_blue_sofa.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #f5f0e6 0%, #374151 60%, #1f2937 100%)"
        },
        {
          id: "mat-deck-floor",
          code: "97752",
          name: "Dark slate deck",
          category: "Deck flooring",
          desc: "Natural teak to dark thermo-ash",
          scene: "deck",
          src: "videos_webm/deck_color_blue_floor.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #d6b88e 0%, #57534e 55%, #292524 100%)"
        }
      ],
      salon: [
        {
          id: "mat-salon-harmony",
          code: "97729",
          name: "Navy velvet suite",
          category: "Interior",
          desc: "Sand linen to navy velvet with terracotta",
          scene: "salon",
          src: "videos_webm/interior_001.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #e7e0d6 0%, #1e3a5f 60%, #c26d3a 100%)"
        },
        {
          id: "mat-salon-sofas",
          code: "97730",
          name: "Slate & navy sofas",
          category: "Interior",
          desc: "Ivory sofas to slate and navy",
          scene: "salon",
          src: "videos_webm/interior_002.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #f3ede2 0%, #4b5563 50%, #1e3a8a 100%)"
        },
        {
          id: "mat-salon-table",
          code: "97731",
          name: "Marble coffee table",
          category: "Interior",
          desc: "Smoked oak and Carrara marble",
          scene: "salon",
          src: "videos_webm/interior_003.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #44372d 0%, #f8fafc 50%, #cbd5e1 100%)"
        }
      ]
    },

    /* C) ORBITS & STATIC LOOPS */
    orbits: [
      {
        id: "orbit-yacht-360",
        code: "97756",
        name: "Around the yacht",
        sub: "Full 360° flight at deck height",
        scene: "exterior",
        src: "videos_webm/main_around.webm",
        loop: true,
        badge: "360°"
      },
      {
        id: "orbit-horizon",
        code: "97739",
        name: "Around the cove",
        sub: "High orbit with the coastline",
        scene: "horizon",
        src: "videos_webm/horizon_360.webm",
        loop: true,
        badge: "Orbit"
      },
      {
        id: "orbit-deck-sofas",
        code: "97755",
        name: "Around the deck sofas",
        sub: "Arc around the aft lounge",
        scene: "deck",
        src: "videos_webm/deck_around.webm",
        loop: true,
        badge: "Orbit"
      },
      {
        id: "cam-horizon-static",
        code: "97740",
        name: "Aerial still",
        sub: "Fixed high view of the cove",
        scene: "horizon",
        src: "videos_webm/horizon_idle.webm",
        loop: true,
        badge: "STATIC LOOP"
      },
      {
        id: "cam-exterior-static",
        code: "97757",
        name: "Exterior still",
        sub: "Fixed three-quarter stern view",
        scene: "exterior",
        src: "videos_webm/main_idle.webm",
        loop: true,
        badge: "STATIC LOOP"
      }
    ],

    /* D) CINEMATIC CAMERA TRANSITIONS */
    cameraTransitions: [
      {
        id: "cam-exterior-to-deck",
        code: "97744",
        from: "exterior",
        to: "deck",
        name: "Exterior → Deck",
        sub: "Approach the stern sofas",
        src: "videos_webm/main_deck.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-flybridge",
        code: "97743",
        from: "exterior",
        to: "flybridge",
        name: "Exterior → Antenna",
        sub: "Push in to the hardtop",
        src: "videos_webm/main_antena.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-salon",
        code: "97737",
        from: "exterior",
        to: "salon",
        name: "Exterior → Interior",
        sub: "Across the deck and inside",
        src: "videos_webm/main_interior.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-horizon",
        code: "97741",
        from: "exterior",
        to: "horizon",
        name: "Exterior → Aerial",
        sub: "Pull back over the cove",
        src: "videos_webm/horizon_main.webm",
        followUpSrc: "videos_webm/horizon_idle.webm",
        followUpCode: "97740"
      },
      {
        id: "cam-deck-to-salon-a",
        code: "97732",
        from: "deck",
        to: "salon",
        name: "Deck → Interior, glide",
        sub: "Over the sofas into the cabin",
        src: "videos_webm/deck_interior.webm",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-flybridge",
        code: "97742",
        from: "deck",
        to: "flybridge",
        name: "Deck → Antenna",
        sub: "Rise up to the hardtop",
        src: "videos_webm/deck_antena.webm",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-horizon",
        code: "97738",
        from: "deck",
        to: "horizon",
        name: "Deck → Aerial",
        sub: "Long pull back over the cove",
        src: "videos_webm/horizon_deck.webm",
        followUpSrc: "videos_webm/horizon_idle.webm",
        followUpCode: "97740"
      },
      {
        id: "cam-flybridge-to-salon-a",
        code: "97733",
        from: "flybridge",
        to: "salon",
        name: "Antenna → Interior, side glass",
        sub: "Down through the side windows",
        src: "videos_webm/antena_interior.webm",
        holdLastFrame: true
      },
      {
        id: "cam-horizon-to-salon",
        code: "97734",
        from: "horizon",
        to: "salon",
        name: "Aerial → Interior",
        sub: "From the sky straight inside",
        src: "videos_webm/horizon_interior.webm",
        holdLastFrame: true
      }
    ]
  }
};

// Keep backwards-compatible alias for any legacy module reading CONFIG
const CONFIG = CONFIG_V2;
