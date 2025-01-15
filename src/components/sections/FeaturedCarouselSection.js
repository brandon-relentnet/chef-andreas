// /app/(wherever)/FeaturedCarouselSection.js
import Section from "./Section";
import FeaturedCarousel from "@/components/carousel/FeaturedCarousel";

export const dynamic = "force-dynamic";

const OPTIONS = { align: "start", loop: true, dragFree: true };
const url = `${"http://localhost:3000" || process.env.WEB_URL}/api/menu?featured=1`;

export default async function FeaturedCarouselSection() {
    // Fetch only featured items from your API
    const res = await fetch(
        url,
        {
            // e.g. revalidate: 60 for ISR, or cache: "no-store"
            next: { revalidate: 60 },
        }
    );
    const featuredItems = await res.json();

    // Pass the entire array to the carousel as "slides"
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
            <FeaturedCarousel slides={featuredItems} options={OPTIONS} />
        </Section>
    );
}
