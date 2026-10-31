import Link from "next/link";
import Image from "next/image";

function formatDate(value) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

export function BlogCard({ post }) {
    return (
      <article className="blog-card">
        {post.coverUrl && <Link className="blog-card-cover" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
          <Image src={post.coverUrl} alt={post.coverAlt ?? post.title} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw"/>
        </Link>}
        <p className="eyebrow"><span className="eyebrow-dot"/>NOTES & PERSPECTIVES</p>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-footer">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <Link className="text-link" href={`/blog/${post.slug}`}>Read the post <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    );
}
