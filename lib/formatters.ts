// ─── Argentine Formatters ───────────────────────────────────

const ARS_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ARS_COMPACT_FORMATTER = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const NUMBER_FORMATTER = new Intl.NumberFormat('es-AR');

const DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

// ─── Exports ────────────────────────────────────────────────

/** Format as Argentine Pesos → $850.000 */
export function formatARS(amount: number): string {
  return ARS_FORMATTER.format(amount);
}

/** Format as compact Argentine Pesos → $18,2 M */
export function formatARSCompact(amount: number): string {
  return ARS_COMPACT_FORMATTER.format(amount);
}

/** Format a number with locale separators → 14.000 */
export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

/** Format kg to tonnes → "14,0 tn" */
export function formatTonnes(kg: number): string {
  return `${(kg / 1000).toFixed(1).replace('.', ',')} tn`;
}

/** Format distance → "300 km" */
export function formatKm(km: number): string {
  return `${NUMBER_FORMATTER.format(km)} km`;
}

/** Format a date string or Date object → "25 may 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_FORMATTER.format(d);
}

/** Format a date string or Date object → "25 may 2026, 14:30" */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATETIME_FORMATTER.format(d);
}

/** Format percentage → "+12%" or "-3%" */
export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value}%`;
}
