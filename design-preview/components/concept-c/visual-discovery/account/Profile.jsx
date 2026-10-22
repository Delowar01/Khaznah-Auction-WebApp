"use client";

// Profile (spec B §5): profile details (photo, full name, preferred
// language — email and mobile look editable but production never saves
// them, kept for the owner to decide), password change, push notifications
// on this device, email verification by code, and saved addresses (default,
// edit, delete after a confirmation; the form clears as soon as it is sent,
// as in production). The preview simulates the browser's push permission
// and the code check: any six-digit code verifies.
import { useEffect, useId, useRef, useState } from "react";
import { Check, MapPin, Pencil, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Notice, Tile } from "../kit/Blocks";
import { Checkbox, CodeInput, Field, PasswordInput, Select, TextInput } from "../kit/Form";
import { Dialog } from "../kit/Overlay";
import { btn, cx } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Avatar, Ltr, Section, Status, useAccount, wait } from "./parts";

function Details() {
  const { t } = useLang();
  const acc = useAccount();
  const fileId = useId();
  const [fullName, setFullName] = useState(() => t(acc.profile.full_name) || "");
  const [language, setLanguage] = useState(acc.profile.preferred_language || "en");
  const [uploading, setUploading] = useState(false);
  return (
    <Section title={t(C.profileDetails)} note={t(C.accountIdentity)} id="profile-details">
      <Tile className="flex flex-wrap items-center gap-4 !p-4">
        <Avatar profile={acc.profile} size="lg" />
        <div className="min-w-0 flex-1 basis-48">
          <p className="vd-md font-bold text-[var(--vd-ink)]">{t(C.profilePhoto)}</p>
          <p className="mt-0.5 vd-xs text-[var(--vd-muted)]">{t(C.photoHelp)}</p>
          <label htmlFor={fileId} className={cx(btn("indigo", "md", "mt-3 cursor-pointer"), uploading && "pointer-events-none opacity-60")}>
            {uploading ? t(C.uploading) : t(C.uploadPhoto)}
          </label>
          <input
            id={fileId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setUploading(true);
              await acc.uploadAvatar(file);
              setUploading(false);
            }}
          />
        </div>
      </Tile>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          acc.saveProfile({ full_name: fullName.trim(), preferred_language: language });
        }}
        className="mt-4 grid gap-3"
      >
        <Field label={t(C.fullName)}>{(ids) => <TextInput {...ids} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} />}</Field>
        <Field label={t(C.email)}>{(ids) => <TextInput {...ids} type="email" defaultValue={acc.profile.user_email || t(C.notProvided)} />}</Field>
        <Field label={t(C.mobile)}>{(ids) => <TextInput {...ids} type="tel" defaultValue={acc.profile.phone_number || t(C.notProvided)} />}</Field>
        <Field label={t(C.preferredLanguage)}>
          {(ids) => (
            <Select {...ids} value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="en">{t(C.english)}</option>
              <option value="ar">{t(C.arabic)}</option>
            </Select>
          )}
        </Field>
        <div>
          <button type="submit" className={btn("indigo", "lg")} data-testid="save-profile">
            {t(C.saveProfile)}
          </button>
        </div>
      </form>
    </Section>
  );
}

function Security() {
  const { t } = useLang();
  const [fields, setFields] = useState({ current: "", next: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const set = (key) => (event) => setFields((value) => ({ ...value, [key]: event.target.value }));
  const filled = fields.current && fields.next && fields.confirm;
  const submit = async (event) => {
    event.preventDefault();
    if (!filled || loading) return;
    setLoading(true);
    setMessage(null);
    await wait(600);
    setLoading(false);
    if (fields.next.length < 8) setMessage({ tone: "danger", text: C.passwordShort });
    else if (fields.next !== fields.confirm) setMessage({ tone: "danger", text: C.passwordMismatch });
    else {
      setFields({ current: "", next: "", confirm: "" });
      setMessage({ tone: "success", text: C.passwordChanged });
    }
  };
  return (
    <Section title={t(C.security)} note={t(C.passwordAccess)} id="profile-security">
      <p className="vd-sm text-[var(--vd-muted)]">{t(C.securityIntro)}</p>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <Field label={t(C.currentPassword)}>{(ids) => <PasswordInput {...ids} autoComplete="current-password" value={fields.current} onChange={set("current")} />}</Field>
        <Field label={t(C.newPassword)}>{(ids) => <PasswordInput {...ids} autoComplete="new-password" value={fields.next} onChange={set("next")} />}</Field>
        <Field label={t(C.confirmPassword)}>{(ids) => <PasswordInput {...ids} autoComplete="new-password" value={fields.confirm} onChange={set("confirm")} />}</Field>
        {message ? (
          <Notice tone={message.tone} role={message.tone === "danger" ? "alert" : "status"}>
            {t(message.text)}
          </Notice>
        ) : null}
        <div>
          <button type="submit" disabled={!filled || loading} className={btn("navy", "lg")} data-testid="change-password">
            {loading ? t(C.changingPassword) : t(C.changePassword)}
          </button>
        </div>
      </form>
    </Section>
  );
}

function Push() {
  const { t } = useLang();
  const [status, setStatus] = useState("checking");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const id = window.setTimeout(() => setStatus("not-subscribed"), 300);
    return () => window.clearTimeout(id);
  }, []);
  const toggle = async () => {
    setBusy(true);
    await wait(700);
    setBusy(false);
    const on = status !== "subscribed";
    setStatus(on ? "subscribed" : "not-subscribed");
    setMessage(on ? C.pushEnabled : C.pushDisabled);
  };
  return (
    <Section title={t(C.pushTitle)} note={t(C.thisDevice)} id="profile-push">
      <p className="vd-sm text-[var(--vd-muted)]">{t(C.pushIntro)}</p>
      <div className="mt-4">
        <button
          type="button"
          onClick={toggle}
          disabled={busy || status === "checking"}
          className={btn(status === "subscribed" ? "outline" : "navy", "lg")}
          data-testid="push-toggle"
        >
          {busy ? t(C.working) : status === "subscribed" ? t(C.pushDisable) : t(C.pushEnable)}
        </button>
      </div>
      {message ? (
        <p role="status" className="mt-3 rounded-[14px] bg-[#f6f8fc] px-3.5 py-2.5 vd-sm text-[var(--vd-ink)]">
          {t(message)}
        </p>
      ) : null}
    </Section>
  );
}

function EmailVerification() {
  const { t } = useLang();
  const acc = useAccount();
  const [flow, setFlow] = useState({ active: false, loading: false, code: "", message: null });
  const email = acc.profile.user_email;
  const send = async () => {
    setFlow({ active: true, loading: true, code: "", message: null });
    await wait(700);
    setFlow((value) => ({ ...value, loading: false, message: { tone: "success", text: C.codeSent } }));
  };
  const verify = async (event) => {
    event.preventDefault();
    if (flow.code.length < 4 || flow.loading) return;
    setFlow((value) => ({ ...value, loading: true, message: null }));
    await wait(700);
    if (/^\d{6}$/.test(flow.code)) {
      // Production hides the panel on success, so its message is never seen (spec B §5.6).
      setFlow({ active: false, loading: false, code: "", message: null });
      acc.setProfile((value) => ({ ...value, is_email_verified: true }));
      return;
    }
    setFlow((value) => ({ ...value, loading: false, message: { tone: "danger", text: C.invalidOtp } }));
  };
  return (
    <Section title={t(C.emailVerification)} note={t(C.accountSecurity)} id="profile-email">
      <Tile className="flex flex-wrap items-center justify-between gap-3 !p-4">
        <div className="min-w-0">
          <p className="vd-xs font-semibold text-[var(--vd-muted)]">{t(C.email)}</p>
          <p className="truncate vd-md font-bold text-[var(--vd-ink)]">{email ? <Ltr>{email}</Ltr> : t(C.notProvided)}</p>
        </div>
        {acc.profile.is_email_verified ? (
          <Status status={{ label: C.verified, tone: "success" }} />
        ) : (
          <button type="button" onClick={send} disabled={!email || flow.loading} className={btn("outline", "md")} data-testid="verify-email">
            {/* One shared flag: it also reads "Sending…" while a code is checked, as in production. */}
            {flow.loading ? t(C.sending) : t(C.verifyEmail)}
          </button>
        )}
      </Tile>
      {flow.active && !acc.profile.is_email_verified ? (
        <form onSubmit={verify} className="mt-3 grid gap-2 rounded-[18px] border border-[var(--vd-line)] p-4" data-testid="otp-panel">
          <div className="flex flex-wrap items-end gap-2">
            <Field label={t(C.verificationCode)} labelHidden className="min-w-0 flex-1 basis-40">
              {(ids) => <CodeInput {...ids} className="!h-12 !text-[18px]" value={flow.code} onChange={(event) => setFlow((value) => ({ ...value, code: event.target.value.replace(/\s/g, "") }))} placeholder={t(C.verificationCode)} />}
            </Field>
            <button type="submit" disabled={flow.code.length < 4 || flow.loading} className={btn("indigo", "lg")} data-testid="verify-code">
              {t(C.verify)}
            </button>
          </div>
          {flow.message ? (
            <p role={flow.message.tone === "danger" ? "alert" : "status"} className={cx("vd-sm font-semibold", flow.message.tone === "danger" ? "text-[#b3261e]" : "text-[var(--vd-grade-a)]")}>
              {t(flow.message.text)}
            </p>
          ) : null}
        </form>
      ) : null}
    </Section>
  );
}

const EMPTY = { label: "", recipient_name: "", recipient_phone: "", city: "", region: "", district: "", address_line: "", postal_code: "", is_default: false };

function Addresses() {
  const { t } = useLang();
  const acc = useAccount();
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const first = useRef(null);
  const set = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const reset = () => {
    setForm(EMPTY);
    setEditing(null);
  };
  const summary = (address) => [address.recipient_name, address.address_line || address.label, address.district, address.city, address.region, address.postal_code].map((part) => t(part)).filter(Boolean).join(", ");
  const fields = [
    { key: "label", label: C.aLabel },
    { key: "recipient_name", label: C.aRecipient, autoComplete: "name" },
    { key: "recipient_phone", label: C.aPhone, type: "tel", autoComplete: "tel" },
    { key: "city", label: C.aCity, autoComplete: "address-level2" },
    { key: "region", label: C.aRegion, autoComplete: "address-level1" },
    { key: "district", label: C.aDistrict, autoComplete: "address-level3" },
    { key: "address_line", label: C.aAddress, autoComplete: "street-address", span: true },
    { key: "postal_code", label: C.aPostal, autoComplete: "postal-code", ltr: true },
  ];
  return (
    <Section title={t(C.savedAddresses)} note={t(C.manageAddresses)} id="profile-addresses" className="dt:col-span-2">
      <div className="rounded-[20px] border border-[var(--vd-line)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 vd-md font-bold text-[var(--vd-ink)]">
            <MapPin aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
            {t(C.deliveryAddress)}
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              first.current?.focus();
            }}
            className={btn("soft", "sm", "h-10")}
          >
            <Plus aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {t(C.add)}
          </button>
        </div>
        {acc.addresses.length ? (
          <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
            {acc.addresses.map((address) => (
              <li key={address.id} className={cx("flex items-start gap-3 rounded-[18px] border p-3.5", address.is_default ? "border-[var(--vd-indigo)] bg-[#f6f8fc]" : "border-[var(--vd-line)]")} data-testid="address-card">
                <span aria-hidden="true" className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", address.is_default ? "bg-[var(--vd-indigo)] text-white" : "border border-[#9fb0cf]")}>
                  {address.is_default ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="vd-md font-bold text-[var(--vd-ink)]">
                    {t(address.label) || t(C.savedAddress)}
                    {address.is_default ? <span className="font-semibold text-[var(--vd-indigo)]"> {t(C.defaultMarker)}</span> : null}
                  </p>
                  <p className="mt-0.5 vd-xs text-[var(--vd-muted)]">{summary(address) || t(C.addressUnavailable)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      aria-label={t(C.editAddress)}
                      onClick={() => {
                        setEditing(address.id);
                        setForm(Object.fromEntries(Object.keys(EMPTY).map((key) => [key, key === "is_default" ? Boolean(address.is_default) : t(address[key]) || ""])));
                        first.current?.focus();
                      }}
                      className="grid size-9 place-items-center rounded-full text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)]"
                    >
                      <Pencil aria-hidden="true" className="size-4" strokeWidth={2.2} />
                    </button>
                    {address.is_default ? null : (
                      <button type="button" onClick={() => acc.updateAddress(address.id, { is_default: true })} className="h-9 rounded-full px-3 vd-sm font-semibold text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)]">
                        {t(C.setDefault)}
                      </button>
                    )}
                    <button type="button" onClick={() => setConfirm(address)} className="h-9 rounded-full px-3 vd-sm font-semibold text-[#a61b18] hover:bg-[#fdf1f0]" data-testid="delete-address">
                      {t(C.deleteAddress)}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-[16px] bg-[#f6f8fc] p-4 vd-md text-[var(--vd-muted)]">{t(C.addAddressToContinue)}</p>
        )}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (editing) acc.updateAddress(editing, form);
          else acc.createAddress(form);
          // Production clears the form at once, before the answer (spec B §5.6).
          reset();
        }}
        className="mt-4 grid gap-3"
        data-testid="address-form"
      >
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          {fields.map((field, i) => (
            <Field key={field.key} label={t(field.label)} className={field.span ? "sm:col-span-2" : undefined}>
              {(ids) => <TextInput {...ids} ref={i === 0 ? first : undefined} type={field.type || "text"} ltr={field.ltr} autoComplete={field.autoComplete} value={form[field.key]} onChange={set(field.key)} />}
            </Field>
          ))}
        </div>
        <Checkbox checked={form.is_default} onChange={(event) => setForm((value) => ({ ...value, is_default: event.target.checked }))}>
          {t(C.makeDefaultAddress)}
        </Checkbox>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={btn("indigo", "lg")} data-testid="submit-address">
            {editing ? t(C.saveAddress) : t(C.addAddress)}
          </button>
          {editing ? (
            <button type="button" onClick={reset} className={btn("outline", "lg")}>
              {t(C.cancelEdit)}
            </button>
          ) : null}
        </div>
      </form>
      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        size="sm"
        title={t(C.deleteConfirm)}
        description={confirm ? summary(confirm) : null}
        testId="delete-address-dialog"
        footer={
          <>
            <button type="button" onClick={() => setConfirm(null)} className={btn("outline", "lg")} data-autofocus>
              {t(C.keepAddress)}
            </button>
            <button
              type="button"
              onClick={() => {
                acc.deleteAddress(confirm.id);
                setConfirm(null);
              }}
              className={btn("danger", "lg")}
              data-testid="confirm-delete-address"
            >
              {t(C.deleteAddress)}
            </button>
          </>
        }
      />
    </Section>
  );
}

export function Profile() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 dt:grid-cols-2 dt:items-start">
      <Details />
      <Security />
      <Push />
      <EmailVerification />
      <Addresses />
    </div>
  );
}
