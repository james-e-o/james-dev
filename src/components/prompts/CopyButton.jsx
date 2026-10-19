"use client";
import { useState } from "react";
export function CopyButton({ text }) {
    const [status, setStatus] = useState("idle");
    async function copyPrompt() {
        try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
        }
        catch {
            setStatus("error");
        }
        window.setTimeout(() => setStatus("idle"), 2200);
    }
    return (<button className="copy-button" type="button" onClick={copyPrompt}>
      <span aria-live="polite">{status === "copied" ? "Copied ✓" : status === "error" ? "Copy unavailable" : "Copy prompt ↗"}</span>
    </button>);
}
