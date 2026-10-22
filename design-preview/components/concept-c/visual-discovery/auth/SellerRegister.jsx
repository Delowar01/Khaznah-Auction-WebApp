"use client";

// Option 3 — Seller registration (production /seller/register, also shown
// in place on /register). One screen, as in production: the plan picker on
// a navy panel beside the workspace form — together on desktop; on phones
// the plans become a sideways rail above the form. Production's rules: the
// first package is preselected, Monthly/Annual changes every price and the
// cycle sent, "-20%" is a fixed badge and "Popular" marks the middle card
// (both quirks kept); submit stays off without a plan; the checks run in
// production's order (fields, then plan, matching passwords, terms); the
// Country select shows when countries load; success signs the new owner in
// (warehouse_admin), shows the warehouse code, offers the optional email
// code and hands off to the seller dashboard — a production screen outside
// this preview.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, CircleCheck, LayoutDashboard, LoaderCircle, Sparkles, Store, Users, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { PLAN_COPY as PC, PORTAL_COPY as P, SELLER_REGISTER_COPY as C } from "@/components/shared/commerce/authCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { Money } from "@/components/shared/ui/Money";
import { SAMPLE_SELLER_ERRORS } from "@/data/authSamples";
import { SELLER_COUNTRIES, SELLER_PACKAGES } from "@/data/sellerPlans";
import { annualSavings, defaultCountry, includedFeatures, joinMessages, popularIndex, QUOTA_ORDER, quotaValue, sellerRegisterErrors, verifyCode, warehouseCode } from "@/lib/auth";
import { AuthCard, AuthShell } from "../kit/AuthShell";
import { Spinner } from "../kit/Blocks";
import { Checkbox, CodeInput, Field, PasswordInput, Select, TextInput } from "../kit/Form";
import { btn, cx } from "../ui";
import { AuthHeading, Banner, Email, OutsideLink, PortalSwitch, SubmitButton, request, useCooldown } from "./AuthParts";

const EMPTY_FORM = { fullName: "", email: "", phone: "", country: defaultCountry(SELLER_COUNTRIES), city: "", businessName: "", password: "", confirmPassword: "" };
const FIELD_ORDER = ["fullName", "email", "city", "businessName", "password", "confirmPassword"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The success preview state: a seller who has just registered.
const SAMPLE_SUCCESS = { businessName: "Al Noor Trading", email: "noura@example.com" };

/**
 * The browser's own checks in production (required fields, the email's
 * shape, eight-character passwords), shown beside the fields here.
 */
function fieldErrors(form) {
  const errors = {};
  for (const key of ["fullName", "city", "businessName"]) if (!form[key].trim()) errors[key] = C.fieldRequired;
  if (!form.email.trim()) errors.email = C.fieldRequired;
  else if (!EMAIL.test(form.email.trim())) errors.email = C.fieldEmail;
  for (const key of ["password", "confirmPassword"]) {
    if (!form[key]) errors[key] = C.fieldRequired;
    else if (form[key].length < 8) errors[key] = C.fieldShort;
  }
  return errors;
}

/** Monthly · Annual (-20%) — production's two pressed-state buttons. */
function BillingToggle({ annual, onChange }) {
  const { t } = useLang();
  const item = (active) => cx("inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 vd-md font-semibold transition-colors", active ? "bg-white text-[var(--vd-ink)] shadow-[0_1px_3px_rgb(0_0_0/0.25)]" : "text-white hover:bg-white/10");
  return (
    <div role="group" aria-label={t(C.cycle)} className="mt-5 flex w-full max-w-sm gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15">
      <button type="button" aria-pressed={!annual} onClick={() => onChange(false)} className={item(!annual)} data-testid="cycle-monthly">
        {t(C.monthly)}
      </button>
      <button type="button" aria-pressed={annual} onClick={() => onChange(true)} className={item(annual)} data-testid="cycle-annual">
        {t(C.annual)}
        <span className="inline-flex h-5 items-center rounded-full bg-[var(--vd-gold)] px-2 vd-xs font-extrabold text-[var(--vd-ink)]" dir="ltr">
          {t(C.annualBadge)}
        </span>
      </button>
    </div>
  );
}

/** components/seller/PlanCard.jsx: one pressed-state button per package. */
function PlanCard({ pkg, annual, selected, popular, onSelect }) {
  const { t } = useLang();
  const included = includedFeatures(pkg.features);
  const savings = annual ? annualSavings(pkg) : 0;
  const chip = "inline-flex h-6 items-center rounded-full px-2.5 vd-xs font-bold";
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(pkg.id)}
      className={cx(
        "relative flex w-[78vw] max-w-[19rem] shrink-0 snap-start flex-col rounded-[20px] bg-white p-4 text-start text-[var(--vd-ink)] transition-shadow sm:max-w-[20rem] lg:w-full lg:max-w-none dt:p-5",
        selected ? "shadow-[0_0_0_3px_var(--vd-gold)]" : "shadow-[0_0_0_1px_rgb(255_255_255/0.15)] hover:shadow-[0_0_0_2px_rgb(225_169_50/0.6)]",
      )}
      data-testid="plan-card"
      data-plan={pkg.slug}
    >
      <span className="flex items-start gap-3">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="vd-h3">{pkg.name}</span>
            {popular ? (
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[var(--vd-gold)] px-2.5 vd-xs font-extrabold text-[var(--vd-ink)]">
                <Sparkles aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
                {t(PC.popular)}
              </span>
            ) : null}
          </span>
          <span className="mt-1.5 flex items-baseline gap-1">
            <Money value={Number(annual ? pkg.annual_price : pkg.monthly_price)} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.75em]" />
            <span className="vd-sm text-[var(--vd-muted)]">/{t(annual ? PC.perYear : PC.perMonth)}</span>
          </span>
        </span>
        <span aria-hidden="true" className={cx("grid size-7 shrink-0 place-items-center rounded-full border-2", selected ? "border-[var(--vd-gold)] bg-[var(--vd-gold)] text-[var(--vd-ink)]" : "border-[#c7d3e6] text-transparent")}>
          <Check className="size-4" strokeWidth={3} />
        </span>
      </span>
      {pkg.trial_days > 0 || savings > 0 ? (
        <span className="mt-3 flex flex-wrap gap-1.5">
          {pkg.trial_days > 0 ? <span className={cx(chip, "bg-[#e3ecfb] text-[var(--vd-indigo)]")}>{t(PC.trial, { n: pkg.trial_days })}</span> : null}
          {savings > 0 ? <span className={cx(chip, "bg-[#ddf4e6] text-[var(--vd-grade-a)]")}>{t(PC.save, { n: savings })}</span> : null}
        </span>
      ) : null}
      <span className="mt-3 flex flex-wrap gap-1.5">
        {included.length ? (
          <>
            {included.slice(0, 4).map((key) => (
              <span key={key} className={cx(chip, "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]")}>
                {t(PC.features[key])}
              </span>
            ))}
            {included.length > 4 ? (
              <span className={cx(chip, "bg-[var(--vd-bluegray)] text-[var(--vd-ink)]")} dir="ltr">
                {PC.more.replace("{n}", included.length - 4)}
              </span>
            ) : null}
          </>
        ) : (
          <span className="vd-sm text-[var(--vd-muted)]">{t(PC.core)}</span>
        )}
      </span>
      <span className="mt-4 grid grid-cols-2 gap-1 rounded-[14px] bg-[#f6f8fc] p-1.5 lg:grid-cols-4">
        {QUOTA_ORDER.map((key) => {
          const value = quotaValue(pkg.features?.[key]);
          return (
            <span key={key} className="min-w-0 rounded-[10px] px-1 py-1.5 text-center">
              <span className="block vd-md font-extrabold tabular">
                {value === "∞" ? (
                  <>
                    <span aria-hidden="true" className="text-[19px] leading-5">∞</span>
                    <span className="sr-only">{t(PC.unlimited)}</span>
                  </>
                ) : (
                  value
                )}
              </span>
              <span className="block truncate vd-2xs font-semibold text-[var(--vd-muted)]">{t(PC.quotas[key])}</span>
            </span>
          );
        })}
      </span>
    </button>
  );
}

/** The navy plans panel: heading, cycle, and the cards (a sideways rail on phones). */
function PlansPanel({ status, annual, onAnnual, selectedId, onSelect, headingRef }) {
  const { t } = useLang();
  const popular = popularIndex(SELLER_PACKAGES.length);
  return (
    <section aria-labelledby="plans-title" className="relative overflow-hidden rounded-[28px] bg-[var(--vd-navy)] px-5 py-6 text-white sm:px-6 dt:px-8 dt:py-8">
      <span aria-hidden="true" className="absolute -end-20 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(225_169_50/0.25),transparent)]" />
      <div className="relative">
        <h1 id="plans-title" ref={headingRef} tabIndex={-1} className="vd-title-page text-white outline-none">
          {t(C.plansTitle)}
        </h1>
        <p className="mt-2 vd-lg text-white/80">{t(C.plansSubtitle)}</p>
        <BillingToggle annual={annual} onChange={onAnnual} />
        <div className="mt-5">
          {status === "loading" ? (
            <div aria-busy="true">
              <Spinner label={t(C.plansLoading)} showLabel className="!text-white/85 [&_svg]:!text-[var(--vd-gold)]" />
              <div className="mt-4 grid gap-3">
                {[0, 1].map((i) => (
                  <span key={i} aria-hidden="true" className="block h-40 animate-pulse rounded-[20px] bg-white/10 motion-reduce:animate-none" />
                ))}
              </div>
            </div>
          ) : status === "empty" ? (
            <p className="rounded-[20px] bg-white/10 px-5 py-6 text-center vd-md font-semibold text-white" data-testid="plans-empty">
              {t(C.plansEmpty)}
            </p>
          ) : (
            <ul aria-label={t(C.plans)} className="vd-rail -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 pt-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 lg:pb-0">
              {SELLER_PACKAGES.map((pkg, i) => (
                <li key={pkg.id} className="flex lg:block">
                  <PlanCard pkg={pkg} annual={annual} selected={selectedId === pkg.id} popular={i === popular} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** "Selected plan: Business · Monthly", or production's prompt when there is none. */
function PlanSummary({ selected, annual }) {
  const { t } = useLang();
  return (
    <p className="mt-2 vd-md text-[var(--vd-muted)]" data-testid="plan-summary">
      {selected ? (
        <>
          {t(C.selectedPlan)}: <span className="font-bold text-[var(--vd-ink)]">{selected.name}</span> · {t(annual ? C.annual : C.monthly)}
        </>
      ) : (
        t(C.choosePlan)
      )}
    </p>
  );
}

/** After a successful registration: the warehouse code, the optional email code, the hand-off. */
function Success({ code, email, headingRef, initialCooldown }) {
  const { t } = useLang();
  const { toast } = useStore();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useCooldown(initialCooldown);

  const onVerify = async (event) => {
    event.preventDefault();
    if (verifying || otp.length < 4) return;
    setVerifying(true);
    setOtpError(null);
    await request();
    const result = verifyCode(otp, attempts);
    setVerifying(false);
    if (result.ok) {
      setVerified(true);
      return;
    }
    setAttempts((n) => n + 1);
    setOtpError(result.message || C.errVerify);
  };

  return (
    <div className="text-center" data-testid="seller-success">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#ddf4e6] text-[var(--vd-grade-a)]">
        <CircleCheck aria-hidden="true" className="size-8" strokeWidth={2} />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-4 vd-h2 !text-[30px] !leading-9 text-[var(--vd-ink)] outline-none">
        {t(C.successTitle)}
      </h2>
      <p className="mx-auto mt-2 max-w-md vd-lg text-[var(--vd-muted)]">{t(C.successText)}</p>
      {code ? (
        <div className="mx-auto mt-6 w-fit max-w-full rounded-[18px] bg-[#f6f8fc] px-6 py-4 ring-1 ring-[var(--vd-line)]">
          <p className="vd-kicker text-[var(--vd-muted)]">{t(C.warehouseCode)}</p>
          <p className="mt-1 vd-h3 !text-[19px] !leading-7 tracking-[0.04em] text-[var(--vd-indigo)] tabular sm:!text-[22px]" dir="ltr" data-testid="warehouse-code">
            {code}
          </p>
        </div>
      ) : null}

      <div className="mx-auto mt-6 max-w-md text-start">
        {verified ? (
          <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#ddf4e6] px-4 py-2 vd-md font-bold text-[var(--vd-grade-a)]" role="status" data-testid="email-verified">
            <CircleCheck aria-hidden="true" className="size-5" strokeWidth={2.2} />
            {t(C.verified)}
          </p>
        ) : (
          <form noValidate onSubmit={onVerify} className="rounded-[20px] border border-[var(--vd-line)] bg-white p-4 sm:p-5">
            <p className="vd-md text-[var(--vd-ink)]">
              {t(C.sentTo)} <Email>{email}</Email>
            </p>
            {otpError ? (
              <p role="alert" className="mt-3 vd-sm font-semibold text-[#b3261e]" data-testid="seller-otp-error">
                {t(otpError)}
              </p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <Field label={t(C.code)} labelHidden className="min-w-0 flex-1">
                {(field) => (
                  <CodeInput
                    {...field}
                    invalid={Boolean(otpError)}
                    placeholder={C.codePlaceholder}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={verifying}
                    className="!h-12 !text-[20px]"
                  />
                )}
              </Field>
              <button type="submit" disabled={otp.length < 4 && !verifying} aria-disabled={verifying || undefined} aria-label={verifying ? t(C.verifying) : undefined} className={btn("indigo", "lg", "h-12 min-w-24 aria-disabled:cursor-wait")} data-testid="seller-verify">
                {verifying ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin motion-reduce:animate-none" strokeWidth={2.2} /> : t(C.verify)}
              </button>
            </div>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => {
                setCooldown(60);
                setAttempts(0);
                setOtpError(null);
              }}
              className="mt-3 vd-md font-semibold text-[var(--vd-indigo)] hover:underline disabled:cursor-not-allowed disabled:text-[var(--vd-muted)] disabled:no-underline"
              data-testid="seller-resend"
            >
              {cooldown > 0 ? `${t(C.resendIn)} ${cooldown}s` : t(C.resend)}
            </button>
          </form>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast({ tone: "info", title: t(C.dashboard), description: t(C.dashboardOutside) })}
        className={btn("indigo", "lg", "mt-7 h-14 w-full max-w-md vd-lg")}
        data-testid="seller-dashboard"
      >
        <LayoutDashboard aria-hidden="true" className="size-5" strokeWidth={2} />
        {t(C.dashboard)}
      </button>
    </div>
  );
}

/**
 * Seller registration. `state`: the preview state; `embedded`: shown in
 * place on /register, where "Buyer" (a button there) returns to the buyer
 * form without leaving the page.
 */
export function SellerRegistration({ state = "default", embedded = false, onSelectBuyer, focusOnMount = false }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const plansStatus = state === "loading" ? "loading" : state === "no-plans" ? "empty" : "ready";
  const [annual, setAnnual] = useState(false);
  // Production preselects the first package once the list arrives.
  const [selectedId, setSelectedId] = useState(plansStatus === "ready" ? SELLER_PACKAGES[0].id : null);
  const [form, setForm] = useState(state === "errors" ? { ...EMPTY_FORM, ...SAMPLE_SELLER_ERRORS } : EMPTY_FORM);
  const [terms, setTerms] = useState(state === "errors");
  const [errors, setErrors] = useState(state === "errors" ? fieldErrors({ ...EMPTY_FORM, ...SAMPLE_SELLER_ERRORS }) : {});
  const [error, setError] = useState(null);
  const [termsInvalid, setTermsInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(state === "success" ? { code: warehouseCode(SAMPLE_SUCCESS.businessName, SAMPLE_SUCCESS.email), email: SAMPLE_SUCCESS.email } : null);
  const formRef = useRef(null);
  const bannerRef = useRef(null);
  const plansHeading = useRef(null);
  const successHeading = useRef(null);
  // What takes focus once the next render is on screen: the error banner or "You're in!".
  const focusNext = useRef(null);

  useEffect(() => {
    if (focusOnMount) plansHeading.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "banner" && error) bannerRef.current?.focus();
    if (target === "success" && success) successHeading.current?.focus();
  }, [error, success]);

  const selected = SELLER_PACKAGES.find((pkg) => pkg.id === selectedId) || null;
  const set = (key) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const fail = (message) => {
    setError(message);
    // A banner already on screen takes focus now; a new one once it renders.
    if (bannerRef.current) bannerRef.current.focus();
    else focusNext.current = "banner";
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setTermsInvalid(false);
    const found = fieldErrors(form);
    setErrors(found);
    const first = FIELD_ORDER.find((key) => found[key]);
    if (first) {
      formRef.current?.elements[first]?.focus();
      return;
    }
    if (!selected) return fail(C.errNoPlan);
    if (form.password !== form.confirmPassword) return fail(C.errMismatch);
    if (!terms) {
      setTermsInvalid(true);
      return fail(C.errTerms);
    }
    setBusy(true);
    await request(900);
    const messages = sellerRegisterErrors(form);
    setBusy(false);
    if (messages.length) return fail(joinMessages(messages));
    // Signed in as the new warehouse owner; the email code goes out in the background.
    focusNext.current = "success";
    setSuccess({ code: warehouseCode(form.businessName, form.email), email: form.email.trim() });
  };

  const field = (key, label, props = {}, fieldProps = {}) => (
    <Field label={t(label)} error={errors[key] ? t(errors[key]) : null} {...fieldProps} className={cx("content-start", fieldProps.className)}>
      {(ids) => <TextInput {...ids} name={key} value={form[key]} onChange={set(key)} {...props} />}
    </Field>
  );

  return (
    <AuthShell variant="split">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <p className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--vd-navy)] px-4 vd-kicker text-[var(--vd-gold)]">
          <Store aria-hidden="true" className="size-4" strokeWidth={2.2} />
          {t(C.pill)}
        </p>
        <PortalSwitch
          label={t(P.sellerNav)}
          className="w-full sm:w-auto"
          items={[
            embedded ? { key: "buyer", label: t(P.buyer), icon: Users, onClick: onSelectBuyer } : { key: "buyer", label: t(P.buyer), icon: Users, href: "/register" },
            { key: "seller", label: t(P.seller), icon: Warehouse, current: true },
            { key: "admin", label: t(P.admin), icon: LayoutDashboard, outside: "/dashboard/login" },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start dt:gap-8">
        <PlansPanel status={plansStatus} annual={annual} onAnnual={setAnnual} selectedId={selectedId} onSelect={setSelectedId} headingRef={plansHeading} />

        <AuthCard className="!p-5 sm:!p-7 dt:!p-8">
          {success ? (
            <Success code={success.code} email={success.email} headingRef={successHeading} initialCooldown={60} />
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <AuthHeading as="h2" id="seller-form-title" title={t(C.formTitle)} className="min-w-0 [&_h2]:!text-[26px] [&_h2]:!leading-8" />
                <OutsideLink href="/warehouse/login" name={t(C.login)} className={btn("soft", "md", "gap-1.5")}>
                  <Warehouse aria-hidden="true" className="size-4" strokeWidth={2} />
                  {t(C.login)}
                </OutsideLink>
              </div>
              <PlanSummary selected={selected} annual={annual} />

              {error ? (
                <Banner ref={bannerRef} tone="danger" role="alert" aria-live="assertive" className="mt-5" data-testid="seller-error">
                  {t(error)}
                </Banner>
              ) : null}

              <form ref={formRef} noValidate onSubmit={onSubmit} aria-labelledby="seller-form-title" className="mt-6 grid gap-5 sm:grid-cols-2">
                {field("fullName", C.fullName, { autoComplete: "name", required: true })}
                {field("email", C.email, { type: "email", inputMode: "email", autoComplete: "email", required: true })}
                {field("phone", C.phone, { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: C.phonePlaceholder }, { optional: true })}
                {SELLER_COUNTRIES.length ? (
                  <Field label={t(C.country)} className="content-start">
                    {(ids) => (
                      <Select {...ids} name="country" value={form.country} onChange={set("country")} required>
                        {SELLER_COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {lang === "ar" && country.name_ar ? country.name_ar : country.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                ) : null}
                {field("city", C.city, { autoComplete: "address-level2", required: true })}
                {field("businessName", C.businessName, { autoComplete: "organization", required: true }, { className: "sm:col-span-2" })}
                <Field label={t(C.password)} error={errors.password ? t(errors.password) : null} className="content-start">
                  {(ids) => <PasswordInput {...ids} name="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={set("password")} />}
                </Field>
                <Field label={t(C.confirmPassword)} error={errors.confirmPassword ? t(errors.confirmPassword) : null} className="content-start">
                  {(ids) => (
                    <PasswordInput
                      {...ids}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                      labels={{ show: t(C.showConfirm), hide: t(C.hideConfirm) }}
                    />
                  )}
                </Field>
                <Checkbox checked={terms} invalid={termsInvalid} onChange={(event) => setTerms(event.target.checked)} className="sm:col-span-2" name="terms">
                  {t(C.termsLead)}{" "}
                  <Link href={link("/terms")} target="_blank" rel="noopener noreferrer" className="vd-link font-bold text-[var(--vd-indigo)] underline">
                    {t(C.terms)}
                    <span className="sr-only"> {t(P.newTab)}</span>
                  </Link>{" "}
                  {t(C.and)}{" "}
                  <Link href={link("/privacy")} target="_blank" rel="noopener noreferrer" className="vd-link font-bold text-[var(--vd-indigo)] underline">
                    {t(C.policies)}
                    <span className="sr-only"> {t(P.newTab)}</span>
                  </Link>
                  {t(C.termsTail)}
                </Checkbox>
                <div className="sm:col-span-2">
                  <SubmitButton busy={busy} busyLabel={t(C.creating)} label={t(C.submit)} disabled={!selected} data-testid="seller-submit" />
                </div>
              </form>
            </>
          )}
        </AuthCard>
      </div>
    </AuthShell>
  );
}

/** Option 3 — Seller registration (production /seller/register). */
export function VisualDiscoverySellerRegister() {
  return <StateRoute fallback={<SellerRegistration state="loading" />}>{(params, state) => <SellerRegistration key={state} state={state} />}</StateRoute>;
}
