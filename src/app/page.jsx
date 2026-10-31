import { Suspense } from "react";
import Link from "next/link";
import { CtaPair } from "@/components/sections/CtaPair";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/sections/Reveal";
import { Container, Section } from "@/components/ui/Section";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { WorkCard } from "@/components/work/WorkCard";
import { site } from "@/data/site";
import { getWorkItems } from "@/lib/content";
import { mockBlogPosts } from "@/data/blog";
const practices = [
    { number: "01", title: "Video editing", description: "Thoughtful cuts, a feeling-first edit, and motion that gives the story room to breathe.", href: "/work/video", symbol: "▶" },
    { number: "02", title: "Graphic design", description: "Distinctive identities and visual systems made to work in the real world.", href: "/work/design", symbol: "✳" },
    { number: "03", title: "Product & UX", description: "Research-led experiences that solve the right problem before polishing the pixels.", href: "/work?filter=UX%20%2F%20Product", symbol: "⌘" },
    { number: "04", title: "AI & the future", description: "Personal thoughts on the changing tools, creative work and what comes next.", href: "/blog/thoughts-on-the-future-of-ai", symbol: "✺" },
];
const process = [
    ["01", "Discover", "Listen first. Understand the people, the context and what success really means."],
    ["02", "Define", "Get clear on the right problem, agree the shape of the work and make a plan."],
    ["03", "Create", "Explore, test and make with care—keeping the real audience in the room."],
    ["04", "Refine", "Use feedback and evidence to improve the work, not just add more polish."],
    ["05", "Deliver", "Hand over something useful, considered and ready for what comes next."],
];
export default function Home() {
    return (<main id="main">
      <section className="hero">
        <Container className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot"/>{site.availability}</p>
            <h1>{site.fullName}<br /><span className="serif-italic">Make it mean.</span></h1>
            <p className="hero-position">{site.positioning}</p>
            <p className="hero-description">{site.description}</p>
            <CtaPair />
            <div className="hero-socials" aria-label="Social links">
              {site.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}<span aria-hidden="true">↗</span></a>)}
              <span className="hero-location">{site.location}</span>
            </div>
          </div>
          <div className="hero-art" role="img" aria-label={`Illustrated portrait placeholder for ${site.fullName}; replace with a portrait photo`}>
            <div className="hero-art-orbit hero-art-orbit--one"/>
            <div className="hero-art-orbit hero-art-orbit--two"/>
            <span className="hero-art-spark hero-art-spark--one">✳</span>
            <span className="hero-art-spark hero-art-spark--two">✦</span>
            <div className="portrait-shape">
              <div className="portrait-hair"/>
              <div className="portrait-head"><span className="portrait-eye portrait-eye--left"/><span className="portrait-eye portrait-eye--right"/><span className="portrait-smile"/></div>
              <div className="portrait-shirt"/>
            </div>
            <div className="portrait-note"><span>THE PERSON</span><strong>behind the pixels</strong></div>
            <span className="hero-art-label">A CREATIVE MIND<br />IN PROGRESS · ALWAYS</span>
          </div>
          <div className="hero-bottom-note"><span className="hero-bottom-line"/>A little bit of everything. A lot of care in all of it.</div>
        </Container>
      </section>

      <Section className="what-section">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-dot"/>A FEW THINGS I DO</p><h2>Different tools.<br /><span className="serif-italic">Same curiosity.</span></h2></div>
          <p className="section-aside">I like working across disciplines. It means I can find the right shape for an idea—not just the familiar one.</p>
        </div>
        <div className="practice-grid">
          {practices.map((item) => (<Link href={item.href} className="practice-card" key={item.number}>
              <span className="practice-number">{item.number} / 04</span>
              <span className="practice-symbol" aria-hidden="true">{item.symbol}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="practice-link">Explore <span aria-hidden="true">↗</span></span>
            </Link>))}
        </div>
      </Section>

      <Section tone="soft" className="reel-section">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-dot"/>A LITTLE MOVING PICTURE</p><h2>Stories with<br /><span className="serif-italic">a pulse.</span></h2></div>
          <p className="section-aside">A short reel of edits, images and ideas. Press play when you’re ready.</p>
        </div>
        <VideoPlayer title="Selected video editing reel" caption="Selected edits, motion and moments · Captions/transcript placeholder: add an accessible transcript for the final reel before launch."/>
      </Section>

      <Section className="selected-section">
        <div className="section-heading section-heading--inline">
          <div><p className="eyebrow"><span className="eyebrow-dot"/>SELECTED PROJECTS · 2023—25</p><h2>A few things<br /><span className="serif-italic">out in the world.</span></h2></div>
          <Link className="text-link" href="/work">All projects <span aria-hidden="true">↗</span></Link>
        </div>
        <Suspense fallback={<p className="admin-state" role="status">Loading selected work…</p>}>
          <FeaturedProjects/>
        </Suspense>
      </Section>

      <Section tone="soft" className="process-section">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>HOW I LIKE TO WORK</p><h2>People first.<br /><span className="serif-italic">Always.</span></h2></div><p className="section-aside">Good work isn’t a straight line, but having a thoughtful process gives the messy middle somewhere to go.</p></div>
        <ol className="process-list">
          {process.map(([number, title, text]) => <li key={number}><span className="process-number">{number}</span><h3>{title}</h3><p>{text}</p></li>)}
        </ol>
      </Section>

      <Section className="ai-section">
        <div className="ai-layout">
          <div className="ai-copy">
            <p className="eyebrow"><span className="eyebrow-dot"/>A PERSONAL TAKE ON AI</p>
            <h2>AI is changing.<br /><span className="serif-italic">People still matter.</span></h2>
            <p>I am curious about how AI will shape the way we create and work. The tools will keep evolving; care, curiosity and good judgement still belong in the process.</p>
            <ul className="service-list">
              <li><span>01</span> What new tools make possible</li>
              <li><span>02</span> Where human judgement matters</li>
              <li><span>03</span> How creative work might change</li>
            </ul>
            <Link className="text-link" href={`/blog/${mockBlogPosts[1].slug}`}>Read my thoughts on AI <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="ai-note">
            <p className="eyebrow"><span className="eyebrow-dot"/>A NOTE TO THE FUTURE</p>
            <blockquote>“The interesting question is not only what these tools can do, but what we choose to do with them.”</blockquote>
            <Link className="text-link" href="/blog">More notes on the blog <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </Section>

      <Section tone="soft" className="tools-section">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>THE TOOLBOX</p><h2>Good hands.<br /><span className="serif-italic">Useful tools.</span></h2></div><p className="section-aside">Tools change. The thought behind them matters more. Here are a few I reach for.</p></div>
        <div className="tools-grid">
          <div><span className="tool-index">01 / PICTURE & SOUND</span><h3>Video & motion</h3><p>Premiere Pro <i>·</i> After Effects <i>·</i> DaVinci Resolve</p></div>
          <div><span className="tool-index">02 / SHAPE & COLOUR</span><h3>Design</h3><p>Photoshop <i>·</i> Illustrator <i>·</i> Figma</p></div>
          <div><span className="tool-index">03 / THINK & BUILD</span><h3>Product & development</h3><p>Next.js <i>·</i> JavaScript <i>·</i> Git <i>·</i> Notion</p></div>
          <div><span className="tool-index">04 / MAKE IT USEFUL</span><h3>AI & research</h3><p>LLMs <i>·</i> Creative workflows <i>·</i> Interviews <i>·</i> Testing</p></div>
        </div>
      </Section>

      <Section className="testimonials-section">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>KIND WORDS, PLACEHOLDERS</p><h2>Better work<br /><span className="serif-italic">together.</span></h2></div><p className="section-aside">Replace these sample quotes with real, approved testimonials before publishing.</p></div>
        <div className="testimonial-grid">
          <blockquote><span className="quote-mark">“</span><p>James brought a rare mix of creative energy and calm thinking to a project that needed both.</p><footer>CLIENT NAME <span>· BRAND / ROLE</span></footer></blockquote>
          <blockquote><span className="quote-mark">“</span><p>He really listened. The work feels like us, only clearer and more confident.</p><footer>CLIENT NAME <span>· BRAND / ROLE</span></footer></blockquote>
          <blockquote><span className="quote-mark">“</span><p>Thoughtful, collaborative and never precious about the process. A joy to make things with.</p><footer>CLIENT NAME <span>· BRAND / ROLE</span></footer></blockquote>
        </div>
      </Section>
      <FinalCta />
    </main>);
}

async function FeaturedProjects() {
    const featuredWork = (await getWorkItems()).filter((item) => item.featured);
    return (
      <div className="work-grid work-grid--featured">
        {featuredWork.map((item) => <Reveal key={item.slug}><WorkCard item={item} compact/></Reveal>)}
      </div>
    );
}
