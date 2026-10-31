import Image from "next/image";

export function Artwork({ item, className = "", videoControls = false }) {
    const hasUploadedMedia = item.imageUrl || item.mediaUrl;
    return (<div className={`artwork artwork--${item.art} ${className}`} style={{ "--art-one": item.colors[0], "--art-two": item.colors[1] }} role={hasUploadedMedia ? undefined : "img"} aria-label={hasUploadedMedia ? undefined : `Abstract placeholder artwork for ${item.title}`}>
      {item.imageUrl ? (
        <Image className="artwork-media" src={item.imageUrl} alt={item.imageAlt ?? item.title} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw"/>
      ) : item.mediaUrl ? (
        <video className="artwork-media" src={item.mediaUrl} muted={!videoControls} autoPlay={!videoControls} loop={!videoControls} controls={videoControls} playsInline preload="metadata" aria-label={item.imageAlt ?? `${item.title} video`}/>
      ) : (
        <>
          <span className="artwork-grain"/>
          <span className="artwork-shape artwork-shape--one"/>
          <span className="artwork-shape artwork-shape--two"/>
          <span className="artwork-shape artwork-shape--three"/>
          <span className="artwork-type">{item.title}</span>
          <span className="artwork-index" aria-hidden="true">J—01</span>
        </>
      )}
    </div>);
}
