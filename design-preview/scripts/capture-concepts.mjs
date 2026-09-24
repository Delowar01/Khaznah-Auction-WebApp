// Captures the home page of each concept (desktop + mobile, EN + AR) for the
// concept selector's preview cards. Run against a production server:
//   npm run build && npm start            (port 3100)
//   node scripts/capture-concepts.mjs --base http://localhost:3100
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : fallback;
};

const BASE = arg("--base", "http://localhost:3100");
const CONCEPTS = arg("--concepts", "a,b,c,d").split(",");
const LANGS = arg("--langs", "en,ar").split(",");
const OUT = path.join(process.cwd(), "public/images/concepts");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function shoot(url, viewport, scale, mobile) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  const buffer = await page.screenshot({ type: "png" });
  await context.close();
  return buffer;
}

for (const concept of CONCEPTS) {
  for (const lang of LANGS) {
    const url = `${BASE}/${lang}/concept-${concept}?embed=1`;
    const desktop = await shoot(url, { width: 1440, height: 900 }, 1, false);
    for (const width of [1440, 960]) {
      await sharp(desktop).resize(width).webp({ quality: 82 }).toFile(path.join(OUT, `${concept}-${lang}-desktop-${width}.webp`));
    }
    const mobile = await shoot(url, { width: 390, height: 844 }, 2, true);
    for (const width of [780, 390]) {
      await sharp(mobile).resize(width).webp({ quality: 82 }).toFile(path.join(OUT, `${concept}-${lang}-mobile-${width}.webp`));
    }
    console.log(`captured ${concept} ${lang}`);
  }
}

await browser.close();
