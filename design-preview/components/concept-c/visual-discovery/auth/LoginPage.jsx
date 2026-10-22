"use client";

// Option 3 — Customer login (production /login). The quiet brand shell: the
// form card beside the furniture photograph, which carries production's
// introduction (pill, headline, four tiles, protected-details box) from
// 1024 px. Production's rules: buyer accounts only (buyer, trade_buyer —
// any other role is signed out again with the portal message), empty fields
// never reach the server, ?next= is cleaned (same-site paths only, else
// home) and followed with replace, ?registered shows the success banner
// (even beside an error), ?expired=1 the session banner (hidden while an
// error shows). Server messages are English, as production's are.
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Gavel, LayoutDashboard, ShieldCheck, ShoppingBag, Store, UserPlus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { LOGIN_COPY as C, PORTAL_COPY as P } from "@/components/shared/commerce/authCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { SAMPLE_EMAILS } from "@/data/authSamples";
import { isBuyerRole, previewPath, sanitizeNextPath, signIn } from "@/lib/auth";
import { AuthCard, AuthShell } from "../kit/AuthShell";
import { Spinner } from "../kit/Blocks";
import { Field, PasswordInput, TextInput } from "../kit/Form";
import { useSession } from "../kit/session";
import { btn } from "../ui";
import { AuthHeading, Banner, Divider, IntroAside, PortalSwitch, SubmitButton, TrustNote, request } from "./AuthParts";

const TILE_ICONS = [ShieldCheck, Gavel, CircleCheck, ShoppingBag];

/** Production's login portal switch: Buyer here, the seller and staff portals elsewhere. */
export function LoginPortals() {
  const { t } = useLang();
  return (
    <PortalSwitch
      label={t(P.loginNav)}
      items={[
        { key: "buyer", label: t(P.buyer), icon: ShoppingBag, current: true },
        { key: "seller", label: t(P.seller), icon: Store, outside: "/warehouse/login" },
        { key: "admin", label: t(P.admin), icon: LayoutDashboard, outside: "/dashboard/login" },
      ]}
    />
  );
}

// The preview states that open with a sign-in already answered.
const PRESET = {
  error: { email: SAMPLE_EMAILS.unknown, password: "khaznah-demo", error: "No active account found with the given credentials" },
  "not-buyer": { email: SAMPLE_EMAILS.seller, password: "khaznah-demo", error: C.errNotBuyer },
};

function LoginForm({ params, state }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { setSignedIn } = useSession();
  const preset = PRESET[state] || {};
  const [email, setEmail] = useState(preset.email || "");
  const [password, setPassword] = useState(preset.password || "");
  const [error, setError] = useState(preset.error || null);
  const [missing, setMissing] = useState(null);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const registered = Boolean(params.get("registered")) || state === "registered";
  const expired = params.get("expired") === "1" || state === "expired";
  const next = params.get("next");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError(null);
    setMissing(null);
    const result = signIn(email, password);
    if (result.empty) {
      // No request: production's "Invalid credentials." The empty field is marked and focused.
      const field = !email ? "email" : "password";
      setMissing(field);
      setError(C.errEmpty);
      (field === "email" ? emailRef : passwordRef).current?.focus();
      return;
    }
    setBusy(true);
    await request();
    if (result.message) {
      setBusy(false);
      setError(result.message);
      return;
    }
    if (!isBuyerRole(result.role)) {
      // Production signs the new session out again at once.
      setSignedIn(false);
      setBusy(false);
      setError(C.errNotBuyer);
      return;
    }
    setSignedIn(true);
    // The button keeps "Signing in..." until the next page opens.
    router.replace(previewPath(sanitizeNextPath(next, "/"), link));
  };

  return (
    <>
      <AuthCard>
        <LoginPortals />
        <AuthHeading className="mt-7" eyebrow={t(C.eyebrow)} icon={ShoppingBag} title={t(C.title)} subtitle={t(C.subtitle)} />

        <div className="mt-6 grid gap-3 empty:hidden">
          {registered ? (
            <Banner tone="success" role="status" aria-live="polite" data-testid="login-registered">
              {t(C.registered)}
            </Banner>
          ) : null}
          {expired && !error ? (
            <Banner tone="warning" role="alert" data-testid="login-expired">
              {t(C.expired)}
            </Banner>
          ) : null}
          {error ? (
            <Banner tone="danger" role="alert" aria-live="assertive" data-testid="login-error">
              {t(error)}
            </Banner>
          ) : null}
        </div>

        <form noValidate onSubmit={onSubmit} className="mt-6 grid gap-5">
          <Field label={t(C.email)}>
            {(field) => (
              <TextInput
                {...field}
                ref={emailRef}
                invalid={missing === "email"}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder={C.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={busy}
              />
            )}
          </Field>
          <Field label={t(C.password)}>
            {(field) => (
              <PasswordInput
                {...field}
                ref={passwordRef}
                invalid={missing === "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={busy}
              />
            )}
          </Field>
          <SubmitButton busy={busy} busyLabel={t(C.submitting)} label={t(C.submit)} className="mt-1" data-testid="login-submit" />
        </form>

        <Divider className="mt-8">{t(C.newCustomer)}</Divider>
        <Link href={link("/register")} className={btn("outline", "lg", "mt-4 h-12 w-full")} data-testid="login-register">
          <UserPlus aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
          {t(C.register)}
        </Link>
      </AuthCard>
      <TrustNote title={C.trustTitle} text={C.trustText} />
    </>
  );
}

/** Production's Suspense fallback: the page waits for its query string (static export only). */
function LoginFallback() {
  const { t } = useLang();
  return (
    <AuthCard className="grid min-h-[420px] place-items-center">
      <Spinner label={t(C.loading)} />
    </AuthCard>
  );
}

/** Option 3 — Customer login (production /login). */
export function VisualDiscoveryLogin() {
  return (
    <AuthShell
      aside={
        <IntroAside pill={C.pill} title={C.introTitle} text={C.introText} tiles={C.tiles} icons={TILE_ICONS} trustTitle={C.trustTitle} trustText={C.trustText} />
      }
    >
      <StateRoute fallback={<LoginFallback />}>{(params, state) => <LoginForm key={state} params={params} state={state} />}</StateRoute>
    </AuthShell>
  );
}
