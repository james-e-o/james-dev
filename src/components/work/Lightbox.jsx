"use client";
import { useEffect, useRef } from "react";
import { Artwork } from "./Artwork";
export function Lightbox({ item, onClose, onPrevious, onNext, }) {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    useEffect(() => {
        const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        function handleKeyDown(event) {
            if (event.key === "Escape")
                onClose();
            if (event.key === "ArrowLeft")
                onPrevious();
            if (event.key === "ArrowRight")
                onNext();
            if (event.key === "Tab") {
                const buttons = dialogRef.current?.querySelectorAll("button:not(:disabled)");
                if (!buttons?.length)
                    return;
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
                else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [onClose, onNext, onPrevious]);
    return (<div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`${item.title} artwork`} onMouseDown={(event) => {
            if (event.target === event.currentTarget)
                onClose();
        }}>
      <button ref={closeRef} className="lightbox-close" type="button" onClick={onClose} aria-label="Close artwork">×</button>
      <button className="lightbox-prev" type="button" onClick={onPrevious} aria-label="Previous artwork">←</button>
      <div className="lightbox-content">
        <Artwork item={item} className="lightbox-art"/>
        <p>{item.title} <span>· {item.role}</span></p>
      </div>
      <button className="lightbox-next" type="button" onClick={onNext} aria-label="Next artwork">→</button>
    </div>);
}
