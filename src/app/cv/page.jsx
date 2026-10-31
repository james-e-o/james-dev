import { site } from "@/data/site";
export const metadata = {
    title: "CV",
    description: "James Onwuasoanya's CV: accounting graduate, web developer, trainer and content creator.",
};

const h2 = "mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60";
const block = "border-t border-[rgba(128,128,128,0.3)] py-5";
const p = "mb-1.5 text-sm leading-relaxed opacity-80";
const link = "underline-offset-4 hover:underline";
const entry = "mb-4 last:mb-0";
const period = "text-xs tracking-wide opacity-60";
const h3 = "mt-0.5 text-[15px] font-semibold leading-snug";
const company = "text-sm opacity-70";
const strong = "font-semibold opacity-100";

export default function CvPage() {
    return (<main id="main" className="page-main">
      <section aria-label="CV and experience" className="grid grid-cols-1 items-start gap-8 py-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12 lg:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2))]">

        {/* LEFT: details (keeps the site's left margin) */}
        <aside className="min-w-0 break-words px-5 sm:px-8 lg:px-0">
          <header className="pb-6">
            <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
              <span className="h-2 w-2 rounded-full bg-[#4b6b27]"/>Curriculum Vitae
            </p>
            <a href={site.resume} download className="mb-5 inline-flex items-center gap-2 bg-[#4b6b27] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d581f]">
              Download PDF <span aria-hidden="true">↓</span>
            </a>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">James Onwuasoanya</h1>
            <p className="mt-3 text-sm leading-relaxed opacity-80">Accounting graduate combining financial knowledge with web development, UI/UX and technical training. Building an accounting-focused ERP, teaching web development and practical AI, and managing a Lagos retailer’s website, content and IT.</p>
          </header>

          <section className={block}><h2 className={h2}>Contact</h2>
            <p className={p}><a className={link} href="tel:+2349032916720">+234 903 291 6720</a></p>
            <p className={p}><a className={link} href="mailto:onwuasoanyajames@gmail.com">onwuasoanyajames@gmail.com</a></p>
            <p className={p}>Lagos, Nigeria</p>
          </section>

          <section className={block}><h2 className={h2}>Core skills</h2>
            <p className={p}><strong className={strong}>Web:</strong> HTML5, CSS3, JavaScript, responsive front-end, UI/UX.</p>
            <p className={p}><strong className={strong}>Design & media:</strong> CorelDRAW, Photoshop, Canva, graphic design, video editing.</p>
            <p className={p}><strong className={strong}>Marketing:</strong> Content and email marketing, social media, content writing.</p>
            <p className={p}><strong className={strong}>Accounting:</strong> Financial, cost and management accounting, taxation.</p>
            <p className={p}><strong className={strong}>Training & operations:</strong> Technical instruction, AI implementation, website administration, IT support and customer service.</p>
          </section>

          <section className={block}><h2 className={h2}>Experience</h2>
            <div className={entry}>
              <span className={period}>20XX — Present</span>
              <h3 className={h3}>Web Development Instructor & AI Implementation Trainer</h3>
              <p className={company}>Nairok Solutions</p>
            </div>
            <div className={entry}>
              <span className={period}>2023 — Present</span>
              <h3 className={h3}>Social Media Specialist</h3>
              <p className={company}>QPM Stationery Limited · Victoria Island, Lagos</p>
            </div>
            <div className={entry}>
              <span className={period}>20XX — 20XX</span>
              <h3 className={h3}>Content Creator, then UI/UX & Front-End Developer</h3>
              <p className={company}>Firepips Forex Academy</p>
            </div>
            <div className={entry}>
              <span className={period}>2020 — 2021</span>
              <h3 className={h3}>Digital Marketing Specialist</h3>
              <p className={company}>Shopnow Integrated Services Limited · Lagos</p>
            </div>
          </section>

          <section className={block}><h2 className={h2}>Project</h2>
            <h3 className={h3}>ERP application · Ongoing</h3>
            <p className={`${p} mt-1`}>Personal project combining business operations and accounting capabilities.</p>
          </section>

          <section className={block}><h2 className={h2}>Education</h2>
            <h3 className={h3}>B.Sc. Accounting</h3>
            <p className={`${p} mt-1`}>University of Nigeria, Nsukka · 2015–2021</p>
            <p className={p}>Also: WASSCE, Febilak International Secondary School, Surulere, Lagos · 2010–2013.</p>
          </section>
        </aside>

        {/* RIGHT: PDF at A4 size (210mm x 297mm = 794 x 1123 px), flush to the right edge of the screen (PDF shows first on mobile) */}
        <section className="order-first flex min-w-0 flex-col gap-3 lg:order-0 lg:items-end" aria-label="CV PDF">
          {/* toolbar=0 and navpanes=0 hide the PDF toolbar and the thumbnail/page-number sidebar */}
          <iframe
            title="James O. CV"
            src={`${site.resume}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="block aspect-210/297 w-full max-w-full border-y border-l lg:ml-auto lg:w-[794px] border-[rgba(128,128,128,0.3)] bg-white"
          />
          <a className="px-5 text-sm underline-offset-4 opacity-70 hover:underline sm:px-8" href={site.resume} target="_blank" rel="noreferrer">PDF not appearing? Open it in a new tab ↗</a>
        </section>

      </section>
    </main>);
}