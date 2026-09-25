"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Flame, Package, Percent, Sparkles, Timer } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { CATEGORIES } from "@/data/categories";
import { LIVE_EVENT } from "@/data/live";
import { LiveBadge } from "../ui/Badge";
import { Plate } from "../ui/Plate";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";

const QUICK = [
  { key: "ending", icon: Timer, href: "/browse?ending=1h", copy: COPY.underAnHour },
  { key: "new", icon: Sparkles, href: "/browse?sort=newest", ui: "justListed" },
  { key: "deals", icon: Percent, href: "/browse?tab=buy_now&has_discount=true", copy: COPY.buyNowDeals },
  { key: "hot", icon: Flame, href: "/browse?tab=auction&sort=most_bids", ui: "sortMostBids" },
  { key: "bulk", icon: Package, href: "/browse?category=bulk-pallets", ui: "bulkLots" },
];

/** Full-width category panel under the nav bar. */
export function MegaMenu({ open, id, onClose }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const current = LIVE_EVENT.items.find((item) => item.status === "live");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="kb-focus-reset absolute inset-x-0 top-full z-50 border-b border-line bg-surface shadow-raised"
        >
          <div className="kb-container grid grid-cols-[minmax(0,1fr)_300px] gap-8 py-6">
            <div>
              <p className="mb-3 kb-eyebrow text-fg-3">{ui("shopByCategory")}</p>
              <ul className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <BrowseLink
                      href={`/browse?category=${category.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-2"
                    >
                      <Plate image={category.image} alt="" sizes="64px" pad="p-1.5" className="size-14 shrink-0 rounded-lg border border-line" />
                      <span className="min-w-0">
                        <span className="block truncate kb-sm font-bold text-fg group-hover:text-primary">{t(category.name)}</span>
                        <span className="block truncate kb-xs text-fg-3">{t(category.blurb)}</span>
                        <span className="block kb-2xs font-semibold text-fg-3 tabular">{pl("lots", category.count)}</span>
                      </span>
                    </BrowseLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-s border-line ps-8">
              <p className="mb-3 kb-eyebrow text-fg-3">{t(COPY.quickLinks)}</p>
              <ul className="grid gap-0.5">
                {QUICK.map((item) => (
                  <li key={item.key}>
                    <BrowseLink href={item.href} onClick={onClose} className="flex h-9 items-center gap-2.5 rounded-lg px-2 kb-sm font-semibold text-fg-2 hover:bg-surface-2 hover:text-fg">
                      <item.icon aria-hidden="true" className="size-4 text-primary" />
                      <span className="flex-1">{item.copy ? t(item.copy) : ui(item.ui)}</span>
                      <DirIcon icon={ChevronRight} className="size-4 text-fg-3" />
                    </BrowseLink>
                  </li>
                ))}
              </ul>
              <Link
                href={link("/live-auction")}
                onClick={onClose}
                className="group mt-4 flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-surface-2 p-2 transition-colors hover:border-line-strong"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                  <Img image={LIVE_EVENT.stream} alt="" sizes="64px" className="size-full object-cover" />
                </span>
                <span className="min-w-0">
                  <LiveBadge>{ui("liveNow")}</LiveBadge>
                  <span className="mt-1 line-clamp-2 kb-xs font-bold text-fg group-hover:text-primary">{t(LIVE_EVENT.title)}</span>
                  {current ? <span className="block truncate kb-2xs text-fg-3">{t(current.title)}</span> : null}
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
