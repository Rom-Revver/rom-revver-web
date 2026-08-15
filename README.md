# web/ — marketing site

The public ROM Revver landing page. Source lives here (private repo); the built
static files are deployed to the **public** `Rom-Revver/rom-revver-web` repo by
`.github/workflows/web-deploy.yml` on every push to `main` that touches `web/`
(or via *Run workflow*). GitHub Pages on `rom-revver-web` serves it.

- **Preview locally:** open `web/index.html` in a browser (it's self-contained —
  no build step, no external requests).
- **Edit:** it's a single `index.html` (inlined CSS) + `assets/` screenshots.
  Screenshots are copied from `reports/assets/` — refresh them there and re-copy.

## One-time owner setup (WEB-01) — in order

`rom-revver-web` starts **empty** (no commits → no `main` branch yet). That's fine:
the deploy workflow **creates `main` on its first run**, so do these in order:

1. `WEB_TOKEN` secret in this repo (fine-grained PAT, Contents: read+write on
   `rom-revver-web`) — **done**.
2. **Run the deploy once** — commit `web/` to this repo's `main` (the push triggers
   it), or **Actions → Deploy website → Run workflow**. This creates and fills
   `rom-revver-web`'s `main` branch.
3. **Now** on `rom-revver-web`: **Settings → Pages → Deploy from a branch →
   `main` / root**. (The branch exists only after step 2.) Live at
   `https://rom-revver.github.io/rom-revver-web/`.
4. Pick a domain (see WEB-01 in `BACKLOG.md`) and point it at Pages. Note:
   `ezwedsites.ca` reads as a wedding-site brand; a fitting domain is recommended.
   *(A cleaner URL — `https://rom-revver.github.io/` — is possible if the repo is
   renamed `rom-revver.github.io`.)*

## Before public launch

- Confirm provisional pricing copy ($20 Pro, one-time — **no renewal**; the $8
  renewal was withdrawn 2026-08-14, decision-log
  `pro-license-single-purchase-no-renewal`).
- **The "Buy Pro" button is LIVE** (a real Stripe Payment Link that takes real
  money). Before public launch: confirm `LWF-31` automated fulfilment is
  deployed, then drop the "issued by hand" note from the Pro card.
- Add the real download links once Phase-A release ships (replace the
  "Coming soon" buttons).
- Add the privacy policy / ToS page (LEGAL-01) — required once the storefront
  collects customer data.
