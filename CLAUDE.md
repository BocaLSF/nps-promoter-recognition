# CLAUDE.md - Project Context & Architecture Guide

This repository powers the **NPS Promoter Daily Recognition Studio** (`nps-promoter-recognition`), a web tool for generating and presenting daily colleague NPS Promoter recognition posters.

## 1. Core Product & Design Constraints (IMPORTANT)

1. **Two-Zone Vertical Experience**:
   - **Above the Fold (`100vh`, `#top-stage`)**: Immediately displays a pure, distraction-free **16:9 recognition poster** (`#poster-canvas`). Supports fullscreen projection (`F` key) and offline 2K (`2560x1440`) PNG export.
   - **Below the Fold (`#console-dashboard`)**: Scrolling down reveals the **Control Console / Dashboard** styled in **Anthropic editorial parchment (`#F5F3EC`, `#FAF9F5`, terracotta `#D97757`) + Claude Code dark terminal (`#181715`)** aesthetics.

2. **Poster Aesthetic & Strict Minimalist Copy Rule**:
   - **Visual Style**: Lively, bright, fresh **Bauhaus geometric style** (`#FFFDF7` grid canvas, cobalt blue `#2563EB`, cadmium yellow `#FFD233`, coral `#FF5938`, mint `#14B88A`, bold `#16181D` ink outlines and hard offset shadows).
   - **STRICT Minimalist Text Rule**: Do **NOT** add slogans, subtitles, paragraphs, store names, or explanatory copy onto the 16:9 poster. The poster must ONLY contain:
     1. `NPS` + `PROMOTER` (or `PROMOTERS` / `PROMOTE`) badge lockup
     2. Date stamp (e.g. `2026.11.17`)
     3. Each colleague's Memoji avatar
     4. Each colleague's Name

3. **Smart Adaptive Multi-Person Layout**:
   - **1 colleague**: Centered hero layout with oversized Memoji (`36.5cqh`) and prominent name tag.
   - **2 colleagues**: Evenly balanced duo (`30cqh`, generous `11.5cqw` horizontal gap).
   - **3 colleagues**: Naturally distributed horizontal trio (`25.5cqh`).
   - **4 colleagues**: Crisp 4-across gallery row (`21cqh`).
   - **5-10 colleagues**: Centered 2-row staggered Bauhaus grid (e.g. `3+2`, `3+3`, `4+3`, `4+4`).
   - **11+ colleagues**: Centered 3-row adaptive grid.

4. **Dual-Mode Memoji Auto-Retrieval**:
   - Typing a colleague's name in the `❯` terminal prompt automatically checks:
     1. **IndexedDB Memoji Vault** (populated by dragging `ColleagueName.png` files into the dashboard dropzone; supports `.json` export/import backup).
     2. **Local `./memojis/` directory** (`./memojis/<Name>.png`, `.webp`, `.jpg`).
     3. **Built-in SVG Memoji Placeholder Generator** (`src/js/memoji-placeholder.js`) when real Memoji assets have not yet been uploaded.

## 2. Repository Structure

- `index.html` - Modular entry point for local development (works directly via `file://` or any static HTTP server, zero npm dependencies).
- `src/styles/`
  - `tokens-and-base.css` - Anthropic, Claude Code, and typography tokens + base reset.
  - `poster-bauhaus.css` - 16:9 stage and CSS Container Query (`cqw`/`cqh`) Bauhaus poster styles.
  - `console-anthropic.css` - Anthropic editorial panels + Claude Code dark terminal UI.
- `src/js/`
  - `memoji-placeholder.js` - Deterministic Memoji-inspired SVG character portrait generator.
  - `vault-storage.js` - IndexedDB storage engine, `./memojis/` folder prober, and JSON backup/restore.
  - `layout-engine.js` - Headcount row/scale calculator (`computeLayoutMetrics`), date formatting, and `localStorage` state persistence.
  - `exporter-canvas.js` - Pixel-matched `2560x1440` native HTML5 `<canvas>` PNG renderer (100% offline, avoids `html2canvas` container-query bugs).
  - `app.js` - DOM rendering, Claude Code autocomplete palette, roster reordering, drag-and-drop, and fullscreen handlers.
- `memojis/` - Drop real transparent Memoji files here named `<Name>.png` (e.g. `Alex.png`) for automatic local lookup.
- `data/sample-roster.json` - Sample configuration and Memoji vault backup schema reference.
- `scripts/build-standalone.py` - Bundles `index.html` + `src/*` into a single portable file at `dist/NPS-Promoter-Recognition.html`.
- `dist/NPS-Promoter-Recognition.html` - Pre-built single-file version ready to share or open anywhere.

## 3. Common Workflows

- **Preview / Edit Modular Source**:
  - Open `index.html` directly in Safari/Chrome, or run `python3 -m http.server 8080`.
- **Keep Poster DOM & PNG Exporter Synced**:
  - Whenever changing poster geometry or layout metrics in `src/styles/poster-bauhaus.css` or `src/js/layout-engine.js`, update `src/js/exporter-canvas.js` accordingly so exported 2K PNGs match the live DOM stage.
- **Rebuild Single-File HTML**:
  ```bash
  python3 scripts/build-standalone.py
  ```
