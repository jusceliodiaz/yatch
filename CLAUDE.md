# Yacht Explorer — Project Guide

## Project overview

This project is the starting point for a cinematic, interactive yacht showcase. The intended experience is a single full-screen page where visitors can explore yacht views, move between scenes, compare day and night, and open optional product or media tools.

The project was copied from an architectural property-tour prototype. **The current implementation still shows the original Pool and Terrace scenes**; its media, labels, metadata, and IKEA shop have not yet been replaced with yacht-specific content. Treat those parts as starter content, not as the finished yacht experience.

## Language

The visitor-facing interface is in English (`<html lang="en">`). Keep source identifiers and comments in English, following the existing code style. Update labels, SEO text, and sharing metadata when yacht-specific content and branding are available.

## Stack and deployment

- Plain HTML, CSS, and JavaScript; no framework or build step.
- Static site currently configured for deployment to Vercel through Git.
- Media assets are stored in the repository.
- Three.js is loaded from a CDN for the optional 3D product viewer and 360° panorama viewer.

## Main files

```text
index.html       Page structure, media elements, navigation, shop, AI Studio, and gallery
styles.css       Page and responsive styles
scenes-fp.js     Scene labels, video sources, image sequences, and transition map
script-fp.js     Scene playback, sequence canvas, day/night controls, AI Studio, and gallery
pano360.js       Optional interactive 360° panorama viewer
shop.js          Product catalog, cart, and AI product-placement flow
shop3d.js        Optional Three.js product viewer
SHOP-README.md   Details of the inherited IKEA Italia shop integration
images/          Videos, transition frames, panorama images, and interface assets
glb/             3D model assets
```

## Current content in this copy

The scene IDs are historical and do not describe the displayed content:

| Internal ID | Current label | Day video | Night content |
|---|---|---|---|
| `aerial` | Pool | `images/2_pingpong.webm` (video 2, forward + reverse in one loop) | None yet (the `1_night*` clips match video 1 only) |
| `aerial2` | Pool 2 | `images/1_pingpong.webm` (video 1, forward + reverse) | Day-to-night clip, reverse clip, and night loop |

The Terrace scene was removed; its media was moved out of the repository to `../yatch_removed_terrace/`. The opening poster is `images/poster_pool.jpg` / `poster_pool_m.jpg` (frame 0 of `2_pingpong.webm`). With no transition sequences configured, scene changes are direct cuts.

These are the current prototype scenes, **not yacht scenes**. Once yacht footage is ready, update the timeline labels, scene IDs as appropriate, videos, night variants, transition sequences, and the preload poster together in `scenes-fp.js`, `script-fp.js`, and `index.html`.

The product drawer is also inherited starter content: it currently contains IKEA Italia products intended for an outdoor pool/terrace setting. Replace its catalog and related copy if the yacht project needs a different shop. See `SHOP-README.md` for the existing behavior.

## How video and image-sequence playback works

The main stage has two visual states:

- **Loop:** a muted, inline `<video>` plays the current scene. Scene navigation and configured points of interest are displayed over it.
- **Transition:** a `<canvas>` draws preloaded still frames in sequence, hiding the points of interest while the virtual camera moves to the destination.

`CONFIG.transitions` maps a source scene and destination scene to a sequence in `scenes-fp.js`. The sequence settings define the image folder, filename prefix, frame range, extension, cache version, and playback FPS. A reverse transition can reuse the same frames in reverse order.

The opening poster is frame 0 of the main transition sequence. The scene video takes over when it can play. Transition sequences for the current scene are preloaded, while secondary day/night assets load when the browser is idle. If a sequence takes longer to load after navigation, the loader can appear.

To keep the transition visually seamless, its first frame should match the visible source-video frame and its last frame should match the destination video. Verify those endpoints whenever replacing footage or frames.

On mobile, the sequence player switches from `images/seq_arch/` to `images/seq_arch_m/` and loads every other frame. This reduces image size and frame count while maintaining approximately the same transition duration.

## Day/night controls

Scenes can use one of two day/night transition modes, configured in `CONFIG.scenes`:

- **Sequence mode:** `abSequence` supplies the transition frames while the destination night video is prepared.
- **Video mode:** `abVideoB` plays the day-to-night clip, `abVideoBLoop` supplies the night loop, and `abVideoBReverse` plays the return transition.

The controls are wired by `abSetNight()` in `script-fp.js`. During a transition, scene navigation and repeated day/night clicks are blocked. If a transition video changes, regenerate its reverse clip and update the cache-busting versions in the configuration.

## Optional 360° views

`pano360.js` defines the panorama images and hotspots. A scene can expose the 360° button when its configuration includes a matching `pano` ID. The current panorama tour is also inherited Pool/Terrace content and needs yacht panoramas and hotspot labels before it represents the yacht.

## AI Studio and gallery

- **AI Studio:** creates images or videos using the current view as a reference or a user prompt. It requires the visitor's Gemini API key.
- **Gallery:** holds generated images and videos for review and download during the current page session; it is not persistent across reloads.
- The shop's AI product-placement flow shares the AI Studio key and adds its generated results to the gallery.

## Media and performance

- The live page (`index.html`) loads the V2 files (`scenes-fpV2.js`, `script-fpV2.js`, `stylesV2.css`, `shopV2.js`, `pano360V2.js`).
- V2 clips are full-quality VP9 WebM in `videos_webm/`, one file per master in `videos/` with the same base name (`main_idle.webm` is the opening clip and the Exterior view). The same files are served on every device for now; `resolveBestVideoFormat()` in `script-fpV2.js` is the hook for future Safari / mobile variants. `videos/` and `videos_v2/` are git-ignored masters.

- Keep desktop transition frames in `images/seq_arch/` and mobile versions in `images/seq_arch_m/`.
- The existing naming pattern is `<prefix>_NN.jpg`; frame ranges and prefixes are configuration values, not fixed player assumptions.
- When replacing an asset without changing its filename, increment its `v` cache-busting value in `scenes-fp.js` or `script-fp.js`. Keep the initial poster preload in `index.html` in sync.
- Main scene videos must remain muted and use `playsinline` for reliable mobile autoplay.
- Keep large source/master media outside the repository when practical; commit only optimized delivery assets.

## Yacht-content adaptation checklist

1. Replace the Pool and Terrace videos with approved yacht footage and configure all corresponding day/night variants.
2. Create and configure transitions whose first and last frames match their neighboring videos.
3. Update timeline labels, poster preloads, panorama images, hotspots, and any points of interest.
4. Replace inherited property-tour SEO, social metadata, branding, and IKEA shop content wherever the yacht experience requires it.
5. Test the opening, both navigation directions, day/night switching, mobile playback, and optional 360° views using a local web server.

## Code conventions

- Use plain JavaScript; avoid adding dependencies unless needed.
- Keep function and variable names in English.
- `script-fp.js` includes legacy minified code and newer readable functions. Prefer adding readable code rather than manually minifying edits.
- Keep visitor-facing text in English and match the existing visual and responsive patterns.
