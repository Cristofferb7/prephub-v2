# PrepHub "Vital Ember" Redesign — spec for Claude Code

Research-backed direction (July 2026): fitness-dashboard warmth (Whoop/Apple Fitness ring) on Material 3 Expressive structure (Google's research: tonal surfaces + pill nav = users find key elements up to 4× faster; older/low-tech users reach parity), Duolingo/Finch-friendly tone. Full rationale lives with Cowork; this file is the to-do.

## Already implemented by Cowork (do NOT redo — review the diff)

- Token system rewritten in `src/index.css`: warm near-black `#141210` base (was cold blue-ink), tonal surfaces 1/2/3, hairline inner highlights, **zero 1px borders anywhere**, radius scale (12/16/20/28), spring easing var, light theme = warm paper `#faf6f0` with soft shadows.
- Pressed-state `scale(0.97)` on all tappables; springy nav pill; circular pop-animation checkboxes (green fill when done, row tints `--good-dim`); gradient progress bars + CTA; score ring: gradient stroke + cheap SVG glow (wide low-opacity stroke, NO filters/backdrop-blur) + 800-weight numeral; `/ahora` now deep-red world (`#450a0a` bg, filled red buttons); nav is a raised rounded sheet, backdrop-filter removed (kills low-end Androids); theme-color metas updated to #141210/#faf6f0.

## Your tasks, in order

1. **Manifest colors** in `vite.config.ts`: `theme_color: '#141210'`, `background_color: '#141210'`.
2. **Home next-step CTA**: when score is >0 and <100, show one full-width CTA under the ring naming the single next action, e.g. "Siguiente: Agua potable — 2 min" (pick the first unchecked kit item or first empty plan section). Never negative framing ("te faltan 14 cosas" ❌ / "3 pasos para subir a 80" ✅). Reuse `.cta`.
3. **Kit screen**: sticky slim progress bar at top (reuse `.bar`, `position: sticky`); per-group counters in the group headers ("AGUA Y COMIDA · 2/4"); staggered card entrance (CSS `animation-delay` steps of 40ms, translateY(8px)+fade, respect reduced-motion).
4. **Plan familiar → one-question-per-screen wizard** (biggest task): convert the long form into 5–6 steps with a segmented amber progress bar on top (goal-gradient effect reduces drop-off), one section per step, big option-card inputs where applicable, Next button pinned bottom (40% opacity until valid), always-visible labeled Back, editable summary + celebration (plan card scales in with `--ease-spring`) at the end. Keep all existing fields and Dexie persistence; keep share/print/QR on the final step.
5. **Display font (optional, last)**: self-host ONE variable font for headings + the ring numeral only — Onest or Figtree, subsetted to Latin+digits (~40 KB woff2), `font-display: swap`, add to SW precache. Body stays system stack. Skip if it pushes first-load JS+CSS+font past 300 KB gzipped.

## Reference apps addendum (July 10) — NERV · FEMA · Watch Duty

Owner wants inspiration from nerv.app, the FEMA app, and watchduty.org. Synthesis of what to take:

**NERV (Japan)** — its brand IS accessibility: per-user text size (±levels), font weight, contrast modes, color-vision-deficiency themes, screen-reader layouts; "convey information not only by colour, but also by text." Cowork already implemented the core (see below). Remaining NERV-inspired backlog: (a) audit every state so nothing is communicated by color alone (done-items, banners, nav active — add icons/text where needed); (b) color-vision-deficiency check of amber/green/red trio (simulate protanopia/deuteranopia; adjust --good/--emergency if they collide); (c) screen-reader pass: aria-live on score changes, meaningful read-outs on cards (NERV reads full weather sentences — our cards should read "Kit de emergencia, 40 por ciento completo").

**Watch Duty (US)** — trust through verification and provenance. Backlog: (a) every guide page gets a provenance chip: "Fuente: FUNVISIS / OPS · Revisado: julio 2026" (data already in guides.ts sources — surface it as a visible chip at top, not buried at bottom); (b) reorganize Guías index into the three-phase structure (Antes / Durante / Después + Lluvias) — mirrors Watch Duty's Monitor→Prepare→Respond framing and matches how people actually search under stress; (c) tone: verified-facts voice, timestamps on content updates.

**FEMA app** — validation, not new features: PrepHub already covers its core loop (checklist + family plan + guides) Spanish-first. Its one steal: bilingual toggle. Backlog (v2, low priority): English language option — structure copy so strings can be extracted later (don't hardcode more prose into components; keep content in data files).

### Cowork implemented (July 10, second pass — don't redo)

- NERV-style accessibility system: `/ajustes` page ("Pantalla y texto", Aa button in topbar) with text size (5 levels, root-font scaling — ALL css font-sizes converted to rem), bold-text toggle, high-contrast mode (token overrides incl. visible hairline borders), theme toggle moved into it. Prefs persist (ph-text/ph-bold/ph-contrast) and apply pre-paint in index.html.
- Fixed brand SVG referencing dead tokens (--surface/--border → --surface-2).

### Your next tasks (in priority order)

1. Watch Duty provenance chips on guide pages + three-phase Guías index regroup.
2. NERV color-only audit + aria-live score + card read-outs.
3. Verify /ajustes text scaling doesn't break the wizard pinned nav or kit sticky bar at "Enorme" (23.5px root) on a 360px viewport — fix any overflow with wrapping, never smaller text.
4. Color-vision simulation check of the green/amber/red system.

## Hard rules (unchanged from CLAUDE.md)

No backdrop-filter. Animate transform/opacity only. No animation libraries. `prefers-reduced-motion` respected everywhere. Red = emergency contexts only. Bundle budget < 300 KB gz. Everything works offline. Spanish (Venezuelan) copy. After changes: `npm run build` green, then `vercel --prod`.
