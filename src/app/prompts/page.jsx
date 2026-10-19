import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { PromptCard } from "@/components/prompts/PromptCard";
import { prompts } from "@/data/prompts";
export const metadata = {
    title: "Business AI prompts",
    description: "Practical, careful AI prompt starters for sales, marketing, operations, support and product teams.",
};
export default function PromptsPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="A SMALL, PRACTICAL LIBRARY" title="Prompts with a purpose.">
          Useful starting points for real work—not magic words. Each one asks for context, sets sensible guardrails and leaves room for human judgement.
        </PageIntro>
      </div>
      <section className="container page-content" aria-label="Prompt library">
        <div className="prompt-grid">{prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt}/>)}</div>
      </section>
      <PageCta />
    </main>);
}
