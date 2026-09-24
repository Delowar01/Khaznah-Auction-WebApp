// Condition grades — same keys, labels and wording as the production
// grade guide (frontend/src/lib/gradeInfo.js) so the redesign stays
// faithful to what buyers see today.

export const GRADES = {
  new: {
    key: "new",
    short: { en: "New", ar: "جديد" },
    label: { en: "New product", ar: "منتج جديد" },
    text: { en: "Brand new, unopened and unused.", ar: "منتج جديد تماماً وغير مفتوح وغير مستخدم." },
    tone: "new",
  },
  A: {
    key: "A",
    short: { en: "A", ar: "A" },
    label: { en: "Grade A", ar: "الدرجة A" },
    text: { en: "Unopened packaging with no damage to the product or device.", ar: "عبوة غير مفتوحة دون تلف في المنتج أو الجهاز." },
    tone: "a",
  },
  B: {
    key: "B",
    short: { en: "B", ar: "B" },
    label: { en: "Grade B", ar: "الدرجة B" },
    text: { en: "Opened packaging; unused or minimally used with no marks.", ar: "عبوة مفتوحة؛ غير مستخدم أو مستخدم بشكل بسيط دون علامات." },
    tone: "b",
  },
  C: {
    key: "C",
    short: { en: "C", ar: "C" },
    label: { en: "Grade C", ar: "الدرجة C" },
    text: { en: "Used and functional with minor marks of usage.", ar: "مستخدم ويعمل مع علامات استخدام بسيطة." },
    tone: "c",
  },
  D: {
    key: "D",
    short: { en: "D", ar: "D" },
    label: { en: "Grade D", ar: "الدرجة D" },
    text: { en: "Electronics: functional with prominent marks of usage.", ar: "للإلكترونيات: يعمل مع علامات استخدام واضحة." },
    tone: "d",
  },
  R: {
    key: "R",
    short: { en: "R", ar: "R" },
    label: { en: "Grade R", ar: "الدرجة R" },
    text: { en: "Electronics: previously repaired and functional.", ar: "للإلكترونيات: سبق إصلاحه ويعمل." },
    tone: "r",
  },
  F: {
    key: "F",
    short: { en: "F", ar: "F" },
    label: { en: "Grade F", ar: "الدرجة F" },
    text: { en: "Not working (electronics) or heavily marked (non-electronics).", ar: "لا يعمل (للإلكترونيات) أو بعلامات كبيرة (لغير الإلكترونيات)." },
    tone: "f",
  },
};

export const GRADE_ORDER = ["new", "A", "B", "C", "D", "R", "F"];

// The supplied Electronics / Non-Electronics matrix.
export const GRADE_MATRIX = [
  {
    key: "electronics",
    label: { en: "Electronics", ar: "الإلكترونيات" },
    rows: [
      { grade: "A", works: true, text: { en: "Box not opened; box may have minor damage but no damage to the device.", ar: "العلبة غير مفتوحة؛ قد يكون بها تلف بسيط، دون أي تلف بالجهاز." } },
      { grade: "B", works: true, text: { en: "Opened box; device not used or minimally used; no marks on the device.", ar: "العلبة مفتوحة؛ الجهاز غير مستخدم أو مستخدم استخداماً بسيطاً؛ لا توجد علامات عليه." } },
      { grade: "C", works: true, text: { en: "Opened box; used device with minor marks of usage.", ar: "العلبة مفتوحة؛ الجهاز مستخدم وعليه علامات استخدام بسيطة." } },
      { grade: "D", works: true, text: { en: "Opened box; used device with prominent marks of usage.", ar: "العلبة مفتوحة؛ الجهاز مستخدم وعليه علامات استخدام واضحة." } },
      { grade: "R", works: true, text: { en: "Previously repaired; may or may not have marks of usage.", ar: "سبق إصلاحه؛ وقد تظهر عليه علامات استخدام أو لا تظهر." } },
      { grade: "F", works: false, text: { en: "Opened box; marks may range from minimal to severe damage.", ar: "العلبة مفتوحة؛ وقد تتراوح العلامات من بسيطة إلى أضرار جسيمة." } },
    ],
  },
  {
    key: "non_electronics",
    label: { en: "Non-electronics", ar: "غير الإلكترونيات" },
    rows: [
      { grade: "A", works: null, text: { en: "Box not opened; box may have minor damage but no damage to the product.", ar: "العلبة غير مفتوحة؛ قد يكون بها تلف بسيط، دون أي تلف بالمنتج." } },
      { grade: "B", works: null, text: { en: "Opened box; product not used or minimally used; no marks.", ar: "العلبة مفتوحة؛ المنتج غير مستخدم أو مستخدم استخداماً بسيطاً؛ دون علامات." } },
      { grade: "C", works: null, text: { en: "Opened box; used product with minor marks of usage.", ar: "العلبة مفتوحة؛ المنتج مستخدم وعليه علامات استخدام بسيطة." } },
      { grade: "F", works: null, text: { en: "Opened box; marks range from major damage to soiling.", ar: "العلبة مفتوحة؛ وتتراوح العلامات من أضرار كبيرة إلى اتساخ." } },
    ],
  },
];

// Same keys as StockItem.source_type in the backend.
export const SOURCE_TYPES = {
  returned: { en: "Customer return", ar: "مرتجع عميل" },
  open_box: { en: "Open box", ar: "علبة مفتوحة" },
  surplus: { en: "Surplus stock", ar: "فائض مخزون" },
  liquidation: { en: "Liquidation", ar: "تصفية" },
  other: { en: "Other", ar: "أخرى" },
};

export const ITEM_TYPES = {
  single: { en: "Single item", ar: "قطعة واحدة" },
  bulk: { en: "Bulk carton", ar: "كرتونة بالجملة" },
  pallet: { en: "Pallet", ar: "طبلية" },
};

export function getGrade(key) {
  return GRADES[key] || GRADES.A;
}
