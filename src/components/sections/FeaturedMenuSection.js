import Section from "./Section";
import Menu from "@/components/Menu";

export default function FeaturedMenuSection() {
    return (
        <Section backgroundColor="bg-cream">
            <div className="max-w-4xl mx-auto">
                <h2 className="font-bold text-deepRed mb-6 text-center">Il Menù</h2>
                <p className="text-slate-700 mb-12 text-center">
                    View our curated selection of traditional Italian dishes, click on
                    any item to view more details.
                </p>
                <Menu />
            </div>
        </Section>
    );
}
