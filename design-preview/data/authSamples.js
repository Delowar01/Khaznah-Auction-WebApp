// Sample outcomes for the preview's sign-in and registration forms (there is
// no backend). Any other email signs in as the demo buyer or registers a new
// account; these addresses give production's other answers. Server messages
// are English in both languages, as production's backend sends them.
export const SAMPLE_EMAILS = {
  // POST accounts/session/login/ → 401 (wrong password or no such account)
  unknown: "unknown@example.com",
  // A warehouse_admin signing in on the customer login → rejected and signed out
  seller: "seller@example.com",
  // reject_if_not_signinable (suspended account)
  suspended: "suspended@example.com",
  // RegisterSerializer / SellerRegisterSerializer email uniqueness
  taken: "taken@example.com",
};

// The values the "errors" preview states fill in, so the page shows the
// server's answer for them (R2: every message joined, field names dropped).
export const SAMPLE_REGISTER_ERRORS = {
  fullName: "Faisal Al-Harbi",
  email: SAMPLE_EMAILS.taken,
  phone: "",
  password: "short",
  confirmPassword: "short",
};

export const SAMPLE_SELLER_ERRORS = {
  fullName: "",
  email: "noura@",
  phone: "",
  city: "Riyadh",
  businessName: "",
  password: "short",
  confirmPassword: "short",
};

// A code production would send: six digits that never start with 0
// (randint(100000, 999999)); the test-mode state shows it.
export const SAMPLE_OTP = "482917";
