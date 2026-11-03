# Yacht Explorer — Project Guide

## Project overview

A single full-screen page that showcases the MAGNIFIC 68' yacht with video. Visitors switch between views (Aerial, Exterior, Deck, Antenna, Interior), orbit the yacht, change finishes and lighting, and open optional tools (furniture shop, AI renders, a request-info form).

## Language

The visitor-facing interface is in English (`<html lang="en">`). Keep labels short, plain and in sentence case. Keep source identifiers and comments in English.

## Stack and deployment

- Plain HTML, CSS and JavaScript; no framework or build step.
- Static site deployed to Vercel through Git.
- Delivered media is stored in the repository; masters are not.
- Three.js (CDN) powers the optional 3D product viewer; `<model-viewer>` (CDN) powers AR.

## Files

```text
index.html     Page structure: preloader, top bar, bottom dock, Customize drawer, Request info modal, shop, AI Studio, gallery
styles.css     All styles. The last sections ("GROUPED CONTROLS", "COMPOSE LOOK") define the current look and override older rules
scenes.js      CONFIG_V2: poster, views (timeline), scene videos, frame sequences, transitions, and the clip catalog
script.js      Preloader, video player, image-sequence player, navigation, dock, Customize drawer, dropdowns, AI Studio, gallery
shop.js        Furniture shop catalog, cart and AI product placement (inherited IKEA content, see SHOP-README.md)
shop3d.js      Three.js product viewer
videos_webm/   Delivered clips (VP9 WebM)
videos/        Master clips (git-ignored)
images/        Poster, favicon and inherited prototype media
```

## Video

- Every clip is a WebM in `videos_webm/` whose base name matches its master in `videos/` (e.g. `videos/horizon_idle.mp4` → `videos_webm/horizon_idle.webm`). Replacing a file with the same name needs no code change.
- `main_idle.webm` opens the site and is the Exterior view.
- The same files are served on every device for now. `resolveBestVideoFormat()` in `script.js` is the single place to return Safari or mobile variants later.
- Playback is double-buffered: two `<video>` elements swap so there is never a black frame; the outgoing frame is held on `#seq-canvas` while the next clip starts.
- Stage videos are always muted (also forced in `script.js`) and use `playsinline`.
- Background preloads go through a small queue (`queuePreload`): the current view's transitions first; finishes and lighting clips only on desktop.

## Startup

1. `#preloader` shows a percentage while it loads the poster (`CONFIG_V2.poster`, frame 0 of `main_idle.webm`; `posterMobile` on phones), the opening idle video into memory (with real download progress), and any frame sequences that leave the opening view.
2. The poster is drawn on `#seq-canvas`, the preloader fades, the idle video starts underneath and the canvas fades out once the video is moving.
3. Everything else loads in the background queue while the visitor watches.

If the opening idle video changes, re-extract both posters from its frame 0.

## Image-sequence transitions

- Defined in `CONFIG_V2.sequences` (see the comment there) and used from `transitions[from][to] = { sequence: "<id>" }`. An entry can also keep a `src` video as a fallback if the frames fail to load.
- Desktop frames live in `folder`; phones read the same file names from `folder` + `_m` at half resolution and load every other frame at half the fps, so the duration matches.
- Frames are downloaded and decoded (`img.decode()`) before playback; up to 5 sequences (3 on phones) stay in memory. Entering a view preloads the sequences that leave it and their destination idle videos.
- Playback draws on the canvas with `requestAnimationFrame`; afterwards the destination idle video starts under the held last frame and the canvas fades out (300 ms).
- Frame rule: the first frame must match the source view (idles have a static camera, so any loop frame works) and the last frame must equal frame 0 of the destination idle video. One render can serve both directions with `reverse: true`.
- Destination views should have a looping idle video (`loop: true`) for the hand-off to be seamless.

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
