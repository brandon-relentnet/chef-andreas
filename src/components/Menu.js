import Link from "next/link";

export const revalidate = 60; // re-generate every 60 seconds

export default async function MenuPage() {
    let menuData = [];

    try {
        // no need for cache: 'no-store' if you want ISR
        const res = await fetch(`${process.env.WEB_URL}/api/menu`);
        if (!res.ok) {
            throw new Error("Failed to fetch menu data");
        }
        menuData = await res.json();
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto ">
            {menuData.map((category) => (
                <section key={category.id} className="mb-12">
                    <h2 className="font-bold text-deepRed mb-4">{category.category}</h2>
                    <ul className="space-y-4">
                        {category.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-4"
                            >
                                <div>
                                    <Link href={`/product/${item.id}`}>
                                        <h3 className="font-bold text-slate-800 cursor-pointer">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-slate-700 mt-1">{item.description}</p>
                                </div>
                                <span className="text-forestGreen font-semibold mt-2 md:mt-0">
                                    ${item.price}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}
