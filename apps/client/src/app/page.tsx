import { HeroSection } from "../components/features/HeroSection";
import { HowItWorks } from "../components/features/HowItWorks";
import { FeaturedEvents } from "../components/features/FeaturedEvents";
import { CategoryGrid } from "../components/features/CategoryGrid";
import { StatsSection } from "../components/features/StatsSection";
import { TestimonialCarousel } from "../components/features/TestimonialCarousel";
import { HostCTA } from "../components/features/HostCTA";
import { Footer } from "../components/shared/Footer";

export const metadata = {
  title: "Hypehouse - Find Your Perfect Activity Partner",
  description: "Join local events, meet like-minded people, never miss out again. Discover amazing events happening near you.",
  openGraph: {
    title: "Hypehouse - Find Your Perfect Activity Partner",
    description: "Join local events, meet like-minded people, never miss out again.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: How It Works */}
      <HowItWorks />

      {/* Section 3: Featured Events */}
      <FeaturedEvents />

      {/* Section 4: Event Categories */}
      <CategoryGrid />

      {/* Section 5: Stats/Social Proof */}
      <StatsSection />

      {/* Section 6: Testimonials */}
      <TestimonialCarousel />

      {/* Section 7: Host CTA */}
      <HostCTA />

      {/* Section 8: Footer */}
      <Footer />
    </main>
  );
}
