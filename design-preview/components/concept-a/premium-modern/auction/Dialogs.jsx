"use client";

// Premium Modern dialogs: confirm a bid, confirm Buy Now and the grade
// guide. Ivory panels with a hairline head, bottom sheets on phones (the
// shared Modal traps focus, closes on Escape and returns focus).
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
import { GradePill, btn, cx } from "../ui";

function Dialog({ open, onClose, title, wide = false, footer, children, testId }) {
  const { ui } = useLang();
  const titleId = useId();
  return (
    <Modal open={open} onClose={onClose} variant="sheet" labelledBy={titleId} panelClassName={cx("rounded-t-[8px] bg-[var(--bg)] text-fg shadow-overlay md:rounded-[6px]", wide && "md:max-w-2xl!")}>
      <div data-testid={testId}>
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 id={titleId} className="pr-lg font-semibold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-10 shrink-0 place-items-center rounded-[4px] hover:bg-[var(--pr-stone)]">
            <X aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div> : null}
      </div>
    </Modal>
  );
}

function LotLine({ product, label }) {
  const { t, ui } = useLang();
  return (
    <div className="flex items-center gap-3.5">
      <span className="relative size-16 shrink-0 overflow-hidden rounded-[4px] bg-[var(--pr-stone)]">
        <Img image={product.images[0]} cutout alt="" sizes="64px" className="pr-multiply absolute inset-0 size-full object-contain p-1.5" />
      </span>
      <div className="min-w-0">
        <p className="pr-kicker text-fg-2">{label}</p>
        <p className="line-clamp-2 pr-md font-semibold text-fg">{t(product.title)}</p>
        <p className="mt-1 flex items-center gap-2 pr-xs text-fg-2">
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
    <li className="flex items-start gap-2.5 pr-sm text-fg-2">
      <Icon aria-hidden="true" className="mt-px size-4 shrink-0 text-[var(--pr-bronze)]" strokeWidth={1.8} />
      <span>{children}</span>
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
          <button type="button" onClick={confirm.cancel} className={btn("outline", "md")}>
            {ui("cancel")}
          </button>
          <button type="button" onClick={confirm.accept} className={btn("charcoal", "md", "min-w-40")} data-testid="confirm-bid">
            <Gavel aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            {ui("confirmBid")}
          </button>
        </>
      }
    >
      <div className="grid gap-5">
        <LotLine product={product} label={ui("youAreBidding")} />
        <div className="rounded-[4px] bg-[var(--pr-panel)] px-4 py-4 text-center">
          <p className="pr-xs text-fg-2">{ui("yourBid")}</p>
          <Money value={confirm.amount || 0} className="pr-price text-fg" symbolClassName="text-[0.78em]" />
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
          <button type="button" onClick={buyNow.cancel} className={btn("outline", "md")}>
            {ui("cancel")}
          </button>
          <button type="button" onClick={buyNow.accept} className={btn("charcoal", "md", "min-w-40")} data-testid="confirm-buy-now">
            <Zap aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            {ui("buyItNow")}
          </button>
        </>
      }
    >
      <div className="grid gap-5">
        <LotLine product={product} label={ui("buyNow")} />
        <div className="rounded-[4px] bg-[var(--pr-panel)] px-4 py-4 text-center">
          <p className="pr-xs text-fg-2">{ui("buyNow")}</p>
          <Money value={product.buyNowPrice} className="pr-price text-fg" symbolClassName="text-[0.78em]" />
        </div>
        <ul className="grid gap-2">
          <Note icon={Zap}>{ui("buyNowClosesAuction")}</Note>
          <Note icon={ShieldCheck}>{t(C.boughtText, { hours: AUCTION_POLICY.paymentWindowHours })}</Note>
        </ul>
      </div>
    </Dialog>
  );
}

/** Grade guide: Electronics / Non-electronics, this lot's grade marked. */
export function GradeGuide({ detail }) {
  const { t, ui } = useLang();
  const { guide, product } = detail;
  const tabs = useTabs(GRADE_MATRIX.map((group) => group.key));
  return (
    <Dialog open={guide.open} onClose={guide.close} title={ui("gradeGuide")} wide testId="grade-guide">
      <p className="pr-md text-fg-2">{ui("gradeGuideText")}</p>
      <div role="tablist" aria-label={ui("gradeGuide")} className="mt-4 flex gap-6 border-b border-line">
        {GRADE_MATRIX.map((group) => (
          <button
            key={group.key}
            {...tabs.tabProps(group.key)}
            className={cx("-mb-px border-b-2 py-2.5 pr-md", tabs.active === group.key ? "border-[var(--pr-brass)] font-semibold text-fg" : "border-transparent text-fg-2 hover:text-fg")}
          >
            {t(group.label)}
          </button>
        ))}
      </div>
      {GRADE_MATRIX.map((group) => (
        <div key={group.key} {...tabs.panelProps(group.key)} className="outline-offset-4">
          <ul className="divide-y divide-line">
            {group.rows.map((row) => {
              const mine = row.grade === product.grade;
              return (
                <li key={row.grade} className={cx("flex items-start gap-3 px-2 py-3", mine && "bg-[var(--pr-panel)]")}>
                  <GradePill grade={row.grade} short className="mt-0.5 w-12 justify-center" />
                  <div className="min-w-0 flex-1">
                    <p className="pr-md text-fg">{t(row.text)}</p>
                    {mine ? <p className="mt-0.5 pr-kicker text-[var(--pr-bronze)]">{t(C.thisLot)}</p> : null}
                  </div>
                  {row.works == null ? null : (
                    <span className={cx("inline-flex shrink-0 items-center gap-1 pr-xs font-semibold", row.works ? "text-[var(--pr-grade-a)]" : "text-[var(--danger)]")}>
                      {row.works ? <Check aria-hidden="true" className="size-3.5" /> : <X aria-hidden="true" className="size-3.5" />}
                      {t(row.works ? C.gradeMatrixWorks : C.gradeMatrixNotWorking)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="mt-4 pr-xs text-fg-2">{ui("returnsText")}</p>
    </Dialog>
  );
}
