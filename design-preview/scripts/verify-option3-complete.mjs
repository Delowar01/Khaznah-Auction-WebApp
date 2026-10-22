#!/usr/bin/env node
// Option 3 — complete customer website checks: every customer page of the
// selected master design and its documented states, in English and Arabic.
//
//   npm run build && npm run start            (serves on http://localhost:3100)
//   npm run verify:option3-complete -- [--base http://localhost:3100]
//       [--only global,cart] [--no-axe] [--verbose] [--shots DIR]
//
// Areas, one module each in scripts/option3/ (run in this order):
//   global     every Option 3 route: status, html lang and dir, one h1, one
//              main, skip link, no sideways scroll at 1920–320 px, no console
//              errors, no serious or critical axe findings
//   discovery  the approved pages and the seller storefront
//   cart, checkout, payment, account (9 tabs), auth, content (with the
//   404, loading and error states)
// `npm run verify:option3` (hero cards and the winner moment) stays as is.
// Exits 1 on any failure.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHarness } from "./option3/harness.mjs";

const AREAS = ["global", "discovery", "cart", "checkout", "payment", "account", "auth", "content"];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = opt("base", process.env.PREVIEW_URL || "http://localhost:3100");
const ONLY = opt("only", "")
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "option3");
const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
const h = createHarness({ browser, base: BASE, axe: !flag("no-axe"), verbose: flag("verbose"), shots: opt("shots", "") });

const started = Date.now();
for (const name of AREAS) {
  if (ONLY.length && !ONLY.includes(name)) continue;
  const file = path.join(dir, `${name}.mjs`);
  if (!fs.existsSync(file)) {
    h.section(name);
    h.check(`${name}: area module present`, false, `missing scripts/option3/${name}.mjs`);
    continue;
  }
  const { default: run } = await import(pathToFileURL(file).href);
  h.section(name);
  const before = { ...h.stats };
  try {
    await run(h);
  } catch (error) {
    h.check(`${name}: area ran to the end`, false, String(error?.stack || error).slice(0, 400));
  }
  console.log(`   ${name}: ${h.stats.pass - before.pass} passed, ${h.stats.fail - before.fail} failed`);
}
await browser.close();

const seconds = Math.round((Date.now() - started) / 1000);
console.log(`\n${h.stats.pass + h.stats.fail} checks: ${h.stats.pass} passed, ${h.stats.fail} failed (${seconds}s)`);
if (h.stats.failures.length) {
  console.log("\nFailures:");
  for (const line of h.stats.failures) console.log(`  ${line}`);
}
process.exit(h.stats.fail ? 1 : 0);
