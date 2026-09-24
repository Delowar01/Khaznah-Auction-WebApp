// A presenter-led live auction event. Shapes follow the public live-event
// payload (LiveAuctionEvent + sequence_items): item statuses are
// staged | countdown | live | sold | reserve_not_met, with per-item
// duration_seconds and a deadline, as in liveauctions/services.py.
import { photo, BRAND_PHOTOS } from "./media";

export const LIVE_EVENT = {
  id: 27,
  slug: "tuesday-evening-appliances-live",
  title: {
    en: "Tuesday Evening Live — Home & Electronics",
    ar: "مزاد الثلاثاء المسائي المباشر — المنزل والإلكترونيات",
  },
  host: "REDSEA",
  presenter: { en: "Presented by Khalid Al-Zahrani", ar: "يقدّمه خالد الزهراني" },
  status: "live",
  startedMinutesAgo: 38,
  viewers: 1284,
  stream: BRAND_PHOTOS.warehouseRiyadh,
  itemDurationSeconds: 45,
  depositAmount: 200,
  items: [
    { order: 1, status: "sold", title: { en: "Cordless Stick Vacuum", ar: "مكنسة عصا لاسلكية" }, image: photo("stick-vacuum", 0), startingBid: 150, increment: 10, finalBid: 310, bidCount: 14 },
    { order: 2, status: "sold", title: { en: "12-Cup Digital Coffee Maker", ar: "ماكينة قهوة رقمية 12 كوباً" }, image: photo("coffee-maker-12", 0), startingBid: 60, increment: 5, finalBid: 120, bidCount: 9 },
    { order: 3, status: "reserve_not_met", title: { en: "Mechanical Gaming Keyboard", ar: "لوحة مفاتيح ميكانيكية للألعاب" }, image: photo("gaming-keyboard", 0), startingBid: 180, increment: 10, finalBid: null, bidCount: 0 },
    { order: 4, status: "sold", title: { en: "Black Leather Loveseat", ar: "كنبة جلدية سوداء لشخصين" }, image: photo("black-loveseat", 0), startingBid: 800, increment: 25, finalBid: 1350, bidCount: 19 },
    {
      order: 5,
      status: "live",
      title: { en: "Mid-Century Leather Recliner", ar: "كرسي استرخاء جلدي بتصميم منتصف القرن" },
      image: photo("recliner", 0),
      scene: photo("recliner", 1),
      grade: "A",
      startingBid: 900,
      increment: 25,
      currentBid: 1850,
      bidCount: 16,
      marketPrice: 3100,
      note: {
        en: "Olive top-grain leather, solid wood frame. Showroom overstock, no marks.",
        ar: "جلد طبيعي زيتوني وإطار من الخشب الصلب. فائض صالة عرض دون علامات.",
      },
    },
    { order: 6, status: "staged", title: { en: "Upholstered Dining Chairs, Set of 2", ar: "كرسيا طعام منجّدان، طقم من 2" }, image: photo("dining-chairs", 0), startingBid: 400, increment: 20 },
    { order: 7, status: "staged", title: { en: "Portable Bluetooth Speaker", ar: "مكبر صوت بلوتوث محمول" }, image: photo("bt-speaker", 0), startingBid: 90, increment: 5 },
    { order: 8, status: "staged", title: { en: "Electronics Repair Tool Kit", ar: "طقم أدوات إصلاح الإلكترونيات" }, image: photo("toolkit", 0), startingBid: 60, increment: 5 },
    { order: 9, status: "staged", title: { en: "Enamelled Cast-Iron Casserole, Red", ar: "قدر حديد زهر مطلي بالمينا، أحمر" }, image: photo("dutch-oven-red", 0), startingBid: 110, increment: 5 },
    { order: 10, status: "staged", title: { en: "Suede Wedge-Sole Boots", ar: "حذاء برقبة من الشامواه بنعل سميك" }, image: photo("suede-boots", 0), startingBid: 70, increment: 5 },
  ],
};

// Other events shown in "more live & upcoming" rails.
export const OTHER_EVENTS = [
  {
    slug: "riyadh-furniture-thursday",
    title: { en: "Thursday Furniture Clearance", ar: "تصفية الأثاث يوم الخميس" },
    host: "RAWABI",
    status: "upcoming",
    startsIn: 2 * 24 * 3600 + 5 * 3600,
    lots: 24,
    image: photo("leather-sofa", 0),
  },
  {
    slug: "khazna-pallet-hour",
    title: { en: "Pallet Hour — Bulk Returns", ar: "ساعة الطبليات — مرتجعات بالجملة" },
    host: "KHAZNA",
    status: "upcoming",
    startsIn: 20 * 3600,
    lots: 12,
    image: photo("boxes-stack", 0),
  },
];
