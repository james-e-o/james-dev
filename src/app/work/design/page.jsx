import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { DesignGallery } from "@/components/work/DesignGallery";
import { designs, videos } from "@/data/work";
export const metadata = {
    title: "Visual work",
    description: "A mixed gallery of graphic design and video edits, including portrait-format social clips.",
};
export default function DesignPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="GRAPHIC DESIGN & VIDEO EDITING" title="Made to be seen.">
          A mix of visual identities, campaign graphics and video edits. Portrait thumbnails show Reels and TikTok cuts; landscape pieces are wider films. The artwork is placeholder imagery—add your own thumbnails and video links in the work data.
        </PageIntro>
      </div>
      <section className="container page-content" aria-label="Graphic design and video work gallery">
        <DesignGallery designs={designs} videos={videos}/>
      </section>
      <PageCta />
    </main>);
}
