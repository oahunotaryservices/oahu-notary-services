# Oahu Notary Services Website

Official website files for **Oahu Notary Services**.

**Website:** https://www.oahunotaryservices.com  
**Phone:** 808-774-6248  
**Email:** OahuNotaryServices@gmail.com

## Main Pages

- `index.html` — Home
- `services.html` — Services
- `estate.html` — Estate Planning Signings
- `loan-signings.html` — Loan Signings
- `apostille.html` — Apostille Services
- `pricing.html` — Pricing
- `estimate.html` — Fee Estimate
- `reviews.html` — Reviews
- `contact.html` — Contact
- `privacy.html` — Privacy
- `404.html` — Not Found page
- `home/index.html` — legacy `/home` redirect to the current homepage

## Brand / App Files

- `assets/img/oahu-notary-logo.png` — website logo
- `favicon.ico` and branded favicon PNGs — browser-tab icons
- `assets/img/ons-brand-icon-*.png` — installed mobile web-app icons derived from the existing Oahu Notary Services logo
- `manifest.webmanifest` — installed mobile web-app name, brand colors, icons and shortcuts

The installed mobile version opens the live website, so normal published website content changes also appear there. The app icon itself may remain cached on devices that installed an older version; reinstalling the app refreshes the home-screen icon.

## Current Visual System

- Forest green: `#1F4A3A`
- Cream / white backgrounds with tan accents
- Title: Nexa Pro Text when available
- Heading/Subheading: Utopia when available
- Body: Noto Sans
- Square borders throughout cards, forms and sections
- All clickable buttons use rounded corners; content cards, pricing boxes and form fields remain square
- Lists use standard bullet points rather than decorative check marks

## Important Maintenance Notes

When changing pricing, update both visible pricing content and the estimate calculator so the amounts remain consistent.

When adding a new public page, update `sitemap.xml` and the navigation where appropriate.

Do not remove `home/index.html`; it preserves the former `/home` address and directs it to the current homepage.

Do not remove `CNAME` unless the custom domain is intentionally being changed.

Keep sensitive client documents, IDs, passwords and private legal information out of public website files. Use the secure document-upload option for client documents.


## Installed App Branding

- App name: **Oahu Notary Services**
- Home-screen short name: **Oahu Notary**
- Icon: symbol-only Oahu Notary Services owl/O mark in forest green, white, and tan
- Launch treatment: branded Oahu Notary Services splash screen
- Theme color: `#1F4A3A`
- Background color: warm cream `#F7F3EA`
- The installed app uses live website content. The service worker uses network-first navigation so published website changes are preferred over cached copies.


## Installable App

The Home page includes a permanent **Install Oahu Notary Services** section at `index.html#install-app`. The install button opens the native browser installation prompt when available and provides device-specific instructions when the browser does not expose the prompt.


## September 2026 Trust & Policy Update

- Added `about.html` with owner photo, credentials, E&O coverage, background-screening and trust information.
- Added `policies.html` covering payment, cancellation/rescheduling/no-show, refunds, client responsibility and limitation of responsibility.
- Added general FAQs, a three-step How It Works section, local service-area text, and a live Google review preview on Home.
- Added LocalBusiness structured data and new sitemap entries.
- Added policy acknowledgement to the contact form.
- `assets/img/stacey-oahu-notary.jpg` is the exact user-provided owner photo.
- IMPORTANT: this package intentionally does NOT include `assets/img/oahu-notary-logo.png`. Keep the exact logo file already in the live repository; uploading this package over the existing files will leave it unchanged.


## Witness Availability

Clients are encouraged to provide their own qualified witness(es). If a required witness cannot be provided by the client, they may ask about availability when scheduling. Oahu Notary Services may be able to arrange one witness for an additional $25 by advance request, subject to availability and document requirements. Availability is not guaranteed.


## V5.5 Pricing Update

- Town / South Oʻahu standard mobile travel / meeting fee starts at $50.
- Notarization / signature fee remains $5 each.
- A simple Town appointment with one notarized signature starts at $55 before applicable Hawaiʻi GET.
- Short notice (4–24 hours): +$25.
- Rush / immediate (less than 4 hours): +$50; not stacked with short notice.
- Late-night appointments: +$50 from 10 PM–7 AM.
- Automatic Monday–Friday 4–7 PM peak-traffic surcharge removed.
- No automatic weekend surcharge.
- Exact travel pricing and any unusual access/parking adjustment are confirmed before booking.
