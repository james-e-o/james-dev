"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor } from "./BlogEditor";
import { ProjectEditor } from "./ProjectEditor";
import { createSupabaseClient } from "@/lib/supabase";

export function AdminDashboard() {
    const client = useMemo(() => createSupabaseClient(), []);
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [access, setAccess] = useState("checking");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [dataError, setDataError] = useState("");
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("projects");
    const [editingProject, setEditingProject] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    const loadContent = useCallback(async () => {
        if (!client)
            return;
        setLoading(true);
        setDataError("");

        try {
            const [projectResult, postResult] = await Promise.all([
                client.from("portfolio_projects")
                    .select("id, slug, title, discipline, role, tools, project_year, description, body_markdown, status, featured")
                    .order("created_at", { ascending: false }),
                client.from("blog_posts")
                    .select("id, slug, title, excerpt, body_markdown, cover_asset_id, status, published_at")
                    .order("created_at", { ascending: false }),
            ]);

            if (projectResult.error)
                throw new Error(`Could not load projects: ${projectResult.error.message}`);
            if (postResult.error)
                throw new Error(`Could not load blog posts: ${postResult.error.message}`);

            setProjects(projectResult.data);
            setPosts(postResult.data);
        }
        catch (error) {
            setDataError(error instanceof Error ? error.message : "Could not load editor content.");
        }
        finally {
            setLoading(false);
        }
    }, [client]);

    useEffect(() => {
        if (!client)
            return;

        let isMounted = true;
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
            if (!isMounted)
                return;
            setSession(nextSession);
            setAccess(nextSession ? "checking" : "signed-out");
            setAuthReady(true);
            setAuthError("");
        });

        client.auth.getSession()
            .then(({ data, error }) => {
                if (!isMounted)
                    return;
                if (error) {
                    setAuthError(`Could not check your login: ${error.message}`);
                    setAccess("error");
                }
                else {
                    setSession(data.session);
                    setAccess(data.session ? "checking" : "signed-out");
                }
                setAuthReady(true);
            })
            .catch((error) => {
                if (!isMounted)
                    return;
                setAuthError(`Could not check your login: ${error.message}`);
                setAccess("error");
                setAuthReady(true);
            });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [client]);

    useEffect(() => {
        if (!client || !session)
            return;

        let isMounted = true;
        client.from("admin_users")
            .select("user_id")
            .eq("user_id", session.user.id)
            .maybeSingle()
            .then(({ data, error }) => {
                if (!isMounted)
                    return;
                if (error) {
                    setAuthError(`Could not verify admin access: ${error.message}`);
                    setAccess("error");
                    return;
                }
                if (!data) {
                    setAccess("denied");
                    return;
                }
                setAccess("authorized");
                loadContent();
            })
            .catch((error) => {
                if (!isMounted)
                    return;
                setAuthError(`Could not verify admin access: ${error.message}`);
                setAccess("error");
            });

        return () => {
            isMounted = false;
        };
    }, [client, loadContent, session]);

    async function handleSignIn(event) {
        event.preventDefault();
        if (!client)
            return;
        setAuthError("");
        try {
            const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
            if (error)
                setAuthError(`Sign-in failed: ${error.message}`);
        }
        catch (error) {
            setAuthError(`Sign-in failed: ${error instanceof Error ? error.message : "Please try again."}`);
        }
    }

    async function handleSignOut() {
        if (!client)
            return;
        try {
            const { error } = await client.auth.signOut();
            if (error)
                setAuthError(`Sign-out failed: ${error.message}`);
        }
        catch (error) {
            setAuthError(`Sign-out failed: ${error instanceof Error ? error.message : "Please try again."}`);
        }
    }

    if (!client) {
        return (
          <section className="admin-login">
            <h2>Admin setup needed</h2>
            <p>To enable sign-in, configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, then complete the Supabase setup and add your account to the admin allowlist.</p>
          </section>
        );
    }

    if (!authReady || access === "checking") {
        return <p className="admin-state" role="status">Checking your sign-in…</p>;
    }

    if (access === "signed-out" || access === "error") {
        return (
          <section className="admin-login">
            <h2>Sign in to your workspace</h2>
            <p>Use the email and password for the admin account you created in Supabase. Public sign-up is disabled.</p>
            <form className="admin-form" onSubmit={handleSignIn}>
              <label>Email<input className="admin-input" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required/></label>
              <label>Password<input className="admin-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required/></label>
              {authError && <p className="admin-message admin-message--error" role="alert">{authError}</p>}
              <button className="button button--primary" type="submit">Sign in</button>
            </form>
          </section>
        );
    }

    if (access === "denied") {
        return (
          <section className="admin-login">
            <h2>This account is not an administrator</h2>
            <p>Your sign-in worked, but this account is not enabled in the Supabase admin allowlist.</p>
            {authError && <p className="admin-message admin-message--error" role="alert">{authError}</p>}
            <button className="button button--secondary" type="button" onClick={handleSignOut}>Sign out</button>
          </section>
        );
    }

    return (
      <section className="admin-workspace">
        <div className="admin-toolbar">
          <div><p className="eyebrow"><span className="eyebrow-dot"/>SIGNED IN</p><p>{session?.user.email}</p></div>
          <button className="button button--secondary" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
        <div className="admin-tabs" role="tablist" aria-label="Content editor">
          <button type="button" role="tab" aria-selected={activeTab === "projects"} onClick={() => setActiveTab("projects")}>Portfolio projects ({projects.length})</button>
          <button type="button" role="tab" aria-selected={activeTab === "posts"} onClick={() => setActiveTab("posts")}>Blog posts ({posts.length})</button>
        </div>
        {dataError && <p className="admin-message admin-message--error" role="alert">{dataError}</p>}
        {loading && <p className="admin-state" role="status">Loading your content…</p>}
        {!loading && activeTab === "projects" && (
          <div className="admin-editor-layout">
            <ProjectEditor
              client={client}
              userId={session.user.id}
              project={editingProject}
              onCancel={() => setEditingProject(null)}
              onSaved={() => {
                  setEditingProject(null);
                  loadContent();
                  router.refresh();
              }}
            />
            <div className="admin-content-list">
              <h3>Your projects</h3>
              {projects.length === 0 && <p className="admin-muted">No projects yet. Add one to start building your portfolio.</p>}
              {projects.map((project) => (
                <article className="admin-list-item" key={project.id}>
                  <div><strong>{project.title}</strong><span>{project.status} · {project.discipline}</span></div>
                  <button className="admin-text-button" type="button" onClick={() => setEditingProject(project)}>Edit</button>
                </article>
              ))}
            </div>
          </div>
        )}
        {!loading && activeTab === "posts" && (
          <div className="admin-editor-layout">
            <BlogEditor
              client={client}
              userId={session.user.id}
              post={editingPost}
              onCancel={() => setEditingPost(null)}
              onSaved={() => {
                  setEditingPost(null);
                  loadContent();
                  router.refresh();
              }}
            />
            <div className="admin-content-list">
              <h3>Your blog posts</h3>
              {posts.length === 0 && <p className="admin-muted">No posts yet. Create a post or run the sample-post SQL from the setup guide.</p>}
              {posts.map((post) => (
                <article className="admin-list-item" key={post.id}>
                  <div><strong>{post.title}</strong><span>{post.status}</span></div>
                  <button className="admin-text-button" type="button" onClick={() => setEditingPost(post)}>Edit</button>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    );
}
