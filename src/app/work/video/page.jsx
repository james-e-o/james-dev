import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { VideoCard } from "@/components/work/VideoCard";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { videos } from "@/data/work";
export const metadata = {
    title: "Video editing",
    description: "Selected edits, motion design and video storytelling.",
};
export default function VideoPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="CUT WITH INTENTION" title="Stories in motion.">
          From the first rough cut to the final frame, I shape footage into films that feel clear, considered and alive.
        </PageIntro>
      </div>
      <section className="container page-content">
        <div className="feature-reel">
          <div className="feature-reel-label"><span>Selected reel</span><span>Editing · Motion · Colour · Sound</span></div>
          <VideoPlayer title="Video editing showreel" caption="A sample reel placeholder. Replace with your own captioned reel; provide an audio-described version or transcript where needed."/>
        </div>
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-dot"/>SELECTED VIDEO PROJECTS</p><h2>A few frames<br /><span className="serif-italic">from the edit.</span></h2></div></div>
        <div className="video-grid">{videos.map((item) => <VideoCard key={item.slug} item={item}/>)}</div>
      </section>
      <PageCta />
    </main>);
}
