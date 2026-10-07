(() => {
  'use strict';
  const root = document.querySelector('[data-notary-reviews]');
  if (!root) return;
  const element = (tag, text) => {
    const el = document.createElement(tag);
    if (text != null) el.textContent = String(text);
    return el;
  };
  const safeUrl = value => {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; }
    catch { return null; }
  };
  const link = (text, url) => {
    const a = element('a', text);
    const href = safeUrl(url);
    if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  };
  async function load() {
    try {
      if (!root.dataset.endpoint || root.dataset.endpoint.includes('REPLACE-')) throw new Error('Configure endpoint');
      const response = await fetch(root.dataset.endpoint, {
        cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(16000)
      });
      if (!response.ok) throw new Error('Unavailable');
      const place = await response.json();
      const fragment = document.createDocumentFragment();
      if (typeof place.rating === 'number') {
        fragment.append(element('p', `${place.rating.toFixed(1)} / 5 · ${place.userRatingCount ?? 0} Google reviews`));
      }
      fragment.append(element('p', 'Selected by Google, ordered by relevance. No additional rating filter.'));
      const grid = element('div'); grid.className = 'google-review-grid';
      for (const review of place.reviews || []) {
        const card = element('article');
        const author = review.authorAttribution || {};
        const header = element('div');
        header.className = 'review-author';
        const imageUrl = safeUrl(author.photoUri);
        if (imageUrl) {
          const img = element('img'); img.src = imageUrl; img.alt = '';
          img.width = 40; img.height = 40; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
          header.append(img);
        }
        header.append(link(author.displayName || 'Google reviewer', author.uri));
        card.append(header);
        card.append(element('p', `${review.rating ?? ''} / 5 · ${review.relativePublishTimeDescription || ''}`));
        const text = element('p', review.originalText?.text || review.text?.text || '');
        text.className = 'review-text'; card.append(text);
        card.append(link('View this review on Google Maps', review.googleMapsUri));
        grid.append(card);
      }
      fragment.append(grid);
      if (!(place.reviews || []).length) fragment.append(element('p', 'No reviews returned.'));
      const actions = element('div'); actions.className = 'review-actions';
      actions.append(link('Read all Google reviews', place.googleMapsUri));
      actions.append(link('Leave a Google review', 'https://g.page/r/CdlFAdkKu8WPEBM/review'));
      fragment.append(actions);
      for (const attribution of place.attributions || []) {
        const credit = element('p');
        credit.append(link(attribution.provider || 'Data provider', attribution.providerUri));
        fragment.append(credit);
      }
      // Compact attribution footer uses Google's allowed text form for limited space.
      const attribution = element('span', 'Google Maps');
      attribution.className = 'google-attribution';
      attribution.setAttribute('translate', 'no');
      const footer = element('div'); footer.className = 'review-footer';
      footer.append(attribution); fragment.append(footer);
      fragment.append(link('Google review policy', 'https://support.google.com/contributionpolicy/answer/7400114'));
      root.replaceChildren(fragment);
    } catch {
      root.replaceChildren(element('p', 'Google reviews are temporarily unavailable.'),
        link('Read our reviews on Google', 'https://www.google.com/maps?cid=10359892173100500441')); 
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, { rootMargin: '150px' });
    observer.observe(root);
  } else load();
})();
