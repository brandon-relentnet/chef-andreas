// /components/carousel/FeaturedCarousel.js
"use client";

import { DotButton, useDotButton } from "./FeaturedCarouselDotButton";
import {
    PrevButton,
    NextButton,
    usePrevNextButtons,
} from "./FeaturedCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";

const FeaturedCarousel = (props) => {
    const { slides, options } = props;
    // Now `slides` is an array of objects: [{ id, name, price, imageUrl, ...}, ...]

    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {/* Map over each item object instead of an index */}
                    {slides.map((item) => (
                        <div className="embla__slide" key={item.id}>
                            <Link href={`/product/${item.id}`}>
                            {/* Use the item’s imageUrl, name, and price */}
                            <Image
                                src={item.imageUrl || "/no-image.jpg"}
                                alt={item.name}
                                className="embla__slide__img rounded shadow"
                                width={400}
                                height={400}
                            />
                            <div className="embla__slide__details p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                    <p className="text-forestGreen mb-0 ml-2">${item.price}</p>
                                </div>
                                <p className="text-slate-700">{item.description}</p>
                            </div>
                            </Link>
                        </div>
                    ))}

                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={
                                "embla__dot" + (index === selectedIndex ? " embla__dot--selected" : "")
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCarousel;
