import { Button } from "@/components/ui/Button";
export function CtaPair({ compact = false }) {
    return (<div className={`cta-pair ${compact ? "cta-pair--compact" : ""}`}>
      <Button href="/work">View my work <span aria-hidden="true">↗</span></Button>
      <Button href="/cv" kind="secondary">View my CV <span aria-hidden="true">↗</span></Button>
    </div>);
}
