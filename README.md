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
   is invalid at a zone apex; that form is only for a `www` host), plus the
   `CNAME` *file* — which lives at **`web/CNAME` in THIS repo** (the deploy
   mirror-wipes `rom-revver-web`, so a CNAME only there — including the one
   GitHub writes when the domain is set in the Pages UI — is deleted on the
   next deploy; `tests/web-site.test.ts` pins the file here). The
   same domain is the Cakemail sending domain for licence keys, so its DNS also
   carries SPF/DKIM/DMARC — see
   `docs/monetization/key-delivery-architecture.md`.
   *(A cleaner URL — `https://rom-revver.github.io/` — is possible if the repo is
   renamed `rom-revver.github.io`.)*

> **Status (2026-08-24): the OWNER DECIDED the apex serves THIS site**, and
> everything repo-side is done — `web/CNAME` ships with every deploy, so the
> GitHub Pages binding stands once the post-merge deploy runs (if the apex
> hasn't flipped, check the deploy ran BEFORE checking DNS). **The ONE
> remaining step is the DNS flip**
> in Cloudflare (dash → romrevver.ca → DNS). The apex records are PROXIED
> (they resolve to Cloudflare edge IPs; it is their CONTENT — currently
> GoDaddy Website Builder's origin, auto-provisioned with the domain
> purchase — that points at GoDaddy). Change:
>
> - apex `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
>   `185.199.111.153`
> - apex `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`,
>   `2606:50c0:8002::153`, `2606:50c0:8003::153`
> - `www` `CNAME` → `rom-revver.github.io`
>
> **Touch NOTHING else** — the MX/TXT records carry the domain's email
> (inbound routing, SPF, DMARC; see the BACKLOG item on licence-key email
> alignment). If the Pages cert shows pending, set the changed records to
> DNS-only (grey cloud) until GitHub finishes provisioning, then re-proxy.
> **Between this branch's deploy and the DNS flip, this site is reachable at
> NO URL** — the `github.io` URL 301s to the apex (which still shows GoDaddy)
> the moment the binding lands. Accepted deliberately: nothing links to the
> `github.io` URL today, so no reader loses a working path, and the flip is
> the immediate next owner action. When diagnosing any future apex issue,
> fingerprint the origin first:
> `curl -sI https://romrevver.ca | grep -iE 'x-github|x-siteid'`.

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
