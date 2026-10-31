import { Suspense } from "react";
import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { DesignGallery } from "@/components/work/DesignGallery";
import { getWorkItems } from "@/lib/content";
export const metadata = {
    title: "Visual work",
    description: "A mixed gallery of graphic design and video edits, including portrait-format social clips.",
};
export default function DesignPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="GRAPHIC DESIGN & VIDEO EDITING" title="Made to be seen.">
          A mix of visual identities, campaign graphics and video edits. New published projects and uploaded media appear here alongside the selected sample work.
        </PageIntro>
      </div>
      <section className="container page-content" aria-label="Graphic design and video work gallery">
        <Suspense fallback={<p className="admin-state" role="status">Loading visual work…</p>}>
          <VisualWorkGallery/>
        </Suspense>
      </section>
      <PageCta />
    </main>);
}

async function VisualWorkGallery() {
    const items = await getWorkItems();
    const designs = items.filter((item) => item.discipline === "Graphic Design");
    const videos = items.filter((item) => item.discipline === "Video Editing");
    return <DesignGallery designs={designs} videos={videos}/>;
}
