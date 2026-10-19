"use client";
import { useEffect, useSyncExternalStore } from "react";
function subscribe(onChange) {
    window.addEventListener("portfolio-theme-change", onChange);
    return () => window.removeEventListener("portfolio-theme-change", onChange);
}
function getTheme() {
    return document.documentElement.dataset.theme !== "light";
}
function getServerTheme() {
    return true;
}
export function ThemeToggle() {
    const dark = useSyncExternalStore(subscribe, getTheme, getServerTheme);
    useEffect(() => {
        const saved = window.localStorage.getItem("portfolio-theme");
        const useDark = saved ? saved === "dark" : true;
        document.documentElement.dataset.theme = useDark ? "dark" : "light";
        window.dispatchEvent(new Event("portfolio-theme-change"));
    }, []);
    function toggleTheme() {
        const next = !dark;
        document.documentElement.dataset.theme = next ? "dark" : "light";
        window.localStorage.setItem("portfolio-theme", next ? "dark" : "light");
        window.dispatchEvent(new Event("portfolio-theme-change"));
    }
    return (<button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}>
      <span aria-hidden="true">{dark ? "☼" : "◐"}</span>
    </button>);
}
