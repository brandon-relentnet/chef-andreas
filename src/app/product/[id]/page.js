import { notFound } from "next/navigation";
import db from "@/lib/db";
import Image from "next/image";

// Force Next.js to render this page on every request (SSR)
export const dynamic = "force-dynamic";

export default async function ProductPage(props) {
    // Await `props.params`
    const params = await props.params;
    const { id } = params || {};

    // If there's no `id` for some reason, show 404
    if (!id) {
        notFound();
    }

    // Fetch item by ID from your DB
    const [rows] = await db.query(
        `SELECT * FROM items WHERE id = ? LIMIT 1`,
        [id]
    );

    // If no rows returned, show 404
    if (!rows || rows.length === 0) {
        notFound();
    }

    const item = rows[0];

    // Render your product page
    return (
        <div className="max-w-3xl mx-auto p-4 py-20">
            <h2 className="text-deepRed font-bold mb-4">{item.name}</h2>
            <p className="text-softBrown mb-4">{item.description}</p>

            <div className="mb-4">
                <Image
                    src={item.imageUrl || "/no-image.jpg"}
                    alt={item.name}
                    width={800}
                    height={600}
                    className="rounded shadow"
                    style={{ height: "auto" }}
                    priority
                />
            </div>

            <p className="text-xl font-semibold text-deepRed">${item.price}</p>
        </div>
    );
}
