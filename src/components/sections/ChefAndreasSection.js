import { Autour_One } from "next/font/google";
import Section from "./Section";
import Image from "next/image";

export default function ChefAndreasSection() {
    return (
        <Section backgroundColor="bg-[#f7e9d3]" withBoxShadow>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-bold text-deepRed mb-6">Di Chef Andreas</h2>
                <Image
                    src="/images/ca_about_me_2.jpg"
                    alt="Chef Andreas"
                    width={300}
                    height={300}
                    className="rounded shadow-lg mx-auto mb-12"
                    style={{ width: "auto", height: "auto" }}
                />
                <h3 className="font-bold text-slate-800 mb-6">Award Winning Chef & Publisher</h3>
                <p className="text-slate-700 leading-relaxed">
                    Apuzzo began his formal culinary education while working in a bakery
                    in his home town of Anacapri. At fourteen, he left Capri to travel to
                    Germany, Switzerland, England and South America to further his
                    culinary training in Europe and abroad.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                    After working 35 years in kitchens all over the world, Apuzzo moved to
                    Bermuda in 1973 to work at the Southampton Princess Hotel and later
                    the Hamilton Princess Hotel. In 1975, he came to the United States
                    as Executive Sous-Chef of the Omni International Hotel in Atlanta,
                    Georgia. In 1977, he moved to New Orleans as Executive Chef of the
                    Royal Orleans Hotel, a position he held until January 1985 when he
                    left to open Andrea&apos;s.
                </p>
            </div>
        </Section>
    );
}
