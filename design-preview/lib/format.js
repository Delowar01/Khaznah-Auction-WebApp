// Formatting shared by every concept. Numbers use Western digits in both
// languages (matching production's `en-SA` money formatting); dates use the
// Gregorian calendar with Latin digits unless a concept asks otherwise.

export const RIYAL = "⃁"; // Saudi Riyal sign (Unicode 17), served by /fonts/riyal-regular.woff2
const LRI = "⁦"; // left-to-right isolate
const PDI = "⁩"; // pop directional isolate

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function formatNumber(value) {
  return numberFormat.format(Number(value) || 0);
}

export function formatCompact(value) {
  return compactFormat.format(Number(value) || 0);
}

/** Plain-text money for sentences, toasts and aria text. */
export function moneyText(value) {
  return `${LRI}${RIYAL} ${formatNumber(value)}${PDI}`;
}

export function moneyLabel(value, lang) {
  const amount = formatNumber(value);
  return lang === "ar" ? `${amount} ريال سعودي` : `${amount} Saudi riyals`;
}

export function percentOff(price, original) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function durationParts(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    total: s,
  };
}

const pad = (n) => String(n).padStart(2, "0");

const UNIT = {
  en: { d: "d", h: "h", m: "m", s: "s" },
  ar: { d: "ي", h: "س", m: "د", s: "ث" },
};

export const UNIT_LABELS = {
  en: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  ar: { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" },
};

/**
 * Compact remaining-time text.
 *  "short": 2h 14m · 18m 24s · 1d 3h   (AR: 2س 14د)
 *  "clock": 02:14:36 · 1d 03:12:10     (AR: 1ي 03:12:10)
 */
export function formatDuration(totalSeconds, lang = "en", style = "short") {
  const { days, hours, minutes, seconds } = durationParts(totalSeconds);
  const u = UNIT[lang] || UNIT.en;
  if (style === "clock") {
    const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return days > 0 ? `${days}${u.d} ${clock}` : clock;
  }
  if (days > 0) return `${days}${u.d} ${hours}${u.h}`;
  if (hours > 0) return `${hours}${u.h} ${pad(minutes)}${u.m}`;
  if (minutes > 0) return `${minutes}${u.m} ${pad(seconds)}${u.s}`;
  return `${seconds}${u.s}`;
}

/** "3 min ago" style relative time for activity feeds. */
export function formatAgo(secondsAgo, lang = "en") {
  const s = Math.max(0, Math.floor(secondsAgo));
  if (lang === "ar") {
    if (s < 10) return "الآن";
    if (s < 60) return `قبل ${s} ث`;
    if (s < 3600) return `قبل ${Math.floor(s / 60)} د`;
    if (s < 86400) return `قبل ${Math.floor(s / 3600)} س`;
    return `قبل ${Math.floor(s / 86400)} ي`;
  }
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} d ago`;
}

export function formatMonthYear(iso, lang = "en") {
  const locale = lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB";
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "Asia/Riyadh" }).format(new Date(iso));
}

/** Hijri + Gregorian date strings for "today" (client-only use). */
export function formatDualDate(date, lang = "en") {
  const hijri = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-islamic-umalqura-nu-latn" : "en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(date);
  const gregorian = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Riyadh",
  }).format(date);
  return { hijri, gregorian };
}
