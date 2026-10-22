// Content and support pages (About, How it works, FAQ, Contact, Privacy,
// Terms), the branded 404, the loading and error boundaries, /live and the
// Components & states page: production's copy word for word, the help
// navigation and phone menu, FAQ search and accordion (mouse and keyboard),
// the contact form's rules, API-driven details and results, the policy
// reading view (section list, plain-text email, print), and no sideways
// scroll on phones.
const HELP = ["/about", "/how-it-works", "/faq", "/contact", "/privacy", "/terms"];

const COPY = {
  en: {
    helpNav: "Help and company",
    about: ["Saudi Arabia's Trusted", "Auction House"],
    how: ["From Browsing to", "Ownership in Minutes"],
    contactHero: ["We're Here to", "Help You"],
    privacy: ["Your Privacy", "Matters to Us"],
    terms: ["Using Khaznah", "Your Agreement Matters"],
    updated: "Last updated: January 2025",
    privacy1: "1. Information We Collect",
    privacy6: "6. PDPL Compliance",
    terms7: "7. Limitation of Liability",
    terms7Body: "Khaznah provides the platform 'as is' and does not guarantee the accuracy of lot descriptions beyond our inspection and grading.",
    question: "What is Khaznah?",
    answer: "Khaznah is a professional online auction platform based in Saudi Arabia that sells open-box, returned, and surplus goods through dynamic timed auctions and fixed-price buy-now.",
    match: "AUCTION",
    noMatch: "zzzz",
    noResults: "No results found",
    clear: "Clear search",
    send: "Send Message",
    sending: "Sending...",
    sent: "Message sent successfully!",
    useForm: "Use the form below",
    viaWhatsApp: "Message us on WhatsApp",
    whatsapp: "Chat with us on WhatsApp",
    prefill: "Hello Khazna support, I need help with…",
    address: "Riyadh, Saudi Arabia",
    hours: "Sun–Thu 9:00 AM – 6:00 PM",
    invalidEmail: "Enter a valid email address.",
    notFound: "We couldn’t find that page",
    somethingWrong: "Something went wrong",
    tryAgain: "Try again",
    auctionError: "We could not refresh this auction",
    loading: "Loading",
    loadingAuction: "Loading auction",
    openMenu: "Open menu",
    sample: "Sample contact details",
  },
  ar: {
    helpNav: "المساعدة والشركة",
    about: ["دار المزادات الموثوقة في", "المملكة"],
    how: ["من التصفح إلى", "التملك في دقائق"],
    contactHero: ["نحن هنا", "لمساعدتك"],
    privacy: ["خصوصيتك", "تهمنا"],
    terms: ["استخدام خزنة", "اتفاقك مهم"],
    updated: "آخر تحديث: يناير 2025",
    privacy1: "١. المعلومات التي نجمعها",
    privacy6: "٦. الامتثال للائحة حماية البيانات الشخصية",
    terms7: "٧. حدود المسؤولية",
    terms7Body: "تقدم خزنة المنصة 'كما هي' ولا تضمن دقة أوصاف المنتجات بما يتجاوز الفحص والتصنيف الخاص بنا.",
    question: "ما هي خزنة؟",
    answer: "خزنة هي منصة مزادات احترافية في المملكة العربية السعودية تبيع المنتجات المفتوحة والمرتجعة والفائضة من خلال مزادات زمنية ديناميكية وشراء فوري بأسعار ثابتة.",
    match: "مزادات",
    noMatch: "zzzz",
    noResults: "لم يتم العثور على نتائج",
    clear: "مسح البحث",
    send: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    sent: "تم إرسال الرسالة بنجاح!",
    useForm: "استخدم النموذج أدناه",
    viaWhatsApp: "راسلنا على واتساب",
    whatsapp: "تحدث معنا عبر واتساب",
    prefill: "مرحباً دعم خزنة، أحتاج مساعدة في…",
    address: "الرياض، المملكة العربية السعودية",
    hours: "الأحد–الخميس 9:00 صباحاً – 6:00 مساءً",
    invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",
    notFound: "لم نعثر على هذه الصفحة",
    somethingWrong: "حدث خطأ ما",
    tryAgain: "حاول مرة أخرى",
    auctionError: "تعذّر تحديث هذا المزاد",
    loading: "جارٍ التحميل",
    loadingAuction: "جارٍ تحميل المزاد",
    openMenu: "فتح القائمة",
    sample: "بيانات تواصل نموذجية",
  },
};

const text = (page, selector = "main") => page.evaluate((s) => document.querySelector(s)?.innerText ?? "", selector);
const hrefs = (locator) => locator.evaluateAll((links) => links.map((a) => a.getAttribute("href")));

async function helpNav(h, page, lang, current, label) {
  const c = COPY[lang];
  const nav = page.getByRole("navigation", { name: c.helpNav });
  const links = await hrefs(nav.getByRole("link"));
  h.check(`${label}: help navigation lists the six pages`, HELP.every((path, i) => links[i] === `/${lang}/concept-c${path}`), links.join(" "));
  const here = await nav.locator('[aria-current="page"]').getAttribute("href");
  h.check(`${label}: help navigation marks this page`, here === `/${lang}/concept-c${current}`, here);
}

async function headline(h, page, lines, label) {
  const h1 = (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim();
  h.check(`${label}: production headline`, h1 === `${lines[0]} ${lines[1]}`, h1);
}

export default async function content(h) {
  for (const lang of ["en", "ar"]) {
    const c = COPY[lang];

    // About
    {
      const { page, errors, close } = await h.open(lang, "/about");
      await headline(h, page, c.about, `${lang} about`);
      await helpNav(h, page, lang, "/about", `${lang} about`);
      const body = await text(page);
      h.check(`${lang} about: production figures kept as written`, ["2024", "25K+", "3", "10K+"].every((value) => body.includes(value)));
      const links = await hrefs(page.locator("main a"));
      h.check(`${lang} about: hero and closing links as production`, ["/browse", "/how-it-works", "/register"].every((path) => links.includes(`/${lang}/concept-c${path}`)));
      h.check(`${lang} about: trust strip, seven marks`, (await page.getByRole("region", { name: lang === "en" ? "Payment and trust marks" : "علامات الدفع والثقة" }).locator("li").count()) === 7);
      await h.audit(page, `${lang} about`, { errors });
      await close();
    }

    // How it works
    {
      const { page, errors, close } = await h.open(lang, "/how-it-works");
      await headline(h, page, c.how, `${lang} how it works`);
      await helpNav(h, page, lang, "/how-it-works", `${lang} how it works`);
      const links = await hrefs(page.locator("main a"));
      h.check(
        `${lang} how it works: the three ways to buy link to their pages`,
        ["/browse?tab=auction", "/browse?tab=buy_now", "/live-auction"].every((path) => links.includes(`/${lang}/concept-c${path}`)),
      );
      h.check(`${lang} how it works: five steps`, (await page.getByTestId("steps").locator(":scope > li").count()) === 5);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
      });
      await page.waitForFunction(() => [...document.querySelectorAll("main img")].every((img) => img.complete), null, { timeout: 30000 }).catch(() => {});
      const images = await page.evaluate(() => [...document.querySelectorAll("main img")].map((img) => ({ src: img.currentSrc || img.src, ok: img.complete && img.naturalWidth > 0 })));
      h.check(`${lang} how it works: approved Khaznah photography only (no hot-linked stock)`, images.length >= 6 && images.every((img) => new URL(img.src).pathname.startsWith("/images/work/") && new URL(img.src).host === new URL(h.base).host), images.map((img) => img.src).join(" ").slice(0, 200));
      h.check(`${lang} how it works: every picture loads`, images.every((img) => img.ok));
      await h.audit(page, `${lang} how it works`, { errors });
      await close();
    }

    // FAQ
    {
      const { page, errors, close } = await h.open(lang, "/faq");
      await headline(h, page, c.contactHero, `${lang} faq (production reuses the Contact hero)`);
      await helpNav(h, page, lang, "/faq", `${lang} faq`);
      const question = page.getByRole("button", { name: c.question });
      h.check(`${lang} faq: one question, closed at first`, (await page.locator("[data-faq-question]").count()) === 1 && (await question.getAttribute("aria-expanded")) === "false");
      await question.click();
      const panel = page.getByRole("region", { name: c.question });
      h.check(`${lang} faq: opens with production's answer`, (await question.getAttribute("aria-expanded")) === "true" && (await panel.innerText()).trim() === c.answer);
      await question.press("Enter");
      h.check(`${lang} faq: Enter closes it`, (await question.getAttribute("aria-expanded")) === "false" && !(await panel.isVisible()));
      await question.press(" ");
      h.check(`${lang} faq: Space opens it`, (await question.getAttribute("aria-expanded")) === "true");
      const search = page.locator("main").getByRole("searchbox");
      h.check(`${lang} faq: search has a label`, (await search.getAttribute("id")) !== null && (await page.locator(`label[for="${await search.getAttribute("id")}"]`).count()) === 1);
      await search.fill(c.match);
      h.check(`${lang} faq: case-insensitive match in the answer`, (await page.locator("[data-faq-question]").count()) === 1);
      await search.fill(c.noMatch);
      h.check(`${lang} faq: no results`, (await text(page)).includes(c.noResults));
      await page.getByRole("button", { name: c.clear }).click();
      h.check(`${lang} faq: Clear search brings the question back`, (await page.locator("[data-faq-question]").count()) === 1 && (await search.inputValue()) === "");
      await h.audit(page, `${lang} faq`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/faq?state=no-results");
      h.check(`${lang} faq no-results state`, (await text(page)).includes(c.noResults) && (await page.locator("[data-faq-question]").count()) === 0);
      await h.audit(page, `${lang} faq no-results`, { errors, axe: false });
      await close();
    }

    // Contact
    {
      const { page, errors, close } = await h.open(lang, "/contact");
      await headline(h, page, c.contactHero, `${lang} contact`);
      await helpNav(h, page, lang, "/contact", `${lang} contact`);
      const email = page.getByTestId("contact-email").locator("a");
      const phone = page.getByTestId("contact-phone").locator("a");
      h.check(`${lang} contact: email from the API, as a mailto link`, (await email.getAttribute("href")) === "mailto:support@khaznah.com");
      h.check(`${lang} contact: phone from the API, spaces removed for tel:`, (await phone.getAttribute("href")) === "tel:+966110000000");
      const whatsapp = page.getByRole("link", { name: c.whatsapp }).first();
      const wa = await whatsapp.getAttribute("href");
      h.check(`${lang} contact: WhatsApp button with production's prefill`, wa === `https://wa.me/966110000000?text=${encodeURIComponent(c.prefill)}` && (await whatsapp.getAttribute("target")) === "_blank", wa);
      h.check(`${lang} contact: address and hours fixed, as production`, (await page.getByTestId("contact-address").innerText()).includes(c.address) && (await page.getByTestId("contact-hours").innerText()).includes(c.hours));
      await email.click();
      h.check(`${lang} contact: sample details say so instead of opening an app`, (await page.getByText(c.sample).first().isVisible()) && page.url().includes("/contact"));

      const submit = page.getByTestId("contact-submit");
      await submit.click();
      const invalid = await page.locator('#contact-form [aria-invalid="true"]').count();
      const focused = await page.evaluate(() => document.activeElement?.getAttribute("name"));
      h.check(`${lang} contact: empty send marks all four fields and focuses the first`, invalid === 4 && focused === "name", `${invalid} ${focused}`);
      await page.locator('#contact-form [name="name"]').fill("Sara");
      await page.locator('#contact-form [name="email"]').fill("sara@");
      await page.locator('#contact-form [name="subject"]').fill("Pickup");
      await page.locator('#contact-form [name="message"]').fill("Hello");
      await submit.click();
      h.check(`${lang} contact: a malformed email is caught`, (await page.locator('#contact-form [name="email"]').getAttribute("aria-invalid")) === "true" && (await text(page, "#contact-form")).includes(c.invalidEmail));
      await page.locator('#contact-form [name="email"]').fill("sara@example.com");
      await submit.click();
      h.check(`${lang} contact: Sending... while it runs`, (await submit.isDisabled()) && (await submit.innerText()).includes(c.sending));
      await page.getByTestId("contact-result").getByText(c.sent).waitFor({ timeout: 5000 });
      h.check(`${lang} contact: sent — form cleared`, (await page.locator('#contact-form [name="name"]').inputValue()) === "" && (await page.locator('#contact-form [name="message"]').inputValue()) === "");
      await page.locator('#contact-form [name="name"]').fill("   ");
      await page.locator('#contact-form [name="email"]').fill("sara@example.com");
      await page.locator('#contact-form [name="subject"]').fill("Pickup");
      await page.locator('#contact-form [name="message"]').fill("Hello");
      await submit.click();
      await page.getByTestId("contact-result").getByText("Name: Name is required.").waitFor({ timeout: 5000 });
      const kept = await page.locator('#contact-form [name="message"]').inputValue();
      const serverLang = await page.getByTestId("contact-result").locator('[lang="en"]').count();
      h.check(`${lang} contact: the server's English message, values kept`, kept === "Hello" && serverLang === 1);
      await h.audit(page, `${lang} contact`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/contact?state=unconfigured");
      const email = page.getByTestId("contact-email").locator("a");
      const phone = page.getByTestId("contact-phone").locator("a");
      h.check(
        `${lang} contact unconfigured: production's fallbacks point at the form`,
        (await email.innerText()).trim() === c.useForm && (await email.getAttribute("href")) === "#contact-form" && (await phone.innerText()).trim() === c.viaWhatsApp && (await phone.getAttribute("href")) === "#contact-form",
      );
      h.check(`${lang} contact unconfigured: no WhatsApp button`, (await page.getByRole("link", { name: c.whatsapp }).count()) === 0);
      await page.locator('#contact-form [name="name"]').fill("Sara");
      await page.locator('#contact-form [name="email"]').fill("sara@example.com");
      await page.locator('#contact-form [name="subject"]').fill("Pickup");
      await page.locator('#contact-form [name="message"]').fill("Hello");
      await page.getByTestId("contact-submit").click();
      await page.getByTestId("contact-result").getByText("Support email is not configured. Please contact us on WhatsApp.").waitFor({ timeout: 5000 });
      h.check(`${lang} contact unconfigured: sending fails as production's backend does (503)`, true);
      await h.audit(page, `${lang} contact unconfigured`, { errors, axe: false });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/contact?state=error");
      const result = await text(page, '[data-testid="contact-result"]');
      h.check(`${lang} contact error state: throttle message, values kept`, result.includes("Request was throttled.") && (await page.locator('#contact-form [name="email"]').inputValue()) === "sara@example.com");
      await h.audit(page, `${lang} contact error`, { errors });
      await close();
    }
    {
      const { page, errors, close } = await h.open(lang, "/contact?state=sent");
      h.check(`${lang} contact sent state`, (await text(page, '[data-testid="contact-result"]')).includes(c.sent) && (await page.locator('#contact-form [name="name"]').inputValue()) === "");
      await h.audit(page, `${lang} contact sent`, { errors, axe: false });
      await close();
    }

    // Privacy and Terms
    for (const kind of ["privacy", "terms"]) {
      const { page, errors, close } = await h.open(lang, `/${kind}`);
      await headline(h, page, c[kind], `${lang} ${kind}`);
      await helpNav(h, page, lang, `/${kind}`, `${lang} ${kind}`);
      const body = await text(page);
      h.check(`${lang} ${kind}: "Last updated" kept as production`, body.includes(c.updated));
      const headings = await page.locator("article h2").allInnerTexts();
      const count = kind === "privacy" ? 6 : 7;
      h.check(`${lang} ${kind}: ${count} numbered sections, verbatim`, headings.length === count + 1 && (kind === "privacy" ? headings[0] === c.privacy1 && headings[5] === c.privacy6 : headings[6] === c.terms7), headings.join(" | ").slice(0, 160));
      if (kind === "terms") h.check(`${lang} terms: section 7 text verbatim`, body.includes(c.terms7Body));
      const list = await hrefs(page.locator("nav details a"));
      h.check(`${lang} ${kind}: section list links every section`, list.length === count && list.every((href, i) => href === `#${kind}-${i + 1}`));
      h.check(`${lang} ${kind}: email stays plain text, isolated left-to-right`, (await page.locator('article a[href^="mailto:"]').count()) === 0 && (await page.locator('article bdi[dir="ltr"]').count()) >= 1);
      await page.emulateMedia({ media: "print" });
      const printed = await page.evaluate(() => ({
        header: getComputedStyle(document.querySelector('header [data-ref="01"]').closest("header")).display,
        footer: getComputedStyle(document.querySelector('[data-ref="13"]')).display,
        nav: getComputedStyle(document.querySelector("nav.vd-print-hide") ?? document.body).display,
        article: getComputedStyle(document.querySelector("article")).display,
      }));
      h.check(`${lang} ${kind}: prints as a document (no masthead, footer or navigation)`, printed.header === "none" && printed.footer === "none" && printed.nav === "none" && printed.article !== "none", JSON.stringify(printed));
      await page.emulateMedia({ media: "screen" });
      await h.audit(page, `${lang} ${kind}`, { errors });
      await close();
    }

    // 404
    for (const route of ["/orders/1", "/account/orders/1", "/seller/NOPE", "/no/such/page"]) {
      const { page, errors, status, close } = await h.open(lang, route);
      await page.getByTestId("not-found").waitFor({ timeout: 15000 }).catch(() => {});
      const noindex = await page.locator('meta[name="robots"][content*="noindex"]').count();
      h.check(`${lang} 404 ${route}: branded page`, (await page.getByTestId("not-found").count()) === 1 && (await page.locator("h1").innerText()).trim() === c.notFound);
      h.check(`${lang} 404 ${route}: 404 status or noindex`, status === 404 || noindex > 0, `status ${status}`);
      if (route === "/orders/1") await h.audit(page, `${lang} 404`, { errors: errors.filter((e) => !/404|Not Found/i.test(e)) });
      await close();
    }

    // /live: production redirects to Browse's live tab
    {
      const { page, close } = await h.open(lang, "/live", { wait: 1500 });
      h.check(`${lang} /live redirects to Browse's live tab`, page.url().endsWith(`/${lang}/concept-c/browse?tab=live`), page.url());
      await close();
    }

    // Components & states, the boundaries' presentation and the real error page
    {
      const { page, errors, close } = await h.open(lang, "/system");
      const body = await text(page);
      h.check(`${lang} system: loading boundaries with production's labels`, (await page.getByTestId("main-loading").getByRole("status").innerText()).trim() === c.loading && (await page.getByTestId("auction-loading").getByRole("status").innerText()).trim() === c.loadingAuction);
      h.check(`${lang} system: page, auction and seller errors and the 404`, body.includes(c.somethingWrong) && body.includes(c.auctionError) && (await page.getByTestId("not-found").count()) === 1);
      const opener = page.getByRole("button", { name: lang === "en" ? "Open a dialog" : "افتح نافذة" });
      await opener.click();
      await page.getByTestId("system-dialog").waitFor();
      await page.keyboard.press("Escape");
      await page.getByTestId("system-dialog").waitFor({ state: "detached" }).catch(() => {});
      await page.waitForTimeout(200);
      const back = await page.evaluate(() => document.activeElement?.textContent ?? "");
      h.check(`${lang} system: dialog closes with Escape and returns focus`, (await page.getByTestId("system-dialog").count()) === 0 && back.includes(lang === "en" ? "Open a dialog" : "افتح نافذة"));
      const index = await hrefs(page.locator("#index a"));
      h.check(`${lang} system: index links every preview state`, index.includes(`/${lang}/concept-c/cart?state=empty`) && index.includes(`/${lang}/concept-c/faq?state=no-results`) && index.includes(`/${lang}/concept-c/contact?state=unconfigured`));
      await h.audit(page, `${lang} system`, { errors });
      await close();
    }
    {
      const { page, close } = await h.open(lang, "/system?state=crash", { wait: 1500 });
      await page.getByRole("button", { name: c.tryAgain }).first().waitFor({ timeout: 10000 }).catch(() => {});
      h.check(`${lang} error page: replaces the failed page with retry and home`, (await page.locator("h1").innerText()).trim() === c.somethingWrong && (await page.getByRole("button", { name: c.tryAgain }).count()) >= 1 && (await hrefs(page.locator("main a"))).includes(`/${lang}/concept-c`));
      await close();
    }
  }

  // Phone menu: the six help pages, as production's phone menu.
  for (const lang of ["en", "ar"]) {
    const { page, close } = await h.open(lang, "", { width: 390 });
    await page.getByRole("button", { name: COPY[lang].openMenu }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const links = await hrefs(dialog.getByRole("link"));
    h.check(`${lang} phone menu: the six help and company pages`, HELP.every((path) => links.includes(`/${lang}/concept-c${path}`)));
    await close();
  }

  // Phones and tablets: no sideways scroll, purposeful layouts.
  for (const [lang, width] of [
    ["en", 390],
    ["ar", 390],
    ["en", 320],
    ["ar", 320],
    ["ar", 768],
    ["en", 1024],
  ]) {
    for (const route of ["/about", "/how-it-works", "/faq", "/contact", "/privacy", "/terms", "/orders/1", "/system"]) {
      const { page, errors, close } = await h.open(lang, route, { width });
      if (route === "/orders/1") await page.getByTestId("not-found").waitFor({ timeout: 15000 }).catch(() => {});
      await h.audit(page, `${lang} ${route} @${width}`, { errors: errors.filter((e) => !/404|Not Found/i.test(e)), axe: width === 390 && route !== "/system" });
      await close();
    }
  }
}
