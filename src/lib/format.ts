// Utilidades de formatação (moeda, números, percentuais)
export const formatCurrency = (value: number, currency: string = 'AOA') =>
  new Intl.NumberFormat('pt-AO', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 0 }).format(value);

export const formatPercent = (value: number, opts: { sign?: boolean } = {}) => {
  const sign = opts.sign ? (value > 0 ? '+' : value < 0 ? '−' : '') : '';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
};
