import Link from "next/link";
import { Artwork } from "./Artwork";
import { Tag } from "@/components/ui/Tag";
export function WorkCard({ item, compact = false }) {
    return (<article className={`work-card ${compact ? "work-card--compact" : ""}`}>
      <Link className="work-card-link" href={`/work/${item.slug}`} aria-label={`View ${item.title} project`}>
        <Artwork item={item} className="work-card-art"/>
        <div className="work-card-meta">
          <div>
            <Tag>{item.discipline}</Tag>
            <h3>{item.title}</h3>
            <p>{item.role}</p>
            <p className="work-card-tools">{item.tools.join(" · ")}</p>
          </div>
          <span className="work-card-arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>);
}
