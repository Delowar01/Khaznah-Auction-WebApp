"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { getProduct } from "@/lib/catalog";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame, PlateImage } from "../ui/Frame";

function Tile({ caption, children }) {
  const { t } = useLang();
  return (
    <figure className="flex flex-col rounded-md border border-line bg-surface">
      <div className="relative flex min-h-56 flex-1 items-center justify-center overflow-hidden p-8">{children}</div>
      <figcaption className="border-t border-line px-5 py-4 text-sm font-medium text-fg">{t(caption)}</figcaption>
    </figure>
  );
}

/** The three brand-derived motifs: diamond, 62° chamfer, square-Kufic grid. */
export function GeometryBoard() {
  const lamp = getProduct("task-lamp");
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Tile caption={COPY.sysDiamond}>
        <div className="flex items-center gap-7">
          <Logo variant="mark" decorative className="c-logo h-24 w-auto" />
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-4 text-primary">
              <Diamond size={5} />
              <Diamond size={8} />
              <Diamond size={12} className="text-accent" />
            </div>
            <div className="flex items-center gap-4">
              <Diamond variant="outline" size={12} className="text-fg-2" />
              <Diamond variant="live" size={12} />
            </div>
          </div>
        </div>
      </Tile>
      <Tile caption={COPY.sysChamfer}>
        <ChamferFrame size="lg" gold className="w-40">
          <PlateImage image={lamp.images[0]} alt="" sizes="160px" zoom={false} className="aspect-square" />
        </ChamferFrame>
      </Tile>
      <Tile caption={COPY.sysGrid}>
        <span className="c-gridlines" style={{ "--grid": "1.5rem", "--grid-mask": "radial-gradient(closest-side, black 55%, transparent)" }} />
        <Logo variant="wordmark-ar" decorative className="c-logo relative h-14 w-auto" />
      </Tile>
    </div>
  );
}
