"use client";

// Visual Discovery dialogs: confirm a bid, confirm Buy Now and the grade
// guide. Rounded white panels with pill actions; bottom sheets on phones
// (the shared Modal traps focus, closes on Escape and returns focus).
import { useId } from "react";
import { Check, Gavel, ShieldCheck, Timer, X, Zap } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useTabs } from "@/components/shared/auction/hooks";
import { Img } from "@/components/shared/ui/Img";
import { Modal } from "@/components/shared/ui/Modal";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY } from "@/data/site";
import { GRADE_MATRIX } from "@/data/grades";
import { toneOf } from "../browse/Cards";
import { GradePill, btn, cx } from "../ui";

function Dialog({ open, onClose, title, wide = false, footer, children, testId }) {
  const { ui } = useLang();
  const titleId = useId();
  return (
    <Modal open={open} onClose={onClose} variant="sheet" labelledBy={titleId} panelClassName={cx("rounded-t-[24px] bg-white text-[var(--vd-ink)] shadow-overlay md:rounded-[24px]", wide && "md:max-w-2xl!")}>
      <div data-testid={testId}>
        <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-5">
          <h2 id={titleId} className="vd-h3">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] hover:bg-[#dfe7f3]">
            <X aria-hidden="true" className="size-5" strokeWidth={2.2} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">{footer}</div> : null}
      </div>
    </Modal>
  );
}

function LotLine({ product, label }) {
  const { t, ui } = useLang();
  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border border-[var(--vd-line)] p-2.5">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-[14px]" style={{ background: toneOf(product.slug) }}>
        <Img image={product.images[0]} cutout alt="" sizes="64px" className="vd-multiply absolute inset-0 size-full object-contain p-1.5" />
      </span>
      <div className="min-w-0">
        <p className="vd-xs font-semibold text-[var(--vd-muted)]">{label}</p>
        <p className="line-clamp-2 vd-md font-bold">{t(product.title)}</p>
        <p className="mt-1 flex items-center gap-2 vd-xs text-[var(--vd-muted)]">
          <GradePill grade={product.grade} />
          <span>
            {ui("lotNumber")}{" "}
            <span dir="ltr" className="tabular">
              {product.lot}
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}

function Note({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-2.5 vd-sm text-[var(--vd-ink)]">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]">
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
      </span>
      <span className="pt-1">{children}</span>
    </li>
  );
}

/** "Confirm your bid": the lot, the amount, deposit, binding and (late on) anti-sniping notes. */
export function ConfirmBid({ detail }) {
  const { ui, money } = useLang();
  const { product, auction, confirm, lateBid } = detail;
  return (
    <Dialog
      open={confirm.open}
      onClose={confirm.cancel}
      title={ui("confirmYourBid")}
      testId="confirm-dialog"
      footer={
        <>
          <button type="button" onClick={confirm.cancel} className={btn("outline", "lg", "h-12")}>
            {ui("cancel")}
          </button>
          <button type="button" onClick={confirm.accept} className={btn("indigo", "lg", "h-12 min-w-44")} data-testid="confirm-bid">
            <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
            {ui("confirmBid")}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <LotLine product={product} label={ui("youAreBidding")} />
        <div className="rounded-[20px] bg-[var(--vd-bluegray)] px-4 py-4 text-center">
          <p className="vd-sm text-[var(--vd-muted)]">{ui("yourBid")}</p>
          <Money value={confirm.amount || 0} className="vd-display text-[30px] font-extrabold leading-9 text-[var(--vd-ink)]" symbolClassName="text-[0.66em]" />
        </div>
        <ul className="grid gap-2">
          <Note icon={ShieldCheck}>
            {ui("depositCovered")} · {money(auction.deposit.walletBalance)}
          </Note>
          <Note icon={Gavel}>{ui("bindingBid")}</Note>
          {lateBid ? <Note icon={Timer}>{ui("antiSnipe")}</Note> : null}
        </ul>
      </div>
    </Dialog>
  );
}

/** Buy Now on an auction lot: closes the auction at once. */
export function ConfirmBuyNow({ detail }) {
  const { t, ui, money } = useLang();
  const { product, buyNow } = detail;
  return (
    <Dialog
      open={buyNow.open}
      onClose={buyNow.cancel}
      title={ui("buyNowFor", { amount: money(product.buyNowPrice) })}
      testId="buy-now-dialog"
      footer={
        <>
          <button type="button" onClick={buyNow.cancel} className={btn("outline", "lg", "h-12")}>
            {ui("cancel")}
          </button>
          <button type="button" onClick={buyNow.accept} className={btn("indigo", "lg", "h-12 min-w-44")} data-testid="confirm-buy-now">
            <Zap aria-hidden="true" className="size-[18px]" strokeWidth={2.1} />
            {ui("buyItNow")}
          </button>
        </>
      }
    >
      <div className="grid gap-4">
        <LotLine product={product} label={ui("buyNow")} />
        <div className="rounded-[20px] bg-[var(--vd-ivory)] px-4 py-4 text-center">
          <p className="vd-sm text-[var(--vd-muted)]">{ui("buyNow")}</p>
          <Money value={product.buyNowPrice} className="vd-display text-[30px] font-extrabold leading-9 text-[var(--vd-ink)]" symbolClassName="text-[0.66em]" />
        </div>
        <ul className="grid gap-2">
          <Note icon={Zap}>{ui("buyNowClosesAuction")}</Note>
          <Note icon={ShieldCheck}>{t(C.boughtText, { hours: AUCTION_POLICY.paymentWindowHours })}</Note>
        </ul>
      </div>
    </Dialog>
  );
}

/** Grade guide: pill tabs for Electronics / Non-electronics, this lot's grade marked. */
export function GradeGuide({ detail }) {
  const { t, ui } = useLang();
  const { guide, product } = detail;
  const tabs = useTabs(GRADE_MATRIX.map((group) => group.key));
  return (
    <Dialog open={guide.open} onClose={guide.close} title={ui("gradeGuide")} wide testId="grade-guide">
      <p className="vd-md text-[var(--vd-muted)]">{ui("gradeGuideText")}</p>
      <div role="tablist" aria-label={ui("gradeGuide")} className="mt-4 inline-flex gap-1 rounded-full bg-[var(--vd-bluegray)] p-1">
        {GRADE_MATRIX.map((group) => (
          <button
            key={group.key}
            {...tabs.tabProps(group.key)}
            className={cx("h-10 rounded-full px-4 vd-md font-semibold transition-colors", tabs.active === group.key ? "bg-[var(--vd-indigo)] text-white" : "text-[var(--vd-indigo)] hover:bg-white/70")}
          >
            {t(group.label)}
          </button>
        ))}
      </div>
      {GRADE_MATRIX.map((group) => (
        <div key={group.key} {...tabs.panelProps(group.key)} className="mt-4 outline-offset-4">
          <ul className="grid gap-2">
            {group.rows.map((row) => {
              const mine = row.grade === product.grade;
              return (
                <li key={row.grade} className={cx("flex items-start gap-3 rounded-[16px] px-3 py-3", mine ? "bg-[#eef3fd] ring-2 ring-[var(--vd-indigo)]" : "bg-white ring-1 ring-[var(--vd-line)]")}>
                  <GradePill grade={row.grade} className="mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="vd-md text-[var(--vd-ink)]">{t(row.text)}</p>
                    {mine ? <p className="mt-1 inline-flex rounded-full bg-[var(--vd-indigo)] px-2 py-0.5 vd-label text-white">{t(C.thisLot)}</p> : null}
                  </div>
                  {row.works == null ? null : (
                    <span className={cx("inline-flex shrink-0 items-center gap-1 vd-sm font-semibold", row.works ? "text-[var(--vd-grade-a)]" : "text-[var(--vd-live)]")}>
                      {row.works ? <Check aria-hidden="true" className="size-3.5" strokeWidth={2.6} /> : <X aria-hidden="true" className="size-3.5" strokeWidth={2.6} />}
                      {t(row.works ? C.gradeMatrixWorks : C.gradeMatrixNotWorking)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="mt-4 vd-sm text-[var(--vd-muted)]">{ui("returnsText")}</p>
    </Dialog>
  );
}
