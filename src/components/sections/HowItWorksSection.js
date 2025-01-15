import Section from "./Section";
import Image from "next/image";

export default function HowItWorksSection() {
    return (
        <Section backgroundColor="bg-cream">
            <div className="py-0 md:py-28">
                <h2 className="text-center text-deepRed font-bold mb-8">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {/* Step 1 */}
                    <div>
                        <div className="relative w-48 h-48 mx-auto mb-4">
                            <Image
                                src="/images/ca_order_online.jpg"
                                alt="Order Online"
                                fill
                                className="rounded-full shadow-lg object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 300px"
                            />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">1. Order Online</h3>
                        <p className="text-slate-700">
                            Browse our menu and place your order from the comfort of your home.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div>
                        <div className="relative w-48 h-48 mx-auto mb-4">
                            <Image
                                src="/images/ca_chef_preparing.jpg"
                                alt="Chef Prepares"
                                fill
                                className="rounded-full shadow-lg object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 300px"
                            />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">2. Chef Prepares</h3>
                        <p className="text-slate-700">
                            We prepare every dish fresh, using the finest ingredients.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div>
                        <div className="relative w-48 h-48 mx-auto mb-4">
                            <Image
                                src="/images/ca_pick_up.jpg"
                                alt="Pick Up"
                                fill
                                className="rounded-full shadow-lg object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 300px"
                            />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">3. Pick Up & Enjoy</h3>
                        <p className="text-slate-700">
                            Pick up your warm, delicious meal at your convenience.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
