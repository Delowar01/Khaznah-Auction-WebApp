"use client";

// Suspension banner and appeal (spec A §4.5): the reason, what a suspension
// stops, then the latest appeal's status and note — or the appeal form when
// none exists (once any appeal exists, a second one cannot be filed).
// Production can never show this banner (quirk Q33); the "suspended" and
// "appeal" preview states show the design.
import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Field, TextArea } from "../kit/Form";
import { btn } from "../ui";
import { ACCOUNT_COPY as C } from "./copy";
import { Status, useAccount } from "./parts";
import { appealStatus } from "./status";

export function AppealBanner() {
  const { t } = useLang();
  const acc = useAccount();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const latest = acc.appeals[0];
  const submit = async (event) => {
    event.preventDefault();
    const text = reason.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    try {
      await acc.submitAppeal(text);
      setReason("");
    } catch {
      setError(t(C.appealFailed));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section aria-labelledby="suspension-title" className="rounded-[24px] border border-[#f3c9c5] bg-[#fdf6f5] p-5 dt:p-6" data-testid="suspension-banner">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[#a61b18] shadow-[0_2px_8px_rgb(7_27_82/0.1)]">
          <ShieldAlert className="size-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="suspension-title" className="vd-h3 text-[#8f1d18]">
            {t(C.suspended)}
          </h2>
          {acc.suspension?.suspension_reason ? (
            <p className="mt-1 vd-md text-[var(--vd-ink)]">
              <span className="font-bold">{t(C.reason)}</span>
              {t(acc.suspension.suspension_reason)}
            </p>
          ) : null}
          <p className="mt-1 vd-sm text-[var(--vd-ink)]/80">{t(C.suspendedNote)}</p>
          {latest ? (
            <div className="mt-4 rounded-[18px] bg-white p-4" data-testid="appeal-latest">
              <p className="flex flex-wrap items-center gap-2 vd-md font-bold text-[var(--vd-ink)]">
                {t(C.appealStatus)}
                <Status status={appealStatus(latest.status)} />
              </p>
              <p className="mt-2 vd-md text-[var(--vd-ink)]/85">
                <bdi dir="auto">{t(latest.reason)}</bdi>
              </p>
              {latest.resolution_note ? (
                <p className="mt-2 vd-sm text-[var(--vd-muted)]">
                  {t(C.resolutionNote)}
                  {t(latest.resolution_note)}
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 grid gap-3 rounded-[18px] bg-white p-4" data-testid="appeal-form">
              <Field label={t(C.submitAnAppeal)} error={error || null}>
                {(ids) => <TextArea {...ids} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t(C.appealPlaceholder)} />}
              </Field>
              <div>
                <button type="submit" disabled={busy || !reason.trim()} className={btn("danger", "lg")}>
                  {busy ? t(C.submittingDots) : t(C.submitAppeal)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
