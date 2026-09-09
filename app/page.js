import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import TopSellingProducts from "./components/TopSellingProducts";
import FeatureProducts from "./components/FeatureProducts";
import OfferMarquee from "./components/OfferMarquee";
import About from "./components/About";
import CtaSection from "./components/CtaSection";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <OfferMarquee />
      <CategorySection />
      <TopSellingProducts />
      <FeatureProducts categoryId={1} categoryName="Serum" />
      <FeatureProducts categoryId={2} categoryName="Cream" />
      <About />
      <CtaSection />
    </main>
  );
}
