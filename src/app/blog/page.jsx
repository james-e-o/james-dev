import { Suspense } from "react";
import { PageCta } from "@/components/sections/PageCta";
import { PageIntro } from "@/components/sections/PageIntro";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts } from "@/lib/content";

export const metadata = {
    title: "Blog",
    description: "Personal notes on building for the web and the future of AI.",
};

export default function BlogPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <PageIntro eyebrow="NOTES, IDEAS & CURIOSITY" title="A few things on my mind.">
          Personal perspectives on building for the web, creative work and where AI might take us next.
        </PageIntro>
      </div>
      <section className="container page-content" aria-label="Blog posts">
        <Suspense fallback={<p className="admin-state" role="status">Loading posts…</p>}>
          <BlogPostList/>
        </Suspense>
      </section>
      <PageCta />
    </main>);
}

async function BlogPostList() {
    const posts = await getBlogPosts();

    return posts.length > 0 ? (
      <div className="blog-grid">{posts.map((post) => <BlogCard key={post.slug} post={post}/>)}</div>
    ) : (
      <p className="empty-state">There are no published posts yet.</p>
    );
}
