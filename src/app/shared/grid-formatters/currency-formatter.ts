export const currencyFormatter = (params: any, defaultValue = 'N/A') => {
  if (!params.value) {
    return defaultValue;
  }
  const usdFormate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  return usdFormate.format(params.value);
};
