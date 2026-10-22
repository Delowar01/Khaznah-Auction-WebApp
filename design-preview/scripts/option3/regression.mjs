// The five approved pages (home, Browse, Auction detail, Live auction,
// Product) against the baseline server — the frozen commit — in English and
// Arabic at the review widths:
//   1. pixel by pixel, full page (photos and ticking countdowns masked in
//      both, as boxes that still move with the layout);
//   2. by structure: landmarks, headings, links and buttons. The footer is
//      compared separately: its labels and order stay the same, and its
//      placeholder links now open the new pages (FOOTER_TARGETS).
// Runs only with --baseline URL; --widths limits the widths and --out DIR
// saves a diff image (changed pixels in red) for any page that differs.
import fs from "node:fs";
import path from "node:path";
import { LANGS, REVIEW_WIDTHS, heightFor } from "./harness.mjs";

const PAGES = [
  ["home", ""],
  ["browse", "/browse"],
  ["auction", "/auction"],
  ["live", "/live-auction"],
  ["product", "/product"],
];

// Footer destinations after the website was completed (label → path after /{lang}/concept-c).
const FOOTER_TARGETS = {
  en: { "How it works": "/how-it-works", "Condition grades": "/#grades", "Delivery & pickup": "/contact", Contact: "/contact", "About Khaznah": "/about", "Sell on Khaznah": "/seller/register", Terms: "/terms", Privacy: "/privacy" },
  ar: { "كيف تعمل خزنة": "/how-it-works", "درجات الحالة": "/#grades", "التوصيل والاستلام": "/contact", "تواصل معنا": "/contact", "عن خزنة": "/about", "البيع عبر خزنة": "/seller/register", الشروط: "/terms", الخصوصية: "/privacy" },
};

// Countdowns ("08m 58s", "2h 05m", "3 ي 4 س") and the live lot clock ("1:42").
const TICKING = /^(\d+\s?[dhmsيسدث]\s\d+\s?[dhmsيسدث]|\d+:\d{2})$/;
const TICKING_IN_TEXT = /\b\d+\s?[dhmsيسدث]\s\d+\s?[dhmsيسدث]\b|\b\d+:\d{2}\b/g;

async function capture(h, server, lang, route, width) {
  const context = await h.browser.newContext({ viewport: { width, height: heightFor(width) }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  await context.addInitScript(() => {
    Math.random = () => 0.99;
    try {
      localStorage.setItem("kz-pbar", "hidden");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(`${server}/${lang}/concept-c${route}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1200);
  // Photos are masked: Chromium may draw a cached, sharper size of the same
  // picture from one load to the next, or a lazy one may still be loading
  // (measured: the frozen commit differs from itself by up to 1.6% in
  // photos). Each picture becomes a flat box of its own size and place, so
  // a moved or resized picture is still caught.
  await page.addStyleTag({
    content: ".kz-pbar-show{display:none!important}*{caret-color:transparent!important}img{object-position:-99999px -99999px!important;background:#ff00ff!important}",
  });
  const png = await page.screenshot({ fullPage: true, animations: "disabled", mask: [page.getByText(TICKING)], maskColor: "#ff00ff" });
  const outline = await page.evaluate((ticking) => {
    const re = new RegExp(ticking, "g");
    const name = (el) => (el.getAttribute("aria-label") || el.innerText || "").replace(re, "#").replace(/\s+/g, " ").trim().slice(0, 90);
    const outside = (el) => !el.closest("footer");
    const all = (selector) => [...document.querySelectorAll(selector)];
    return {
      landmarks: all("header, nav, main, footer, aside, [role=region], [role=dialog], section[aria-label], section[aria-labelledby]").map((el) => `${el.tagName.toLowerCase()}${el.getAttribute("aria-label") ? ` "${el.getAttribute("aria-label")}"` : ""}`),
      headings: all("h1, h2, h3, h4").map((el) => `${el.tagName.toLowerCase()} ${name(el)}`),
      links: all("a[href]").filter(outside).map((el) => `${name(el)} → ${el.getAttribute("href")}`),
      buttons: all("button").filter(outside).map((el) => name(el)),
      footer: all("footer a[href], footer button").map((el) => ({ label: name(el), href: el.getAttribute("href") })),
    };
  }, TICKING_IN_TEXT.source);
  await context.close();
  return { png, outline };
}

function listDiff(a, b) {
  const count = (list) => list.reduce((map, item) => map.set(item, (map.get(item) || 0) + 1), new Map());
  const ca = count(a);
  const cb = count(b);
  const removed = [...ca].filter(([item, n]) => (cb.get(item) || 0) < n).map(([item]) => item);
  const added = [...cb].filter(([item, n]) => (ca.get(item) || 0) < n).map(([item]) => item);
  return { removed, added, same: removed.length === 0 && added.length === 0 && a.join("\n") === b.join("\n") };
}

export default async function regression(h) {
  if (!h.baseline) {
    console.log("   (skipped: pass --baseline URL to compare the approved pages with the frozen commit)");
    return;
  }
  const widths = h
    .opt("widths", REVIEW_WIDTHS.join(","))
    .split(",")
    .map(Number)
    .filter(Boolean);
  const out = h.opt("out", "");
  if (out) fs.mkdirSync(out, { recursive: true });
  const compare = await (await h.browser.newContext()).newPage();

  for (const [key, route] of PAGES) {
    for (const lang of LANGS) {
      for (const width of widths) {
        const label = `${key} ${lang} ${width}`;
        const before = await capture(h, h.baseline, lang, route, width);
        const after = await capture(h, h.base, lang, route, width);
        const result = await compare.evaluate(
          async ([a, b, wantDiff]) => {
            const load = (src) =>
              new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
              });
            const [ia, ib] = await Promise.all([load(a), load(b)]);
            if (ia.width !== ib.width || ia.height !== ib.height) return { sameSize: false, a: `${ia.width}×${ia.height}`, b: `${ib.width}×${ib.height}` };
            const pixels = (img) => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d", { willReadFrequently: true });
              ctx.drawImage(img, 0, 0);
              return ctx.getImageData(0, 0, img.width, img.height);
            };
            const da = pixels(ia);
            const db = pixels(ib);
            let diff = 0;
            let first = -1;
            let last = -1;
            const marks = wantDiff ? new Uint8ClampedArray(da.data) : null;
            for (let i = 0; i < da.data.length; i += 4) {
              const delta = Math.abs(da.data[i] - db.data[i]) + Math.abs(da.data[i + 1] - db.data[i + 1]) + Math.abs(da.data[i + 2] - db.data[i + 2]);
              if (delta > 24) {
                diff += 1;
                const y = Math.floor(i / 4 / ia.width);
                if (first < 0) first = y;
                last = y;
                if (marks) {
                  marks[i] = 255;
                  marks[i + 1] = 0;
                  marks[i + 2] = 0;
                  marks[i + 3] = 255;
                }
              } else if (marks) marks[i + 3] = 70;
            }
            let image = "";
            if (marks && diff) {
              const canvas = document.createElement("canvas");
              canvas.width = ia.width;
              canvas.height = ia.height;
              canvas.getContext("2d").putImageData(new ImageData(marks, ia.width, ia.height), 0, 0);
              image = canvas.toDataURL("image/png");
            }
            return { sameSize: true, diff, total: ia.width * ia.height, first, last, image };
          },
          [`data:image/png;base64,${before.png.toString("base64")}`, `data:image/png;base64,${after.png.toString("base64")}`, Boolean(out)],
        );
        if (!result.sameSize) {
          h.check(`${label}: same page size as the frozen commit`, false, `${result.a} → ${result.b}`);
        } else {
          const share = result.diff / result.total;
          h.check(`${label}: pixels match the frozen commit`, share <= 0.0001, result.diff ? `${result.diff} px (${(share * 100).toFixed(4)}%) in rows ${result.first}–${result.last}` : "");
          if (result.image) fs.writeFileSync(path.join(out, `diff-${key}-${lang}-${width}.png`), Buffer.from(result.image.split(",")[1], "base64"));
        }
        if (out && (!result.sameSize || result.diff)) {
          fs.writeFileSync(path.join(out, `before-${key}-${lang}-${width}.png`), before.png);
          fs.writeFileSync(path.join(out, `after-${key}-${lang}-${width}.png`), after.png);
        }

        for (const part of ["landmarks", "headings", "links", "buttons"]) {
          const d = listDiff(before.outline[part], after.outline[part]);
          h.check(`${label}: ${part} unchanged`, d.same, [...d.removed.map((item) => `- ${item}`), ...d.added.map((item) => `+ ${item}`)].slice(0, 4).join(" ; "));
        }
        const labels = (list) => list.map((item) => item.label);
        h.check(`${label}: footer labels and order unchanged`, labels(before.outline.footer).join("|") === labels(after.outline.footer).join("|"));
        // (Next's links drop the slash before a hash: /en/concept-c#grades.)
        const wrong = Object.entries(FOOTER_TARGETS[lang]).filter(([name, target]) => {
          const item = after.outline.footer.find((entry) => entry.label === name);
          return !item || item.href !== `/${lang}/concept-c${target}`.replace("/#", "#");
        });
        h.check(`${label}: footer links open the new pages`, wrong.length === 0, wrong.map(([name]) => name).join(", "));
      }
    }
  }
  await compare.context().close();
}
