import { notFound } from "next/navigation";
import { PageCta } from "@/components/sections/PageCta";
import { Artwork } from "@/components/work/Artwork";
import { Tag } from "@/components/ui/Tag";
import { workItems } from "@/data/work";
import { caseStudies } from "@/lib/caseStudies";
export function generateStaticParams() {
    return workItems.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params, }) {
    const { slug } = await params;
    const item = workItems.find((work) => work.slug === slug);
    return item ? { title: item.title, description: item.description } : {};
}
export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const item = workItems.find((work) => work.slug === slug);
    if (!item)
        notFound();
    const CaseStudy = caseStudies[slug];
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <p className="eyebrow"><span className="eyebrow-dot"/>{item.year} · SELECTED WORK</p>
        <Tag>{item.discipline}</Tag>
        <h1 className="project-title">{item.title}</h1>
        <p className="page-intro-copy">{item.description}</p>
        <dl className="project-meta">
          <div><dt>My role</dt><dd>{item.role}</dd></div>
          <div><dt>Tools</dt><dd>{item.tools.join(" · ")}</dd></div>
          <div><dt>Year</dt><dd>{item.year}</dd></div>
        </dl>
      </div>
      <div className="container project-cover"><Artwork item={item}/></div>
      <div className="container project-body">
        <nav className="project-toc" aria-label="On this page">
          <a href="#brief">The brief</a><a href="#process">The process</a><a href="#outcome">The outcome</a>
        </nav>
        <article className="mdx-content">
          {CaseStudy ? (<CaseStudy />) : (<>
              <section id="brief"><h2>The brief</h2><p>{item.description} This sample project page is here to show the case-study format. Replace this overview with the real brief, context and audience when you add your project details.</p></section>
              <section id="process"><h2>The process</h2><p>I started by getting clear on the people and the problem, then explored a few directions before making and refining the work. The work was shaped around the real context rather than a template solution.</p><ul><li>Listen to the brief and surface open questions.</li><li>Explore a small number of considered routes.</li><li>Test, refine and prepare a useful handover.</li></ul></section>
              <section id="outcome"><h2>The outcome</h2><p>A thoughtful, audience-aware piece of work. Add approved outcome measures and before/after examples here; no metrics are invented for this placeholder.</p></section>
            </>)}
        </article>
      </div>
      <PageCta />
    </main>);
}
