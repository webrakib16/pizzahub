
import Hero from "@/components/shared/Hero";
import FeaturedMenuItems from "@/components/FeaturedMenuItems";
import PizzaCategories from "@/components/PizzaCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowPizzaHubWorks";
import Footer from "@/components/Footer";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedMenuItems />
        <PizzaCategories />
        <WhyChooseUs />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
