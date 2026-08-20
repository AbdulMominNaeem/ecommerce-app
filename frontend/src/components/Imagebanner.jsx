import React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { ArrowRight } from "lucide-react";

const slides = [
    {
        subtitle: "Best Deal Online on Smart Watches",
        title: "Smart Wearables",
        button: "Up to 80% Off",
        image: "/images/images (1).jpg",
    },
    {
        title: "Fresh Arrivals",
        subtitle: "New products added every week",
        button: "Explore Collection",
        image: "/images/images (2).jpg",
    },
    {
        title: "Fast Delivery",
        subtitle: "Get your order in just a few hours",
        button: "Learn More",
        image: "/images/images.jpg",
    },
];

export default function Imagebanner() {
    const [sliderRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1,
        },
        duration: 900,
    });

    return (
        <section className="bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

            <div
                ref={sliderRef}
                className="keen-slider mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
            >

                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="keen-slider__slide relative min-h-[360px] overflow-hidden sm:min-h-[430px] lg:min-h-[500px]"
                    >

                        {/* Background Image */}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-transparent" />

                        {/* Content */}
                        <div className="relative z-10 flex min-h-[360px] items-center px-7 py-12 sm:min-h-[430px] sm:px-12 lg:min-h-[500px] lg:px-16">

                            <div className="max-w-2xl">

                                {/* Label */}
                                <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                                        Featured Collection
                                    </span>
                                </div>

                                {/* Subtitle */}
                                <p className="mb-3 max-w-lg text-base font-medium text-white/80 sm:text-lg">
                                    {slide.subtitle}
                                </p>

                                {/* Title */}
                                <h2 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                    {slide.title}
                                </h2>

                                {/* Description */}
                                <p className="mt-5 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
                                    Discover premium products at exceptional prices.
                                    Shop our latest collection today.
                                </p>

                                {/* CTA */}
                                <button
                                    className="
                                        mt-8
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        bg-cyan-500
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-bold
                                        text-slate-950
                                        shadow-lg
                                        shadow-cyan-500/20
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-cyan-400
                                        hover:shadow-cyan-400/30
                                    "
                                >
                                    {slide.button}

                                    <ArrowRight
                                        size={18}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </button>

                            </div>
                        </div>

                        {/* Bottom accent */}
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-transparent" />

                    </div>
                ))}

            </div>
        </section>
    );
}