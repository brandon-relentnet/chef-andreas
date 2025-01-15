import HeroSection from "@/components/sections/HeroSection";
import FeaturedCarouselSection from "@/components/sections/FeaturedCarouselSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ChefAndreasSection from "@/components/sections/ChefAndreasSection";
import FeaturedMenuSection from "@/components/sections/FeaturedMenuSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CallToActionSection from "@/components/sections/CallToActionSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Carousel Section */}
      <FeaturedCarouselSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* About Chef Andreas Section */}
      <ChefAndreasSection />

      {/* Featured Menu Section */}
      <FeaturedMenuSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <CallToActionSection />
    </>
  );
}
