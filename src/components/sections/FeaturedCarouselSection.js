import Section from "./Section";
import FeaturedCarousel from "@/components/carousel/FeaturedCarousel";

// Example carousel configs
const OPTIONS = { align: "start", loop: true, dragFree: true };
const SLIDE_COUNT = 10;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export default function FeaturedCarouselSection() {
    return (
        <Section
            backgroundColor="bg-[#f7e9d3]"
            withBoxShadow
            showVineTopLeft
            showVineBottomRight
            vineImg="/textures/ca_vine_2.png"
        >
            <h2 className="font-bold text-deepRed mb-6 text-center">Signature Dishes</h2>
            <p className="text-slate-700 mb-12 text-center">
                Explore a curated selection of our customer favorites. Buon Appetito!
            </p>
            <FeaturedCarousel slides={SLIDES} options={OPTIONS} />
        </Section>
    );
}
