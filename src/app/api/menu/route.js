import { NextResponse } from "next/server";

const menuData = [
    {
        category: "Antipasti (Appetizers)",
        items: [
            {
                name: "Bruschetta al Pomodoro",
                description: "Toasted bread topped with fresh tomatoes, basil, garlic, and olive oil.",
                price: 8,
            },
            {
                name: "Calamari Fritti",
                description: "Lightly battered and fried calamari served with marinara sauce.",
                price: 12,
            },
            {
                name: "Caprese Salad",
                description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze.",
                price: 10,
            },
            {
                name: "Arancini",
                description: "Crispy risotto balls filled with mozzarella and served with marinara.",
                price: 9,
            },
        ],
    },
    {
        category: "Primi (Pastas)",
        items: [
            {
                name: "Spaghetti alla Carbonara",
                description: "Classic Roman pasta with pancetta, eggs, and pecorino cheese.",
                price: 15,
            },
            {
                name: "Fettuccine Alfredo",
                description: "Creamy parmesan sauce over fresh fettuccine pasta.",
                price: 14,
            },
            {
                name: "Penne alla Vodka",
                description: "Penne pasta in a creamy tomato vodka sauce with a touch of chili.",
                price: 16,
            },
            {
                name: "Lasagna alla Bolognese",
                description: "Layers of pasta, rich meat sauce, béchamel, and mozzarella.",
                price: 17,
            },
        ],
    },
    {
        category: "Dolci (Desserts)",
        items: [
            {
                name: "Tiramisu",
                description: "Layers of coffee-soaked ladyfingers, mascarpone cream, and cocoa.",
                price: 7,
            },
            {
                name: "Cannoli",
                description: "Crispy pastry shells filled with sweet ricotta cream and chocolate chips.",
                price: 6,
            },
            {
                name: "Panna Cotta",
                description: "Creamy vanilla custard topped with berry compote.",
                price: 6,
            },
            {
                name: "Gelato Trio",
                description: "Three scoops of artisanal Italian gelato (vanilla, chocolate, pistachio).",
                price: 7,
            },
        ],
    },
];

export async function GET() {
    return NextResponse.json(menuData);
}