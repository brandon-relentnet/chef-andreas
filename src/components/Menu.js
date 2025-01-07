export default async function Menu() {
    let menuData = [];

    try {
        const res = await fetch("http://localhost:3000/api/menu", {
            // `cache: 'no-store'` forces a server-side fetch each time
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
        <div className="bg-cream min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-8xl font-bold text-deepRed text-center mb-12">
                    Chef Andreas' Menu
                </h1>

                {menuData.map((category, index) => (
                    <section key={index} className="mb-12">
                        <h2 className="text-6xl font-bold text-forestGreen mb-4">
                            {category.category}
                        </h2>
                        <ul className="space-y-4">
                            {category.items.map((item, itemIndex) => (
                                <li
                                    key={itemIndex}
                                    className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-4"
                                >
                                    <div>
                                        <h3 className="text-4xl font-bold text-deepRed">
                                            {item.name}
                                        </h3>
                                        <p className="text-softBrown text-sm mt-1">
                                            {item.description}
                                        </p>
                                    </div>
                                    <span className="text-deepRed font-semibold text-lg mt-2 md:mt-0">
                                        ${item.price}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
