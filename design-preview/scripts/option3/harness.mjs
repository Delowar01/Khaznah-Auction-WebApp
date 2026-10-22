// Shared helpers for scripts/verify-option3-complete.mjs. Each area module
// in this folder (cart.mjs, checkout.mjs, …) exports a default
// `async function run(h)` that uses the harness below:
//
//   h.check(name, ok, detail)        record a PASS / FAIL
//   h.open(lang, path, options)      a fresh browser context on an Option 3
//                                    page: { page, context, errors, status, close }
//   h.audit(page, label, { errors }) the page-wide checks: no sideways scroll,
//                                    one h1, html lang and dir, no console or
//                                    page errors, no serious or critical axe
//                                    findings (axe can be skipped with --no-axe)
//   h.overflow(page) / h.axe(page)   the individual measurements
//   h.mainText(page)                 the visible text of <main>
//   h.shot(page, name)               a screenshot when --shots is given
//   h.browser, h.baseline            the browser, and the --baseline server
//                                    (the regression area compares against it)
//   h.opt(name, fallback)            another command-line option (--widths …)
//
// Paths are Option 3 paths without the language and concept prefix
// ("/cart?state=empty"); `lang` is "en" or "ar".
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";

export const LANGS = ["en", "ar"];
export const REVIEW_WIDTHS = [1920, 1440, 1280, 1024, 768, 430, 390, 375, 320];
export const heightFor = (width) => (width < 768 ? 844 : width < 1024 ? 1024 : 900);

export function createHarness({ browser, base, baseline = "", axe = true, verbose = false, shots = "", opt = (name, fallback) => fallback }) {
  const stats = { pass: 0, fail: 0, failures: [] };
  let area = "";

  function section(name) {
    area = name;
    console.log(`\n== ${name}`);
  }

  function check(name, ok, detail = "") {
    const line = `${name}${detail ? `  (${detail})` : ""}`;
    if (ok) stats.pass += 1;
    else {
      stats.fail += 1;
      stats.failures.push(`[${area}] ${line}`);
    }
    if (!ok || verbose) console.log(`${ok ? "PASS" : "FAIL"}  ${line}`);
    return ok;
  }

  const url = (lang, route) => `${base}/${lang}/concept-c${route}`;

  /**
   * Options: width (1440), height, reducedMotion ("reduce"), signedOut (the
   * simulated session starts signed out in this tab), init (an extra init
   * script), wait (ms after load, 400).
   */
  async function open(lang, route, { width = 1440, height, reducedMotion = "reduce", signedOut = false, init, wait = 400 } = {}) {
    const context = await browser.newContext({ viewport: { width, height: height ?? heightFor(width) }, reducedMotion, deviceScaleFactor: 1 });
    await context.addInitScript(() => {
      try {
        localStorage.setItem("kz-pbar", "hidden");
      } catch {}
    });
    if (signedOut) {
      await context.addInitScript(() => {
        try {
          if (!sessionStorage.getItem("kz-test-init")) {
            sessionStorage.setItem("kz-test-init", "1");
            sessionStorage.setItem("kz-session", "out");
          }
        } catch {}
      });
    }
    if (init) await context.addInitScript(init);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    let status = 0;
    try {
      const response = await page.goto(url(lang, route), { waitUntil: "networkidle", timeout: 90000 });
      status = response?.status() ?? 0;
    } catch (error) {
      errors.push(`navigation: ${error.message}`);
    }
    await page.waitForTimeout(wait);
    return { page, context, errors, status, close: () => context.close() };
  }

  async function overflow(page) {
    return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  }

  async function axeFindings(page) {
    const result = await new AxeBuilder({ page }).disableRules(["region"]).analyze();
    return result.violations
      .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
      .map((violation) => `${violation.id} ×${violation.nodes.length}: ${violation.nodes.slice(0, 2).map((node) => node.target.join(" ")).join(" | ")}`);
  }

  async function audit(page, label, { errors = [], axe: runAxe = axe, h1 = 1 } = {}) {
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll("h1").length,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      main: document.querySelectorAll("main").length,
    }));
    const lang = page.url().includes("/ar/") ? "ar" : "en";
    check(`${label}: no sideways scroll`, info.overflow <= 1, info.overflow > 1 ? `${info.overflow}px` : "");
    if (h1 !== null) check(`${label}: one h1`, info.h1 === h1, `${info.h1}`);
    check(`${label}: one main landmark`, info.main === 1, `${info.main}`);
    check(`${label}: html lang and dir`, info.lang === lang && info.dir === (lang === "ar" ? "rtl" : "ltr"), `${info.lang}/${info.dir}`);
    check(`${label}: no console or page errors`, errors.length === 0, errors.slice(0, 2).join(" | ").slice(0, 240));
    if (runAxe) {
      const findings = await axeFindings(page);
      check(`${label}: no serious axe findings`, findings.length === 0, findings.slice(0, 3).join(" ; "));
    }
    return info;
  }

  async function mainText(page) {
    return page.evaluate(() => document.querySelector("main")?.innerText ?? "");
  }

  async function shot(page, name) {
    if (!shots) return;
    fs.mkdirSync(shots, { recursive: true });
    await page.screenshot({ path: path.join(shots, `${name}.png`), fullPage: true });
  }

  return { browser, base, baseline, opt, url, section, check, open, overflow, axe: axeFindings, audit, mainText, shot, stats, verbose, shots };
}
