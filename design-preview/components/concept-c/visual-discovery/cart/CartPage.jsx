"use client";

// Option 3 — Cart. The approved masthead over a compact page heading, the
// lines in a white card grouped by seller (checkout places one order per
// seller), and the order summary beside them on desktop — below them, with a
// floating navy total-and-checkout bar, on phones. Production's line rules
// (inventory B.7): quantity 1…stock, removal only behind "Remove Item?",
// full-stock lines locked, an unavailable line blocks checkout, the discount
// is informational and the total VAT-inclusive.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShoppingCart, Store, Trash2, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useToastClearance } from "@/components/shared/auction/hooks";
import { CART_COPY as C } from "@/components/shared/commerce/cartCopy";
import { StateRoute } from "@/components/shared/preview/StateRoute";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { SAMPLE_CARTS } from "@/data/cartSamples";
import { cartLines, cartSummary, groupBySeller } from "@/lib/cart";
import { detailPath } from "@/lib/catalog";
import { toneOf } from "../browse/Cards";
import { EmptyState, ErrorState, Notice, PageHeader, Panel, Placeholder, Spinner, SummaryRow } from "../kit/Blocks";
import { useSession } from "../kit/session";
import { Dialog } from "../kit/Overlay";
import { LockedQuantity, QuantityStepper } from "../kit/Quantity";
import { VDPage } from "../kit/Page";
import { Arrow, GradePill, btn, cx } from "../ui";

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

function StockNote({ line }) {
  const { t } = useLang();
  if (line.outOfStock) return <p className="vd-sm font-bold text-[#a61b18]">{t(C.outOfStock)}</p>;
  return (
    <>
      <p className={cx("vd-sm", line.lowStock ? "font-bold text-[#7a4e0c]" : "text-[var(--vd-muted)]")}>{t(C.onlyLeft, { n: line.stock })}</p>
      {line.overStock ? <p className="vd-sm font-bold text-[#a61b18]">{t(C.overStock, { n: line.stock })}</p> : null}
    </>
  );
}

function CartLine({ line, onQty, onAskRemove }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { product } = line;
  const title = t(product.title);
  const href = link(detailPath(product));
  const attention = line.outOfStock || line.overStock;
  return (
    <li data-testid="cart-line" data-slug={line.slug} className={cx("grid grid-cols-[76px_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-5", attention && "my-1 rounded-[18px] bg-[#fdf6f5] px-3")}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative aspect-square overflow-hidden rounded-[16px]" style={{ background: toneOf(product.slug) }}>
        <Img image={product.images[0]} cutout alt="" sizes="104px" className="vd-multiply absolute inset-0 size-full object-contain p-2" />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <Link href={href} className="vd-link line-clamp-2 vd-title text-[var(--vd-ink)]">
              {title}
            </Link>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 vd-xs text-[var(--vd-muted)]">
              <GradePill grade={product.grade} />
              <span>
                {ui("lotNumber")}{" "}
                <span dir="ltr" className="tabular">
                  {product.lot}
                </span>
              </span>
            </p>
          </div>
          {line.locked ? null : (
            <button
              type="button"
              onClick={() => onAskRemove(line)}
              aria-label={`${t(C.removeItem)}: ${title}`}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] transition-colors hover:bg-[#fde3e1] hover:text-[#a61b18]"
              data-testid="remove-line"
            >
              <Trash2 aria-hidden="true" className="size-[18px]" strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
          <div className="grid gap-1.5">
            {line.locked ? (
              <LockedQuantity value={line.quantity} label={t(C.lockedShort)} />
            ) : (
              <QuantityStepper
                value={line.quantity}
                max={Math.max(1, line.stock)}
                disabled={line.outOfStock}
                onChange={(next) => onQty(line, next)}
                labels={{ quantity: t(C.quantityOf, { title }), decrease: t(C.decrease, { title }), increase: t(C.increase, { title }) }}
              />
            )}
            {line.locked ? (
              <p className="flex items-start gap-1.5 vd-sm font-semibold text-[#7a4e0c]">
                <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.2} />
                {t(line.lockReason === "pallet" ? C.palletLocked : C.auctionLocked)}
              </p>
            ) : null}
            <StockNote line={line} />
          </div>
          <dl className="flex gap-6 text-end">
            <div>
              <dt className="vd-xs text-[var(--vd-muted)]">{t(C.unit)}</dt>
              <dd className="mt-0.5">
                {line.discountUnit > 0 ? <Money value={line.originalPrice} strike className="me-1.5 vd-xs text-[var(--vd-muted)]" /> : null}
                <Money value={line.unitPrice} className="vd-md font-bold text-[var(--vd-ink)]" />
              </dd>
            </div>
            <div>
              <dt className="vd-xs text-[var(--vd-muted)]">{t(C.total)}</dt>
              <dd className="mt-0.5">
                <Money value={line.lineTotal} className="vd-lg font-extrabold text-[var(--vd-indigo)]" />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
}

function SellerGroup({ group, onQty, onAskRemove }) {
  const { t } = useLang();
  const { link } = useConcept();
  const name = t(group.seller.name);
  return (
    <section aria-label={t(C.soldBy, { name })} className="border-t border-[var(--vd-line)] pt-4 first:border-t-0 first:pt-0">
      <h3 className="flex items-center gap-2.5 vd-md text-[var(--vd-muted)]">
        <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--vd-navy)] vd-xs font-bold text-white">
          {initials(group.seller.name.en)}
        </span>
        <span>
          {t(C.soldByLead)}{" "}
          <Link href={link(`/seller/${group.seller.code}`)} className="vd-link font-bold text-[var(--vd-ink)]">
            {name}
          </Link>
        </span>
      </h3>
      <ul className="divide-y divide-[var(--vd-line)]">
        {group.lines.map((line) => (
          <CartLine key={line.slug} line={line} onQty={onQty} onAskRemove={onAskRemove} />
        ))}
      </ul>
    </section>
  );
}

function Summary({ summary, guest, checkoutHref }) {
  const { t, pl } = useLang();
  return (
    <Panel aria-labelledby="cart-summary-title" className="dt:sticky dt:top-[calc(var(--pbar-h)+20px)]">
      <h2 id="cart-summary-title" className="vd-h3">
        {t(C.summary)}
      </h2>
      <dl className="mt-4 grid gap-2.5 rounded-[20px] bg-[#f6f8fc] p-4">
        <SummaryRow label={`${t(C.products)} · ${pl("items", summary.itemCount)}`} amount={summary.products} />
        {summary.discount > 0 ? <SummaryRow label={t(C.discountApplied)} tone="saving" value={<span dir="ltr">−<Money value={summary.discount} /></span>} /> : null}
        <SummaryRow label={t(C.total)} strong className="mt-1 border-t border-[var(--vd-line)] pt-3" value={<Money value={summary.total} className="vd-price text-[var(--vd-ink)]" symbolClassName="text-[0.7em]" />} />
      </dl>
      <p className="mt-2 vd-xs text-[var(--vd-muted)]">{t(C.vatIncluded)}</p>
      {guest ? (
        <Notice tone="info" icon={UserRound} className="mt-4">
          {t(C.guestNote)}
        </Notice>
      ) : null}
      <div className="mt-5">
        {summary.blocked ? (
          <button type="button" disabled className={btn("indigo", "lg", "h-14 w-full whitespace-normal text-center vd-md")} data-testid="checkout-blocked">
            {t(C.blocked)}
          </button>
        ) : (
          <Link href={checkoutHref} className={btn("indigo", "lg", "h-14 w-full vd-lg")} data-testid="proceed-checkout">
            {t(C.proceed)}
            <Arrow className="size-5" />
          </Link>
        )}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-center vd-xs text-[var(--vd-muted)]">
        <Lock aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.2} />
        {t(C.secureNote)}
      </p>
    </Panel>
  );
}

/** Phones: a floating navy bar with the total and the way on, like the product page's. */
function PhoneBar({ summary, checkoutHref }) {
  const { t } = useLang();
  const barRef = useToastClearance();
  return (
    <div ref={barRef} className="vd-print-hide fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-30 [--focus:var(--vd-gold)] md:hidden" data-testid="cart-bar">
      <div className="mx-auto flex h-16 max-w-[640px] items-center gap-2.5 rounded-full bg-[var(--vd-navy)] ps-5 pe-2 text-white shadow-[0_12px_30px_-12px_rgb(6_33_63/0.6)]">
        <div className="min-w-0 flex-1">
          {summary.blocked ? (
            <span className="line-clamp-2 vd-xs font-semibold text-white">{t(C.blocked)}</span>
          ) : (
            <>
              <span className="block vd-xs text-white/75">{t(C.total)}</span>
              <Money value={summary.total} className="block truncate vd-lg font-extrabold" symbolClassName="text-[0.75em]" />
            </>
          )}
        </div>
        {summary.blocked ? (
          <button type="button" disabled className={btn("gold", "lg", "max-[379px]:px-4")}>
            {t(C.proceed)}
          </button>
        ) : (
          <Link href={checkoutHref} className={btn("gold", "lg", "max-[379px]:px-4")}>
            {t(C.proceed)}
          </Link>
        )}
      </div>
    </div>
  );
}

function CartHeader() {
  const { t } = useLang();
  return <PageHeader crumbs={[{ label: t(C.kicker) }]} title={t(C.title)} intro={t(C.intro)} />;
}

function CartSkeleton() {
  const { t } = useLang();
  return (
    <>
      <CartHeader />
      <div className="vd-container grid gap-6 pb-16 pt-6 dt:grid-cols-[minmax(0,1fr)_400px] dt:gap-8" aria-busy="true">
        <Panel>
          <Spinner label={t(C.loading)} />
          <div className="mt-5 grid gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="grid grid-cols-[76px_minmax(0,1fr)] gap-4 sm:grid-cols-[104px_minmax(0,1fr)]">
                <span aria-hidden="true" className="aspect-square animate-pulse rounded-[16px] bg-[var(--vd-bluegray)] motion-reduce:animate-none" />
                <div className="grid content-start gap-3">
                  <Placeholder className="h-4 w-3/4" />
                  <Placeholder className="h-3 w-1/3" />
                  <Placeholder className="mt-2 h-10 w-36" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <Placeholder className="h-5 w-40" />
          <Placeholder className="mt-5 h-24 w-full !rounded-[20px]" />
          <Placeholder className="mt-5 h-14 w-full" />
        </Panel>
      </div>
    </>
  );
}

function CartView({ state }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { cart, setCartQty, removeFromCart, replaceCart, toast } = useStore();
  const { ready, signedIn } = useSession();
  const [confirm, setConfirm] = useState(null);
  // A guest: the "guest" preview state, or a visitor who signed out.
  const guest = state === "guest" || (ready && !signedIn);

  // Preview states load their sample cart into the store once (the header
  // count, the cart drawer and checkout follow); "empty" clears it.
  useEffect(() => {
    if (SAMPLE_CARTS[state]) replaceCart(SAMPLE_CARTS[state]);
    else if (state === "empty") replaceCart([]);
  }, [state, replaceCart]);

  if (state === "loading") return <CartSkeleton />;

  const lines = cartLines(cart);
  const summary = cartSummary(lines);
  const groups = groupBySeller(lines);
  // Signed out, checkout sends the visitor to sign in first (production:
  // /login?next=/checkout). The "guest" preview state shows that step
  // without signing the preview's session out.
  const checkoutHref = link(state === "guest" ? "/checkout?state=signed-out" : "/checkout");

  const onQty = (line, next) => setCartQty(line.slug, next);
  const onRemove = () => {
    removeFromCart(confirm.slug);
    toast({ tone: "success", title: t(C.removed), description: t(confirm.product.title) });
    setConfirm(null);
  };

  return (
    <>
      <CartHeader />
      <div className="vd-container pb-28 pt-6 md:pb-16 dt:pb-20 dt:pt-8">
        {state === "error" ? (
          <ErrorState title={t(C.loadFailed)} text={t(C.loadFailedText)} onRetry={() => router.replace(link("/cart"))} />
        ) : !lines.length ? (
          <EmptyState
            icon={ShoppingCart}
            title={t(C.emptyTitle)}
            text={t(C.emptyText)}
            actions={
              <Link href={link("/browse")} className={btn("indigo", "lg")}>
                {t(C.browseNow)}
                <Arrow />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 dt:grid-cols-[minmax(0,1fr)_400px] dt:items-start dt:gap-8">
            <Panel aria-labelledby="cart-items-title">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="cart-items-title" className="vd-h3">
                  {t(C.itemsTitle)}
                </h2>
                <span className="inline-flex h-7 items-center rounded-full bg-[var(--vd-bluegray)] px-3 vd-sm font-bold text-[var(--vd-ink)]">{pl("items", summary.itemCount)}</span>
              </div>
              {summary.sellerCount > 1 ? (
                <Notice tone="neutral" icon={Store} className="mt-4">
                  {t(C.sellersNote, { n: summary.sellerCount })}
                </Notice>
              ) : null}
              <div className="mt-4 grid gap-2">
                {groups.map((group) => (
                  <SellerGroup key={group.seller.code} group={group} onQty={onQty} onAskRemove={setConfirm} />
                ))}
              </div>
            </Panel>
            <Summary summary={summary} guest={guest} checkoutHref={checkoutHref} />
            <PhoneBar summary={summary} checkoutHref={checkoutHref} />
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        size="sm"
        title={t(C.removeConfirm)}
        description={confirm ? t(confirm.product.title) : null}
        testId="remove-dialog"
        footer={
          <>
            <button type="button" onClick={() => setConfirm(null)} className={btn("outline", "lg")} data-autofocus>
              {t(C.cancel)}
            </button>
            <button type="button" onClick={onRemove} className={btn("danger", "lg")} data-testid="confirm-remove">
              <Trash2 aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {t(C.remove)}
            </button>
          </>
        }
      />
    </>
  );
}

/** Option 3 — Cart (production /cart). */
export function VisualDiscoveryCart() {
  return (
    <VDPage>
      <StateRoute fallback={<CartSkeleton />}>{(params, state) => <CartView key={state} state={state} />}</StateRoute>
    </VDPage>
  );
}
