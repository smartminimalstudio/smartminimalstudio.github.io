'use strict';

// Public checkout links only. Never put API keys or paid-file URLs here.
// Branded Payhip checkout; skip the duplicate product page.
window.DETENT_STORE = Object.freeze({
  provider: 'payhip',
  currency: 'USD',
  personalPrice: 19,
  personalCheckoutUrl: 'https://payhip.com/buy?link=pT3IL'
});
