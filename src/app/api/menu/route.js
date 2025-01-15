// app/api/menu/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";

export async function PATCH(request) {
    const { itemId, featured } = await request.json();
    await db.query(`UPDATE items SET featured=? WHERE id=?`, [featured ? 1 : 0, itemId]);
    return NextResponse.json({ message: "Featured updated" });
}

/**
 * GET: Get All Categories & Items
 * Optional: If `?featured=1`, only return featured items (flattened or grouped).
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const featuredParam = searchParams.get("featured"); // '1' or null

        // If we're only fetching featured items
        if (featuredParam === "1") {
            // Grab only items that are featured, plus category data if needed
            const [rows] = await db.query(`
        SELECT i.id, i.name, i.description, i.price, i.imageUrl, i.featured,
               c.id as categoryId, c.name as categoryName
        FROM items i
        JOIN categories c ON i.categoryId = c.id
        WHERE i.featured = 1
      `);
            // Return as a flat list of featured items (each includes category info if desired)
            return NextResponse.json(rows);
        }

        // Otherwise, get all categories, plus their items
        const [categories] = await db.query(`SELECT * FROM categories`);
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
                    imageUrl: i.imageUrl,
                    featured: !!i.featured, // boolean
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
 * POST: Add a new Item (with optional image upload).
 * Now also handles `featured` (boolean).
 */
export async function POST(request) {
    try {
        const form = await request.formData();
        const category = form.get("category");
        const name = form.get("name");
        const description = form.get("description");
        const price = form.get("price");
        const file = form.get("image");
        // If you add a checkbox named "featured" in your form, it might come back as "on".
        // For example: formData.append("featured", featured ? "on" : "");
        let featured = form.get("featured"); // could be "on" or "" or null

        // Basic fields check
        if (!category || !name || !description || !price) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Convert featured to a 0/1
        // If your form uses "on" for featured, do this:
        featured = featured === "on" ? 1 : 0;

        // 1) Find or create category
        const [catRows] = await db.query(
            `SELECT id FROM categories WHERE name = ? LIMIT 1`,
            [category]
        );
        let categoryId;
        if (catRows.length === 0) {
            const [catResult] = await db.query(
                `INSERT INTO categories (name) VALUES (?)`,
                [category]
            );
            categoryId = catResult.insertId;
        } else {
            categoryId = catRows[0].id;
        }

        // 2) If we have a file, store it in /public/uploads
        let imageUrl = null;
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = path.extname(file.name) || ".jpg";
            const baseName = path.basename(file.name, ext);
            const timestamp = Date.now();
            const fileName = `${baseName}-${timestamp}${ext}`;
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            await fs.mkdir(uploadsDir, { recursive: true });
            const filePath = path.join(uploadsDir, fileName);
            await fs.writeFile(filePath, buffer);
            imageUrl = "/uploads/" + fileName;
        }

        // 3) Insert item into DB (including featured)
        await db.query(
            `INSERT INTO items (name, description, price, categoryId, imageUrl, featured)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [name, description, parseFloat(price), categoryId, imageUrl, featured]
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
