import HeroSection from "@/components/HeroSection";
import Menu from "@/components/Menu";
import Link from "next/link";
import Image from "next/image";
import FeaturedCarousel from "@/components/carousel/FeaturedCarousel";

const OPTIONS = { align: 'start', loop: true, dragFree: true }
const SLIDE_COUNT = 10
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Carousel */}
      <section className="bg-[#f7e9d3] relative py-28 px-8 text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            boxShadow: "inset 0px 0px 30px rgba(0, 0, 0, 0.2)",
            opacity: 0.2,
            zIndex: 0,
          }}
        />
        
        {/* Content */}
        <h2 className="font-bold text-deepRed mb-6 text-center">
          Signature Dishes
        </h2>
        <p className="text-slate-700 mb-12 text-center">
          Explore a curated selection of our customer favorites. Buon Appetito!
        </p>
        <FeaturedCarousel slides={SLIDES} options={OPTIONS} />
      </section>
      {/* How It Works */}
      <section className="bg-cream px-8 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: .2,
            zIndex: 0,
          }}
        />

        <div className="relative max-w-6xl mx-auto z-10 py-28">
          <h2 className="text-center text-deepRed font-bold mb-8 z-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/ca_order_online.jpg"
                  alt="Order Online"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">1. Order Online</h3>
              <p className="text-slate-700">
                Browse our menu and place your order from the comfort of your home.
              </p>
            </div>
            <div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/ca_chef_preparing.jpg"
                  alt="Chef Prepares"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">2. Chef Prepares</h3>
              <p className="text-slate-700">
                We prepare every dish fresh, using the finest ingredients.
              </p>
            </div>
            <div>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/ca_pick_up.jpg"
                  alt="Pick Up"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">3. Pick Up & Enjoy</h3>
              <p className="text-slate-700">
                Pick up your warm, delicious meal at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Chef Andreas */}
      <section className="bg-[#f7e9d3] relative py-28 px-8 text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            boxShadow: "inset 0px 0px 30px rgba(0, 0, 0, 0.2)",
            opacity: 0.2,
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto">
          <h2 className="font-bold text-deepRed mb-6">Di Chef Andreas</h2>
          <Image
            src="/images/ca_about_me_2.jpg"
            alt="Chef Andreas"
            width={400}
            height={400}
            className="rounded shadow-lg mx-auto mb-12"
          />
          <h3 className="font-bold text-slate-800 mb-6">Award Winning Chef & Publisher</h3>
          <p className="text-slate-700 leading-relaxed">
            Apuzzo began his formal culinary education while working in a bakery in his home town of Anacapri. At fourteen, he left Capri to travel to Germany, Switzerland, England and South America to further his culinary training in Europe and abroad.
          </p>
          <p className="text-slate-700 leading-relaxed">
            After working 35 years in kitchens all over the world, Apuzzo moved to Bermuda in 1973 to work at the Southampton Princess Hotel and later the Hamilton Princess Hotel. In 1975, he came to the United States as Executive Sous-Chef of the Omni International Hotel in Atlanta, Georgia. In 1977, he moved to New Orleans as Executive Chef of the Royal Orleans Hotel, a position he held until January 1985 when he left to open Andrea's.
          </p>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="bg-cream py-28 px-8 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.2,
            zIndex: 0,
          }}
        />

        <div className="max-w-4xl mx-auto z-10 relative">
          <h2 className="font-bold text-deepRed mb-6 text-center">
            Il Menù
          </h2>
          <p className="text-slate-700 mb-12 text-center">
            View our curated selection of traditional Italian dishes, click on any item to view more details.
          </p>
          <Menu />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f7e9d3] py-28 px-8 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            boxShadow: "inset 0px 0px 30px rgba(0, 0, 0, 0.2)",
            opacity: 0.2,
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-deepRed mb-6">
            What Our Customers Say
          </h2>
          <p className="text-slate-700 mb-12">
            Our food isn’t just a meal—it’s an experience. Here’s what our customers have to say.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="p-6 border-l-4 border-deepRed bg-cream shadow rounded">
              <p className="italic text-slate-800">
                "The lasagna was absolutely divine. I felt like I was back in Italy!"
              </p>
              <footer className="mt-4 font-semibold text-forestGreen">- Maria G.</footer>
            </blockquote>
            <blockquote className="p-6 border-l-4 border-deepRed bg-cream shadow-sm rounded">
              <p className="italic text-slate-800">
                "Fresh, flavorful, and perfectly crafted—Chef Andreas never disappoints."
              </p>
              <footer className="mt-4 font-semibold text-forestGreen">- Giovanni R.</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-cream py-16 px-8 text-center text-slate-800 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture_2.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.2,
            zIndex: 0,
          }}
        />

        <div className="max-w-4xl mx-auto relative py-28 z-10">
          <h2 className="font-bold text-deepRed mb-6">Ready to Savor the Taste of Italy?</h2>
          <p className="text-slate-700 mb-8">
            Your next favorite meal is just a few clicks away. Explore our menu and place your order today!
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
      </section>
    </>
  );
}
