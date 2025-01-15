import Section from "./Section";
import Link from "next/link";

export default function CallToActionSection() {
    return (
        <Section backgroundColor="bg-cream">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-bold text-deepRed mb-6">Ready to Savor the Taste of Italy?</h2>
                <p className="text-slate-700 mb-8">
                    Your next favorite meal is just a few clicks away. Explore our menu
                    and place your order today!
                </p>
                <div className="flex flex-wrap justify-center mt-8 gap-4">
                    <Link
                        href="/menu"
                        className="bg-deepRed text-cream font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-forestGreen transition"
                    >
                        Explore Menu
                    </Link>
                    <Link
                        href="/order"
                        className="bg-goldenYellow text-deepRed font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-forestGreen hover:text-cream transition"
                    >
                        Order Online
                    </Link>
                </div>
            </div>
        </Section>
    );
}
