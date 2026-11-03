/* ══════════════════════════════════════════════════════════════════════════
   YACHT EXPLORER V2 — SCENE, CAMERA, MATERIAL, LIGHTING & MOOD CONFIGURATION
   Maps all 29 videos (H.264 MP4 in /videos_web, 720p copies in /videos_web_m) to structured interactive triggers.
   ══════════════════════════════════════════════════════════════════════════ */

const CONFIG_V2 = {
  slug: "yacht-explorer-v2",
  yachtName: "MAGNIFIC 68'",
  yachtSub: "Bespoke Mediterranean Flybridge Explorer",
  defaultScene: "exterior",
  poster: "images/poster_yacht_v2.jpg?v=1",

  /* ── 1. MAIN CAMERA VIEWPOINTS (Bottom Dock Timeline) ── */
  timeline: [
    {
      id: "horizon",
      label: "Aerial view",
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
      label: "Aft deck",
      shortLabel: "Aft deck",
      badge: "COCKPIT 03",
      coords: "Stern Terrace",
      elevation: "3.2m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/><path d="M6 13V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M2 15h20"/></svg>'
    },
    {
      id: "flybridge",
      label: "Flybridge",
      shortLabel: "Flybridge",
      badge: "UPPER DECK 04",
      coords: "Carbon Hardtop",
      elevation: "5.4m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>'
    },
    {
      id: "salon",
      label: "Salon",
      shortLabel: "Salon",
      badge: "INTERIOR 05",
      coords: "Panoramic Lounge",
      elevation: "2.1m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>'
    }
  ],

  /* ── 2. SCENE DEFINITIONS & INTERACTIVE HOTSPOTS (POIs) ── */
  scenes: {
    horizon: {
      title: "Aerial view",
      subtitle: "The yacht at anchor in the cove",
      video: "videos_web/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.mp4",
      loop: true,
      videoId: "97740",
      orbitVideo: "videos_web/magnific_loopable-video-turn-around-the-yatch-vendo-o-horiz_wan_1080p_16-9_30fps_97739.mp4",
      orbitId: "97739",
      orbitLabel: "Orbit the cove",
      pois: [
        {
          x: 13,
          y: 78,
          type: "nav",
          target: "exterior",
          label: "Exterior"
        },
        {
          x: 24,
          y: 72,
          type: "clip",
          clipId: "cam-horizon-to-salon",
          targetScene: "salon",
          label: "Fly into the salon"
        },
        {
          x: 52,
          y: 44,
          type: "clip",
          clipId: "orbit-horizon",
          label: "Orbit the cove"
        }
      ]
    },

    exterior: {
      title: "Exterior",
      subtitle: "Three-quarter stern view",
      video: "videos_web/main_idle.mp4",
      loop: true,
      videoId: "97757",
      orbitVideo: "videos_web/magnific_360-em-volta-do-yach-mesma-atura-de-camera_seedance_1080p_16-9_24fps_97756.mp4",
      orbitId: "97756",
      orbitLabel: "Orbit the yacht",
      pano: "aerial",
      pois: [
        {
          x: 34,
          y: 66,
          type: "nav",
          target: "deck",
          label: "Aft deck"
        },
        {
          x: 47,
          y: 47,
          type: "nav",
          target: "flybridge",
          label: "Flybridge"
        },
        {
          x: 42,
          y: 56,
          type: "nav",
          target: "salon",
          label: "Salon"
        },
        {
          x: 72,
          y: 28,
          type: "nav",
          target: "horizon",
          label: "Aerial view"
        },
        {
          x: 56,
          y: 62,
          type: "drawer",
          drawerTab: "materials",
          drawerSub: "hull",
          label: "Hull color"
        }
      ]
    },

    deck: {
      title: "Aft deck",
      subtitle: "Teak deck and lounge sofas",
      video: "videos_web/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.mp4",
      loop: true,
      videoId: "97755",
      orbitVideo: "videos_web/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.mp4",
      orbitId: "97755",
      orbitLabel: "Orbit the deck",
      pois: [
        {
          x: 50,
          y: 44,
          type: "nav",
          target: "salon",
          label: "Salon"
        },
        {
          x: 48,
          y: 24,
          type: "nav",
          target: "flybridge",
          label: "Flybridge"
        },
        {
          x: 34,
          y: 62,
          type: "clip",
          clipId: "mat-deck-sofa",
          label: "Sofa fabric"
        },
        {
          x: 52,
          y: 76,
          type: "clip",
          clipId: "mat-deck-floor",
          label: "Deck flooring"
        },
        {
          x: 80,
          y: 25,
          type: "nav",
          target: "horizon",
          label: "Aerial view"
        }
      ]
    },

    flybridge: {
      title: "Flybridge",
      subtitle: "Hardtop and radar domes",
      video: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.mp4",
      loop: false,
      holdLastFrame: true,
      videoId: "97743",
      pois: [
        {
          x: 56,
          y: 58,
          type: "clip",
          clipId: "cam-flybridge-to-salon-a",
          targetScene: "salon",
          label: "Salon via side glass"
        },
        {
          x: 36,
          y: 68,
          type: "clip",
          clipId: "cam-flybridge-to-salon-b",
          targetScene: "salon",
          label: "Salon via stern"
        },
        {
          x: 24,
          y: 34,
          type: "nav",
          target: "exterior",
          label: "Exterior"
        }
      ]
    },

    salon: {
      title: "Salon",
      subtitle: "Glazed main living area",
      video: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.mp4",
      loop: false,
      holdLastFrame: true,
      videoId: "97732",
      pano: "aerial",
      pois: [
        {
          x: 26,
          y: 66,
          type: "clip",
          clipId: "mat-salon-harmony",
          label: "Navy velvet suite"
        },
        {
          x: 72,
          y: 74,
          type: "clip",
          clipId: "mat-salon-sofas",
          label: "Sofa fabric"
        },
        {
          x: 49,
          y: 77,
          type: "clip",
          clipId: "mat-salon-table",
          label: "Coffee table"
        },
        {
          x: 18,
          y: 42,
          type: "nav",
          target: "deck",
          label: "Aft deck"
        },
        {
          x: 82,
          y: 36,
          type: "nav",
          target: "exterior",
          label: "Exterior"
        }
      ]
    }
  },

  /* ── 3. AUTOMATIC SCENE-TO-SCENE CAMERA TRANSITION MATRIX ── */
  transitions: {
    exterior: {
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.mp4",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.mp4",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.mp4",
        endBehavior: "holdEndFrame"
      },
      salon: {
        clipId: "cam-exterior-to-salon",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97737.mp4",
        endBehavior: "holdEndFrame"
      }
    },
    horizon: {
      salon: {
        clipId: "cam-horizon-to-salon",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97734.mp4",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_web/main_idle.mp4",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.mp4",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.mp4",
        endBehavior: "holdEndFrame"
      }
    },
    deck: {
      salon: {
        clipId: "cam-deck-to-salon-a",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.mp4",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-deck-to-flybridge",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-do-sofa-para_wan_1080p_16-9_30fps_97742.mp4",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.mp4",
        endBehavior: "startSceneLoop"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_web/main_idle.mp4",
        endBehavior: "startSceneLoop"
      }
    },
    flybridge: {
      salon: {
        clipId: "cam-flybridge-to-salon-a",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97733.mp4",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_web/main_idle.mp4",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.mp4",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.mp4",
        endBehavior: "startSceneLoop"
      }
    },
    salon: {
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_web/main_idle.mp4",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "orbit-deck-sofas",
        src: "videos_web/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.mp4",
        endBehavior: "startSceneLoop"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.mp4",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.mp4",
        endBehavior: "startSceneLoop"
      }
    }
  },

  /* ── 4. COMPLETE CATALOG OF ALL 29 VIDEOS BY CATEGORY ── */
  catalog: {
    /* A) LIGHTING & MOOD (6 videos: 97757, 97750, 97748, 97749, 97753, 97754) */
    moods: [
      {
        id: "mood-day-sunny",
        code: "97757",
        name: "Midday sun",
        sub: "Clear sky, turquoise water",
        scene: "exterior",
        src: "videos_web/main_idle.mp4",
        loop: true,
        badge: "Loop",
        swatch: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #facc15 100%)"
      },
      {
        id: "mood-soft-lighting",
        code: "97750",
        name: "Soft light",
        sub: "Hazy sky, diffused light",
        scene: "exterior",
        src: "videos_web/magnific_transio-suave-de-iluminao-_wan_1080p_16-9_30fps_97750.mp4",
        loop: false,
        holdLastFrame: true,
        badge: "Transition",
        swatch: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 55%, #d6b370 100%)"
      },
      {
        id: "mood-day-to-rain",
        code: "97748",
        name: "Rain shower",
        sub: "Sun turns to rain",
        scene: "exterior",
        src: "videos_web/magnific_loopable-video-transio-suave-de-dia-pra-chuva_wan_1080p_16-9_30fps_97748.mp4",
        followUpSrc: "videos_web/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97749.mp4",
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
        src: "videos_web/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97749.mp4",
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
        src: "videos_web/magnific_loopable-video-_wan_1080p_16-9_30fps_97753.mp4",
        followUpSrc: "videos_web/magnific_loopable-video-_wan_1080p_16-9_30fps_97754.mp4",
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
        src: "videos_web/magnific_loopable-video-_wan_1080p_16-9_30fps_97754.mp4",
        loop: true,
        badge: "Loop",
        swatch: "linear-gradient(135deg, #090d16 0%, #0e7490 55%, #f59e0b 100%)"
      }
    ],

    /* B) MATERIALS & HULL FINISHES (8 videos: 97745, 97746, 97747, 97751, 97752, 97729, 97730, 97731) */
    materials: {
      hull: [
        {
          id: "mat-hull-default",
          code: "97757",
          name: "Titanium silver",
          category: "Hull",
          desc: "Standard satin-metallic finish",
          scene: "exterior",
          src: "videos_web/main_idle.mp4",
          loop: true,
          swatch: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)"
        },
        {
          id: "mat-hull-pearl",
          code: "97745",
          name: "Pearl white",
          category: "Hull",
          desc: "Navy to pearl white to titanium",
          scene: "exterior",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97745.mp4",
          loop: true,
          swatch: "linear-gradient(135deg, #1e293b 0%, #f8fafc 50%, #64748b 100%)"
        },
        {
          id: "mat-hull-cobalt",
          code: "97746",
          name: "Cobalt blue",
          category: "Hull",
          desc: "Titanium to cobalt blue and back",
          scene: "exterior",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97746.mp4",
          loop: true,
          swatch: "linear-gradient(135deg, #64748b 0%, #1d4ed8 50%, #3b82f6 100%)"
        },
        {
          id: "mat-hull-midnight",
          code: "97747",
          name: "Midnight navy",
          category: "Hull",
          desc: "Titanium to deep navy",
          scene: "exterior",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97747.mp4",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #64748b 0%, #0f172a 60%, #1e3a8a 100%)"
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
          src: "videos_web/magnific_transio-suave-da-troca-do-material-do-sofa_wan_1080p_16-9_30fps_97751.mp4",
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
          src: "videos_web/magnific_transio-suave-da-troca-do-piso_wan_1080p_16-9_30fps_97752.mp4",
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
          category: "Salon",
          desc: "Sand linen to navy velvet with terracotta",
          scene: "salon",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97729.mp4",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #e7e0d6 0%, #1e3a5f 60%, #c26d3a 100%)"
        },
        {
          id: "mat-salon-sofas",
          code: "97730",
          name: "Slate & navy sofas",
          category: "Salon",
          desc: "Ivory sofas to slate and navy",
          scene: "salon",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97730.mp4",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #f3ede2 0%, #4b5563 50%, #1e3a8a 100%)"
        },
        {
          id: "mat-salon-table",
          code: "97731",
          name: "Marble coffee table",
          category: "Salon",
          desc: "Smoked oak and Carrara marble",
          scene: "salon",
          src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97731.mp4",
          loop: true,
          swatch: "linear-gradient(135deg, #44372d 0%, #f8fafc 50%, #cbd5e1 100%)"
        }
      ]
    },

    /* C) ORBITS & STATIC LOOPS (5 videos: 97756, 97739, 97755, 97740, 97757) */
    orbits: [
      {
        id: "orbit-yacht-360",
        code: "97756",
        name: "Around the yacht",
        sub: "Full 360° flight at deck height",
        scene: "exterior",
        src: "videos_web/magnific_360-em-volta-do-yach-mesma-atura-de-camera_seedance_1080p_16-9_24fps_97756.mp4",
        loop: true,
        badge: "360°"
      },
      {
        id: "orbit-horizon",
        code: "97739",
        name: "Around the cove",
        sub: "High orbit with the coastline",
        scene: "horizon",
        src: "videos_web/magnific_loopable-video-turn-around-the-yatch-vendo-o-horiz_wan_1080p_16-9_30fps_97739.mp4",
        loop: true,
        badge: "Orbit"
      },
      {
        id: "orbit-deck-sofas",
        code: "97755",
        name: "Around the deck sofas",
        sub: "Arc around the aft lounge",
        scene: "deck",
        src: "videos_web/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.mp4",
        loop: true,
        badge: "Orbit"
      },
      {
        id: "cam-horizon-static",
        code: "97740",
        name: "Aerial still",
        sub: "Fixed high view of the cove",
        scene: "horizon",
        src: "videos_web/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.mp4",
        loop: true,
        badge: "STATIC LOOP"
      },
      {
        id: "cam-exterior-static",
        code: "97757",
        name: "Exterior still",
        sub: "Fixed three-quarter stern view",
        scene: "exterior",
        src: "videos_web/main_idle.mp4",
        loop: true,
        badge: "STATIC LOOP"
      }
    ],

    /* D) CINEMATIC CAMERA TRANSITIONS (11 videos: 97732..97738, 97741..97744) */
    cameraTransitions: [
      {
        id: "cam-exterior-to-deck",
        code: "97744",
        from: "exterior",
        to: "deck",
        name: "Exterior → Aft deck",
        sub: "Approach the stern sofas",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-flybridge",
        code: "97743",
        from: "exterior",
        to: "flybridge",
        name: "Exterior → Flybridge",
        sub: "Push in to the hardtop",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-salon",
        code: "97737",
        from: "exterior",
        to: "salon",
        name: "Exterior → Salon",
        sub: "Across the deck and inside",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97737.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-horizon",
        code: "97741",
        from: "exterior",
        to: "horizon",
        name: "Exterior → Aerial view",
        sub: "Pull back over the cove",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.mp4",
        followUpSrc: "videos_web/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.mp4",
        followUpCode: "97740"
      },
      {
        id: "cam-deck-to-salon-a",
        code: "97732",
        from: "deck",
        to: "salon",
        name: "Aft deck → Salon, glide",
        sub: "Over the sofas into the cabin",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-salon-b",
        code: "97735",
        from: "deck",
        to: "salon",
        name: "Aft deck → Salon, walk",
        sub: "Between the sofas, through the doors",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97735.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-flybridge",
        code: "97742",
        from: "deck",
        to: "flybridge",
        name: "Aft deck → Flybridge",
        sub: "Rise up to the hardtop",
        src: "videos_web/magnific_transicao-suave-de-troca-de-camera-de-do-sofa-para_wan_1080p_16-9_30fps_97742.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-horizon",
        code: "97738",
        from: "deck",
        to: "horizon",
        name: "Aft deck → Aerial view",
        sub: "Long pull back over the cove",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.mp4",
        followUpSrc: "videos_web/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.mp4",
        followUpCode: "97740"
      },
      {
        id: "cam-flybridge-to-salon-a",
        code: "97733",
        from: "flybridge",
        to: "salon",
        name: "Flybridge → Salon, side glass",
        sub: "Down through the side windows",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97733.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-flybridge-to-salon-b",
        code: "97736",
        from: "flybridge",
        to: "salon",
        name: "Flybridge → Salon, stern",
        sub: "Around the overhang and inside",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97736.mp4",
        holdLastFrame: true
      },
      {
        id: "cam-horizon-to-salon",
        code: "97734",
        from: "horizon",
        to: "salon",
        name: "Aerial view → Salon",
        sub: "From the sky straight inside",
        src: "videos_web/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97734.mp4",
        holdLastFrame: true
      }
    ]
  }
};

// Keep backwards-compatible alias for any legacy module reading CONFIG
const CONFIG = CONFIG_V2;
