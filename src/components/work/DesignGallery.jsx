"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Artwork } from "./Artwork";
import { Lightbox } from "./Lightbox";
function mixGalleryItems(designs, videos) {
    const mixed = [];
    let designIndex = 0;
    let videoIndex = 0;
    while (designIndex < designs.length || videoIndex < videos.length) {
        if (designIndex < designs.length)
            mixed.push(designs[designIndex++]);
        if (videoIndex < videos.length)
            mixed.push(videos[videoIndex++]);
        if (designIndex < designs.length)
            mixed.push(designs[designIndex++]);
    }
    return mixed;
}
export function DesignGallery({ designs, videos }) {
    const items = mixGalleryItems(designs, videos);
    const [activeIndex, setActiveIndex] = useState(null);
    const active = activeIndex === null ? null : designs[activeIndex];
    const close = useCallback(() => setActiveIndex(null), []);
    const previous = useCallback(() => setActiveIndex((index) => index === null ? null : (index - 1 + designs.length) % designs.length), [designs.length]);
    const next = useCallback(() => setActiveIndex((index) => index === null ? null : (index + 1) % designs.length), [designs.length]);
    return (<>
      <div className="design-grid">
        {items.map((item, index) => (item.discipline === "Video Editing" ? (<Link className="design-tile design-tile--video" key={item.slug} href={item.videoUrl ?? `/work/${item.slug}`} target={item.videoUrl ? "_blank" : undefined} rel={item.videoUrl ? "noreferrer" : undefined} aria-label={`${item.videoUrl ? "Watch" : "View"} ${item.title} video, ${item.mediaOrientation === "portrait" ? "portrait" : "landscape"} thumbnail`}>
              <span className={`design-thumbnail-wrap ${item.mediaOrientation === "portrait" ? "design-thumbnail-wrap--portrait" : "design-thumbnail-wrap--landscape"}`}>
                <Artwork item={item} className={`design-art ${item.mediaOrientation === "portrait" ? "design-art--portrait" : "design-art--landscape"}`}/>
                <span className="video-thumbnail-play" aria-hidden="true">▶</span>
                <span className="video-thumbnail-platform">{item.platform ?? "Video edit"}</span>
                <span className="video-thumbnail-ratio">{item.mediaOrientation === "portrait" ? "9:16" : "16:9"}</span>
              </span>
              <span className="design-tile-caption">{item.title}<span>{item.role}</span></span>
            </Link>) : (<button className="design-tile" key={item.slug} type="button" onClick={() => setActiveIndex(designs.findIndex((entry) => entry.slug === item.slug))} aria-label={`Open ${item.title} artwork`}>
              <Artwork item={item} className="design-art"/>
              <span className="design-tile-caption">{item.title}<span>{item.role}</span></span>
            </button>)))}
      </div>
      {active && <Lightbox item={active} onClose={close} onPrevious={previous} onNext={next}/>}
    </>);
}
