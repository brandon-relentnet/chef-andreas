"use client"; // we need a client component to handle form submissions

import { useState } from "react";

export default function AdminPage() {
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    // For delete
    const [deleteCategory, setDeleteCategory] = useState("");
    const [deleteName, setDeleteName] = useState("");

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!category || !name || !description || !price) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await fetch("/api/menu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ category, name, description, price }),
            });

            if (!res.ok) {
                throw new Error("Failed to add item");
            }
            alert("Item added successfully!");
            // Reset form fields
            setCategory("");
            setName("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    const handleDeleteItem = async (e) => {
        e.preventDefault();
        if (!deleteCategory || !deleteName) {
            alert("Please fill in category and item name to delete");
            return;
        }

        try {
            const query = new URLSearchParams({
                category: deleteCategory,
                name: deleteName,
            }).toString();

            const res = await fetch(`/api/menu?${query}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to delete item");
            }

            alert("Item deleted successfully!");
            // Reset fields
            setDeleteCategory("");
            setDeleteName("");
        } catch (error) {
            console.error(error);
            alert(error.message || "Something went wrong");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Page</h1>

            {/* ADD ITEM FORM */}
            <form onSubmit={handleAddItem} className="mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
                <div className="mb-2">
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <div className="mb-2">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <div className="mb-2">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <div className="mb-2">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Add Item
                </button>
            </form>

            {/* DELETE ITEM FORM */}
            <form onSubmit={handleDeleteItem}>
                <h2 className="text-xl font-bold mb-4">Delete Menu Item</h2>
                <div className="mb-2">
                    <label>Category:</label>
                    <input
                        type="text"
                        value={deleteCategory}
                        onChange={(e) => setDeleteCategory(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <div className="mb-2">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={deleteName}
                        onChange={(e) => setDeleteName(e.target.value)}
                        className="border p-1 ml-2"
                    />
                </div>
                <button type="submit" className="bg-red-500 text-white p-2 rounded">
                    Delete Item
                </button>
            </form>
        </div>
    );
}
