import Image from "next/image";

export default function Section({
    children,
    backgroundColor = "bg-cream",
    backgroundImg = "/textures/ca_background_texture_2.jpg",
    withBoxShadow = false,
    showVineTopLeft = false,
    showVineBottomRight = false,
    vineImg = "/textures/ca_vine_2.png",
    className = "",
    style = {},
}) {
    return (
        <section
            className={`${backgroundColor} relative py-28 px-8 ${className}`}
            style={style}
        >
            {/* Background Texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url('${backgroundImg}')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.2,
                    zIndex: 0,
                    boxShadow: withBoxShadow
                        ? "inset 0px 0px 30px rgba(0, 0, 0, 0.2)"
                        : "none",
                }}
            />

            {/* Optional Top-Left Vine */}
            {showVineTopLeft && (
                <div
                    className="absolute top-0 left-0 m-4 invisible md:visible"
                    style={{ zIndex: 1 }}
                >
                    <Image
                        src={vineImg}
                        alt="Top-left grape vine"
                        width={250}
                        height={250}
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            )}

            {/* Optional Bottom-Right Vine */}
            {showVineBottomRight && (
                <div
                    className="absolute bottom-0 right-0 m-4 invisible md:visible"
                    style={{ zIndex: 1 }}
                >
                    <Image
                        src={vineImg}
                        alt="Bottom-right grape vine"
                        width={250}
                        height={250}
                        className="rotate-180"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
        </section>
    );
}
