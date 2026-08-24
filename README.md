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
4. Point **`romrevver.ca`** (bought 2026-08-16, registrar GoDaddy) at Pages —
   **apex `A`/`AAAA` records** per GitHub Pages' custom-domain docs (a `CNAME`
   is invalid at a zone apex; that form is only for a `www` host), plus a
   `CNAME` *file* naming the domain. The
   same domain is the Cakemail sending domain for licence keys, so its DNS also
   carries SPF/DKIM/DMARC — see
   `docs/monetization/key-delivery-architecture.md`.
   *(A cleaner URL — `https://rom-revver.github.io/` — is possible if the repo is
   renamed `rom-revver.github.io`.)*

> **⚠ Steps 3–4 describe the PLAN, and the live site does NOT follow it
> (verified 2026-08-24).** What serves `https://romrevver.ca` today carries
> **no GitHub/Fastly origin fingerprints** (no `x-github-request-id`, no
> `via: varnish` — the `github.io` URL has both), the Pages API for
> `rom-revver-web` reports `cname: null`, and no `CNAME` file exists in that
> branch — yet the apex serves. **What it serves is a GoDaddy Website Builder
> site** (review, 2026-08-24: `x-siteid: us-east-1`, a `dps_site_id` GoDaddy
> cookie, a GoDaddy CSP, and
> `<meta name="generator" content="…Go Daddy Website Builder…">` in the body)
> — the registrar's own product, behind Cloudflare's proxy. **That means THIS
> directory's site — including its Stripe checkout link — is NOT what the
> public sees at `romrevver.ca`**; it is reachable only at the `github.io`
> URL, which nothing points to. See the BACKLOG item. During the
> 2026-08-23/24 apex outage (provider-side; it resolved with **no repo
> change**) an agent concluded the missing-CNAME/GH-Pages story and shipped
> `web/CNAME` — wrong, reverted, deploy cancelled before it bound anything.
> **Do not "fix" an apex outage from this README's plan**: first fingerprint
> the origin (`curl -sI https://romrevver.ca | grep -iE 'x-github|x-siteid'`).

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
