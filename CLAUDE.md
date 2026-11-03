# Yacht Explorer — Project Guide

## Project overview

A single full-screen page that showcases the MAGNIFIC 68' yacht with video. Visitors switch between views (Aerial, Exterior, Deck, Antenna, Interior), orbit the yacht, change finishes and lighting, and open optional tools (furniture shop, AI renders, a request-info form).

## Language

The visitor-facing interface is in English (`<html lang="en">`). Keep labels short, plain and in sentence case. Keep source identifiers and comments in English.

## Stack and deployment

- Plain HTML, CSS and JavaScript; no framework or build step.
- Static site deployed to Vercel through Git.
- Delivered media is stored in the repository; masters are not.
- Three.js (CDN) powers the optional 3D product viewer and 360° panorama; `<model-viewer>` (CDN) powers AR.

## Files

```text
index.html     Page structure: top bar, bottom dock, Customize drawer, Request info modal, shop, AI Studio, gallery
styles.css     All styles. The last sections ("GROUPED CONTROLS", "COMPOSE LOOK") define the current look and override older rules
scenes.js      CONFIG_V2: views (timeline), scene videos, scene-to-scene transitions, and the clip catalog
script.js      Video player, navigation, bottom dock, Customize drawer, dropdowns, AI Studio and gallery
shop.js        Furniture shop catalog, cart and AI product placement (inherited IKEA content, see SHOP-README.md)
shop3d.js      Three.js product viewer
pano360.js     360° panorama viewer (no button on the page at the moment)
videos_webm/   Delivered clips (VP9 WebM)
videos/        Master clips (git-ignored)
images/        Poster, favicon, panorama images and inherited prototype media
```

## Video

- Every clip is a WebM in `videos_webm/` whose base name matches its master in `videos/` (e.g. `videos/horizon_idle.mp4` → `videos_webm/horizon_idle.webm`). Replacing a file with the same name needs no code change.
- `main_idle.webm` opens the site and is the Exterior view.
- The same files are served on every device for now. `resolveBestVideoFormat()` in `script.js` is the single place to return Safari or mobile variants later.
- Playback is double-buffered: two `<video>` elements swap so there is never a black frame; the outgoing frame is held on `#seq-canvas` while the next clip starts.
- Stage videos are always muted (also forced in `script.js`) and use `playsinline`.
- Background preloads go through a small queue (`queuePreload`): the current view's transitions first; finishes and lighting clips only on desktop.

## Configuration (`scenes.js`)

- `timeline`: the views shown in the bottom dock, in order.
- `scenes`: per view, the loop video (`video`), whether it loops or holds its last frame, and the orbit clip.
- `transitions[from][to]`: the clip played when moving between views, and whether it then starts the destination loop or holds its end frame.
- `catalog`: everything in the Customize drawer — `moods` (Lighting), `materials.hull/deck/salon` (Finishes), `orbits`, `cameraTransitions` (Camera moves). Each item has an `id`, a `code` used to highlight the active button, a `src`, and display `name`/`sub`/`desc`.
- Clip `code`s are the original five-digit clip numbers. Renamed files carry no code in their filename, so `extractCodeFromSrc()` looks the code up in the catalog.

## Interface

- Top bar: brand pill with the current view, Lighting dropdown, and Customize / More (furniture shop, AI renders, my renders) / Request info.
- Bottom dock: options for the current view (finishes or camera moves) above the view selector.
- Visual language follows the Compose configurator: DM Sans only, warm-graphite glass, cool-glass dock, gold as the single accent.
- Phones in landscape (`orientation: landscape` and `max-height: 520px`) use a single-row dock and a side-sheet drawer.

## Cache busting

When changing `styles.css` or any script, increment its `?v=` value in `index.html`.

## AI Studio and gallery

- AI renders creates images or videos from the current view; it needs the visitor's Gemini API key.
- My renders holds generated media for the current page session only.
- The shop's AI placement shares the same key and adds results to the gallery.

## Testing

Serve the folder with a local web server (ES modules and video blobs do not work from `file://`), then check: the opening clip, every view in both directions, finishes and lighting, the Customize drawer, desktop, phone portrait and phone landscape.

## Code conventions

- Plain JavaScript; avoid new dependencies unless needed.
- Prefer adding readable code; match the surrounding style.
