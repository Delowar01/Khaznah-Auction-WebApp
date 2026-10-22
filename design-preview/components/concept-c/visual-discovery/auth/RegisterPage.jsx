"use client";

// Option 3 — Buyer registration (production /register). Two steps in the
// sign-in shell: your details, then the 6-digit email code. Production's
// rules: the two client checks run in order (matching passwords, then
// terms) and everything else is the server's answer, all its messages
// joined with the field names dropped (English, as production's are); the
// code field takes digits only, Verify waits for four, resend waits 60 s
// and says nothing when it works; success goes to sign in
// (/login?registered=1&verified=1) without signing in. "Seller" and "Join
// as Seller" swap the seller registration in place — same address, and the
// buyer's step, details and cooldown are kept for the way back.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, FlaskConical, Gavel, LayoutDashboard, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { LOGIN_COPY as L, PORTAL_COPY as P, REGISTER_COPY as C } from "@/components/shared/commerce/authCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { SAMPLE_OTP, SAMPLE_REGISTER_ERRORS } from "@/data/authSamples";
import { joinMessages, registerErrors, verifyCode } from "@/lib/auth";
import { AuthCard, AuthShell } from "../kit/AuthShell";
import { Spinner } from "../kit/Blocks";
import { Checkbox, CodeInput, Field, PasswordInput, TextInput } from "../kit/Form";
import { btn, cx } from "../ui";
import { AuthHeading, Banner, Divider, Email, IntroAside, PortalSwitch, SubmitButton, TrustNote, request, useCooldown } from "./AuthParts";
import { SellerRegistration } from "./SellerRegister";

const TILE_ICONS = [ShieldCheck, Gavel, CircleCheck, ShoppingBag];
const EMPTY = { fullName: "", email: "", phone: "", password: "", confirmPassword: "" };
const SAMPLE_EMAIL = "faisal@example.com";

/** What each preview state opens with. */
function initialFor(state) {
  const verify = { step: 2, form: { ...EMPTY, fullName: "Faisal Al-Harbi", email: SAMPLE_EMAIL, password: "khaznah-demo", confirmPassword: "khaznah-demo" }, terms: true };
  switch (state) {
    case "errors":
      return { step: 1, form: { ...EMPTY, ...SAMPLE_REGISTER_ERRORS }, terms: true, error: joinMessages(registerErrors(SAMPLE_REGISTER_ERRORS)) };
    case "verify":
      return { ...verify, cooldown: 60 };
    case "verify-error":
      // A wrong code, a minute later: resend is available again.
      return { ...verify, otp: "000000", otpError: "Invalid OTP.", attempts: 1, cooldown: 0 };
    case "verify-test":
      // A backend that returns debug_otp (test mode); production's backend never does.
      return { ...verify, otp: SAMPLE_OTP, debugOtp: SAMPLE_OTP, cooldown: 60 };
    default:
      return { step: 1, form: EMPTY, terms: false };
  }
}

/** Two short bars and the step's name (presentation only; production has no step label). */
function Steps({ step }) {
  const { t } = useLang();
  return (
    <div className="mt-6">
      <div aria-hidden="true" className="flex gap-1.5">
        {[1, 2].map((n) => (
          <span key={n} className={cx("h-1.5 flex-1 rounded-full", n <= step ? "bg-[var(--vd-indigo)]" : "bg-[var(--vd-bluegray)]")} />
        ))}
      </div>
      <p className="mt-2 vd-sm font-semibold text-[var(--vd-muted)]" data-testid="register-step">
        {t(step === 1 ? C.stepDetails : C.stepVerify)}
      </p>
    </div>
  );
}

function RegisterFlow({ state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const [initial] = useState(() => initialFor(state));
  const [accountType, setAccountType] = useState(state === "seller" ? "seller" : "buyer");
  const [swapped, setSwapped] = useState(false);
  const [step, setStep] = useState(initial.step);
  const [form, setForm] = useState(initial.form);
  const [terms, setTerms] = useState(initial.terms);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initial.error || null);
  const [otp, setOtp] = useState(initial.otp || "");
  const [otpError, setOtpError] = useState(initial.otpError || null);
  const [attempts, setAttempts] = useState(initial.attempts || 0);
  const [debugOtp] = useState(initial.debugOtp || null);
  const [cooldown, setCooldown] = useCooldown(initial.cooldown || 0);
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const codeRef = useRef(null);
  const focusCode = useRef(false);

  // Back from the seller form: the buyer heading takes focus again.
  useEffect(() => {
    if (swapped && accountType === "buyer") headingRef.current?.focus();
  }, [swapped, accountType]);

  // Step 2 opens with the code field focused.
  useEffect(() => {
    if (step === 2 && focusCode.current) {
      focusCode.current = false;
      codeRef.current?.focus();
    }
  }, [step]);

  if (accountType === "seller") {
    return (
      <SellerRegistration
        embedded
        focusOnMount={swapped}
        onSelectBuyer={() => {
          setSwapped(true);
          setAccountType("buyer");
        }}
      />
    );
  }

  const toSeller = () => {
    setSwapped(true);
    setAccountType("seller");
  };

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    // Production clears the banner as soon as a field changes.
    setError(null);
  };

  const onRegister = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (form.password !== form.confirmPassword) {
      setError(C.errMismatch);
      formRef.current?.elements.confirmPassword?.focus();
      return;
    }
    if (!terms) {
      setError(C.errTerms);
      formRef.current?.elements.terms?.focus();
      return;
    }
    setError(null);
    setBusy(true);
    await request(800);
    const messages = registerErrors(form);
    setBusy(false);
    if (messages.length) {
      setError(joinMessages(messages) || C.errFallback);
      return;
    }
    // The account exists and the code is on its way: step 2, resend in 60 s.
    focusCode.current = true;
    setStep(2);
    setCooldown(60);
  };

  const onVerify = async (event) => {
    event.preventDefault();
    if (busy || otp.length < 4) return;
    setOtpError(null);
    setBusy(true);
    await request();
    const result = verifyCode(otp, attempts);
    if (result.ok) {
      // isLoading resets while the page changes, as in production.
      setBusy(false);
      router.push(link("/login?registered=1&verified=1"));
      return;
    }
    setBusy(false);
    setAttempts((n) => n + 1);
    setOtpError(result.message || C.errVerify);
  };

  const onResend = () => {
    if (cooldown > 0) return;
    // A new code: the cooldown starts again and the new code has five tries. No message, as in production.
    setOtpError(null);
    setAttempts(0);
    setCooldown(60);
  };

  return (
    <AuthShell aside={<IntroAside pill={L.pill} title={C.introTitle} text={C.introText} tiles={C.tiles} icons={TILE_ICONS} trustTitle={L.trustTitle} trustText={C.trustText} />}>
      <AuthCard>
        <PortalSwitch
          label={t(P.registerNav)}
          items={[
            { key: "buyer", label: t(P.buyer), icon: ShoppingBag, current: true },
            { key: "seller", label: t(P.seller), icon: Store, onClick: toSeller },
            { key: "admin", label: t(P.admin), icon: LayoutDashboard, outside: "/dashboard/login" },
          ]}
        />
        <AuthHeading className="mt-7" eyebrow={t(C.eyebrow)} icon={ShoppingBag} title={t(C.title)} subtitle={t(C.subtitle)} id="register-title" headingRef={headingRef} />
        <Steps step={step} />

        {error ? (
          <Banner tone="danger" role="alert" aria-live="assertive" className="mt-5" data-testid="register-error">
            {t(error)}
          </Banner>
        ) : null}

        {step === 1 ? (
          <form ref={formRef} noValidate onSubmit={onRegister} aria-labelledby="register-title" className="mt-6 grid gap-5" data-testid="register-details">
            <Field label={t(C.fullName)}>
              {(ids) => <TextInput {...ids} name="fullName" autoComplete="name" required placeholder={t(C.fullNamePlaceholder)} value={form.fullName} onChange={change} disabled={busy} />}
            </Field>
            <Field label={t(L.email)}>
              {(ids) => <TextInput {...ids} name="email" type="email" inputMode="email" autoComplete="email" required placeholder={L.emailPlaceholder} value={form.email} onChange={change} disabled={busy} />}
            </Field>
            <Field label={t(C.phone)} optional>
              {(ids) => <TextInput {...ids} name="phone" type="tel" autoComplete="tel" placeholder={C.phonePlaceholder} value={form.phone} onChange={change} disabled={busy} />}
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t(L.password)}>
                {(ids) => <PasswordInput {...ids} name="password" autoComplete="new-password" required value={form.password} onChange={change} disabled={busy} shown={shown} onShownChange={setShown} />}
              </Field>
              <Field label={t(C.confirmPassword)}>
                {(ids) => <PasswordInput {...ids} name="confirmPassword" autoComplete="new-password" required value={form.confirmPassword} onChange={change} disabled={busy} shown={shown} toggle={false} invalid={error === C.errMismatch} />}
              </Field>
            </div>
            <Checkbox name="terms" checked={terms} invalid={error === C.errTerms} onChange={(event) => setTerms(event.target.checked)}>
              {t(C.termsLead)}{" "}
              <Link href={link("/terms")} target="_blank" rel="noopener noreferrer" className="vd-link font-bold text-[var(--vd-indigo)] underline">
                {t(C.terms)}
                <span className="sr-only"> {t(P.newTab)}</span>
              </Link>{" "}
              {t(C.and)}{" "}
              <Link href={link("/privacy")} target="_blank" rel="noopener noreferrer" className="vd-link font-bold text-[var(--vd-indigo)] underline">
                {t(C.privacy)}
                <span className="sr-only"> {t(P.newTab)}</span>
              </Link>
              .
            </Checkbox>
            <SubmitButton busy={busy} busyLabel={t(C.creating)} label={t(C.submit)} data-testid="register-submit" />
          </form>
        ) : (
          <form noValidate onSubmit={onVerify} aria-labelledby="register-title" className="mt-6 grid gap-5" data-testid="register-verify">
            <p className="vd-lg text-[var(--vd-ink)]">
              {t(C.sentTo)} <Email>{form.email}</Email>.
            </p>
            {debugOtp ? (
              <p className="flex items-center gap-2.5 rounded-[16px] bg-[#fdf4e2] px-4 py-3 vd-md font-semibold text-[#5c3a06]" data-testid="register-test-code">
                <FlaskConical aria-hidden="true" className="size-5 shrink-0 text-[#7a4e0c]" strokeWidth={2} />
                <span>
                  {t(C.testMode)}{" "}
                  <span dir="ltr" className="font-extrabold tracking-[0.12em] tabular">
                    {debugOtp}
                  </span>
                </span>
              </p>
            ) : null}
            {otpError ? (
              <Banner tone="danger" role="alert" aria-live="assertive" data-testid="register-otp-error">
                {t(otpError)}
              </Banner>
            ) : null}
            <Field label={t(C.code)}>
              {(ids) => (
                <CodeInput
                  {...ids}
                  ref={codeRef}
                  invalid={Boolean(otpError)}
                  required
                  placeholder={C.codePlaceholder}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={busy}
                />
              )}
            </Field>
            <SubmitButton busy={busy} busyLabel={t(C.verifying)} label={t(C.verify)} disabled={otp.length < 4 && !busy} data-testid="register-verify-submit" />
            <p className="text-center">
              <button
                type="button"
                onClick={onResend}
                disabled={cooldown > 0}
                className="inline-flex h-10 items-center rounded-full px-3 vd-md font-semibold text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)] disabled:cursor-not-allowed disabled:text-[var(--vd-muted)] disabled:hover:bg-transparent"
                data-testid="register-resend"
              >
                {cooldown > 0 ? `${t(C.resendIn)} ${cooldown}s` : t(C.resend)}
              </button>
            </p>
          </form>
        )}

        <Divider className="mt-8">{t(C.haveAccount)}</Divider>
        <div className="mt-4 grid gap-3">
          <Link href={link("/login")} className={btn("outline", "lg", "h-12 w-full")} data-testid="register-login">
            <ArrowRight aria-hidden="true" className="flip-rtl size-[18px]" strokeWidth={2.1} />
            {t(C.login)}
          </Link>
          <button type="button" onClick={toSeller} className={btn("soft", "lg", "h-12 w-full")} data-testid="register-join-seller">
            <Store aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
            {t(C.joinSeller)}
          </button>
        </div>
      </AuthCard>
      <TrustNote title={L.trustTitle} text={C.trustText} />
    </AuthShell>
  );
}

function RegisterFallback() {
  const { t } = useLang();
  return (
    <AuthShell aside={<IntroAside pill={L.pill} title={C.introTitle} text={C.introText} tiles={C.tiles} icons={TILE_ICONS} trustTitle={L.trustTitle} trustText={C.trustText} />}>
      <AuthCard className="grid min-h-[420px] place-items-center">
        <Spinner label={t(C.title)} />
      </AuthCard>
    </AuthShell>
  );
}

/** Option 3 — Buyer registration (production /register). */
export function VisualDiscoveryRegister() {
  return <StateRoute fallback={<RegisterFallback />}>{(params, state) => <RegisterFlow key={state} state={state} />}</StateRoute>;
}
