import Image from 'next/image';

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
                        height={96}
                        alt="Chef Andreas Logo"
                        className="h-24 w-auto"
                    />
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold text-deepRed leading-tight md:text-9xl">
                    Welcome to <span className="text-forestGreen">Chef Andreas</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-softBrown mt-4 md:text-xl">
                    Buon Appetito! Traditional Italian dishes, made with love and care.
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-wrap justify-center mt-8 gap-4">
                    <a
                        href="/menu"
                        className="bg-deepRed text-cream font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-forestGreen transition"
                    >
                        Explore Menu
                    </a>
                    <a
                        href="/order"
                        className="bg-goldenYellow text-deepRed font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-forestGreen hover:text-cream transition"
                    >
                        Order Online
                    </a>
                </div>
            </div>
        </div>
    );
}