import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import Category from "./category/page";
import FeatureProducts from "./components/FeatureProducts";
import OfferMarquee from "./components/OfferMarquee";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <OfferMarquee />
      <Category />
      <FeatureProducts categoryId={10} categoryName="Clothes" />
      <FeatureProducts categoryId={11} categoryName="Electronics" />
    </main>
  );
}
