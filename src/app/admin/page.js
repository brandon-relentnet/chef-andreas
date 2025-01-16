"use client";
import { useState, useEffect } from "react";
import Section from "@/components/sections/Section";

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
        <div>
            <Section backgroundColor="bg-[#f7e9d3]" withBoxShadow>
                {/* ADD ITEM FORM */}
                <form onSubmit={handleAddItem}>
                    <h2 className="text-deepRed mb-4">Add New Menu Item</h2>

                    {/* Existing Category Dropdown */}
                    <div className="mb-4">
                        <label className="text-slate-700 block mb-1">Select Existing Category:</label>
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
                        <label className="text-slate-700 block mb-1">Or Add a New Category:</label>
                        <input
                            type="text"
                            className="border-2 border-cream hover:border-deepRed focus:border-forestGreen p-2 rounded w-full outline-none bg-cream transition duration-300"
                            value={newCategory}
                            onChange={(e) => {
                                setNewCategory(e.target.value);
                                setSelectedCategory("");
                            }}
                        />
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                        <label className="text-slate-700 block mb-1">Item Name:</label>
                        <input
                            type="text"
                            className="border-2 border-cream hover:border-deepRed focus:border-forestGreen p-2 rounded w-full outline-none bg-cream transition duration-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="text-slate-700 block mb-1">Description:</label>
                        <textarea
                            className="border-2 border-cream hover:border-deepRed focus:border-forestGreen p-2 rounded w-full outline-none bg-cream transition duration-300"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <label className="text-slate-700 block mb-1">Price:</label>
                        <input
                            type="number"
                            step="0.01"
                            className="border-2 border-cream hover:border-deepRed focus:border-forestGreen p-2 rounded w-full outline-none bg-cream transition duration-300"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    {/* Featured Checkbox */}
                    <div className="mb-4 inline-flex items-center">
                        <label className="flex items-center cursor-pointer relative" htmlFor="featured">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={isFeatured}
                                onChange={() => setIsFeatured(!isFeatured)}
                                className="peer h-5 w-5 cursor-pointer transition duration-300 appearance-none rounded shadow hover:shadow-md bg-cream border-2 border-cream hover:border-deepRed checked:bg-forestGreen checked:border-forestGreen checked:hover:border-forestGreen"
                            />
                            <span className="absolute text-cream opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                    stroke="currentColor" strokeWidth="1">
                                    <path fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                        <label htmlFor="featured" className="cursor-pointer ml-2 text-slate-700">
                            Mark as Featured
                        </label>
                    </div>

                    {/* Image Upload (optional) */}
                    <div className="mb-4">
                        <label className="text-slate-700 block mb-1">Image (optional):</label>
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
            </Section>

            <Section backgroundColor="bg-cream">
                {/* MANAGE ITEMS SECTION */}
                <h2 className="font-bold mb-6 text-deepRed">Manage Items</h2>

                {menuData.length === 0 ? (
                    <p>No categories or items found.</p>
                ) : (
                    <>
                        {menuData.map((cat) => (
                            <div key={cat.id} className="mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800">{cat.category}</h3>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.category)}
                                        className="bg-red-300 text-cream px-3 py-1 rounded hover:bg-red-500 hover:text-white transition duration-300"
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
                                                    <span className="font-semibold text-slate-800 text-xl">{item.name}</span>{" "}
                                                    - <span className="text-forestGreen">${item.price}</span>
                                                    <p className="text-slate-700 text-sm mb-2">{item.description}</p>

                                                    {/* Featured Toggle */}
                                                    <div>
                                                        <div className="mb-4 inline-flex items-center mr-8">
                                                            <label className="flex items-center cursor-pointer relative" htmlFor={`mass-featured-${item.id}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.featured}
                                                                    onChange={() => handleToggleFeatured(item.id, item.featured)}
                                                                    id={`mass-featured-${item.id}`}
                                                                    className="peer h-5 w-5 cursor-pointer transition duration-300 appearance-none rounded shadow hover:shadow-md bg-[#f7e9d3] border-2 border-slate-600 hover:border-deepRed checked:bg-forestGreen checked:border-forestGreen checked:hover:border-forestGreen"
                                                                />
                                                                <span className="absolute text-[#f7e9d3] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                                        stroke="currentColor" strokeWidth="1">
                                                                        <path fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                            <label htmlFor={`mass-featured-${item.id}`} className="cursor-pointer ml-2 text-slate-700">
                                                                Mark as Featured
                                                            </label>
                                                        </div>
                                                        <div className="mb-4 inline-flex items-center">
                                                            {/* Checkbox for mass delete */}
                                                            <label className="flex items-center cursor-pointer relative" htmlFor={`mass-delete-${item.id}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleItemSelection(itemKey)}
                                                                    id={`mass-delete-${item.id}`}
                                                                    className="peer h-5 w-5 cursor-pointer transition duration-300 appearance-none rounded shadow hover:shadow-md bg-[#f7e9d3] border-2 border-slate-600 hover:border-deepRed checked:bg-deepRed checked:border-deepRed"
                                                                />
                                                                <span className="absolute text-[#f7e9d3] opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                                        stroke="currentColor" strokeWidth="1">
                                                                        <path fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                            <label htmlFor={`mass-delete-${item.id}`} className="cursor-pointer ml-2 text-slate-700">
                                                                Mark for Deletion
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteItem(cat.category, item.id)}
                                                    className="bg-red-300 text-cream px-2 py-1 rounded hover:bg-red-500 hover:text-white transition duration-300"
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
                                    className="bg-red-300 text-cream px-4 py-2 rounded fixed bottom-0 left-1/2 mb-4 mr-4 -translate-x-1/2 hover:bg-red-500 hover:text-white transition duration-300"
                            >
                                Delete Selected Items
                            </button>
                        )}
                    </>
                )}
            </Section>
        </div>
    );
}
