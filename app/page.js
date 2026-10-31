import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import TopSellingProducts from "./components/TopSellingProducts";
import WinterCollection from "./components/WinterCollection";
import FeaturedFormulas from "./components/FeaturedFormulas";
import FeatureProducts from "./components/FeatureProducts";
import OfferMarquee from "./components/OfferMarquee";
import About from "./components/About";
import CtaSection from "./components/CtaSection";
import { getCategories } from "./lib/api/categories";
import {
  getTopSellingProducts,
  getFeaturedFormulas,
  getFeaturedProducts,
  getWinterCollectionProducts,
} from "./lib/api/products";

export const revalidate = 300; // Cache homepage for 5 minutes

export default async function Home() {
  // Fetch initial homepage data concurrently on the server
  const [
    categories,
    topSelling,
    winterProducts,
    featuredFormulas,
    serumProducts,
    creamProducts,
  ] = await Promise.all([
    getCategories(),
    getTopSellingProducts(12),
    getWinterCollectionProducts(8),
    getFeaturedFormulas(8),
    getFeaturedProducts("Serum", 4),
    getFeaturedProducts("Cream", 4),
  ]);

  return (
    <main>
      <HeroBanner />
      <OfferMarquee />
      <CategorySection initialCategories={categories} />
      <TopSellingProducts initialProducts={topSelling} />
      <WinterCollection initialProducts={winterProducts} />
      <FeaturedFormulas initialProducts={featuredFormulas} />
      <FeatureProducts
        categoryId={1}
        categoryName="Serum"
        initialProducts={serumProducts}
      />
      <FeatureProducts
        categoryId={2}
        categoryName="Cream"
        initialProducts={creamProducts}
      />
      <About />
      <CtaSection />
    </main>
  );
}
