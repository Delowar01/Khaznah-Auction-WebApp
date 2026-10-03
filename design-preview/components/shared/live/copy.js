// Live Auction wording shared by the four options (EN / AR). Each option
// decides how the room looks; the words stay the same so the pages compare
// like for like. Marketplace words that already exist (Live now, Current bid,
// Going once…, Up next …) come from data/ui.js. The lot clock here is the
// live room's own: seconds, not the timed auction's days and hours.
export const LIVE_COPY = {
  // Stage and event
  stage: { en: "Live stage", ar: "منصة المزاد المباشر" },
  lotNumber: { en: "Lot {n}", ar: "المنتج {n}" },
  saleProgress: { en: "{done} of {total} lots done", ar: "اكتمل {done} من {total}" },

  // The call: the lot clock in words
  open: { en: "Open for bids", ar: "مفتوح للمزايدة" },
  lotClock: { en: "Lot closes in", ar: "يُغلق المنتج خلال" },
  secondsShort: { en: "{n}s", ar: "{n} ث" },
  clockSpoken: { en: "Lot closes in {time}", ar: "يُغلق المنتج خلال {time}" },

  // Late bids
  extended: { en: "Late bid — clock back to {n}s", ar: "مزايدة متأخرة — عاد العدّاد إلى {n} ث" },
  extendedSpoken: { en: "Late bid. The lot clock is back to {n} seconds.", ar: "مزايدة متأخرة. عاد عدّاد المنتج إلى {n} ثانية." },
  extendRule: { en: "A bid in the final {n} seconds puts the clock back to {n} seconds.", ar: "المزايدة في آخر {n} ثانية تعيد العدّاد إلى {n} ثانية." },

  // Hammer and intermission
  soldToYou: { en: "Sold to you", ar: "بيع لك" },
  passedReserve: { en: "Not sold — reserve not met", ar: "لم يُبع — لم يبلغ السعر الأدنى" },
  nextLotIn: { en: "Next lot in {n}s", ar: "المنتج التالي خلال {n} ث" },
  nextLotNamed: { en: "Next: {title}", ar: "التالي: {title}" },
  betweenLots: { en: "Between lots", ar: "بين المنتجات" },
  nowLiveSpoken: { en: "Now live: lot {n} of {total}, {title}. {label} {amount}.", ar: "مباشر الآن: المنتج {n} من {total}، {title}. {label} {amount}." },

  // Bidding
  noBidsLive: { en: "Waiting for the opening bid", ar: "بانتظار أول مزايدة" },
  oneTap: { en: "One tap bids the amount shown — there is no confirm step in the live room.", ar: "نقرة واحدة تقدّم المبلغ الظاهر — لا توجد خطوة تأكيد في المزاد المباشر." },
  liveDeposit: { en: "{amount} bidding deposit · covered by your wallet", ar: "تأمين مزايدة {amount} · مغطّى من محفظتك" },

  // Activity and lots
  noActivity: { en: "No bids on this lot yet.", ar: "لا مزايدات على هذا المنتج بعد." },
  tabBid: { en: "Bid", ar: "المزايدة" },
  tabActivity: { en: "Activity", ar: "النشاط" },
  tabLots: { en: "Lots", ar: "المنتجات" },
  roomSections: { en: "Live room", ar: "غرفة المزاد" },

  // Upcoming events
  reminderOff: { en: "Reminder removed", ar: "تم إلغاء التذكير" },
};
