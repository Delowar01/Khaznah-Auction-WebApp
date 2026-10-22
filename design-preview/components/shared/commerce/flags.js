// Provenance of customer copy for the Option 3 screens beyond the review
// pages. Production copy is used as written ({ en, ar }); two helpers mark
// the rest so the report can list it:
//   arNew(en, ar)  production shows this only in English; the Arabic is a
//                  new translation (an implementation requirement, not a
//                  change to production's wording);
//   copyNew(en, ar) wording that production does not have — presentation
//                  copy for a state the design makes visible (e.g. a guest
//                  note); listed for owner review.
export const arNew = (en, ar) => ({ en, ar, provenance: "ar-new" });
export const copyNew = (en, ar) => ({ en, ar, provenance: "copy-new" });
