import { ContactForm } from "@/components/contact/ContactForm";
import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { site } from "@/data/site";
export const metadata = {
    title: "Contact",
    description: "Get in touch about a creative, product or AI project.",
};
export default function ContactPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="HAVE A THOUGHTFUL ONE IN MIND?" title="Let’s make it matter.">
          A small hello is a good place to start. Tell me a little about what you’re working on and what you need a hand with.
        </PageIntro>
      </div>
      <section className="container page-content">
        <div className="contact-layout">
          <aside className="contact-details">
            <div className="contact-item"><span>Email</span><a href={`mailto:${site.email}`}>{site.email} ↗</a></div>
            <div className="contact-item"><span>Book a conversation</span><a href={site.calendly} target="_blank" rel="noreferrer">Find a time on Calendly ↗</a><p className="contact-note">Calendly link placeholder—replace with your booking page.</p></div>
            <div className="contact-item"><span>Elsewhere</span><div className="contact-socials">{site.socials.map((social) => <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</div></div>
            <div className="contact-item"><span>Based in</span><p>{site.location}</p></div>
          </aside>
          <ContactForm />
        </div>
      </section>
      <PageCta />
    </main>);
}
