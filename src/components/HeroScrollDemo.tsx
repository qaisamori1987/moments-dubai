"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo({
  eyebrow = "Moments Dubai",
  title = "Gifts that hold",
  titleAccent = "life’s first moments",
  videoSrc = "/videos/reels/18089494984753445.mp4",
  poster = "/images/reels/18089494984753445.jpg",
}: {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  videoSrc?: string;
  poster?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-mocha">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl text-charcoal md:text-6xl">
              {title} <br />
              <span className="mt-1 block font-semibold leading-none text-burgundy">
                {titleAccent}
              </span>
            </h1>
          </>
        }
      >
        {/* A brand reel (9:16) that plays as you scroll — fills the portrait frame. */}
        <video
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full rounded-[1.7rem] object-cover"
        />
      </ContainerScroll>
    </div>
  );
}
