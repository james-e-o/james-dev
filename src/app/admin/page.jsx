import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
    title: "Admin",
    robots: { index: false, follow: false },
};

export default function AdminPage() {
    return (<main id="main" className="page-main">
      <div className="container page-hero">
        <div className="page-intro">
          <p className="eyebrow"><span className="eyebrow-dot"/>PRIVATE CONTENT EDITOR</p>
          <h1>Your work,<br/><span className="serif-italic">your words.</span></h1>
          <p className="page-intro-copy">Sign in to manage portfolio projects, upload media and edit blog posts.</p>
        </div>
      </div>
      <section className="container page-content">
        <AdminDashboard/>
      </section>
    </main>);
}
