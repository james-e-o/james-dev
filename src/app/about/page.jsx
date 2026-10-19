import Image from "next/image";
import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { site } from "@/data/site";
import { skills } from "@/data/resume";
export const metadata = {
    title: "About",
    description: "A little about the person behind the edits, identities and digital products.",
};
const values = [
    ["01", "Curiosity before certainty", "Ask better questions before rushing towards familiar answers."],
    ["02", "People over pixels", "A polished interface is nice. A useful, understood experience is the point."],
    ["03", "Craft with a reason", "Make every edit, detail and decision earn its place."],
];
const timeline = [
    ["Now", "Bringing creative craft and product thinking together across independent projects."],
    ["2021", "Started working independently with people building useful, human-centred things."],
    ["Before", "Found my way through editing rooms, design desks and curious side projects."],
];
export default function AboutPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="THE PERSON BEHIND THE WORK" title="Hi, I’m James.">
          Editor, designer, product thinker, and the person who will probably ask one more question about the audience.
        </PageIntro>
      </div>
      <section className="container page-content">
        <div className="story-layout">
          <div className="story-visual">
            <Image src="/images/portrait-placeholder.svg" alt={`Illustrated portrait placeholder for ${site.fullName}; replace with a personal photo`} width={640} height={700} placeholder="blur" blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNhZWJmOGQiLz48L3N2Zz4=" priority/>
            <span className="story-visual-label">A PORTRAIT PLACEHOLDER · REPLACE WITH YOUR PHOTO</span>
          </div>
          <article className="story-copy">
            <h2>A creative by nature.<br />A generalist on purpose.</h2>
            <p>I started with video and design because I loved how a good image or a well-timed cut could make you feel something. I still love that. I’ve also become interested in what sits just before the final frame: the research, the question, the decision about what should exist in the first place.</p>
            <p>These days I move between editing, visual identity, UX and development, and business-focused AI prompt work. Different disciplines, same instinct: pay attention to people, make the complicated clearer, and create something with care.</p>
            <p>I’m not interested in technology for its own sake or polish without purpose. I like useful things with personality—and teams who want to make thoughtful work together.</p>
            <p><strong>{site.location}</strong></p>
          </article>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>A FEW GUIDING PRINCIPLES</p><h2>What I try<br /><span className="serif-italic">to bring.</span></h2></div></div>
          <div className="values-grid">{values.map(([number, title, description]) => <article className="value-card" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>A WORK IN PROGRESS</p><h2>A few markers<br /><span className="serif-italic">along the way.</span></h2></div></div>
          <ol className="timeline">{timeline.map(([year, text]) => <li key={year}><time>{year}</time><p>{text}</p></li>)}</ol>
          <div className="cv-block" style={{ marginTop: 45 }}><h2>Current toolbox</h2><ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>
        </div>
      </section>
      <PageCta />
    </main>);
}
