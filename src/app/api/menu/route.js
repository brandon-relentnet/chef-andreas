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
 * DELETE logic for multiple scenarios:
 * 1) Mass delete via JSON body: { items: [ { category, itemId }, ... ] }
 * 2) Delete entire category if only "category" is present in query
 * 3) Delete single item if both "category" and "name" or "itemId" are in the query
 */
export async function DELETE(request) {
    try {
        // 1) First, see if there's a JSON body for mass deletion
        // (DELETE with a JSON body is not "standard" HTTP, but works in Next.js/Node)
        let body;
        try {
            body = await request.json();
        } catch {
            // No valid JSON body or not provided - that's okay, we handle other cases below
        }

        // -- MASS DELETE scenario --
        if (body && Array.isArray(body.items)) {
            // body.items might look like [{ category: "Dolci (Desserts)", itemId: 123 }, ...]
            return await massDeleteItems(body.items);
        }

        // 2) Parse query params for single-item or category delete
        const { searchParams } = new URL(request.url);
        const categoryName = searchParams.get("category");
        const itemName = searchParams.get("name");
        const itemId = searchParams.get("itemId");

        // If no category param is provided, we can't do anything
        if (!categoryName) {
            return NextResponse.json(
                { error: "Missing 'category' in query" },
                { status: 400 }
            );
        }

        // -- DELETE ENTIRE CATEGORY scenario --
        // If we have category but NO itemName/NO itemId => delete the entire category
        if (!itemName && !itemId) {
            return await deleteEntireCategory(categoryName);
        }

        // -- DELETE SINGLE ITEM scenario --
        // You might prefer itemId instead of itemName in the query
        if (itemId) {
            return await deleteSingleItemById(categoryName, itemId);
        } else {
            // Fallback to itemName if that's how your admin UI is calling it
            return await deleteSingleItemByName(categoryName, itemName);
        }
    } catch (error) {
        console.error("Error in DELETE /api/menu:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
    }
}

/** 
 * Delete many items in one request 
 * items = [{ category: string, itemId: number }, ...]
 */
async function massDeleteItems(items) {
    // We'll loop over each item and delete them individually
    // or build a more optimized query if you prefer.
    for (const { category, itemId } of items) {
        // 1) Find categoryId by category name
        const [catRows] = await db.query(
            `SELECT id FROM categories WHERE name = ? LIMIT 1`,
            [category]
        );
        if (catRows.length === 0) {
            // Category not found, skip or throw error
            continue;
        }
        const categoryId = catRows[0].id;

        // 2) Delete item by itemId & categoryId
        await db.query(
            `DELETE FROM items 
         WHERE id = ? AND categoryId = ?`,
            [itemId, categoryId]
        );
    }

    return NextResponse.json({ message: "Items deleted successfully (mass delete)" });
}

/** 
 * Delete an entire category by name 
 */
async function deleteEntireCategory(categoryName) {
    // 1) Find the categoryId
    const [categories] = await db.query(
        `SELECT id FROM categories WHERE name = ? LIMIT 1`,
        [categoryName]
    );
    if (categories.length === 0) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const categoryId = categories[0].id;

    // 2) Delete all items in that category
    await db.query(`DELETE FROM items WHERE categoryId = ?`, [categoryId]);

    // 3) Delete the category itself
    await db.query(`DELETE FROM categories WHERE id = ?`, [categoryId]);

    return NextResponse.json({ message: `Category "${categoryName}" deleted.` });
}

/** 
 * Delete a single item by itemId 
 */
async function deleteSingleItemById(categoryName, itemId) {
    // 1) Find categoryId
    const [catRows] = await db.query(
        `SELECT id FROM categories WHERE name = ? LIMIT 1`,
        [categoryName]
    );
    if (catRows.length === 0) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const categoryId = catRows[0].id;

    // 2) Delete item by itemId & categoryId
    const [result] = await db.query(
        `DELETE FROM items 
     WHERE id = ? AND categoryId = ?`,
        [itemId, categoryId]
    );
    if (result.affectedRows === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
}

/** 
 * Delete a single item by item name
 * (Legacy approach if your Admin UI only passes "name")
 */
async function deleteSingleItemByName(categoryName, itemName) {
    // 1) Get categoryId
    const [categories] = await db.query(
        `SELECT id FROM categories WHERE name = ? LIMIT 1`,
        [categoryName]
    );
    if (categories.length === 0) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const categoryId = categories[0].id;

    // 2) Find item by name & categoryId
    const [items] = await db.query(
        `SELECT id FROM items WHERE name = ? AND categoryId = ? LIMIT 1`,
        [itemName, categoryId]
    );
    if (items.length === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const itemId = items[0].id;

    // 3) Delete that item
    await db.query(`DELETE FROM items WHERE id = ?`, [itemId]);

    return NextResponse.json({ message: "Item deleted successfully" });
}
