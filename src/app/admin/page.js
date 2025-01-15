"use client";
import { useState, useEffect } from "react";

/**
 * A small helper function to handle fetch requests
 * and standardize error handling. This avoids repeating the
 * same "check if res.ok" logic and JSON parsing in multiple places.
 */
async function fetcher(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) {
        let errMsg = "Unknown error occurred";
        try {
            const data = await res.json();
            errMsg = data.error || errMsg;
        } catch {
            // no-op if parsing fails, fallback to errMsg
        }
        throw new Error(errMsg);
    }
    return res.json();
}

export default function AdminPage() {
    const [menuData, setMenuData] = useState([]);

    // For adding a new item
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isFeatured, setIsFeatured] = useState(false); // <--- NEW

    // For the optional image upload
    const [imageFile, setImageFile] = useState(null);

    // For managing multiple selections (mass delete)
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Fetch menu data on mount
    useEffect(() => {
        fetchMenu();
    }, []);

    /**
     * Fetch the menu data from /api/menu (all categories & items)
     */
    async function fetchMenu() {
        try {
            const data = await fetcher("/api/menu");
            setMenuData(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            alert("Unable to load menu data.\n" + (error.message || ""));
        }
    }

    /**
     * Handle adding a new item (with optional image + featured).
     */
    const handleAddItem = async (e) => {
        e.preventDefault();

        // Decide which category to use: existing dropdown vs. new text field
        const category = newCategory.trim() ? newCategory : selectedCategory;
        if (!category || !name || !description || !price) {
            alert("Please fill all fields (category, name, description, price).");
            return;
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            alert("Please enter a valid price (must be a positive number).");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("category", category);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", parsedPrice);
            // If the featured checkbox is checked, pass "on"
            if (isFeatured) {
                formData.append("featured", "on");
            }

            if (imageFile) {
                formData.append("image", imageFile);
            }

            // POST the new item
            const res = await fetch("/api/menu", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add item");
            }

            alert("Item added successfully!");
            // Reset form fields
            setSelectedCategory("");
            setNewCategory("");
            setName("");
            setDescription("");
            setPrice("");
            setImageFile(null);
            setIsFeatured(false);

            // Refetch menu to show the newly added item
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    /**
     * Example: Toggle an item’s featured status after creation.
     * (Requires a PATCH method in your route.js, as shown in the snippet above.)
     */
    async function handleToggleFeatured(itemId, currentValue) {
        const newValue = !currentValue;
        try {
            // This assumes you've implemented PATCH in your route.js
            await fetcher("/api/menu", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemId,
                    featured: newValue, // boolean
                }),
            });
            fetchMenu();
        } catch (err) {
            console.error(err);
            alert(err.message || "Unable to toggle featured status");
        }
    }

    /**
     * Delete a single item by (categoryName, itemId).
     */
    const handleDeleteItem = async (categoryName, itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const query = new URLSearchParams({
                category: categoryName,
                itemId: String(itemId),
            });
            await fetcher(`/api/menu?${query}`, { method: "DELETE" });
            alert("Item deleted successfully!");
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    /**
     * Toggle item checkbox (used for mass delete).
     * itemKey could be something like: "CategoryName|itemId"
     */
    const toggleItemSelection = (itemKey) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(itemKey)) {
            newSet.delete(itemKey);
        } else {
            newSet.add(itemKey);
        }
        setSelectedItems(newSet);
    };

    /**
     * Mass delete items that were selected.
     */
    const handleMassDelete = async () => {
        if (selectedItems.size === 0) {
            alert("No items selected.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete all selected items?")) {
            return;
        }

        // Build the request body
        const itemsToDelete = [];
        for (const key of selectedItems) {
            const [catName, itemId] = key.split("|");
            itemsToDelete.push({ category: catName, itemId: Number(itemId) });
        }

        try {
            await fetcher("/api/menu", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsToDelete }),
            });
            alert("Selected items deleted successfully!");
            // Clear selection
            setSelectedItems(new Set());
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    /**
     * Delete an entire category (and all items in it).
     */
    const handleDeleteCategory = async (categoryName) => {
        if (!window.confirm(`Delete category "${categoryName}" and all its items?`)) return;
        try {
            const query = new URLSearchParams({ category: categoryName });
            await fetcher(`/api/menu?${query}`, { method: "DELETE" });
            alert(`Category "${categoryName}" deleted successfully!`);
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    return (
        <div className="p-6 my-20">
            <h1 className="text-forestGreen mb-6">Admin Page</h1>

            {/* ADD ITEM FORM */}
            <form onSubmit={handleAddItem} className="mb-8 border border-softBrown p-4 rounded">
                <h2 className="text-deepRed mb-4">Add New Menu Item</h2>

                {/* Existing Category Dropdown */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Select Existing Category:</label>
                    <select
                        className="border p-2 rounded w-full"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setNewCategory("");
                        }}
                    >
                        <option value="">-- None / Not Selected --</option>
                        {menuData.map((cat) => (
                            <option key={cat.id} value={cat.category}>
                                {cat.category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* OR Add New Category */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Or Add a New Category:</label>
                    <input
                        type="text"
                        className="border p-2 rounded w-full outline-none"
                        value={newCategory}
                        onChange={(e) => {
                            setNewCategory(e.target.value);
                            setSelectedCategory("");
                        }}
                        placeholder="Type a new category name..."
                    />
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Item Name:</label>
                    <input
                        type="text"
                        className="border p-2 rounded w-full outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Description:</label>
                    <textarea
                        className="border p-2 rounded w-full outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="border p-2 rounded w-full outline-none"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* Featured Checkbox */}
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={isFeatured}
                        onChange={() => setIsFeatured(!isFeatured)}
                        className="mr-2"
                    />
                    <label htmlFor="featured" className="text-softBrown">
                        Mark as Featured
                    </label>
                </div>

                {/* Image Upload (optional) */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Image (optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />
                    {imageFile && (
                        <p className="text-sm text-gray-700 mt-1">Selected: {imageFile.name}</p>
                    )}
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Item
                </button>
            </form>

            {/* MANAGE ITEMS SECTION */}
            <section className="border border-gray-300 p-4 rounded">
                <h2 className="text-2xl font-bold mb-4">Manage Items</h2>

                {menuData.length === 0 ? (
                    <p>No categories or items found.</p>
                ) : (
                    <>
                        {menuData.map((cat) => (
                            <div key={cat.id} className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold">{cat.category}</h3>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.category)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete Entire Category
                                    </button>
                                </div>

                                <ul className="pl-4 mt-2">
                                    {cat.items.map((item) => {
                                        const itemKey = `${cat.category}|${item.id}`;
                                        const isSelected = selectedItems.has(itemKey);

                                        return (
                                            <li key={item.id} className="flex items-center justify-between mb-2">
                                                <div>
                                                    {/* Checkbox for mass delete */}
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleItemSelection(itemKey)}
                                                        className="mr-2"
                                                    />
                                                    <span className="font-semibold">{item.name}</span>{" "}
                                                    - ${item.price}
                                                    <p className="text-sm text-gray-600">{item.description}</p>

                                                    {/**
                           * Optional: Toggle featured with a small button
                           * if you have PATCH logic set up in the route
                           */}
                                                    <div className="mt-1">
                                                        <label className="mr-2">Featured:</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.featured}
                                                            onChange={() => handleToggleFeatured(item.id, item.featured)}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteItem(cat.category, item.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}

                        {/* Mass Delete Button */}
                        {selectedItems.size > 0 && (
                            <button
                                onClick={handleMassDelete}
                                className="bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Delete Selected Items
                            </button>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}
