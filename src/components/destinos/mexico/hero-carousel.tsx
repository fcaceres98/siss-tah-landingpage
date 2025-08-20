"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    image: "/images/destinos/mexico/mexico01.jpg",
    title: "Aeropuerto Internacional Felipe Ángeles",
    description: "Moderno aeropuerto que conecta la región con destinos nacionales e internacionales.",
  },
  {
    image: "/images/destinos/mexico/mexico02.jpg",
    title: "Museo Militar de Aviación",
    description: "Exhibición de la historia y tecnología de la aviación militar mexicana.",
  },
  {
    image: "/images/destinos/mexico/mexico03.jpg",
    title: "Zona Comercial y Gastronómica",
    description: "Variedad de restaurantes y tiendas para disfrutar la cultura local.",
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative w-full min-h-[calc(100vh-50px)] flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Sliding Images */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, idx) => (
            <div key={idx} className="relative w-full h-full flex-shrink-0">
              <Image
                src={ src.image }
                alt={`Hero ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />

              {/* Overlay text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30 pointer-events-none">
                <h1 className="text-3xl font-bold mb-2">{src.title}</h1>
                <p className="text-lg">{src.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-20 pointer-events-auto"
        aria-label="Previous"
      >
        <svg width="24" height="24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white z-20 pointer-events-auto"
        aria-label="Next"
      >
        <svg width="24" height="24" fill="none"><path d="M9 6l6 6-6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-primary" : "bg-gray-300"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
    </section>
  );
}