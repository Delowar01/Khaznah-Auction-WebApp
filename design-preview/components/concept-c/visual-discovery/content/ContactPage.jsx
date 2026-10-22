"use client";

// Option 3 — Contact (production /contact). Support details come from the
// support-contact API (here a sample response, data/support.js): the email
// and phone replace the fallback lines, the WhatsApp button appears only
// when a number is configured, the address and hours are always fixed.
// The form keeps production's four required fields and rules (required,
// a valid email), sends {name, email, subject, message} as typed and shows
// "Sending..." while it runs; a sent message clears the form, a failed one
// keeps it and shows the server's message, which production's backend
// writes in English (or production's fallback). The preview simulates the
// backend: 5 messages a minute, a 503 when no support inbox is set, the
// server's own required fields. States (?state=): default, unconfigured
// (nothing set), sent, error.
import { useId, useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { CONTENT_COPY as C } from "@/components/shared/commerce/contentCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { PRIORITY_2 } from "@/components/shared/r3/work-media-p2";
import { CONTENT } from "@/data/contentPages";
import { SUPPORT_CONTACT, SUPPORT_LIMIT, THROTTLE_MESSAGE } from "@/data/support";
import { IconDisk, Notice, Panel } from "../kit/Blocks";
import { Field, TextArea, TextInput } from "../kit/Form";
import { btn, cx } from "../ui";
import { ContentHero, ContentPage, SectionIntro, TrustStrip } from "./ContentKit";

const K = CONTENT.contact;
const FIELDS = K.form.fields;
const EMPTY = { name: "", email: "", subject: "", message: "" };
// Preview state "error": a message the visitor had typed when the send failed.
const TYPED = {
  en: { name: "Sara Al-Qahtani", email: "sara@example.com", subject: "Question about an item", message: "Could you tell me more about this item's condition?" },
  ar: { name: "سارة القحطاني", email: "sara@example.com", subject: "سؤال عن منتج", message: "هل يمكن إخباري بالمزيد عن حالة هذا المنتج؟" },
};
// The simulated backend's throttle (5 a minute from one visitor), kept for the tab.
const sends = [];

/** The backend's answer to a send: null (201) or the error text production would show. */
function serverReply(values, configured) {
  if (!configured) return "Support email is not configured. Please contact us on WhatsApp.";
  const now = Date.now();
  while (sends.length && now - sends[0] > 60000) sends.shift();
  if (sends.length >= SUPPORT_LIMIT.perMinute) return THROTTLE_MESSAGE(Math.ceil((60000 - (now - sends[0])) / 1000));
  if (!values.name.trim()) return "Name: Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) return "Email: Enter a valid email address.";
  if (!values.message.trim()) return "Message: Message is required.";
  sends.push(now);
  return null;
}

const whatsappHref = (number, lang) => `https://wa.me/${number}?text=${encodeURIComponent(K.hero.whatsappButton.prefillMessage[lang])}`;

/** The preview's support details are samples: their links say so instead of opening an app. */
function useSampleLink() {
  const { t } = useLang();
  const { toast } = useStore();
  return (target) => (event) => {
    event.preventDefault();
    toast({ tone: "info", title: t(C.sampleTitle), description: t(C.sampleText, { target: t(target) }) });
  };
}

function WhatsAppButton({ number }) {
  const { t, lang } = useLang();
  const sample = useSampleLink();
  return (
    <a
      href={whatsappHref(number, lang)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={sample(C.sampleWhatsApp)}
      className="mt-5 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#25d366] px-6 vd-md font-bold text-[#062b14] transition-colors hover:bg-[#1ebe5a]"
    >
      <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
      {t(K.hero.whatsappButton.label)}
    </a>
  );
}

function InfoCards({ support }) {
  const { t } = useLang();
  const sample = useSampleLink();
  const [email, phone, address, hours] = K.infoCards;
  const valueBase = "mt-1 block break-words vd-lg font-semibold";
  const valueClass = cx(valueBase, "text-[var(--vd-ink)]");
  const linkClass = cx(valueBase, "vd-link w-fit text-[var(--vd-indigo)]");
  const cards = [
    {
      key: "email",
      icon: Mail,
      title: email.title,
      // Production: the API's email, or "Use the form below" pointing at the form.
      value: support.email ? (
        <a href={`mailto:${support.email}`} onClick={sample(C.sampleMail)} dir="ltr" className={linkClass}>
          {support.email}
        </a>
      ) : (
        <a href="#contact-form" className={linkClass}>
          {t(email.fallbackValue)}
        </a>
      ),
    },
    {
      key: "phone",
      icon: Phone,
      title: phone.title,
      // Production: tel: with the API's phone, else WhatsApp, else the form (the line still says WhatsApp).
      value: support.phone ? (
        <a href={`tel:${support.phone.replace(/\s+/g, "")}`} onClick={sample(C.samplePhone)} dir="ltr" className={cx(linkClass, "tabular rtl:text-right")}>
          {support.phone}
        </a>
      ) : (
        <a href={support.whatsapp_number ? `https://wa.me/${support.whatsapp_number}` : "#contact-form"} onClick={support.whatsapp_number ? sample(C.sampleWhatsApp) : undefined} className={linkClass}>
          {t(phone.fallbackValue)}
        </a>
      ),
    },
    { key: "address", icon: MapPin, title: address.title, value: <span className={valueClass}>{t(address.value)}</span> },
    { key: "hours", icon: Clock, title: hours.title, value: <span className={valueClass}>{t(hours.value)}</span> },
  ];
  return (
    <ul className="vd-container mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <li key={card.key} className="flex items-start gap-4 rounded-[24px] border border-[var(--vd-line)] bg-white p-4 sm:block sm:p-5 dt:p-6" data-testid={`contact-${card.key}`}>
          <IconDisk icon={card.icon} />
          <div className="min-w-0 sm:mt-4">
            <h3 className="vd-md font-semibold text-[var(--vd-muted)]">{t(card.title)}</h3>
            {card.value}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ContactForm({ state, support }) {
  const { t, lang } = useLang();
  const [values, setValues] = useState(() => (state === "error" ? TYPED[lang] : EMPTY));
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(() => (state === "sent" ? { ok: true } : state === "error" ? { ok: false, message: THROTTLE_MESSAGE(42) } : null));

  const messages = { name: C.requiredName, email: C.requiredEmail, subject: C.requiredSubject, message: C.requiredMessage };

  const onSubmit = (event) => {
    event.preventDefault();
    if (sending) return;
    // Production's rules (the browser's own): every field required, the email well-formed.
    const form = event.currentTarget;
    const found = {};
    for (const field of FIELDS) {
      if (values[field.name] === "" || (field.name === "email" && !form.elements.email.validity.valid)) found[field.name] = messages[field.name];
    }
    setErrors(found);
    const first = FIELDS.find((field) => found[field.name]);
    if (first) {
      form.elements[first.name].focus();
      return;
    }
    setSending(true);
    setResult(null);
    window.setTimeout(() => {
      const failure = serverReply(values, Boolean(support.email));
      setSending(false);
      if (failure) setResult({ ok: false, message: failure });
      else {
        setValues(EMPTY);
        setResult({ ok: true });
      }
    }, 1100);
  };

  const update = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  return (
    <Panel as="div" className="dt:!p-8">
      <form id="contact-form" noValidate onSubmit={onSubmit} className="grid scroll-mt-28 gap-5">
        {Object.values(errors).some(Boolean) ? (
          <p className="vd-sm font-semibold text-[#b3261e]">
            {t(C.fixFields)}
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          {FIELDS.slice(0, 2).map((field) => (
            <Field key={field.name} label={t(field.label)} error={errors[field.name] ? t(errors[field.name]) : null}>
              {(ids) => (
                <TextInput
                  {...ids}
                  name={field.name}
                  type={field.name === "email" ? "email" : "text"}
                  autoComplete={field.name === "email" ? "email" : "name"}
                  required
                  value={values[field.name]}
                  onChange={update(field.name)}
                  placeholder={t(field.placeholder)}
                />
              )}
            </Field>
          ))}
        </div>
        <Field label={t(FIELDS[2].label)} error={errors.subject ? t(errors.subject) : null}>
          {(ids) => <TextInput {...ids} name="subject" required value={values.subject} onChange={update("subject")} placeholder={t(FIELDS[2].placeholder)} />}
        </Field>
        <Field label={t(FIELDS[3].label)} error={errors.message ? t(errors.message) : null}>
          {(ids) => <TextArea {...ids} name="message" rows={4} required value={values.message} onChange={update("message")} placeholder={t(FIELDS[3].placeholder)} className="resize-none" />}
        </Field>
        <button type="submit" disabled={sending} className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="contact-submit">
          {sending ? t(K.form.submit.sending) : t(K.form.submit.idle)}
          {sending ? null : <Send aria-hidden="true" className="size-[18px] rtl:-scale-x-100" strokeWidth={2.2} />}
        </button>
        <div role="status" aria-live="polite" className="empty:hidden" data-testid="contact-result">
          {result?.ok ? <Notice tone="success" title={t(K.form.toasts.success)} /> : null}
          {result && !result.ok ? (
            <Notice
              tone="danger"
              title={t(C.notSentTitle)}
              actions={support.whatsapp_number ? <WhatsAppLink number={support.whatsapp_number} /> : null}
            >
              {/* The backend's messages are English in both languages; production's fallback is translated. */}
              {result.message ? (
                <span lang="en" dir="ltr" className="inline-block">
                  {result.message}
                </span>
              ) : (
                t(K.form.toasts.errorFallback)
              )}
            </Notice>
          ) : null}
        </div>
      </form>
    </Panel>
  );
}

function WhatsAppLink({ number }) {
  const { t, lang } = useLang();
  const sample = useSampleLink();
  return (
    <a href={whatsappHref(number, lang)} target="_blank" rel="noopener noreferrer" onClick={sample(C.sampleWhatsApp)} className={btn("soft", "sm", "gap-1.5")}>
      <MessageCircle aria-hidden="true" className="size-4" strokeWidth={2.2} />
      {t(K.hero.whatsappButton.label)}
    </a>
  );
}

function ContactView({ state }) {
  const { t } = useLang();
  const titleId = useId();
  const support = state === "unconfigured" ? SUPPORT_CONTACT.unconfigured : SUPPORT_CONTACT.configured;
  return (
    <>
      <ContentHero
        eyebrow={K.hero.eyebrow}
        headline={K.hero.headline}
        intro={K.hero.intro}
        image={PRIORITY_2.sellers.khaznaCartons}
        photoOnPhones={false}
        before={support.whatsapp_number ? <WhatsAppButton number={support.whatsapp_number} /> : null}
      />
      <InfoCards support={support} />
      <section aria-labelledby={titleId} className="vd-container mt-12 dt:mt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            <SectionIntro eyebrow={K.form.eyebrow} title={K.form.heading} id={titleId} />
            <p className="mt-4 max-w-[36rem] vd-lg text-[var(--vd-ink)]/85">{t(K.form.body)}</p>
            <div className="mt-6 flex items-start gap-3 rounded-[20px] bg-[#f6f8fc] p-4">
              <IconDisk icon={MessageCircle} tone="white" />
              <div className="min-w-0">
                <p className="vd-md font-semibold text-[var(--vd-muted)]">{t(K.form.responseTime.label)}</p>
                <p className="mt-0.5 vd-lg font-bold text-[var(--vd-ink)]">{t(K.form.responseTime.value)}</p>
              </div>
            </div>
          </div>
          <ContactForm state={state} support={support} />
        </div>
      </section>
    </>
  );
}

export function VisualDiscoveryContact() {
  return (
    <ContentPage current="contact">
      <StateRoute fallback={<ContactView state="default" />}>{(params, state) => <ContactView key={state} state={state} />}</StateRoute>
      <TrustStrip marks={K.trustStrip} />
      <div className="pb-12 dt:pb-16" />
    </ContentPage>
  );
}
