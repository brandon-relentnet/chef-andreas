import Menu from "@/components/Menu";

export default function MenuPage() {
    return (
        <div className="h-screen mt-20">
            <h1 className="font-bold text-deepRed text-center mb-12">
                Chef Andreas&apos; Menu
            </h1>
            <Menu />
        </div>
    );
}