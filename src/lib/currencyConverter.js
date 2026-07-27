/**
 * Currency Conversion Helper for FlamVoyager.
 * Supports USD ($), INR (₹), and EUR (€).
 */

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸', name: 'USD ($)' },
  INR: { code: 'INR', symbol: '₹', rate: 84.0, flag: '🇮🇳', name: 'INR (₹)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', name: 'EUR (€)' },
};

/**
 * Parses numeric USD values inside strings (e.g., "$450 / person", "$15 - $25")
 * and converts them to the target currency.
 */
export function convertCurrencyString(str, targetCode = 'USD') {
  if (!str || typeof str !== 'string') return str;
  const currencyObj = CURRENCIES[targetCode] || CURRENCIES.USD;

  if (targetCode === 'USD') return str;

  // Replace each dollar amount like $450 or $15 - $25
  return str.replace(/\$(\d+)/g, (match, amountStr) => {
    const amountUSD = parseInt(amountStr, 10);
    if (isNaN(amountUSD)) return match;

    const convertedAmount = Math.round(amountUSD * currencyObj.rate);

    if (targetCode === 'INR') {
      return `${currencyObj.symbol}${convertedAmount.toLocaleString('en-IN')}`;
    }
    return `${currencyObj.symbol}${convertedAmount.toLocaleString('en-US')}`;
  });
}
