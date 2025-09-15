import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import Category from "./components/Category";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <Category />
    </main>
  );
}
