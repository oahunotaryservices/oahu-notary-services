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
