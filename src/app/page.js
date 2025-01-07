import HeroSection from "@/components/HeroSection";
import Menu from "@/components/Menu";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="page-container">
        <h1 className="font-bold text-deepRed text-center mb-12">
          Menu
        </h1>
        <Menu />
      </div>
    </>
  );
}
