import { isAuction } from "@/lib/catalog";
import { AuctionCard } from "./AuctionCard";
import { ProductCard } from "./ProductCard";

export function LotCard(props) {
  return isAuction(props.product) ? <AuctionCard {...props} /> : <ProductCard {...props} />;
}
