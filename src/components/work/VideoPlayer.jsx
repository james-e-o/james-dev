"use client";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
export function VideoPlayer({ title, videoId = "M7lc1UVf-VE", caption, previewSrc, provider = "youtube", }) {
    const [playing, setPlaying] = useState(false);
    const reduceMotion = useReducedMotion();
    const videoUrl = provider === "vimeo"
        ? `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?autoplay=1`
        : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    return (<figure className="video-feature">
      <div className="video-facade">
        {previewSrc ? (<video className="video-loop-preview" src={previewSrc} autoPlay={!reduceMotion} loop={!reduceMotion} muted playsInline controls aria-label={title}/>) : playing ? (<iframe src={videoUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen loading="lazy"/>) : (<button className="video-poster" type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
            <span className="video-poster-art" aria-hidden="true">
              <span className="poster-sun"/>
              <span className="poster-land poster-land--back"/>
              <span className="poster-land poster-land--front"/>
            </span>
            <span className="play-button" aria-hidden="true">▶</span>
            <span className="video-poster-label"><span className="live-dot"/> Featured film · 01:24</span>
          </button>)}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>);
}
