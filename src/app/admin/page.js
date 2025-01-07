"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
    const [menuData, setMenuData] = useState([]);

    // For adding a new item
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    // NEW: State for the file
    const [imageFile, setImageFile] = useState(null);

    // For manage mode (deleting individual / multiple items):
    const [selectedItems, setSelectedItems] = useState(new Set());

    useEffect(() => {
        fetchMenu();
    }, []);

    async function fetchMenu() {
        try {
            const res = await fetch("/api/menu");
            if (!res.ok) {
                throw new Error("Failed to fetch menu");
            }
            const data = await res.json();
            setMenuData(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            alert("Unable to load menu data.");
        }
    }

    /**
     * Handle adding a new item with optional image upload
     */
    const handleAddItem = async (e) => {
        e.preventDefault();

        const category = newCategory.trim() ? newCategory : selectedCategory;
        if (!category || !name || !description || !price) {
            alert("Please fill all fields (category, name, description, price).");
            return;
        }

        try {
            // Build multipart/form-data
            const formData = new FormData();
            formData.append("category", category);
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);

            // If the user selected a file, append it
            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch("/api/menu", {
                method: "POST",
                // Notice: We do NOT set "Content-Type" header manually,
                // fetch will set it automatically for FormData
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to add item");
            }

            alert("Item added successfully!");
            // Reset form fields
            setSelectedCategory("");
            setNewCategory("");
            setName("");
            setDescription("");
            setPrice("");
            setImageFile(null);
            // Refetch menu to show the newly added item (with image if any)
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    /**
     * Delete a single item (by id & category).
     * This assumes your DELETE endpoint can handle something like:
     *   /api/menu?category=SomeCategory&itemId=123
     */
    const handleDeleteItem = async (categoryName, itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const query = new URLSearchParams({
                category: categoryName,
                itemId: String(itemId),
            });
            const res = await fetch(`/api/menu?${query}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete item");
            }
            alert("Item deleted successfully!");
            fetchMenu();
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    /**
     * Handle checkbox toggles for multiple item selection
     */
    const toggleItemSelection = (itemKey) => {
        // itemKey could be something like "categoryName|itemId"
        const newSet = new Set(selectedItems);
        if (newSet.has(itemKey)) {
            newSet.delete(itemKey);
        } else {
            newSet.add(itemKey);
        }
        setSelectedItems(newSet);
    };

    /**
     * Mass delete selected items
     * - We'll pass an array of item + category references to the server
     * - You might need a custom route or handle them one by one
     */
    const handleMassDelete = async () => {
        if (selectedItems.size === 0) {
            alert("No items selected.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete all selected items?")) {
            return;
        }

        // Example: build a request body: { items: [ { category: 'xyz', itemId: 1 }, ... ] }
        const itemsToDelete = [];
        for (const key of selectedItems) {
            const [catName, itemId] = key.split("|");
            itemsToDelete.push({ category: catName, itemId: Number(itemId) });
        }

        try {
            const res = await fetch("/api/menu", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: itemsToDelete }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete items");
            }
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
     * Delete entire category (and all items in it)
     */
    const handleDeleteCategory = async (categoryName) => {
        if (!window.confirm(`Delete category "${categoryName}" and all items?`)) return;
        try {
            const query = new URLSearchParams({ category: categoryName });
            // We'll assume if there's no itemId param, the server deletes the entire category
            const res = await fetch(`/api/menu?${query}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete category");
            }
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
            <form
                onSubmit={handleAddItem}
                className="mb-8 border border-softBrown p-4 rounded"
            >
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
                        className="border p-2 rounded w-full"
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
                        className="border p-2 rounded w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="text-softBrown block mb-1">Description:</label>
                    <textarea
                        className="border p-2 rounded w-full"
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
                        className="border p-2 rounded w-full"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* NEW: Image Upload */}
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
