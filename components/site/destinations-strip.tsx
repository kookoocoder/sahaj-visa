"use client";

import { useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/site/icon";

type Place = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
};

export function DestinationsStrip({ places }: { places: Place[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: 1 | -1) {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
      <div ref={scrollerRef} className="sahaj-strip-scroller" aria-label="India destinations">
        {places.map((place) => (
          <figure key={place.src} className="sahaj-strip-item">
            <Image src={place.src} alt={place.alt} fill sizes="(max-width: 767px) 78vw, 20vw" />
            <figcaption>
              <span className="sahaj-strip-title">{place.title}</span>
              <span className="sahaj-strip-sub">{place.subtitle}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="ux4g-d-flex ux4g-jc-end ux4g-gap-x-xs">
        <button type="button" className="sahaj-strip-nav" aria-label="Scroll destinations left" onClick={() => scrollByAmount(-1)}>
          <Icon name="arrow_back" className="ux4g-fs-18" />
        </button>
        <button type="button" className="sahaj-strip-nav" aria-label="Scroll destinations right" onClick={() => scrollByAmount(1)}>
          <Icon name="arrow_forward" className="ux4g-fs-18" />
        </button>
      </div>
    </div>
  );
}
