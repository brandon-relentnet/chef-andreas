import Section from "./Section";

export default function TestimonialsSection() {
    return (
        <Section backgroundColor="bg-[#f7e9d3]" withBoxShadow>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-bold text-deepRed mb-6">What Our Customers Say</h2>
                <p className="text-slate-700 mb-12">
                    Our food isn’t just a meal—it’s an experience. Here’s what our
                    customers have to say.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <blockquote className="p-6 border-l-4 border-deepRed bg-cream shadow rounded">
                        <p className="italic text-slate-800">
                            &quot;The lasagna was absolutely divine. I felt like I was back in Italy!&quot;
                        </p>
                        <footer className="mt-4 font-semibold text-forestGreen">- Maria G.</footer>
                    </blockquote>
                    <blockquote className="p-6 border-l-4 border-deepRed bg-cream shadow-sm rounded">
                        <p className="italic text-slate-800">
                            &quot;Fresh, flavorful, and perfectly crafted—Chef Andreas never disappoints.&quot;
                        </p>
                        <footer className="mt-4 font-semibold text-forestGreen">- Giovanni R.</footer>
                    </blockquote>
                </div>
            </div>
        </Section>
    );
}
