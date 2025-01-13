import HeroSection from "@/components/HeroSection";
import Menu from "@/components/Menu";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works */}
      <section className="bg-cream py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-forestGreen font-bold mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/ca_order_online.jpg"
                  alt="Order Online"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-deepRed mb-2">1. Order Online</h3>
              <p className="text-softBrown">
                Browse our menu and place your order from the comfort of your home.
              </p>
            </div>
            <div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/ca_chef_preparing.jpg"
                  alt="Chef Prepares"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-deepRed mb-2">2. Chef Prepares</h3>
              <p className="text-softBrown">
                We prepare every dish fresh, using the finest ingredients.
              </p>
            </div>
            <div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/ca_pick_up.jpg"
                  alt="Pick Up"
                  fill
                  className="rounded-full shadow-lg object-cover"
                />
              </div>
              <h3 className="font-bold text-deepRed mb-2">3. Pick Up & Enjoy</h3>
              <p className="text-softBrown">
                Pick up your warm, delicious meal at your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Chef Andreas */}
      <section className="bg-cream relative py-16 px-8 text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.85,
          }}
        ></div>

        {/* Cream Overlay */}
        <div className="absolute inset-0 bg-[#f7e9d3] opacity-70"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto">
          <h2 className="font-bold text-forestGreen mb-6">About Chef Andreas</h2>
          <Image
            src="/images/ca_about_me.jpg"
            alt="Chef Andreas"
            width={400}
            height={400}
            className="rounded shadow-lg mx-auto mb-6"
          />
          <p className="text-softBrown leading-relaxed">
            Chef Andreas blends traditional recipes with a touch of innovation to bring
            authentic Italian cuisine to life. Every dish is crafted with the finest
            ingredients, ensuring an unforgettable dining experience.
          </p>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="bg-cream py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold text-forestGreen mb-6 text-center">
            Our Signature Dishes
          </h2>
          <p className="text-softBrown mb-12 text-center">
            Explore a curated selection of our customer favorites. Buon Appetito!
          </p>
          <Menu />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#f7e9d3] py-16 px-8 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/textures/ca_background_texture.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        ></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-bold text-forestGreen mb-6">
            What Our Customers Say
          </h2>
          <p className="text-softBrown mb-12">
            Our food isn’t just a meal—it’s an experience. Here’s what our customers have to say.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="p-6 border-l-4 border-deepRed bg-white shadow-sm rounded">
              <p className="italic text-softBrown">
                "The lasagna was absolutely divine. I felt like I was back in Italy!"
              </p>
              <footer className="mt-4 font-semibold text-forestGreen">- Maria G.</footer>
            </blockquote>
            <blockquote className="p-6 border-l-4 border-deepRed bg-white shadow-sm rounded">
              <p className="italic text-softBrown">
                "Fresh, flavorful, and perfectly crafted—Chef Andreas never disappoints."
              </p>
              <footer className="mt-4 font-semibold text-forestGreen">- Giovanni R.</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#f7e9d3] py-16 px-8 text-center text-deepRed">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bold mb-6">Ready to Savor the Taste of Italy?</h2>
          <p className="text-softBrown mb-8">
            Your next favorite meal is just a few clicks away. Explore our menu and place your order today!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/menu"
              className="bg-forestGreen text-cream font-bold py-3 px-8 rounded-full shadow-lg hover:bg-deepRed hover:text-cream transition"
            >
              View Menu
            </Link>
            <Link
              href="/order"
              className="bg-forestGreen text-cream font-bold py-3 px-8 rounded-full shadow-lg hover:bg-goldenYellow hover:text-deepRed transition"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
