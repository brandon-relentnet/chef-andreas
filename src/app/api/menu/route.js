// app/api/menu/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";

/**
 * GET: Get All Categories & Items
 */
export async function GET() {
    try {
        const [categories] = await db.query(`SELECT * FROM categories`);
        // For each category, fetch items
        const results = [];
        for (const cat of categories) {
            const [items] = await db.query(
                `SELECT * FROM items WHERE categoryId = ?`,
                [cat.id]
            );
            results.push({
                id: cat.id,
                category: cat.name,
                items: items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    description: i.description,
                    price: i.price,
                })),
            });
        }
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error fetching menu data:", error);
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}

/**
 * POST: Add a new Item
 * Body: { category: "...", name: "...", description: "...", price: 12 }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { category, name, description, price } = body;

        // 1. Find or create the category
        let [categories] = await db.query(
            `SELECT id FROM categories WHERE name = ? LIMIT 1`,
            [category]
        );

        let categoryId;
        if (categories.length === 0) {
            // Insert new category
            const [catResult] = await db.query(
                `INSERT INTO categories (name) VALUES (?)`,
                [category]
            );
            categoryId = catResult.insertId;
        } else {
            categoryId = categories[0].id;
        }

        // 2. Insert item
        await db.query(
            `INSERT INTO items (name, description, price, categoryId)
       VALUES (?, ?, ?, ?)`,
            [name, description, price, categoryId]
        );

        return NextResponse.json({ message: "Item added successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error adding menu item:", error);
        return NextResponse.json({ error: "Failed to add item" }, { status: 400 });
    }
}

/**
 * DELETE: Remove an item by name & category
 * Usage: /api/menu?category=SomeCategory&name=SomeItem
 */
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryName = searchParams.get("category");
        const itemName = searchParams.get("name");

        // 1. Get category
        const [categories] = await db.query(
            `SELECT id FROM categories WHERE name = ? LIMIT 1`,
            [categoryName]
        );
        if (categories.length === 0) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        const categoryId = categories[0].id;

        // 2. Check item in that category
        const [items] = await db.query(
            `SELECT id FROM items WHERE name = ? AND categoryId = ? LIMIT 1`,
            [itemName, categoryId]
        );
        if (items.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        const itemId = items[0].id;

        // 3. Delete item
        await db.query(`DELETE FROM items WHERE id = ?`, [itemId]);

        return NextResponse.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 400 });
    }
}
