// Marketplace categories. Mirrors the production category model
// (name / name_ar / slug / image) so any concept can map 1:1 onto
// GET marketplace/categories/options/ later. `count` is illustrative of a
// live marketplace; result lists always reflect the sample catalogue.
import { photo, cutout, BRAND_PHOTOS } from "./media";

export const CATEGORIES = [
  {
    slug: "electronics",
    name: { en: "Electronics", ar: "إلكترونيات" },
    blurb: { en: "TVs, audio & computing", ar: "تلفزيونات وصوتيات وحاسب" },
    count: 612,
    image: photo("tv-43", 0),
    cutout: cutout("tv-43"),
  },
  {
    slug: "home-appliances",
    name: { en: "Home Appliances", ar: "الأجهزة المنزلية" },
    blurb: { en: "Cooling, laundry & kitchen", ar: "تبريد وغسيل ومطبخ" },
    count: 284,
    image: photo("fridge-690", 0),
    cutout: cutout("fridge-690"),
  },
  {
    slug: "home-kitchen",
    name: { en: "Home & Kitchen", ar: "المنزل والمطبخ" },
    blurb: { en: "Cookware, lighting & décor", ar: "أواني وإضاءة وديكور" },
    count: 431,
    image: photo("dutch-oven-blue", 0),
    cutout: cutout("dutch-oven-blue"),
  },
  {
    slug: "furniture",
    name: { en: "Furniture", ar: "الأثاث" },
    blurb: { en: "Seating, desks & lighting", ar: "جلسات ومكاتب وإضاءة" },
    count: 198,
    image: photo("swivel-chair", 0),
    cutout: cutout("swivel-chair"),
  },
  {
    slug: "fashion",
    name: { en: "Fashion", ar: "الأزياء" },
    blurb: { en: "Bags, shoes & watches", ar: "حقائب وأحذية وساعات" },
    count: 356,
    image: photo("suede-tote", 0),
    cutout: cutout("suede-tote"),
  },
  {
    slug: "tools-diy",
    name: { en: "Tools & DIY", ar: "العدد والأدوات" },
    blurb: { en: "Hand tools & test gear", ar: "عدد يدوية وأجهزة قياس" },
    count: 173,
    image: photo("tool-backpack", 0),
    cutout: cutout("tool-backpack"),
  },
  {
    slug: "automotive",
    name: { en: "Automotive", ar: "مستلزمات السيارات" },
    blurb: { en: "Car care & accessories", ar: "العناية بالسيارة وملحقاتها" },
    count: 142,
    image: photo("car-cooler", 0),
    cutout: cutout("car-cooler"),
  },
  {
    slug: "bulk-pallets",
    name: { en: "Bulk Pallets", ar: "طبليات بالجملة" },
    blurb: { en: "Full pallets & cartons", ar: "طبليات وكراتين كاملة" },
    count: 64,
    image: photo("boxes-stack", 0),
    cutout: cutout("boxes-stack"),
    scene: BRAND_PHOTOS.warehouseFloor,
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug) {
  return CATEGORY_BY_SLUG[slug] || null;
}
