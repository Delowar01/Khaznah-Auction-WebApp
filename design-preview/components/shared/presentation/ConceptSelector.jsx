import Link from "next/link";
import { ArrowRight, ArrowLeft, Languages, MonitorSmartphone, Layers, Smartphone } from "lucide-react";
import { CONCEPTS } from "@/data/concepts";
import { PAGES } from "@/lib/routes";
import { fill, tr } from "@/lib/i18n";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { S } from "./selector-copy";

const HOW_ICONS = [Layers, Languages, MonitorSmartphone];

const shot = (id, lang, kind) =>
  kind === "desktop"
    ? {
        kind: "scene",
        sources: [
          { src: `/images/concepts/${id}-${lang}-desktop-960.webp`, w: 960, h: 600 },
          { src: `/images/concepts/${id}-${lang}-desktop-1440.webp`, w: 1440, h: 900 },
        ],
      }
    : {
        kind: "scene",
        sources: [
          { src: `/images/concepts/${id}-${lang}-mobile-390.webp`, w: 390, h: 844 },
          { src: `/images/concepts/${id}-${lang}-mobile-780.webp`, w: 780, h: 1688 },
        ],
      };

function Preview({ concept, lang, name }) {
  const alt = fill(tr(S.previewAlt, lang), { id: concept.letter, name });
  return (
    <div className="relative overflow-hidden rounded-[18px] bg-[#0d1017] p-3 pb-0 sm:p-4 sm:pb-0">
      <div className="flex items-center gap-1.5 pb-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[10px] bg-[#1a1d26]">
        <Img
          image={shot(concept.id, lang, "desktop")}
          alt={alt}
          sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, 92vw"
          className="absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.015]"
        />
      </div>
      <div className="absolute bottom-4 end-5 w-[21%] min-w-[74px] overflow-hidden rounded-[16px] border-[4px] border-[#0d1017] bg-[#1a1d26] shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] sm:rounded-[22px] sm:border-[6px]">
        <div className="relative aspect-[390/844]">
          <Img image={shot(concept.id, lang, "mobile")} alt="" sizes="140px" className="absolute inset-0 size-full object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

function ConceptCard({ concept, lang, index }) {
  const name = tr(concept.name, lang);
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const base = `/${lang}/concept-${concept.id}`;
  return (
    <article className="kz-fade-up group flex flex-col rounded-[24px] border border-line bg-surface p-3 shadow-card sm:p-4" style={{ animationDelay: `${120 + index * 90}ms` }}>
      <Link href={base} tabIndex={-1} aria-hidden="true" className="block">
        <Preview concept={concept} lang={lang} name={name} />
      </Link>
      <div className="flex flex-1 flex-col px-2 pb-3 pt-7 sm:px-4 sm:pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-fg-3 rtl:text-[13px] rtl:normal-case rtl:tracking-normal">
              {tr(S.option, lang)} {concept.letter}
            </p>
            <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.01em] text-fg sm:text-[32px] rtl:tracking-normal" style={{ fontStretch: "112%" }}>
              {name}
            </h2>
          </div>
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-[20px] font-semibold text-on-secondary" style={{ fontStretch: "118%" }}>
            {concept.letter}
          </span>
        </div>
        <p className="mt-4 text-[17px] leading-relaxed text-fg rtl:text-[18px] rtl:leading-8">{tr(concept.oneLiner, lang)}</p>

        <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-fg-3 rtl:text-[13px] rtl:normal-case rtl:tracking-normal">{tr(S.philosophy, lang)}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-fg-2 rtl:leading-8">{tr(concept.philosophy, lang)}</p>
        </div>

        <div className="mt-5">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-fg-3 rtl:text-[13px] rtl:normal-case rtl:tracking-normal">{tr(S.characteristics, lang)}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {concept.traits.map((trait) => (
              <li key={trait.en} className="flex gap-2.5 text-[14px] leading-snug text-fg rtl:text-[15px] rtl:leading-7">
                <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rotate-45 bg-primary" />
                {tr(trait, lang)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
          <div className="flex items-center gap-2" aria-label={tr(S.palette, lang)} role="img">
            {concept.swatches.map((hex) => (
              <span key={hex} className="size-6 rounded-full border border-black/10" style={{ background: hex }} />
            ))}
          </div>
          <p className="min-w-0 text-[13px] text-fg-2">
            <span className="text-fg-3">{tr(S.typefaces, lang)}: </span>
            {tr(concept.type, lang)}
          </p>
        </div>

        <div className="mt-auto pt-7">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={base}
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-secondary px-6 text-[15px] font-semibold text-on-secondary transition-[background-color,transform] hover:bg-primary active:translate-y-px"
            >
              {fill(tr(S.explore, lang), { id: concept.letter })}
              <Arrow aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href={`/${lang}/preview?device=mobile&src=${encodeURIComponent(base)}`}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-[14px] font-medium text-fg transition-colors hover:border-fg"
            >
              <Smartphone aria-hidden="true" className="size-4" />
              {tr(S.mobile, lang)}
            </Link>
          </div>
          <nav aria-label={`${tr(S.screens, lang)} — ${name}`} className="mt-5">
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-fg-2">
              {PAGES.map((page) => (
                <li key={page.key}>
                  <Link href={`${base}${page.path}`} className="underline-offset-4 hover:text-fg hover:underline">
                    {tr(page.label, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </article>
  );
}

/** Cover page of the presentation: the four directions, side by side, unranked. */
export function ConceptSelector({ lang }) {
  const other = lang === "ar" ? "en" : "ar";
  return (
    <div className="min-h-dvh bg-bg">
      <header className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <Logo variant="lockup" className="h-9 w-auto sm:h-10" title={lang === "ar" ? "خزنة" : "Khazna"} />
        <nav aria-label={lang === "ar" ? "اللغة" : "Language"} className="flex items-center rounded-full border border-line-strong p-1 text-[13px] font-semibold">
          {["en", "ar"].map((code) => (
            <Link
              key={code}
              href={`/${code}`}
              hrefLang={code}
              lang={code}
              aria-current={code === lang ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 transition-colors ${code === lang ? "bg-secondary text-on-secondary" : "text-fg-2 hover:text-fg"}`}
            >
              {code === "en" ? "EN" : "العربية"}
            </Link>
          ))}
        </nav>
      </header>

      <main id="main">
        <section className="mx-auto max-w-[1320px] px-5 pb-14 pt-10 sm:px-8 sm:pt-16 lg:pb-20">
          <p className="kz-fade-up text-[12px] font-semibold uppercase tracking-[0.22em] text-fg-3 rtl:text-[14px] rtl:normal-case rtl:tracking-normal">{tr(S.eyebrow, lang)}</p>
          <h1
            className="kz-fade-up mt-5 max-w-5xl text-[42px] font-semibold leading-[1.02] tracking-[-0.025em] text-fg sm:text-[68px] lg:text-[84px] rtl:leading-[1.25] rtl:tracking-normal rtl:sm:text-[60px] rtl:lg:text-[72px]"
            style={{ fontStretch: "118%", animationDelay: "60ms" }}
          >
            {tr(S.title, lang)}
          </h1>
          <p className="kz-fade-up mt-7 max-w-3xl text-[17px] leading-relaxed text-fg-2 sm:text-[19px] rtl:leading-9" style={{ animationDelay: "120ms" }}>
            {tr(S.lead, lang)}
          </p>
          <ul className="kz-fade-up mt-8 flex flex-wrap gap-2" style={{ animationDelay: "180ms" }}>
            {S.facts.map((fact) => (
              <li key={fact.en} className="rounded-full border border-line-strong bg-surface px-4 py-2 text-[13px] font-medium text-fg">
                {tr(fact, lang)}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
          {CONCEPTS.map((concept, index) => (
            <ConceptCard key={concept.id} concept={concept} lang={lang} index={index} />
          ))}
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-[30px] font-semibold leading-tight text-fg sm:text-[36px]" style={{ fontStretch: "112%" }}>
                {tr(S.howTitle, lang)}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-fg-2 rtl:leading-8">{tr(S.interactive, lang)}</p>
            </div>
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
              {S.how.map((step, i) => {
                const Icon = HOW_ICONS[i];
                return (
                  <li key={step.title.en} className="rounded-[20px] border border-line bg-surface p-6">
                    <Icon aria-hidden="true" className="size-6 text-primary" strokeWidth={1.5} />
                    <h3 className="mt-5 text-[17px] font-semibold text-fg">{tr(step.title, lang)}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-fg-2 rtl:text-[15px] rtl:leading-7">{tr(step.text, lang)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-fg-3 rtl:text-[13px] rtl:normal-case rtl:tracking-normal">{tr(S.credits, lang)}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-2 rtl:leading-7">{tr(S.creditsText, lang)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-[13px] text-fg-2">
            <span>{tr(S.prepared, lang)}</span>
            <Link href={`/${other}`} hrefLang={other} lang={other} className="font-semibold text-fg underline-offset-4 hover:underline">
              {other === "ar" ? "العربية" : "English"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
