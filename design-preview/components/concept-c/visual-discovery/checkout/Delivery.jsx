"use client";

// Checkout delivery: home delivery or warehouse pickup as two radio cards,
// the delivery address (production's AddressSelector inside a "Deliver to"
// disclosure, and its add / edit dialog), the quote status line and the
// pickup location. Production's rules: pickup only for a cart of Khazna's
// own lots, and free; home delivery is priced per order once an address is
// chosen; Edit selects the address at once and Add clears the selection.
import { useState } from "react";
import { Check, ChevronDown, Clock3, House, MapPin, Pencil, Plus, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CHECKOUT_COPY as C } from "@/components/shared/commerce/checkoutCopy";
import { Money } from "@/components/shared/ui/Money";
import { Notice, Panel, PanelHead, Spinner } from "../kit/Blocks";
import { Field, TextArea, TextInput } from "../kit/Form";
import { Dialog } from "../kit/Overlay";
import { btn, cx } from "../ui";

/** The address summary line production's AddressSelector shows. */
export function addressSummary(address) {
  return [address.recipient_name, address.address_line || address.label, address.district, address.city, address.region, address.postal_code].filter(Boolean).join(", ");
}

function MethodCard({ name, value, checked, onSelect, disabled, icon: Icon, title, text, fee, hint, testId }) {
  return (
    <label
      title={hint}
      data-testid={testId}
      className={cx(
        "relative flex min-h-[62px] gap-3 rounded-[20px] border bg-white p-3.5 transition-[border-color,box-shadow] sm:p-4",
        disabled ? "cursor-not-allowed bg-[#f6f8fc]" : "cursor-pointer hover:border-[#b6c6df]",
        checked ? "border-[var(--vd-indigo)] shadow-[0_0_0_1px_var(--vd-indigo)]" : "border-[#dfe7f3]",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onSelect} className="peer sr-only" />
      <span aria-hidden="true" className={cx("hidden size-11 shrink-0 place-items-center rounded-[14px] lg:grid", checked ? "bg-[var(--vd-indigo)] text-white" : "bg-[var(--vd-bluegray)] text-[var(--vd-indigo)]")}>
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cx("block vd-md font-bold", disabled ? "text-[var(--vd-muted)]" : "text-[var(--vd-ink)]")}>{title}</span>
        {text ? <span className={cx("mt-0.5 block vd-sm text-[var(--vd-muted)]", !disabled && "max-lg:hidden")}>{text}</span> : null}
        <span className="mt-1 block vd-sm font-bold">{fee}</span>
      </span>
      <span aria-hidden="true" className={cx("grid size-6 shrink-0 place-items-center rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus)]", checked ? "bg-[var(--vd-grade-a)] text-white" : "border-[1.5px] border-[#c3cfe3] bg-white")}>
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
    </label>
  );
}

function AddressCard({ address, selected, onSelect, onEdit }) {
  const { t } = useLang();
  return (
    <li className={cx("flex items-start gap-2 rounded-[18px] border bg-white p-1.5 transition-[border-color,box-shadow]", selected ? "border-[var(--vd-indigo)] shadow-[0_0_0_1px_var(--vd-indigo)]" : "border-[#dfe7f3]")}>
      <button type="button" onClick={onSelect} aria-pressed={selected} className="flex min-w-0 flex-1 items-start gap-2.5 rounded-[14px] p-2 text-start hover:bg-[#f6f8fc]" data-testid="address-card">
        <span aria-hidden="true" className={cx("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", selected ? "bg-[var(--vd-indigo)] text-white" : "border-[1.5px] border-[#9fb0cf]")}>
          {selected ? <Check className="size-3" strokeWidth={3.2} /> : null}
        </span>
        <span className="min-w-0">
          <span className="block vd-md font-bold text-[var(--vd-ink)]">
            <bdi>{address.label || t(C.savedAddress)}</bdi>
            {address.is_default ? <span className="ms-1.5 vd-sm font-semibold text-[var(--vd-indigo)]">{t(C.defaultTag)}</span> : null}
          </span>
          <span className="mt-0.5 block vd-sm text-[var(--vd-muted)]">
            <bdi>{addressSummary(address) || t(C.addressUnavailable)}</bdi>
          </span>
        </span>
      </button>
      <button type="button" onClick={onEdit} aria-label={`${t(C.editAddress)}: ${address.label || t(C.savedAddress)}`} className="grid size-10 shrink-0 place-items-center rounded-full text-[var(--vd-indigo)] hover:bg-[var(--vd-bluegray)]" data-testid="edit-address">
        <Pencil aria-hidden="true" className="size-4" strokeWidth={2.2} />
      </button>
    </li>
  );
}

/** Production's AddressSelector as checkout uses it (no Default or Delete actions). */
function AddressSelector({ addresses, selectedId, onSelect, onEdit, onAdd }) {
  const { t } = useLang();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 vd-md font-bold text-[var(--vd-ink)]">
          <MapPin aria-hidden="true" className="size-4 text-[var(--vd-indigo)]" strokeWidth={2.2} />
          {t(C.deliveryAddress)}
        </h3>
        <button type="button" onClick={onAdd} className={btn("soft", "sm")} data-testid="add-address">
          <Plus aria-hidden="true" className="size-4" strokeWidth={2.4} />
          {t(C.add)}
        </button>
      </div>
      {addresses.length ? (
        <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} selected={address.id === selectedId} onSelect={() => onSelect(address)} onEdit={() => onEdit(address)} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-[16px] bg-[#f6f8fc] px-4 py-3 vd-md text-[var(--vd-muted)]">{t(C.addFirst)}</p>
      )}
    </div>
  );
}

/** The delivery quote's status under the address: its error with Retry, loading, or the per-warehouse note. */
function QuoteStatus({ quoteError, quoteLoading, onRetry }) {
  const { t } = useLang();
  if (quoteError) {
    return (
      <div role="alert" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[16px] bg-[#fdecea] px-4 py-3" data-testid="quote-error">
        <p className="min-w-0 flex-1 basis-56 vd-sm font-semibold text-[#a61b18]" dir="ltr">
          {quoteError}
        </p>
        <button type="button" onClick={onRetry} className={btn("outline", "sm")} data-testid="quote-retry">
          {t(C.retry)}
        </button>
      </div>
    );
  }
  if (quoteLoading) return <Spinner label={t(C.updatingDelivery)} showLabel className="mt-3 vd-sm" />;
  return <p className="mt-3 vd-sm text-[var(--vd-muted)]">{t(C.feeNote)}</p>;
}

/** Pickup from the platform's location (header always "Selected warehouse", as production's label helper finds no warehouse). */
function PickupBox({ locations, loading, pickupId, onPick }) {
  const { t } = useLang();
  const selected = locations.find((location) => location.id === pickupId);
  return (
    <div className="mt-4 rounded-[20px] bg-[var(--vd-ivory)] p-4 sm:p-5" data-testid="pickup-box">
      <h3 className="flex items-center gap-2 vd-md font-bold text-[var(--vd-ink)]">
        <Warehouse aria-hidden="true" className="size-4 text-[#7a4e0c]" strokeWidth={2.2} />
        {t(C.pickupFrom, { label: t(C.selectedWarehouse) })}
      </h3>
      <Field label={t(C.pickupLocation)} className="mt-3">
        {({ id, describedBy }) => (
          <span className="relative block">
            <select
              id={id}
              aria-describedby={describedBy}
              value={pickupId ?? ""}
              disabled={loading || locations.length === 0}
              onChange={(event) => onPick(event.target.value ? Number(event.target.value) : null)}
              className="h-12 w-full appearance-none rounded-[14px] border border-[#cfdaea] bg-white px-4 pe-11 vd-md text-[var(--vd-ink)] outline-none focus-visible:border-[var(--vd-indigo)] focus-visible:shadow-[0_0_0_3px_rgb(24_57_151/0.18)] disabled:cursor-not-allowed disabled:bg-[#f6f8fc] disabled:text-[var(--vd-muted)]"
              data-testid="pickup-select"
            >
              {loading ? <option value="">{t(C.loadingPickup)}</option> : locations.length ? <option value="">{t(C.selectPickup)}</option> : <option value="">{t(C.noPickup)}</option>}
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {[location.name, location.city, location.address_line1].filter(Boolean).join(" · ")}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-[var(--vd-indigo)]" strokeWidth={2.2} />
          </span>
        )}
      </Field>
      {selected ? (
        <p className="mt-2 vd-sm text-[var(--vd-ink)]">
          <bdi>{[selected.contact_name, selected.phone, selected.address_line1, selected.city].filter(Boolean).join(" · ")}</bdi>
        </p>
      ) : null}
      <p className="mt-2 flex items-center gap-1.5 vd-sm text-[var(--vd-muted)]">
        <Clock3 aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />
        {t(C.collectionHours)}
      </p>
    </div>
  );
}

/**
 * The Delivery Method panel. `quote` is the current quote (or null), `fee`
 * the home card's fee line state: "loading", a number, or null.
 */
export function DeliveryPanel({ method, onMethod, pickupEligible, disabled, homeFee, address, addresses, onSelectAddress, onEditAddress, onAddAddress, quoteError, quoteLoading, onRetryQuote, pickup, className = "" }) {
  const { t } = useLang();
  const [openAddresses, setOpenAddresses] = useState(false);
  const feeLine =
    homeFee === "loading" ? (
      <span className="text-[#7a4e0c]">{t(C.checkingFee)}</span>
    ) : homeFee == null ? (
      <span className="text-[#7a4e0c]">{t(C.quoteAfterAddress)}</span>
    ) : (
      <Money value={homeFee} className="text-[#7a4e0c]" />
    );
  return (
    <Panel aria-labelledby="checkout-delivery-title" className={className} data-testid="delivery-panel">
      <PanelHead id="checkout-delivery-title" title={t(C.deliveryMethod)} />
      <fieldset className="mt-4">
        <legend className="sr-only">{t(C.deliveryMethod)}</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <MethodCard name="delivery-method" value="home" checked={method === "home"} onSelect={() => onMethod("home")} disabled={disabled} icon={House} title={t(C.homeDelivery)} text={t(C.homeText)} fee={feeLine} testId="method-home" />
          <MethodCard
            name="delivery-method"
            value="pickup"
            checked={method === "pickup"}
            onSelect={() => onMethod("pickup")}
            disabled={disabled || !pickupEligible}
            icon={Warehouse}
            title={t(C.warehousePickup)}
            text={pickupEligible ? t(C.pickupText) : t(C.pickupIneligible)}
            fee={<span className="text-[var(--vd-grade-a)]">{t(C.free)}</span>}
            hint={pickupEligible ? undefined : t(C.pickupOnlyKhaznah)}
            testId="method-pickup"
          />
        </div>
        {pickupEligible ? null : <p className="sr-only">{t(C.pickupOnlyKhaznah)}</p>}
      </fieldset>

      {method === "home" ? (
        <>
          {/* Open while no address is chosen, as production's <details open={!address.id}>. */}
          <details open={!address || openAddresses} onToggle={(event) => setOpenAddresses(event.currentTarget.open)} className="group mt-4 rounded-[20px] border border-[var(--vd-line)] bg-white" data-testid="address-disclosure">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-[20px] px-4 py-2.5 vd-md hover:bg-[#f6f8fc] [&::-webkit-details-marker]:hidden">
              <MapPin aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-semibold text-[var(--vd-ink)]">{t(C.deliverTo)}</span>
                <span className="text-[var(--vd-muted)]">
                  {" · "}
                  {address ? (
                    <bdi>
                      {address.recipient_name} · {address.city}
                    </bdi>
                  ) : (
                    t(C.selectAddress)
                  )}
                </span>
              </span>
              {address ? <span className="shrink-0 vd-sm font-bold text-[var(--vd-indigo)] underline underline-offset-2">{t(C.change)}</span> : null}
              <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[var(--vd-indigo)] transition-transform group-open:rotate-180" strokeWidth={2.2} />
            </summary>
            <div className="border-t border-[var(--vd-line)] p-4">
              <AddressSelector
                addresses={addresses}
                selectedId={address?.id}
                onSelect={(entry) => {
                  onSelectAddress(entry);
                  setOpenAddresses(false);
                }}
                onEdit={onEditAddress}
                onAdd={onAddAddress}
              />
            </div>
          </details>
          <QuoteStatus quoteError={quoteError} quoteLoading={quoteLoading} onRetry={onRetryQuote} />
        </>
      ) : (
        <PickupBox {...pickup} />
      )}
    </Panel>
  );
}

const EMPTY_DRAFT = { recipient_name: "", recipient_phone: "", street: "", city: "", district: "", building: "", notes: "" };

/** The form a saved address opens with (production's mapAddressForUi: the street is the whole address line). */
export const draftFrom = (address) =>
  address
    ? { recipient_name: address.recipient_name, recipient_phone: address.recipient_phone, street: address.address_line, city: address.city, district: address.district, building: address.extra_data?.building || "", notes: address.extra_data?.notes || "" }
    : EMPTY_DRAFT;

/**
 * Add / edit a delivery address. Production's title is "Edit Delivery
 * Address" for both; name, phone, city and street are required; the server's
 * error shows at the top of the dialog, which stays open.
 */
export function AddressDialog({ open, draft, error, saving, onChange, onSave, onClose }) {
  const { t } = useLang();
  const field = (key) => ({ value: draft[key], onChange: (event) => onChange({ ...draft, [key]: event.target.value }) });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="wide"
      title={t(C.modalTitle)}
      testId="address-dialog"
      footer={
        <button type="submit" form="checkout-address-form" disabled={saving} className={btn("indigo", "lg")} data-testid="save-address">
          {saving ? t(C.saving) : t(C.saveContinue)}
        </button>
      }
    >
      <form
        id="checkout-address-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="grid grid-cols-1 gap-4"
      >
        {error ? (
          <Notice tone="danger" role="alert">
            <span dir="auto">{error}</span>
          </Notice>
        ) : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t(C.recipientName)}>{(ids) => <TextInput {...ids} autoComplete="name" placeholder={t(C.fullName)} {...field("recipient_name")} />}</Field>
          <Field label={t(C.recipientPhone)}>{(ids) => <TextInput {...ids} type="tel" autoComplete="tel" placeholder={t(C.mobileNumber)} {...field("recipient_phone")} />}</Field>
        </div>
        <Field label={t(C.street)}>{(ids) => <TextInput {...ids} autoComplete="street-address" placeholder={t(C.streetPlaceholder)} {...field("street")} />}</Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t(C.city)}>{(ids) => <TextInput {...ids} autoComplete="address-level2" placeholder={t(C.cityPlaceholder)} {...field("city")} />}</Field>
          <Field label={t(C.district)}>{(ids) => <TextInput {...ids} placeholder={t(C.optional)} {...field("district")} />}</Field>
        </div>
        <Field label={t(C.building)}>{(ids) => <TextInput {...ids} placeholder={t(C.buildingPlaceholder)} {...field("building")} />}</Field>
        <Field label={t(C.notes)}>{(ids) => <TextArea {...ids} rows={2} placeholder={t(C.notesPlaceholder)} className="!min-h-20" {...field("notes")} />}</Field>
      </form>
    </Dialog>
  );
}
