"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  categories?: string[];
}

export default function GridGallery() {
  // Configuration options
  const enableFiltering = true;

  // Static images array
  const images: GalleryImage[]  = React.useMemo( () => [
    {
      src: "/gallery/plane01.jpg",
      alt: "New York City skyline with Empire State Building",
      width: 1280,
      height: 590,
      categories: ["Cabina", "Instrumentos"],
    }, {
      src: "/gallery/plane02.jpg",
      alt: "Chicago downtown with river and bridges",
      width: 1280,
      height: 590,
      categories: ["Cabina", "Instrumentos"],
    }, {
      src: "/gallery/plane03.jpg",
      alt: "San Francisco view with Golden Gate Bridge",
      width: 1280,
      height: 590,
      categories: ["Cabina", "Instrumentos"],
    }, {
      src: "/gallery/plane04.jpg",
      alt: "London cityscape with Tower Bridge",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Dia"],
    }, {
      src: "/gallery/plane05.jpg",
      alt: "Tokyo skyline at night with illuminated buildings",
      width: 719,
      height: 1280,
      categories: ["Cabina", "Asientos"],
    }, {
      src: "/gallery/plane06.jpg",
      alt: "Sydney Opera House and Harbour Bridge",
      width: 1280,
      height: 590,
      categories: ["Aeronave", "Dia"],
    }, {
      src: "/gallery/plane07.jpg",
      alt: "Dubai skyline with Burj Khalifa",
      width: 720,
      height: 1280,
      categories: ["Cabina", "Asientos"],
    }, {
      src: "/gallery/plane08.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 960,
      height: 1280,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane09.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Cabina", "Asientos"],
    }, {
      src: "/gallery/plane10.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 960,
      height: 1280,
      categories: ["Cabina", "Asientos"],
    }, {
      src: "/gallery/plane11.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane12.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane13.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane14.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane15.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 1280,
      height: 960,
      categories: ["Aeronave", "Noche"],
    }, {
      src: "/gallery/plane16.jpg",
      alt: "Paris with Eiffel Tower view",
      width: 960,
      height: 1280,
      categories: ["Aeronave", "Noche"],
    },
  ],
    []
  );

  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  // Extract all unique categories from images
  const categories = React.useMemo(() => {
    if (!enableFiltering) return [];

    const allCategories = new Set<string>();
    images.forEach((image) => {
      image.categories?.forEach((category) => {
        allCategories.add(category);
      });
    });

    return Array.from(allCategories).sort();
  }, [images, enableFiltering]);

  // Filter images based on active category
  const filteredImages = React.useMemo(() => {
    if (!activeFilter) return images;
    return images.filter((image) => image.categories?.includes(activeFilter));
  }, [images, activeFilter]);

  return (
    <div className="w-full p-4 md:p-6">
      {enableFiltering && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={activeFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(null)}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredImages.map((image, index) => (
          <div
            key={`img-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-black/30 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="line-clamp-2 text-sm font-medium text-white">
                {image.alt}
              </p>
            </div>
            {image.categories && image.categories.length > 0 && (
              <div className="absolute top-2 right-2 flex max-w-[calc(100%-16px)] flex-wrap justify-end gap-1">
                {image.categories.slice(0, 2).map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
                {image.categories.length > 2 && (
                  <Badge variant="secondary">
                    +{image.categories.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
