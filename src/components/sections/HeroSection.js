import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <div className="bg-cream min-h-screen flex flex-col items-center justify-center text-center p-8">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: 'url("/ca_hero_background_3.jpg")' }}
            ></div>

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-4xl">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <Image
                        src="/ca_logo.png"
                        width={96}
                        height={97}
                        alt="Chef Andreas Logo"
                    />
                </div>

                {/* Title */}
                <h1 className="font-bold text-slate-800 leading-tight">
                    Cucina <span className="text-deepRed">Andreas</span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-700 text-xl">
                    Buon Appetito! Traditional Italian dishes, made with love and care.
                </p>

                {/* Call to Action Buttons */}
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
        </div>
    );
}