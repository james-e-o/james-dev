import { Suspense } from "react";
import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { WorkFilters } from "@/components/work/WorkFilters";
import { getWorkItems } from "@/lib/content";
export const metadata = {
    title: "Work",
    description: "Selected video, design, product, development and AI work.",
};
export default function WorkPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="A SELECTION OF THE GOOD STUFF" title="Work that works.">
          A mix of moving pictures, thoughtful systems and visuals with a point of view. Each project starts with people, and a good question.
        </PageIntro>
      </div>
      <section className="container page-content" aria-label="Portfolio projects">
        <Suspense fallback={<p className="admin-state" role="status">Loading projects…</p>}>
          <ProjectListing/>
        </Suspense>
      </section>
      <PageCta />
    </main>);
}

async function ProjectListing() {
    return <WorkFilters items={await getWorkItems()}/>;
}
