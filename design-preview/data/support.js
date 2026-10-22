// What the Contact page's GET notifications/support/contact/ returns in the
// preview. Production reads SUPPORT_EMAIL, SUPPORT_PHONE and
// SUPPORT_WHATSAPP_NUMBER from the environment (all empty by default) and
// the page shows whatever comes back; these are samples, not Khaznah's real
// details — the email is the one production's policies print, the numbers
// are placeholders. "unconfigured" is the response with nothing set.
export const SUPPORT_CONTACT = {
  configured: { email: "support@khaznah.com", phone: "+966 11 000 0000", whatsapp_number: "966110000000" },
  unconfigured: { email: "", phone: "", whatsapp_number: "" },
};

// The contact form's server rules (backend notifications/views.py): at
// most 5 messages a minute from one visitor; messages come back in English.
export const SUPPORT_LIMIT = { perMinute: 5 };
export const THROTTLE_MESSAGE = (seconds) => `Request was throttled. Expected available in ${seconds} seconds.`;
