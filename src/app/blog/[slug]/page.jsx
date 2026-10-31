import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { PageCta } from "@/components/sections/PageCta";
import { getBlogPosts } from "@/lib/content";
import { mockBlogPosts } from "@/data/blog";

function formatDate(value) {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

export const metadata = {
    title: "Blog post",
    description: "Personal notes on building for the web and the future of AI.",
};

export function generateStaticParams() {
    return mockBlogPosts.map(({ slug }) => ({ slug }));
}

export default function BlogPostPage({ params }) {
    return (<main id="main" className="page-main">
      <Suspense fallback={<p className="container admin-state" role="status">Loading post…</p>}>
        <BlogPostContent params={params}/>
      </Suspense>
      <PageCta />
    </main>);
}

async function BlogPostContent({ params }) {
    const { slug } = await params;
    const post = (await getBlogPosts()).find((entry) => entry.slug === slug);
    if (!post)
        notFound();

    return (
      <article className="container blog-post">
        <Link className="text-link blog-back-link" href="/blog">← All posts</Link>
        <p className="eyebrow"><span className="eyebrow-dot"/>NOTES & PERSPECTIVES</p>
        <h1>{post.title}</h1>
        <p className="blog-post-excerpt">{post.excerpt}</p>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        {post.coverUrl && <Image className="blog-post-cover" src={post.coverUrl} alt={post.coverAlt ?? post.title} width={1400} height={780} unoptimized/>}
        <div className="blog-body">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>
      </article>
    );
}
