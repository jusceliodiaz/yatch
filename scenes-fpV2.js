/* ══════════════════════════════════════════════════════════════════════════
   YACHT EXPLORER V2 — SCENE, CAMERA, MATERIAL, LIGHTING & MOOD CONFIGURATION
   Maps all 29 MP4 videos in /videos to structured interactive triggers.
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
      label: "Cove & Horizon",
      shortLabel: "Horizon",
      badge: "AERIAL 01",
      coords: "41°08'N · 09°32'E",
      elevation: "48m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 2v2M4.93 4.93l1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
    },
    {
      id: "exterior",
      label: "Yacht Exterior",
      shortLabel: "Exterior",
      badge: "EXTERIOR 02",
      coords: "Port Quarter · 18m",
      elevation: "8.5m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M4 16l3-6h10l4 6H4z"/><path d="M9 10l2-4h5l1 4"/></svg>'
    },
    {
      id: "deck",
      label: "Aft Deck Lounge",
      shortLabel: "Aft Deck",
      badge: "COCKPIT 03",
      coords: "Stern Terrace",
      elevation: "3.2m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/><path d="M6 13V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M2 15h20"/></svg>'
    },
    {
      id: "flybridge",
      label: "Hardtop & Radar",
      shortLabel: "Flybridge",
      badge: "UPPER DECK 04",
      coords: "Carbon Hardtop",
      elevation: "5.4m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>'
    },
    {
      id: "salon",
      label: "Main Salon Interior",
      shortLabel: "Main Salon",
      badge: "INTERIOR 05",
      coords: "Panoramic Lounge",
      elevation: "2.1m ASL",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>'
    }
  ],

  /* ── 2. SCENE DEFINITIONS & INTERACTIVE HOTSPOTS (POIs) ── */
  scenes: {
    horizon: {
      title: "Mediterranean Cove & Horizon",
      subtitle: "High-altitude drone vantage overlooking the turquoise anchorage",
      video: "videos_webm/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.webm",
      loop: true,
      videoId: "97740",
      orbitVideo: "videos_webm/magnific_loopable-video-turn-around-the-yatch-vendo-o-horiz_wan_1080p_16-9_30fps_97739.webm",
      orbitId: "97739",
      orbitLabel: "Horizon Drone Orbit",
      pois: [
        {
          x: 13,
          y: 78,
          type: "nav",
          target: "exterior",
          label: "Fly to Yacht Exterior"
        },
        {
          x: 24,
          y: 72,
          type: "clip",
          clipId: "cam-horizon-to-salon",
          targetScene: "salon",
          label: "Dive into Main Salon (97734)"
        },
        {
          x: 52,
          y: 44,
          type: "clip",
          clipId: "orbit-horizon",
          label: "360° Cove & Horizon Orbit (97739)"
        }
      ]
    },

    exterior: {
      title: "Yacht Exterior Profile",
      subtitle: "68-foot aerodynamic hull in emerald cove waters",
      video: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
      loop: true,
      videoId: "97757",
      orbitVideo: "videos_webm/magnific_360-em-volta-do-yach-mesma-atura-de-camera_seedance_1080p_16-9_24fps_97756.webm",
      orbitId: "97756",
      orbitLabel: "360° Yacht Orbit",
      pano: "aerial",
      pois: [
        {
          x: 34,
          y: 66,
          type: "nav",
          target: "deck",
          label: "Aft Deck Lounge (97744)"
        },
        {
          x: 47,
          y: 47,
          type: "nav",
          target: "flybridge",
          label: "Hardtop & Radar (97743)"
        },
        {
          x: 42,
          y: 56,
          type: "nav",
          target: "salon",
          label: "Enter Main Salon (97737)"
        },
        {
          x: 72,
          y: 28,
          type: "nav",
          target: "horizon",
          label: "Pull Back to Cove Horizon (97741)"
        },
        {
          x: 56,
          y: 62,
          type: "drawer",
          drawerTab: "materials",
          drawerSub: "hull",
          label: "Configure Hull Color"
        }
      ]
    },

    deck: {
      title: "Aft Deck & Stern Lounge",
      subtitle: "Open-air teak terrace with twin modular sun-loungers",
      video: "videos_webm/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.webm",
      loop: true,
      videoId: "97755",
      orbitVideo: "videos_webm/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.webm",
      orbitId: "97755",
      orbitLabel: "Turn Around Deck Sofas",
      pois: [
        {
          x: 50,
          y: 44,
          type: "nav",
          target: "salon",
          label: "Enter Main Salon (97732)"
        },
        {
          x: 48,
          y: 24,
          type: "nav",
          target: "flybridge",
          label: "Rise to Hardtop (97742)"
        },
        {
          x: 34,
          y: 62,
          type: "clip",
          clipId: "mat-deck-sofa",
          label: "Change Sofa Upholstery (97751)"
        },
        {
          x: 52,
          y: 76,
          type: "clip",
          clipId: "mat-deck-floor",
          label: "Change Deck Flooring (97752)"
        },
        {
          x: 80,
          y: 25,
          type: "nav",
          target: "horizon",
          label: "Drone Pullback to Horizon (97738)"
        }
      ]
    },

    flybridge: {
      title: "Hardtop & Navigation Domes",
      subtitle: "Carbon-fiber superstructure with dual satellite domes and glazing",
      video: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.webm",
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
          label: "Dive Through Side Glass to Salon (97733)"
        },
        {
          x: 36,
          y: 68,
          type: "clip",
          clipId: "cam-flybridge-to-salon-b",
          targetScene: "salon",
          label: "Sweep Stern into Salon (97736)"
        },
        {
          x: 24,
          y: 34,
          type: "nav",
          target: "exterior",
          label: "Return to Exterior View"
        }
      ]
    },

    salon: {
      title: "Panoramic Main Salon",
      subtitle: "360-degree glazed living area with bespoke Italian upholstery",
      video: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.webm",
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
          label: "Full Salon Suite: Navy Velvet (97729)"
        },
        {
          x: 72,
          y: 74,
          type: "clip",
          clipId: "mat-salon-sofas",
          label: "Dual Sofa Fabric: Slate & Navy (97730)"
        },
        {
          x: 49,
          y: 77,
          type: "clip",
          clipId: "mat-salon-table",
          label: "Coffee Table: Carrara Marble (97731)"
        },
        {
          x: 18,
          y: 42,
          type: "nav",
          target: "deck",
          label: "Step Out to Aft Deck"
        },
        {
          x: 82,
          y: 36,
          type: "nav",
          target: "exterior",
          label: "Exterior Overview"
        }
      ]
    }
  },

  /* ── 3. AUTOMATIC SCENE-TO-SCENE CAMERA TRANSITION MATRIX ── */
  transitions: {
    exterior: {
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.webm",
        endBehavior: "holdEndFrame"
      },
      salon: {
        clipId: "cam-exterior-to-salon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97737.webm",
        endBehavior: "holdEndFrame"
      }
    },
    horizon: {
      salon: {
        clipId: "cam-horizon-to-salon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97734.webm",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.webm",
        endBehavior: "holdEndFrame"
      }
    },
    deck: {
      salon: {
        clipId: "cam-deck-to-salon-a",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.webm",
        endBehavior: "holdEndFrame"
      },
      flybridge: {
        clipId: "cam-deck-to-flybridge",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-do-sofa-para_wan_1080p_16-9_30fps_97742.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.webm",
        endBehavior: "startSceneLoop"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
        endBehavior: "startSceneLoop"
      }
    },
    flybridge: {
      salon: {
        clipId: "cam-flybridge-to-salon-a",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97733.webm",
        endBehavior: "holdEndFrame"
      },
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "cam-exterior-to-deck",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-exterior-to-horizon",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.webm",
        endBehavior: "startSceneLoop"
      }
    },
    salon: {
      exterior: {
        clipId: "cam-exterior-static",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
        endBehavior: "startSceneLoop"
      },
      deck: {
        clipId: "orbit-deck-sofas",
        src: "videos_webm/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.webm",
        endBehavior: "startSceneLoop"
      },
      flybridge: {
        clipId: "cam-exterior-to-flybridge",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.webm",
        endBehavior: "holdEndFrame"
      },
      horizon: {
        clipId: "cam-deck-to-horizon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.webm",
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
        name: "Mediterranean Noon",
        sub: "Crystal turquoise water · Direct sun loop",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
        loop: true,
        badge: "STATIC LOOP",
        swatch: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #facc15 100%)"
      },
      {
        id: "mood-soft-lighting",
        code: "97750",
        name: "Soft Coastal Mist",
        sub: "Smooth illumination shift · Diffused sky & warm teak",
        scene: "exterior",
        src: "videos_webm/magnific_transio-suave-de-iluminao-_wan_1080p_16-9_30fps_97750.webm",
        loop: false,
        holdLastFrame: true,
        badge: "LIGHT TRANSITION",
        swatch: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 55%, #d6b370 100%)"
      },
      {
        id: "mood-day-to-rain",
        code: "97748",
        name: "Sun to Summer Rain",
        sub: "Weather transition · Rippling rain & wet teak deck",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-transio-suave-de-dia-pra-chuva_wan_1080p_16-9_30fps_97748.webm",
        followUpSrc: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97749.webm",
        followUpCode: "97749",
        loop: false,
        badge: "WEATHER + LOOP",
        swatch: "linear-gradient(135deg, #0ea5e9 0%, #475569 55%, #1e293b 100%)"
      },
      {
        id: "mood-rain-loop",
        code: "97749",
        name: "Rainstorm Anchorage",
        sub: "Static camera loop · Misty cove & raindrop ripples",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97749.webm",
        loop: true,
        badge: "STATIC LOOP",
        swatch: "linear-gradient(135deg, #64748b 0%, #334155 60%, #0f172a 100%)"
      },
      {
        id: "mood-day-to-night",
        code: "97753",
        name: "Dusk Illumination Cycle",
        sub: "Day to night transition · Warm cabin & cyan underwater LEDs",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-_wan_1080p_16-9_30fps_97753.webm",
        followUpSrc: "videos_webm/magnific_loopable-video-_wan_1080p_16-9_30fps_97754.webm",
        followUpCode: "97754",
        loop: false,
        badge: "LIGHTING CYCLE",
        swatch: "linear-gradient(135deg, #f59e0b 0%, #1e3a8a 55%, #06b6d4 100%)"
      },
      {
        id: "mood-night-loop",
        code: "97754",
        name: "Starlight & Underwater Glow",
        sub: "Night static loop · Full architectural & marine LEDs",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-_wan_1080p_16-9_30fps_97754.webm",
        loop: true,
        badge: "NIGHT LOOP",
        swatch: "linear-gradient(135deg, #090d16 0%, #0e7490 55%, #f59e0b 100%)"
      }
    ],

    /* B) MATERIALS & HULL FINISHES (8 videos: 97745, 97746, 97747, 97751, 97752, 97729, 97730, 97731) */
    materials: {
      hull: [
        {
          id: "mat-hull-default",
          code: "97757",
          name: "Titanium Silver Metallic",
          category: "Hull Finish",
          desc: "Signature satin-metallic titanium hull with dark carbon superstructure",
          scene: "exterior",
          src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)"
        },
        {
          id: "mat-hull-pearl",
          code: "97745",
          name: "Glacier Pearl & Obsidian",
          category: "Hull Finish",
          desc: "Smooth color morph: Deep Navy → Glacier Pearl White → Titanium Grey",
          scene: "exterior",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97745.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #1e293b 0%, #f8fafc 50%, #64748b 100%)"
        },
        {
          id: "mat-hull-cobalt",
          code: "97746",
          name: "Aegean Cobalt Blue",
          category: "Hull Finish",
          desc: "Smooth color morph: Titanium Grey → Vibrant Cobalt Blue → Titanium",
          scene: "exterior",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97746.webm",
          loop: true,
          swatch: "linear-gradient(135deg, #64748b 0%, #1d4ed8 50%, #3b82f6 100%)"
        },
        {
          id: "mat-hull-midnight",
          code: "97747",
          name: "Midnight Regatta Navy",
          category: "Hull Finish",
          desc: "Smooth hull transition from Titanium Grey to Deep Midnight Navy Blue",
          scene: "exterior",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-cor-do-_wan_1080p_16-9_30fps_97747.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #64748b 0%, #0f172a 60%, #1e3a8a 100%)"
        }
      ],
      deck: [
        {
          id: "mat-deck-sofa",
          code: "97751",
          name: "Cockpit Loungers: Cream → Anthracite",
          category: "Aft Deck Upholstery",
          desc: "Weatherproof Loro Piana marine bouclé from Warm Ivory to Charcoal Grey",
          scene: "deck",
          src: "videos_webm/magnific_transio-suave-da-troca-do-material-do-sofa_wan_1080p_16-9_30fps_97751.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #f5f0e6 0%, #374151 60%, #1f2937 100%)"
        },
        {
          id: "mat-deck-floor",
          code: "97752",
          name: "Deck Planking: Blonde Teak → Slate",
          category: "Aft Deck Flooring",
          desc: "Natural Burmese teak caulked planks morphing to dark brushed thermo-ash",
          scene: "deck",
          src: "videos_webm/magnific_transio-suave-da-troca-do-piso_wan_1080p_16-9_30fps_97752.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #d6b88e 0%, #57534e 55%, #292524 100%)"
        }
      ],
      salon: [
        {
          id: "mat-salon-harmony",
          code: "97729",
          name: "Salon Suite: Sand → Midnight Velvet",
          category: "Interior Full Suite",
          desc: "Complete interior transformation: Sand linen sofas to Navy velvet & terracotta pillows",
          scene: "salon",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97729.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #e7e0d6 0%, #1e3a5f 60%, #c26d3a 100%)"
        },
        {
          id: "mat-salon-sofas",
          code: "97730",
          name: "Bespoke Sofas: Ivory → Slate & Navy",
          category: "Interior Upholstery",
          desc: "Asymmetric port & starboard sofa upholstery transition with warm oak flooring",
          scene: "salon",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97730.webm",
          loop: false,
          holdLastFrame: true,
          swatch: "linear-gradient(135deg, #f3ede2 0%, #4b5563 50%, #1e3a8a 100%)"
        },
        {
          id: "mat-salon-table",
          code: "97731",
          name: "Centerpiece: Smoked Oak ↔ Carrara Marble",
          category: "Interior Stone & Millwork",
          desc: "Salon coffee table morphing between smoked walnut-oak and white Carrara marble",
          scene: "salon",
          src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-materia_wan_1080p_16-9_30fps_97731.webm",
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
        name: "360° Full Yacht Orbit",
        sub: "Constant-altitude aerial turnaround around the entire vessel",
        scene: "exterior",
        src: "videos_webm/magnific_360-em-volta-do-yach-mesma-atura-de-camera_seedance_1080p_16-9_24fps_97756.webm",
        fallbackMov: "videos_webm/magnific_360-em-volta-do-yach-mesma-atura-de-camera_seedance_1080p_16-9_24fps_97756.mov",
        loop: true,
        badge: "360° ORBIT"
      },
      {
        id: "orbit-horizon",
        code: "97739",
        name: "Cove & Horizon Turnaround",
        sub: "High-altitude sweeping orbit revealing the coastline and sea horizon",
        scene: "horizon",
        src: "videos_webm/magnific_loopable-video-turn-around-the-yatch-vendo-o-horiz_wan_1080p_16-9_30fps_97739.webm",
        loop: true,
        badge: "HORIZON ORBIT"
      },
      {
        id: "orbit-deck-sofas",
        code: "97755",
        name: "Aft Deck Lounge Orbit",
        sub: "180° arc around the stern cockpit sofas looking out to the horizon",
        scene: "deck",
        src: "videos_webm/magnific_loopable-video-turn-around-the-sofas_wan_1080p_16-9_30fps_97755.webm",
        loop: true,
        badge: "DECK ORBIT"
      },
      {
        id: "cam-horizon-static",
        code: "97740",
        name: "Cove Aerial Static Loop",
        sub: "Locked-off high altitude perspective with gentle sea ripples",
        scene: "horizon",
        src: "videos_webm/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.webm",
        loop: true,
        badge: "STATIC LOOP"
      },
      {
        id: "cam-exterior-static",
        code: "97757",
        name: "Yacht Exterior Static Loop",
        sub: "Locked-off three-quarter stern profile in crystal water",
        scene: "exterior",
        src: "videos_webm/magnific_loopable-video-static-camera_wan_1080p_16-9_30fps_97757.webm",
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
        name: "Exterior → Aft Deck Lounge",
        sub: "Smooth approach from port-quarter overview to the stern loungers",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97744.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-flybridge",
        code: "97743",
        from: "exterior",
        to: "flybridge",
        name: "Exterior → Hardtop & Radar",
        sub: "Push-in from medium exterior overview to the carbon hardtop domes",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-longe-pra-pe_wan_1080p_16-9_30fps_97743.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-salon",
        code: "97737",
        from: "exterior",
        to: "salon",
        name: "Exterior → Main Salon Interior",
        sub: "Continuous flight from exterior overview across the deck into the salon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97737.webm",
        holdLastFrame: true
      },
      {
        id: "cam-exterior-to-horizon",
        code: "97741",
        from: "exterior",
        to: "horizon",
        name: "Exterior → Cove Horizon Ascent",
        sub: "Drone pullback from the yacht to the high Mediterranean cove vista",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-perto-do-yat_wan_1080p_16-9_30fps_97741.webm",
        followUpSrc: "videos_webm/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.webm",
        followUpCode: "97740"
      },
      {
        id: "cam-deck-to-salon-a",
        code: "97732",
        from: "deck",
        to: "salon",
        name: "Aft Deck → Main Salon (Starboard Glide)",
        sub: "Sweeping glide over the aft loungers into the main cabin",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97732.webm",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-salon-b",
        code: "97735",
        from: "deck",
        to: "salon",
        name: "Aft Deck → Main Salon (Centerline Walk)",
        sub: "Low-angle tracking shot between the twin sofas through the glass doors",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97735.webm",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-flybridge",
        code: "97742",
        from: "deck",
        to: "flybridge",
        name: "Aft Deck → Hardtop Roof Crane",
        sub: "Vertical crane movement from the stern sofas up to the radar hardtop",
        src: "videos_webm/magnific_transicao-suave-de-troca-de-camera-de-do-sofa-para_wan_1080p_16-9_30fps_97742.webm",
        holdLastFrame: true
      },
      {
        id: "cam-deck-to-horizon",
        code: "97738",
        from: "deck",
        to: "horizon",
        name: "Aft Deck → Cove Horizon Ascent",
        sub: "Long pullback from the cockpit lounge all the way to the high cove view",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97738.webm",
        followUpSrc: "videos_webm/magnific_loopable-video-camera-estatica_wan_1080p_16-9_30fps_97740.webm",
        followUpCode: "97740"
      },
      {
        id: "cam-flybridge-to-salon-a",
        code: "97733",
        from: "flybridge",
        to: "salon",
        name: "Hardtop → Main Salon (Port Glass Dive)",
        sub: "Camera descends from the radar roof through the panoramic side glazing",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97733.webm",
        holdLastFrame: true
      },
      {
        id: "cam-flybridge-to-salon-b",
        code: "97736",
        from: "flybridge",
        to: "salon",
        name: "Hardtop → Main Salon (Stern Overhang)",
        sub: "Curving descent around the aft hardtop overhang into the salon",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97736.webm",
        holdLastFrame: true
      },
      {
        id: "cam-horizon-to-salon",
        code: "97734",
        from: "horizon",
        to: "salon",
        name: "Cove Horizon → Main Salon (Epic Dive)",
        sub: "Spectacular long-range drone dive from the bay sky straight inside the yacht",
        src: "videos_webm/magnific_loopable-video-transicao-suave-de-troca-de-camera-_wan_1080p_16-9_30fps_97734.webm",
        holdLastFrame: true
      }
    ]
  }
};

// Keep backwards-compatible alias for any legacy module reading CONFIG
const CONFIG = CONFIG_V2;
