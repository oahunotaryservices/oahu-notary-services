# Oahu Notary Services — GitHub Pages Website

A complete static website for **Oahu Notary Services, LLC**, designed for free hosting on GitHub Pages.

## What is included

- Responsive homepage
- Services page
- Pricing page with Oʻahu service-area graphic
- Estate Planning Signing pricing
- Interactive fee estimator (pre-GET estimate)
- Apostille/authentication service page
- Reviews page with Google/Yelp links
- Contact/appointment form that opens the visitor's email app
- Secure document-upload button using the existing ClientUpload link
- SEO metadata, LocalBusiness structured data, robots.txt, sitemap.xml
- Privacy page and 404 page
- `.nojekyll` for straightforward static hosting

## Publish on GitHub Pages

1. Sign in to GitHub and create a new repository. A name such as `oahu-notary-services` is fine.
2. Upload everything in this folder to the repository root. `index.html` must remain at the root.
3. Open the repository **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/(root)`, then save.
6. GitHub will give you a `github.io` preview URL.

## Connect www.OahuNotaryServices.com after you approve the preview

1. In GitHub **Settings > Pages**, enter `www.oahunotaryservices.com` as the custom domain.
2. At the company that manages your DNS, point the `www` CNAME record to `<YOUR-GITHUB-USERNAME>.github.io`.
3. Rename `CNAME.example` to `CNAME` and leave its contents as `www.oahunotaryservices.com`.
4. After GitHub confirms the DNS, enable **Enforce HTTPS**.
5. Configure the bare/apex domain (`oahunotaryservices.com`) to redirect to `www.oahunotaryservices.com` using your DNS/domain provider, or follow GitHub's apex-domain instructions if you want GitHub to answer on both.

**Do not change DNS until the GitHub preview looks right.** This lets the current Google Sites website stay live while you test.

## Easy edits

Most business constants are near the top of `assets/js/site.js`:
- phone and email
- secure upload URL
- Google/Yelp review links
- standard travel fees
- estate-planning signing fees
- notarial act fee and common add-ons

Site colors are near the top of `assets/css/styles.css`. The primary green is `#1F4A3A`.

## Images

The package includes logo/hero images derived from the business's public website banner so the site is not blank on first launch. For the strongest brand result, replace:

- `assets/img/oahu-notary-logo.png` with the exact high-resolution transparent logo
- `assets/img/notary-hero.png` with the preferred actual notary-book photo

Keep the filenames unchanged.

## Reviews

This static package intentionally does not fabricate testimonials. The Reviews page links visitors to Google and Yelp. If you later choose an auto-updating review widget, paste that provider's embed code into the marked area in `reviews.html`.

## Forms and privacy

GitHub Pages is static hosting; there is no server-side form processor in this package. The contact form creates a pre-filled email in the visitor's email program. Sensitive documents should be sent through the existing secure ClientUpload link, not through GitHub Pages.
