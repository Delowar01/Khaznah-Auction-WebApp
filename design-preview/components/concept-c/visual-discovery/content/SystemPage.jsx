"use client";

// Option 3 — Components & states (/system): the reviewers' page of the
// shared customer kit (buttons, status pills, notices, fields, quantity,
// cards, summaries, dialogs and side panels), one example of each kind of
// page state in its own page's words (Phase 24: one look per kind, never
// one message for different situations), the loading, error and not-found
// pages, and an index of every preview state. Preview state "crash" makes
// the page fail after it loads, so the real error page shows; the failure
// lasts while the state is set.
import Link from "next/link";
import { useId, useState } from "react";
import { Lock, PackageCheck, ShoppingCart, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CART_COPY } from "@/components/shared/commerce/cartCopy";
import { CONTENT_COPY, SYSTEM_COPY as S } from "@/components/shared/commerce/contentCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { useHydrated } from "@/components/shared/ui/hooks";
import { Money } from "@/components/shared/ui/Money";
import { CONTENT } from "@/data/contentPages";
import { getProduct } from "@/data/products";
import { CITIES } from "@/data/sellers";
import { PAGE_STATES } from "@/lib/previewStates";
import { OPTION3_PAGES } from "@/lib/routes";
import { COPY } from "../copy";
import { EmptyState, ErrorState, IconDisk, LoadingPanel, Notice, Panel, PageHeader, StatusPill, SummaryRow, Tile } from "../kit/Blocks";
import { Checkbox, CodeInput, Field, PasswordInput, PillChoice, RadioCard, Select, TextArea, TextInput } from "../kit/Form";
import { Dialog, SidePanel } from "../kit/Overlay";
import { VDPage } from "../kit/Page";
import { LockedQuantity, QuantityStepper } from "../kit/Quantity";
import { Arrow, btn, cx } from "../ui";
import { AuctionErrorBody, AuctionLoadingBody, MainLoadingBody, PageErrorBody, SellerErrorBody } from "./Boundaries";
import { NotFoundBody } from "./NotFoundPage";

const SECTIONS = [
  { id: "buttons", title: S.buttons },
  { id: "status", title: S.status },
  { id: "forms", title: S.forms },
  { id: "cards", title: S.cards },
  { id: "overlays", title: S.overlays },
  { id: "states", title: S.states },
  { id: "boundaries", title: S.boundaries },
  { id: "index", title: S.index },
];

/** Preview state "crash": fails once the page is in the browser, so concept-c/error.js takes over. */
function Crash() {
  const hydrated = useHydrated();
  if (hydrated) throw new Error("Simulated failure (Components & states, ?state=crash)");
  return null;
}

function Section({ id, title, note, children }) {
  const { t } = useLang();
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="vd-container mt-12 scroll-mt-6 dt:mt-16">
      <h2 id={`${id}-title`} className="vd-h2 text-[var(--vd-ink)]">
        {t(title)}
      </h2>
      {note ? <p className="mt-2 max-w-3xl vd-lg text-[var(--vd-muted)]">{t(note)}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** A labelled example; `href` opens the same state on its page. */
function Example({ label, href, children, className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <figure className={cx("min-w-0 rounded-[24px] border border-[var(--vd-line)] bg-white p-4 sm:p-5", className)}>
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="vd-kicker text-[var(--vd-muted)]">{t(label)}</span>
        {href ? (
          <Link href={link(href)} className="vd-link inline-flex items-center gap-1.5 vd-sm font-bold text-[var(--vd-indigo)]">
            {t(S.openOnPage)}
            <Arrow className="size-3.5" />
          </Link>
        ) : null}
      </figcaption>
      {children}
    </figure>
  );
}

function Buttons() {
  const { t } = useLang();
  return (
    <Section id="buttons" title={S.buttons} note={S.buttonsNote}>
      <Panel as="div" className="grid gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn("gold", "lg")}>
            {t(COPY.exploreAuctions)}
            <Arrow className="size-4" />
          </button>
          <button type="button" className={btn("indigo", "lg")}>
            {t(CART_COPY.proceed)}
          </button>
          <button type="button" className={btn("navy", "lg")}>
            {t(COPY.joinLive)}
          </button>
          <button type="button" className={btn("outline", "lg")}>
            {t(COPY.shopBuyNow)}
          </button>
          <button type="button" className={btn("soft", "lg")}>
            {t(CONTENT_COPY.print)}
          </button>
          <button type="button" className={btn("danger", "lg")}>
            {t(CART_COPY.remove)}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btn("indigo", "sm")}>
            {t(CART_COPY.proceed)}
          </button>
          <button type="button" className={btn("indigo", "md")}>
            {t(CART_COPY.proceed)}
          </button>
          <button type="button" disabled className={btn("indigo", "lg")}>
            {t(S.disabled)}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-[20px] bg-[var(--vd-navy)] p-4">
          <button type="button" className={btn("gold", "lg")}>
            {t(CONTENT.about.cta.buttons[0].label)}
          </button>
          <button type="button" className={btn("white", "lg")}>
            {t(CONTENT.about.cta.buttons[1].label)}
          </button>
        </div>
      </Panel>
    </Section>
  );
}

function Status() {
  const { t } = useLang();
  return (
    <Section id="status" title={S.status} note={S.statusNote}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel as="div">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success">{t(S.toneSuccess)}</StatusPill>
            <StatusPill tone="warning">{t(S.toneWarning)}</StatusPill>
            <StatusPill tone="danger">{t(S.toneDanger)}</StatusPill>
            <StatusPill tone="info">{t(S.toneInfo)}</StatusPill>
            <StatusPill tone="neutral">{t(S.toneNeutral)}</StatusPill>
            <StatusPill tone="live" icon={null}>
              {t(COPY.liveNow)}
            </StatusPill>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill tone="success" size="sm">
              {t(S.toneSuccess)}
            </StatusPill>
            <StatusPill tone="warning" size="sm">
              {t(S.toneWarning)}
            </StatusPill>
            <StatusPill tone="danger" size="sm">
              {t(S.toneDanger)}
            </StatusPill>
          </div>
        </Panel>
        <div className="grid gap-3">
          <Notice tone="info" title={t(S.toneInfo)}>
            {t(CART_COPY.vatIncluded)}
          </Notice>
          <Notice tone="success" title={t(CONTENT.contact.form.toasts.success)} />
          <Notice tone="warning" title={t(CART_COPY.blocked)} />
          <Notice tone="danger" title={t(CONTENT_COPY.notSentTitle)}>
            {t(CONTENT.contact.form.toasts.errorFallback)}
          </Notice>
        </div>
      </div>
    </Section>
  );
}

function Forms() {
  const { t, ui } = useLang();
  const [qty, setQty] = useState(2);
  const [choice, setChoice] = useState("all");
  const [method, setMethod] = useState("delivery");
  const [remember, setRemember] = useState(true);
  const fields = CONTENT.contact.form.fields;
  return (
    <Section id="forms" title={S.forms} note={S.formsNote}>
      <Panel as="div" className="grid items-start gap-5 md:grid-cols-2 dt:!p-8">
        <Field label={t(fields[0].label)}>{(ids) => <TextInput {...ids} name="system-name" defaultValue="" placeholder={t(fields[0].placeholder)} autoComplete="off" />}</Field>
        <Field label={t(fields[1].label)} error={t(CONTENT_COPY.requiredEmail)}>
          {(ids) => <TextInput {...ids} type="email" name="system-email" defaultValue="sara@" autoComplete="off" />}
        </Field>
        <Field label={t(S.password)}>{(ids) => <PasswordInput {...ids} name="system-password" defaultValue="khaznah-2026" autoComplete="off" />}</Field>
        <Field label={t(S.code)} hint={t(S.codeHint)}>
          {(ids) => <CodeInput {...ids} name="system-code" defaultValue="" placeholder="••••••" />}
        </Field>
        <Field label={t(COPY.chooseCity)}>
          {(ids) => (
            <Select {...ids} name="system-city" defaultValue="riyadh">
              {Object.entries(CITIES).map(([key, name]) => (
                <option key={key} value={key}>
                  {t(name)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={t(fields[3].label)} optional>
          {(ids) => <TextArea {...ids} name="system-message" rows={3} placeholder={t(fields[3].placeholder)} />}
        </Field>
        <div className="grid gap-3">
          <RadioCard name="system-method" value="delivery" checked={method === "delivery"} onChange={() => setMethod("delivery")}>
            <span className="flex items-center gap-2 vd-md font-bold">
              <Truck aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              {ui("delivery")}
            </span>
          </RadioCard>
          <RadioCard name="system-method" value="pickup" checked={method === "pickup"} onChange={() => setMethod("pickup")}>
            <span className="flex items-center gap-2 vd-md font-bold">
              <PackageCheck aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              {ui("pickup")}
            </span>
          </RadioCard>
        </div>
        <div className="grid content-start gap-4">
          <PillChoice
            legend={t(COPY.modes)}
            name="system-mode"
            value={choice}
            onChange={setChoice}
            options={[
              { value: "all", label: ui("all") },
              { value: "auction", label: ui("auction") },
              { value: "buy_now", label: ui("buyNow") },
            ]}
          />
          <Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)}>
            {t(S.remember)}
          </Checkbox>
          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} max={5} onChange={setQty} labels={{ quantity: t(CART_COPY.quantity), decrease: ui("decrease"), increase: ui("increase") }} />
            <LockedQuantity value={12} label={t(CART_COPY.lockedShort)} />
          </div>
        </div>
      </Panel>
    </Section>
  );
}

function Cards() {
  const { t, pl } = useLang();
  return (
    <Section id="cards" title={S.cards} note={S.cardsNote}>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel as="div">
          <div className="flex items-center gap-3">
            <IconDisk icon={ShoppingCart} />
            <h3 className="vd-h3 text-[var(--vd-ink)]">{t(CART_COPY.itemsTitle)}</h3>
          </div>
          <Tile className="mt-4 flex items-center gap-3">
            <Lock aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
            <span className="vd-md text-[var(--vd-ink)]">{t(S.tile)}</span>
          </Tile>
        </Panel>
        <Panel as="div">
          <h3 className="vd-h3 text-[var(--vd-ink)]">{t(CART_COPY.summary)}</h3>
          <dl className="mt-4 grid gap-3">
            <SummaryRow label={`${t(CART_COPY.products)} · ${pl("items", 3)}`} amount={1748} />
            <SummaryRow label={t(CART_COPY.total)} strong className="mt-1 border-t border-[var(--vd-line)] pt-3" value={<Money value={1748} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />} />
          </dl>
        </Panel>
      </div>
    </Section>
  );
}

function Overlays() {
  const { t } = useLang();
  const [dialog, setDialog] = useState(false);
  const [panel, setPanel] = useState(false);
  return (
    <Section id="overlays" title={S.overlays} note={S.overlaysNote}>
      <Panel as="div" className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setDialog(true)} className={btn("outline", "lg")}>
          {t(S.openDialog)}
        </button>
        <button type="button" onClick={() => setPanel(true)} className={btn("outline", "lg")}>
          {t(S.openPanel)}
        </button>
      </Panel>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title={t(CART_COPY.removeConfirm)}
        size="sm"
        testId="system-dialog"
        footer={
          <>
            <button type="button" onClick={() => setDialog(false)} className={btn("outline", "lg")}>
              {t(CART_COPY.cancel)}
            </button>
            <button type="button" onClick={() => setDialog(false)} className={btn("danger", "lg")}>
              {t(CART_COPY.remove)}
            </button>
          </>
        }
      >
        <p className="vd-md text-[var(--vd-ink)]">{t(getProduct("task-lamp").title)}</p>
      </Dialog>
      <SidePanel open={panel} onClose={() => setPanel(false)} title={t(S.panelTitle)} testId="system-panel">
        <p className="vd-md text-[var(--vd-muted)]">{t(S.panelText)}</p>
      </SidePanel>
    </Section>
  );
}

function States() {
  const { t } = useLang();
  const F = CONTENT.faq;
  return (
    <Section id="states" title={S.states} note={S.statesNote}>
      <div className="grid gap-4 md:grid-cols-2">
        <Example label={S.stateLoading} href="/cart?state=loading">
          <LoadingPanel label={t(CART_COPY.loading)} lines={2} className="!shadow-none" />
        </Example>
        <Example label={S.stateNoResults} href="/faq?state=no-results">
          <EmptyState
            compact
            headingLevel={3}
            title={t(F.emptyState.message)}
            actions={
              <button type="button" className={btn("indigo", "md")}>
                {t(F.emptyState.clearButton)}
              </button>
            }
          />
        </Example>
        <Example label={S.stateEmpty} href="/cart?state=empty">
          <EmptyState compact headingLevel={3} icon={ShoppingCart} title={t(CART_COPY.emptyTitle)} text={t(CART_COPY.emptyText)} />
        </Example>
        <Example label={S.stateFailed} href="/cart?state=error">
          <ErrorState headingLevel={3} title={t(CART_COPY.loadFailed)} text={t(CART_COPY.loadFailedText)} onRetry={() => {}} className="!py-8" />
        </Example>
        <Example label={S.stateBlocked} href="/cart?state=attention">
          <Notice tone="warning" title={t(CART_COPY.blocked)} />
        </Example>
        <Example label={S.stateSignIn} href="/cart?state=guest">
          <Notice tone="info" title={t(CART_COPY.guestNote)} />
        </Example>
        <Example label={S.stateSendFailed} href="/contact?state=error" className="md:col-span-2">
          <Notice tone="danger" title={t(CONTENT_COPY.notSentTitle)}>
            {t(CONTENT.contact.form.toasts.errorFallback)}
          </Notice>
        </Example>
      </div>
    </Section>
  );
}

function Boundaries() {
  const reset = () => {};
  return (
    <Section id="boundaries" title={S.boundaries} note={S.boundariesNote}>
      <div className="grid gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Example label={S.pageLoading}>
            <div className="max-h-[420px] overflow-hidden">
              <MainLoadingBody container={false} />
            </div>
          </Example>
          <Example label={S.auctionLoading}>
            <AuctionLoadingBody container={false} />
          </Example>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Example label={S.pageError} href="/system?state=crash">
            <PageErrorBody reset={reset} headingLevel={3} container={false} />
          </Example>
          <Example label={S.auctionError}>
            <AuctionErrorBody reset={reset} headingLevel={3} container={false} />
          </Example>
          <Example label={S.sellerError} href="/seller/REDSEA?state=error">
            <SellerErrorBody reset={reset} headingLevel={3} container={false} />
          </Example>
        </div>
        <Example label={S.notFound} href="/orders/1">
          <NotFoundBody headingLevel={3} container={false} showAddress={false} />
        </Example>
      </div>
    </Section>
  );
}

/** Every page's preview states, as links (the presentation bar's menu, page by page). */
function StateIndex() {
  const { t } = useLang();
  const { link } = useConcept();
  const pages = OPTION3_PAGES.filter((page) => PAGE_STATES[page.key]);
  const withState = (path, key) => {
    const [route, query = ""] = path.split("?");
    const params = new URLSearchParams(query);
    if (key !== "default") params.set("state", key);
    const search = params.toString();
    return `${route}${search ? `?${search}` : ""}`;
  };
  return (
    <Section id="index" title={S.index} note={S.indexNote}>
      <div className="grid gap-4 sm:grid-cols-2 dt:grid-cols-3">
        {pages.map((page) => (
          <Panel key={page.key} as="div">
            <h3 className="vd-h3 text-[var(--vd-ink)]">{t(page.label)}</h3>
            <ul className="mt-3 grid gap-1">
              {PAGE_STATES[page.key].map((state) => (
                <li key={state.key}>
                  <Link href={link(withState(page.path, state.key))} className="vd-link flex min-h-9 items-center gap-2 vd-md text-[var(--vd-indigo)]">
                    <Arrow className="size-3.5 shrink-0" />
                    {t(state.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

function SystemView({ state }) {
  const { t } = useLang();
  const contentsId = useId();
  return (
    <>
      {state === "crash" ? <Crash /> : null}
      <PageHeader crumbs={[{ label: t(S.title) }]} kicker={t(S.kicker)} title={t(S.title)} intro={t(S.intro)} size="display" />
      <nav aria-labelledby={contentsId} className="vd-container mt-6">
        <h2 id={contentsId} className="sr-only">
          {t(S.contents)}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="inline-flex h-10 items-center rounded-full border border-[var(--vd-line)] bg-white px-4 vd-md text-[var(--vd-ink)] transition-colors hover:bg-[var(--vd-bluegray)]">
                {t(section.title)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Buttons />
      <Status />
      <Forms />
      <Cards />
      <Overlays />
      <States />
      <Boundaries />
      <StateIndex />
      <div className="pb-14 dt:pb-20" />
    </>
  );
}

export function VisualDiscoverySystem() {
  return (
    <VDPage>
      <StateRoute fallback={<SystemView state="default" />}>{(params, state) => <SystemView key={state} state={state} />}</StateRoute>
    </VDPage>
  );
}
