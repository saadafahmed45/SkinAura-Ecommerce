import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import Category from "./category/page";
import FeatureProducts from "./components/FeatureProducts";
import OfferMarquee from "./components/OfferMarquee";
import About from "./components/About";
import CtaSection from "./components/CtaSection";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <OfferMarquee />
      <About />
      <Category />
      <FeatureProducts categoryId={1} categoryName="Serum" />
      <FeatureProducts categoryId={2} categoryName="Cream" />
      <CtaSection />
    </main>
  );
}
