"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import { categories } from "@/data/work";
import { WorkCard } from "./WorkCard";
function subscribeToLocation(onChange) {
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
}
function getSelectedFilter() {
    const filter = new URLSearchParams(window.location.search).get("filter");
    return categories.find((item) => item.value === filter)?.value ?? "All";
}
function getDefaultFilter() {
    return "All";
}
export function WorkFilters({ items }) {
    const urlFilter = useSyncExternalStore(subscribeToLocation, getSelectedFilter, getDefaultFilter);
    const [selectedOverride, setSelectedOverride] = useState(null);
    const selected = selectedOverride ?? urlFilter;
    const filtered = useMemo(() => selected === "All" ? items : items.filter((item) => item.discipline === selected), [items, selected]);
    return (<>
      <div className="filter-list" role="group" aria-label="Filter projects by discipline">
        {categories.map((category) => (<button key={category.value} className={`filter-button ${selected === category.value ? "is-selected" : ""}`} type="button" aria-pressed={selected === category.value} onClick={() => setSelectedOverride(category.value)}>
            {category.label}
          </button>))}
      </div>
      <p className="filter-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p>
      <div className="work-grid">
        {filtered.map((item) => <WorkCard key={item.slug} item={item}/>)}
      </div>
    </>);
}
