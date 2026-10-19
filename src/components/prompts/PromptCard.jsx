import { CopyButton } from "./CopyButton";
import { Tag } from "@/components/ui/Tag";
export function PromptCard({ prompt }) {
    return (<article className="prompt-card">
      <div className="prompt-card-top"><Tag>{prompt.category}</Tag><span className="prompt-spark" aria-hidden="true">✳</span></div>
      <h2>{prompt.title}</h2>
      <p className="prompt-when"><strong>When to use</strong> {prompt.when}</p>
      <pre className="prompt-copy">{prompt.prompt}</pre>
      <CopyButton text={prompt.prompt}/>
    </article>);
}
