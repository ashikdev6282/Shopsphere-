import Hero from "../components/Hero";
import FeaturedCollections from "../components/Featuredcollections";
import TrendingProducts from "../components/Trendingproduct";
import CategoriesShowcase from "../components/CategorySection";
import BestSellers from "../components/BestSellerSection";
import Testimonials from "../components/TestimonialSection";
import NewsletterCTA from "../components/CalltoAction";

export default function HomePage() {
  return (
    <main className="bg-zinc-900 text-white">
      <Hero />
      <FeaturedCollections />
      <TrendingProducts />
      <CategoriesShowcase />
      <BestSellers />
      <Testimonials />
      <NewsletterCTA />
      
    </main>
  );
}
