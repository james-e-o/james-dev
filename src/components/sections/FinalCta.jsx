import { site } from "@/data/site";
import { CtaPair } from "./CtaPair";
export function FinalCta() {
    return (<section className="final-cta">
      <div className="container final-cta-inner">
        <p className="eyebrow"><span className="eyebrow-dot"/>GOOD WORK STARTS WITH A HELLO</p>
        <h2>Got a good one<br /><span>in mind?</span></h2>
        <p>Tell me what you’re making. I’ll bring curiosity, craft and a very full notebook.</p>
        <CtaPair />
        <a className="final-email" href={`mailto:${site.email}`}>{site.email} <span aria-hidden="true">↗</span></a>
      </div>
    </section>);
}
