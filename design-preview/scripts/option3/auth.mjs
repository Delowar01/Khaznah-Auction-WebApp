// Sign in, registration and seller onboarding (/login, /register,
// /seller/register): production's rules — buyer-only sign-in, empty fields
// never sent, ?next= cleaned (same-site paths only) and followed, the
// registered / expired / error banners and their roles, non-buyers signed
// out again; the two-step registration (client checks in order, the
// server's joined messages, digits-only code, Verify at four digits, 60 s
// resend, success → sign in with the registered banner), the in-place
// seller swap keeping the buyer's details; the plan picker (first plan
// preselected, Monthly/Annual, the positional "Popular"), the field and JS
// checks, success with the warehouse code and the optional email code; and
// that /seller/[code] still opens storefronts.
const COPY = {
  en: {
    invalid: "Invalid credentials.",
    notBuyer: "This login is for customers only. Use the admin or seller portal.",
    registered: "Account created. You can login now.",
    expired: "Your session expired. Please sign in again.",
    show: "Show password",
    hide: "Hide password",
    login: "Login",
    myAccount: "My Account",
    account: "My account",
    seller: "Seller",
    buyer: "Buyer",
    mismatch: "Passwords do not match.",
    terms: "Please accept the terms and privacy policy.",
    sentTo: "We sent a 6-digit code to",
    resendIn: "Resend code in",
    resend: "Resend code",
    plansTitle: "Choose your plan",
    registerTitle: "Create your account",
    summary: "Selected plan: Starter · Monthly",
    summaryAnnual: "Selected plan: Business · Annual",
    popular: "Popular",
    perYear: "/yr",
    noPlan: "Choose a plan to continue.",
    plansEmpty: "No plans are available right now.",
    plansLoading: "Loading plans…",
    sellerMismatch: "Passwords do not match.",
    sellerTerms: "Please accept the seller terms.",
    required: "Fill in this field.",
    youreIn: "You're in!",
    verified: "Email verified",
    storefront: "Verified stock, straight from the seller.",
  },
  ar: {
    invalid: "بيانات تسجيل الدخول غير صحيحة.",
    notBuyer: "هذا الدخول مخصص للعملاء فقط. استخدم بوابة الإدارة أو البائع.",
    registered: "تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.",
    expired: "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.",
    show: "إظهار كلمة المرور",
    hide: "إخفاء كلمة المرور",
    login: "تسجيل الدخول",
    myAccount: "حسابي",
    account: "حسابي",
    seller: "البائع",
    buyer: "المشتري",
    mismatch: "كلمتا المرور غير متطابقتين.",
    terms: "يرجى الموافقة على الشروط وسياسة الخصوصية.",
    sentTo: "أرسلنا رمزًا مكونًا من 6 أرقام إلى",
    resendIn: "إعادة الإرسال خلال",
    resend: "إعادة إرسال الرمز",
    plansTitle: "اختر باقتك",
    registerTitle: "أنشئ حسابك",
    summary: "الباقة المختارة: Starter · شهري",
    summaryAnnual: "الباقة المختارة: Business · سنوي",
    popular: "الأكثر",
    perYear: "/سنة",
    noPlan: "اختر باقة للمتابعة.",
    plansEmpty: "لا توجد باقات متاحة حاليًا.",
    plansLoading: "جارٍ تحميل الباقات…",
    sellerMismatch: "كلمتا المرور غير متطابقتين.",
    sellerTerms: "يرجى الموافقة على شروط البائع.",
    required: "املأ هذا الحقل.",
    youreIn: "لقد انضممت!",
    verified: "تم التحقق من البريد الإلكتروني",
    storefront: "بضاعة موثّقة، مباشرة من البائع.",
  },
};

const session = (page) => page.evaluate(() => sessionStorage.getItem("kz-session"));
const text = (locator) => locator.innerText().then((value) => value.replace(/\s+/g, " ").trim());

async function login(h, lang) {
  const c = COPY[lang];
  const base = `/${lang}/concept-c`;

  {
    const { page, errors, close } = await h.open(lang, "/login");
    const nav = page.locator("main nav").first();
    h.check(`${lang} login: Buyer is the current portal`, (await nav.locator('[aria-current="page"]').innerText()).includes(c.buyer));
    const hrefs = await nav.locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    h.check(`${lang} login: seller and admin portals keep production's addresses`, hrefs.includes("/warehouse/login") && hrefs.includes("/dashboard/login"), hrefs.join(" "));
    const register = await page.getByTestId("login-register").getAttribute("href");
    h.check(`${lang} login: link to register`, register === `${base}/register`, register);
    const email = page.locator('input[type="email"]');
    const password = page.locator('input[autocomplete="current-password"]');
    h.check(`${lang} login: autocomplete and input modes`, (await email.getAttribute("autocomplete")) === "email" && (await email.getAttribute("inputmode")) === "email" && (await password.count()) === 1);

    const toggle = page.getByRole("button", { name: c.show });
    await toggle.click();
    h.check(`${lang} login: password toggle shows the password`, (await password.getAttribute("type")) === "text" && (await page.getByRole("button", { name: c.hide }).getAttribute("aria-pressed")) === "true");
    await page.getByRole("button", { name: c.hide }).click();

    await page.getByTestId("login-submit").click();
    const error = page.getByTestId("login-error");
    h.check(`${lang} login: empty fields → "Invalid credentials." without a request`, (await error.innerText()).includes(c.invalid) && (await error.getAttribute("role")) === "alert");
    h.check(`${lang} login: the empty field is marked and focused`, (await email.getAttribute("aria-invalid")) === "true" && (await email.evaluate((node) => node === document.activeElement)));
    await h.audit(page, `${lang} login`, { errors });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/login?registered=1&expired=1");
    const registered = page.getByTestId("login-registered");
    h.check(`${lang} login ?registered: success banner (status, polite)`, (await registered.innerText()).includes(c.registered) && (await registered.getAttribute("role")) === "status" && (await registered.getAttribute("aria-live")) === "polite");
    h.check(`${lang} login ?expired=1: session banner`, (await page.getByTestId("login-expired").innerText()).includes(c.expired));
    await page.getByTestId("login-submit").click();
    h.check(`${lang} login: the expired banner hides while an error shows, registered stays`, (await page.getByTestId("login-expired").count()) === 0 && (await page.getByTestId("login-registered").count()) === 1);
    await h.audit(page, `${lang} login banners`, { errors, axe: false });
    await close();
  }

  for (const [state, expected] of [
    ["registered", c.registered],
    ["expired", c.expired],
    ["error", "No active account found with the given credentials"],
    ["not-buyer", c.notBuyer],
  ]) {
    const { page, errors, close } = await h.open(lang, `/login?state=${state}`);
    h.check(`${lang} login state ${state}`, (await h.mainText(page)).includes(expected));
    await h.audit(page, `${lang} login ${state}`, { errors, axe: state === "error" });
    await close();
  }

  {
    const { page, close } = await h.open(lang, "/login");
    await page.locator('input[type="email"]').fill("seller@example.com");
    await page.locator('input[autocomplete="current-password"]').fill("khaznah-demo");
    await page.getByTestId("login-submit").click();
    await page.getByTestId("login-error").waitFor();
    h.check(`${lang} login: a seller account is refused with the portal message`, (await page.getByTestId("login-error").innerText()).includes(c.notBuyer));
    h.check(`${lang} login: …and signed out again`, (await session(page)) === "out");
    await page.locator('input[type="email"]').fill("unknown@example.com");
    await page.getByTestId("login-submit").click();
    await page.waitForFunction(() => document.querySelector('[data-testid="login-error"]')?.innerText.includes("No active account"));
    h.check(`${lang} login: wrong credentials → the server's English message`, true);
    await close();
  }

  {
    const { page, close } = await h.open(lang, `/login?next=${encodeURIComponent("/cart")}`, { signedOut: true });
    await page.locator('input[type="email"]').fill("faisal@example.com");
    await page.locator('input[autocomplete="current-password"]').fill("khaznah-demo");
    await page.getByTestId("login-submit").click();
    await page.waitForURL(`**${base}/cart`);
    h.check(`${lang} login: a buyer is signed in and sent to ?next`, page.url().endsWith(`${base}/cart`) && (await session(page)) !== "out", page.url());
    await page.waitForTimeout(300);
    await page.locator("header button[aria-expanded]").nth(1).click();
    h.check(`${lang} login: the header now offers My Account`, await page.getByRole("link", { name: c.myAccount, exact: true }).first().isVisible());
    await close();
  }

  for (const unsafe of ["//evil.example/steal", "https://evil.example", "/\\evil.example"]) {
    const { page, close } = await h.open(lang, `/login?next=${encodeURIComponent(unsafe)}`);
    await page.locator('input[type="email"]').fill("faisal@example.com");
    await page.locator('input[autocomplete="current-password"]').fill("khaznah-demo");
    await page.getByTestId("login-submit").click();
    await page.waitForURL((url) => !url.pathname.endsWith("/login"));
    const path = new URL(page.url()).pathname.replace(/\/$/, "");
    h.check(`${lang} login: unsafe next ${unsafe} → home`, path === base, page.url());
    await close();
  }

  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open(lang, "/login", { width });
    await h.audit(page, `${lang} login ${width}`, { errors, axe: width === 390 });
    await close();
  }
}

async function register(h, lang) {
  const c = COPY[lang];
  const base = `/${lang}/concept-c`;

  {
    const { page, errors, close } = await h.open(lang, "/register");
    await h.audit(page, `${lang} register`, { errors });
    const fields = { fullName: page.locator('input[name="fullName"]'), email: page.locator('input[name="email"]'), phone: page.locator('input[name="phone"]'), password: page.locator('input[name="password"]'), confirm: page.locator('input[name="confirmPassword"]') };
    h.check(
      `${lang} register: autocomplete values`,
      (await fields.email.getAttribute("autocomplete")) === "email" && (await fields.phone.getAttribute("autocomplete")) === "tel" && (await fields.password.getAttribute("autocomplete")) === "new-password" && (await fields.confirm.getAttribute("autocomplete")) === "new-password",
    );
    await page.getByRole("button", { name: c.show }).click();
    h.check(`${lang} register: one toggle shows both passwords`, (await fields.password.getAttribute("type")) === "text" && (await fields.confirm.getAttribute("type")) === "text");

    await fields.fullName.fill("Faisal Al-Harbi");
    await fields.email.fill("new.buyer@example.com");
    await fields.password.fill("khaznah-demo");
    await fields.confirm.fill("khaznah-other");
    await page.getByTestId("register-submit").click();
    h.check(`${lang} register: passwords checked first`, (await page.getByTestId("register-error").innerText()).includes(c.mismatch));
    await fields.confirm.fill("khaznah-demo");
    h.check(`${lang} register: typing clears the message`, (await page.getByTestId("register-error").count()) === 0);
    await page.getByTestId("register-submit").click();
    h.check(`${lang} register: then the terms`, (await page.getByTestId("register-error").innerText()).includes(c.terms));

    // The seller swap keeps the buyer's details and the address.
    await page.getByTestId("register-join-seller").click();
    await page.getByRole("heading", { level: 1, name: c.plansTitle }).waitFor();
    h.check(`${lang} register: Join as Seller swaps in place (same address)`, new URL(page.url()).pathname.replace(/\/$/, "") === `${base}/register`);
    h.check(`${lang} register: the seller heading takes focus`, await page.getByRole("heading", { level: 1, name: c.plansTitle }).evaluate((node) => node === document.activeElement));
    await page.locator("main nav").getByRole("button", { name: c.buyer }).click();
    await page.getByRole("heading", { level: 1, name: c.registerTitle }).waitFor();
    h.check(`${lang} register: back to the buyer form with the details kept`, (await fields.fullName.inputValue()) === "Faisal Al-Harbi" && (await fields.email.inputValue()) === "new.buyer@example.com");

    await page.locator('input[name="terms"]').check();
    await page.getByTestId("register-submit").click();
    await page.getByTestId("register-verify").waitFor();
    const verify = page.getByTestId("register-verify");
    h.check(`${lang} register: step 2 names the address`, (await text(verify)).includes(c.sentTo) && (await text(verify)).includes("new.buyer@example.com"));
    const resend = page.getByTestId("register-resend");
    h.check(`${lang} register: resend waits 60 s`, (await resend.isDisabled()) && /\b(60|59)s$/.test(await resend.innerText()), await resend.innerText());
    await page.waitForTimeout(2300);
    h.check(`${lang} register: the countdown runs`, /\b(5[0-8])s$/.test(await resend.innerText()), await resend.innerText());
    const code = page.locator('input[autocomplete="one-time-code"]');
    h.check(`${lang} register: the code field has focus`, await code.evaluate((node) => node === document.activeElement));
    await code.fill("12ab");
    h.check(`${lang} register: digits only`, (await code.inputValue()) === "12");
    h.check(`${lang} register: Verify waits for four digits`, await page.getByTestId("register-verify-submit").isDisabled());
    await code.fill("000000");
    await page.getByTestId("register-verify-submit").click();
    await page.getByTestId("register-otp-error").waitFor();
    h.check(`${lang} register: a wrong code → "Invalid OTP."`, (await page.getByTestId("register-otp-error").innerText()).includes("Invalid OTP."));
    await code.fill("482917");
    await page.getByTestId("register-verify-submit").click();
    await page.waitForURL((url) => url.pathname.endsWith("/login") || url.pathname.endsWith("/login/"));
    const url = new URL(page.url());
    h.check(`${lang} register: verified → sign in with the registered banner`, url.searchParams.get("registered") === "1" && url.searchParams.get("verified") === "1", page.url());
    await page.getByTestId("login-registered").waitFor();
    h.check(`${lang} register: no automatic sign-in banner check`, (await page.getByTestId("login-registered").innerText()).includes(c.registered));
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/register?state=errors");
    h.check(`${lang} register errors: the server's messages joined, names dropped`, (await page.getByTestId("register-error").innerText()).includes("This email is already being used. Ensure this field has at least 8 characters."));
    await h.audit(page, `${lang} register errors`, { errors });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/register?state=verify-error");
    h.check(`${lang} register verify-error: the code error`, (await page.getByTestId("register-otp-error").innerText()).includes("Invalid OTP."));
    const resend = page.getByTestId("register-resend");
    h.check(`${lang} register verify-error: resend available`, (await resend.isEnabled()) && (await resend.innerText()).includes(c.resend));
    await resend.click();
    h.check(`${lang} register: resend restarts the 60 s wait, no message`, (await resend.isDisabled()) && (await resend.innerText()).includes(c.resendIn) && (await page.getByTestId("register-otp-error").count()) === 0);
    await h.audit(page, `${lang} register verify-error`, { errors });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/register?state=verify-test");
    h.check(`${lang} register verify-test: test-mode code shown and filled in`, (await page.getByTestId("register-test-code").innerText()).includes("482917") && (await page.locator('input[autocomplete="one-time-code"]').inputValue()) === "482917");
    await h.audit(page, `${lang} register verify-test`, { errors, axe: false });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/register?state=seller");
    h.check(`${lang} register seller state: the seller form in place`, (await page.getByRole("heading", { level: 1 }).innerText()).includes(c.plansTitle));
    await h.audit(page, `${lang} register seller`, { errors, axe: false });
    await close();
  }

  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open(lang, "/register?state=verify", { width });
    await h.audit(page, `${lang} register verify ${width}`, { errors, axe: width === 390 });
    await close();
  }
}

async function sellerRegister(h, lang) {
  const c = COPY[lang];

  {
    const { page, errors, close } = await h.open(lang, "/seller/register");
    await h.audit(page, `${lang} seller register`, { errors });
    const cards = page.getByTestId("plan-card");
    h.check(`${lang} seller: the first plan is preselected`, (await cards.nth(0).getAttribute("aria-pressed")) === "true" && (await cards.nth(1).getAttribute("aria-pressed")) === "false");
    h.check(`${lang} seller: summary of the plan`, (await text(page.getByTestId("plan-summary"))).includes(c.summary), await text(page.getByTestId("plan-summary")));
    h.check(`${lang} seller: "Popular" on the middle card only`, (await cards.nth(1).innerText()).includes(c.popular) && !(await cards.nth(0).innerText()).includes(c.popular) && !(await cards.nth(2).innerText()).includes(c.popular));
    await page.getByTestId("cycle-annual").click();
    h.check(`${lang} seller: Annual shows yearly prices and savings`, (await page.getByTestId("cycle-annual").getAttribute("aria-pressed")) === "true" && (await cards.nth(1).innerText()).includes(c.perYear) && /\d+/.test(await cards.nth(1).innerText()));
    await cards.nth(1).click();
    h.check(`${lang} seller: choosing a plan updates the summary`, (await text(page.getByTestId("plan-summary"))).includes(c.summaryAnnual), await text(page.getByTestId("plan-summary")));
    const hrefs = await page.locator("main nav a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    h.check(`${lang} seller: Buyer → register, Admin → staff login`, hrefs.some((href) => href.endsWith("/concept-c/register")) && hrefs.includes("/dashboard/login"), hrefs.join(" "));

    await page.getByTestId("seller-submit").click();
    const fullName = page.locator('input[name="fullName"]');
    h.check(`${lang} seller: required fields marked, the first focused`, (await fullName.getAttribute("aria-invalid")) === "true" && (await fullName.evaluate((node) => node === document.activeElement)) && (await h.mainText(page)).includes(c.required));

    await fullName.fill("Noura Al-Qahtani");
    await page.locator('input[name="email"]').fill("noura@example.com");
    await page.locator('input[name="city"]').fill("Riyadh");
    await page.locator('input[name="businessName"]').fill("Al Noor Trading");
    await page.locator('input[name="password"]').fill("khaznah-demo");
    await page.locator('input[name="confirmPassword"]').fill("khaznah-other");
    await page.getByTestId("seller-submit").click();
    h.check(`${lang} seller: passwords must match`, (await page.getByTestId("seller-error").innerText()).includes(c.sellerMismatch));
    await page.locator('input[name="confirmPassword"]').fill("khaznah-demo");
    await page.getByTestId("seller-submit").click();
    h.check(`${lang} seller: then the seller terms`, (await page.getByTestId("seller-error").innerText()).includes(c.sellerTerms));
    await page.locator('input[name="terms"]').check();
    await page.getByTestId("seller-submit").click();
    await page.getByTestId("seller-success").waitFor();
    const code = await page.getByTestId("warehouse-code").innerText();
    h.check(`${lang} seller: success with the warehouse code (name, 12 max, + 6 hex)`, /^ALNOORTRADIN-[0-9A-F]{6}$/.test(code.trim()), code);
    h.check(`${lang} seller: "You're in!" takes focus`, await page.getByRole("heading", { name: c.youreIn }).evaluate((node) => node === document.activeElement));
    const otp = page.locator('[data-testid="seller-success"] input[autocomplete="one-time-code"]');
    await otp.fill("000000");
    await page.getByTestId("seller-verify").click();
    await page.getByTestId("seller-otp-error").waitFor();
    h.check(`${lang} seller: a wrong code is refused`, (await page.getByTestId("seller-otp-error").innerText()).includes("Invalid OTP."));
    await otp.fill("482917");
    await page.getByTestId("seller-verify").click();
    await page.getByTestId("email-verified").waitFor();
    h.check(`${lang} seller: email verified`, (await page.getByTestId("email-verified").innerText()).includes(c.verified));
    await page.getByTestId("seller-dashboard").click();
    h.check(`${lang} seller: the dashboard hand-off says where it leads`, (await page.locator('[role="status"]').filter({ hasText: /dashboard|لوحة/ }).count()) > 0);
    await h.audit(page, `${lang} seller success`, { errors, axe: false });
    await close();
  }

  {
    const { page, close } = await h.open(lang, "/seller/register");
    await page.locator('input[name="fullName"]').fill("Noura Al-Qahtani");
    await page.locator('input[name="email"]').fill("taken@example.com");
    await page.locator('input[name="city"]').fill("Riyadh");
    await page.locator('input[name="businessName"]').fill("Al Noor Trading");
    await page.locator('input[name="password"]').fill("khaznah-demo");
    await page.locator('input[name="confirmPassword"]').fill("khaznah-demo");
    await page.locator('input[name="terms"]').check();
    await page.getByTestId("seller-submit").click();
    await page.getByTestId("seller-error").waitFor();
    h.check(`${lang} seller: the server's duplicate-email answer (English)`, (await page.getByTestId("seller-error").innerText()).includes("This email is already being used."));
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/seller/register?state=errors");
    h.check(`${lang} seller errors state: fields marked`, (await page.locator('main [aria-invalid="true"]').count()) >= 4);
    await h.audit(page, `${lang} seller errors`, { errors });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/seller/register?state=no-plans");
    h.check(`${lang} seller no-plans: message, prompt and submit off`, (await page.getByTestId("plans-empty").innerText()).includes(c.plansEmpty) && (await text(page.getByTestId("plan-summary"))).includes(c.noPlan) && (await page.getByTestId("seller-submit").isDisabled()));
    await h.audit(page, `${lang} seller no-plans`, { errors, axe: false });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/seller/register?state=loading");
    h.check(`${lang} seller loading: "Loading plans…" announced`, (await page.locator('main [role="status"]').first().innerText()).includes(c.plansLoading));
    await h.audit(page, `${lang} seller loading`, { errors, axe: false });
    await close();
  }

  {
    const { page, errors, close } = await h.open(lang, "/seller/register?state=success");
    h.check(`${lang} seller success state`, (await h.mainText(page)).includes(c.youreIn));
    await h.audit(page, `${lang} seller success state`, { errors });
    await close();
  }

  {
    const { page, errors, status, close } = await h.open(lang, "/seller/REDSEA");
    h.check(`${lang} storefront still opens beside /seller/register`, status === 200 && (await page.getByRole("heading", { level: 1 }).innerText()).includes(c.storefront));
    await h.audit(page, `${lang} storefront`, { errors, axe: false });
    await close();
  }

  for (const width of [390, 320]) {
    const { page, errors, close } = await h.open(lang, "/seller/register", { width });
    await h.audit(page, `${lang} seller register ${width}`, { errors, axe: width === 390 });
    await close();
  }
}

export default async function auth(h) {
  for (const lang of ["en", "ar"]) {
    await login(h, lang);
    await register(h, lang);
    await sellerRegister(h, lang);
  }
}
