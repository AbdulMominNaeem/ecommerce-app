import React from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

const slides = [
  {
    subtitle: 'Best Deal Online on Smart Watches',
    title: 'Smart Wearables',
    button: 'Up to 80% Off',
    image: '/images/images (1).jpg',
  },
  {
    title: 'Fresh Arrivals',
    subtitle: 'New products added every week',
    button: 'Explore',
    image: '/images/images (2).jpg',
  },
  {
    title: 'Fast Delivery',
    subtitle: 'Get your order in just a few hours',
    button: 'Learn More',
    image: '/images/images.jpg',
  },
]

export default function Imagebanner() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    duration: 1000,
  })

  return (
    <section className="px-6 py-6">
      <div ref={sliderRef} className="keen-slider overflow-hidden rounded-2xl shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide relative min-h-[320px] overflow-hidden rounded-2xl"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 max-w-xl flex flex-col justify-center p-8 text-white h-100">
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/80">Featured</p>
              <p className="text-lg text-white/90">{slide.subtitle}</p>
              <h2 className="mb-5 text-5xl font-bold">{slide.title}</h2>
              <button className="rounded-full bg-white px-5 py-2 font-semibold text-gray-900">
                {slide.button}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}