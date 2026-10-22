// Production's sign-in and registration rules, for the Option 3 preview of
// /login, /register and /seller/register. The preview has no backend: the
// "server" answers below follow the production serializers and views
// (accounts/serializers.py, accounts/views.py) and SAMPLE_EMAILS chooses
// which answer a form gets. Server messages are English only, as in
// production (no LocaleMiddleware).
import { SAMPLE_EMAILS } from "@/data/authSamples";

/** lib/safeRedirect.js: only same-site absolute paths; anything else → fallback. */
export function sanitizeNextPath(raw, fallback = "/") {
  const value = String(raw || "");
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/**
 * The preview address of a production path: production paths ("/account")
 * gain the preview's language and Option 3 prefix; a path already inside the
 * preview ("/en/concept-c/account") is kept.
 */
export function previewPath(path, link) {
  return /^\/(en|ar)\/concept-[a-d](\/|\?|$)/.test(path) ? path : link(path);
}

/** login/page.js:52 — only these two roles may sign in on the customer login. */
export const isBuyerRole = (role) => role === "buyer" || role === "trade_buyer";

const same = (a, b) => String(a || "").trim().toLowerCase() === b;

/**
 * POST accounts/session/login/. Empty fields never reach the server
 * (AuthProvider.login returns null → "Invalid credentials.").
 * Returns { empty } | { message } (server text) | { role }.
 */
export function signIn(email, password) {
  if (!email || !password) return { empty: true };
  if (same(email, SAMPLE_EMAILS.unknown)) return { message: "No active account found with the given credentials" };
  if (same(email, SAMPLE_EMAILS.suspended)) return { message: "This account is not allowed to sign in." };
  if (same(email, SAMPLE_EMAILS.seller)) return { role: "warehouse_admin" };
  return { role: "buyer" };
}

// Close to Django's EmailValidator for the addresses people type.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailErrors(email) {
  const value = String(email || "").trim();
  if (!value) return ["This field may not be blank."];
  if (!EMAIL.test(value)) return ["Enter a valid email address."];
  if (same(value, SAMPLE_EMAILS.taken)) return ["This email is already being used."];
  return [];
}

function passwordErrors(password) {
  if (!password) return ["This field may not be blank."];
  if (password.length < 8) return ["Ensure this field has at least 8 characters."];
  return [];
}

/**
 * POST accounts/register/ (RegisterSerializer). The messages in the order
 * of the serializer's fields — email, phone_number, password — which is
 * the order R2 joins them in.
 */
export function registerErrors({ email, phone, password }) {
  return [...emailErrors(email), ...(String(phone || "").length > 64 ? ["Ensure this field has no more than 64 characters."] : []), ...passwordErrors(password)];
}

/** POST accounts/seller-register/ (SellerRegisterSerializer), field order. */
export function sellerRegisterErrors({ fullName, email, phone, password, businessName, city }) {
  const blank = (value) => (String(value || "").trim() ? [] : ["This field may not be blank."]);
  return [
    ...blank(fullName),
    ...emailErrors(email),
    ...(String(phone || "").length > 64 ? ["Ensure this field has no more than 64 characters."] : []),
    ...passwordErrors(password),
    ...blank(businessName),
    ...blank(city),
  ];
}

/** R2: every message joined with spaces, field names dropped. */
export const joinMessages = (messages) => messages.join(" ");

/**
 * The warehouse code the server gives a new seller: the business name kept
 * to A–Z and 0–9, upper-cased, cut to 12 (SELLER when nothing is left),
 * then six hex digits (uuid4, here derived from the form so the preview
 * repeats itself).
 */
export function warehouseCode(businessName, seed = "") {
  const prefix = (String(businessName || "").replace(/[^A-Za-z0-9]+/g, "").toUpperCase() || "SELLER").slice(0, 12);
  let hash = 2166136261;
  for (const char of `${businessName}|${seed}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return `${prefix}-${hash.toString(16).toUpperCase().padStart(8, "0").slice(0, 6)}`;
}

/**
 * POST accounts/verify-otp/ for the preview: production's codes are six
 * digits that never start with 0, so any such code verifies and anything
 * else is "Invalid OTP."; each code allows five tries (the sixth is refused
 * before the code is checked).
 */
export function verifyCode(code, attemptsSoFar) {
  if (attemptsSoFar >= 5) return { message: "OTP attempt limit exceeded." };
  if (/^[1-9]\d{5}$/.test(code)) return { ok: true };
  return { message: "Invalid OTP." };
}

// ── Plan cards (components/seller/PlanCard.jsx) ─────────────────────────────

export const FEATURE_ORDER = ["ecommerce_enabled", "auctions_enabled", "live_auctions_enabled", "pallet_auctions_enabled", "bulk_import_enabled", "pickup_enabled", "cod_enabled"];
export const QUOTA_ORDER = ["seats_limit", "monthly_auction_limit", "monthly_order_limit", "max_active_listings"];

/** Included features in production's fixed order. */
export const includedFeatures = (features) => (features ? FEATURE_ORDER.filter((key) => features[key]) : []);

/** round(((monthly × 12 − annual) / (monthly × 12)) × 100), never below 0. */
export function annualSavings(pkg) {
  const monthly = Number(pkg.monthly_price);
  const annual = Number(pkg.annual_price);
  if (!Number.isFinite(monthly) || !Number.isFinite(annual) || monthly <= 0) return 0;
  return Math.max(0, Math.round(((monthly * 12 - annual) / (monthly * 12)) * 100));
}

/** A quota's value, ∞ when unlimited (null, undefined or ""). */
export const quotaValue = (value) => (value === null || value === undefined || value === "" ? "∞" : String(value));

/** "Popular": positional — the middle card, and only when there are three or more. */
export const popularIndex = (count) => (count >= 3 ? Math.floor((count - 1) / 2) : -1);

/** The default country: the first marked default, otherwise the first. */
export const defaultCountry = (countries) => (countries.find((country) => country.is_default) || countries[0])?.code || "";
