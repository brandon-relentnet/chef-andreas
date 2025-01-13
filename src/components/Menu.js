import Link from "next/link";

export default async function Menu() {
    let menuData = [];

    try {
        const res = await fetch(`${process.env.WEB_URL || "http://localhost:3000"}/api/menu`, {
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error("Failed to fetch menu data");
        }
        menuData = await res.json();
    } catch (error) {
        console.error("Error fetching menu data:", error);
    }

    if (!menuData || menuData.length === 0) {
        return (
            <div className="text-center">
                <h1>Menu is currently unavailable.</h1>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen p-8 max-w-4xl mx-auto">
            {menuData.map((category) => (
                <section key={category.id} className="mb-12">
                    <h2 className="font-bold text-forestGreen mb-4">{category.category}</h2>
                    <ul className="space-y-4">
                        {category.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-4"
                            >
                                <div>
                                    {/* Link to /product/[id] */}
                                    <Link href={`/product/${item.id}`}>
                                        <h3 className="font-bold text-deepRed cursor-pointer">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-softBrown mt-1">{item.description}</p>
                                </div>
                                <span className="text-deepRed font-semibold mt-2 md:mt-0">
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
