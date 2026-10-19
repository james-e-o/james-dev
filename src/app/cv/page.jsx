import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { site } from "@/data/site";
import { experience, skills } from "@/data/resume";
export const metadata = {
    title: "CV",
    description: "Experience, skills and education for James O.",
};
export default function CvPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero cv-top">
        <PageIntro eyebrow="A LITTLE OF WHAT I’VE DONE" title="The short version.">
          A multidisciplinary creative with a practical streak: I like making things people care about and helping teams make better decisions along the way.
        </PageIntro>
        <a className="button button--primary cv-download" href={site.resume} download>Download PDF <span aria-hidden="true">↓</span></a>
      </div>
      <section className="container page-content">
        <div className="cv-grid">
          <aside className="cv-side">
            <section className="cv-block"><h2>Contact</h2><p>{site.location}</p><p><a href={`mailto:${site.email}`}>{site.email}</a></p><p><a href="/contact">Contact page ↗</a></p></section>
            <section className="cv-block"><h2>Skills</h2><ul>{skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></section>
            <section className="cv-block"><h2>Education</h2><p>Education details placeholder</p><p>Institution · Year</p><p className="contact-note">Replace with your actual qualification before publishing.</p></section>
          </aside>
          <div className="cv-main">
            <section className="cv-block"><h2>Experience</h2>
              {experience.map((entry) => (<div className="cv-entry" key={entry.role}>
                  <span className="cv-period">{entry.period}</span>
                  <div><h3>{entry.role}</h3><p className="cv-company">{entry.company}</p><p>{entry.details}</p></div>
                </div>))}
            </section>
            <section className="cv-pdf">
              <h2>PDF version</h2>
              <iframe title="Embedded CV PDF" src={`${site.resume}#view=FitH`}/>
              <p className="contact-note">The PDF is a replaceable placeholder. The on-page CV above remains available without a PDF viewer.</p>
            </section>
          </div>
        </div>
      </section>
      <PageCta />
    </main>);
}
