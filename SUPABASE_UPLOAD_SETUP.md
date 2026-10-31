# Supabase portfolio upload setup

This guide configures Supabase Auth, the database, Storage and the `/admin` editor for portfolio projects, media and blog posts.

## Security notes

- Use Supabase Auth for email/password login. **Do not create a table for passwords or copy rows into `auth.users`.** Supabase owns and secures its Auth tables.
- The publishable key belongs in the browser and is not an admin credential. It does not bypass Row Level Security (RLS).
- Never put a Supabase `service_role`/secret key in `NEXT_PUBLIC_*`, browser code, or this repository. The editor uses the publishable key and relies on RLS; it does not need a service-role key.
- The `portfolio-media` bucket below is public so portfolio images and videos can be displayed without signing in. Anyone with an asset URL can view that asset. Upload, update and delete actions remain restricted to allowlisted admin users. Do not put private files in this bucket.
- Only publish media that is intended to be publicly visible.

## 1. Configure local environment

Create `.env.local` in the project root. Use the project URL and publishable key from the Supabase project settings; do not commit this file.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Admin authorization is enforced by the `admin_users` table and `is_admin()` function below—not by trusting an email supplied by the browser.

## 2. Create the public media bucket

Open **Supabase Dashboard → SQL Editor**, paste and run the SQL in this section. The size cap is 100 MiB per object; adjust it to your Supabase plan and expected video sizes.

```sql
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
```

A public bucket allows visitors to fetch objects through their public URLs without signing in. This setup intentionally does **not** grant anonymous users permission to list bucket objects.

## 3. Create tables, admin helper and RLS policies

Run this SQL after creating the bucket. The statements are safe to re-run for the policies and functions; if you change an existing table's columns later, add an explicit migration rather than dropping live data.

```sql
create extension if not exists pgcrypto;

-- Admin identities are references to Supabase Auth users; passwords remain
-- exclusively in Supabase Auth and are never stored in this table.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null default 'portfolio-media',
  storage_path text unique,
  asset_type text not null check (asset_type in ('image', 'video')),
  title text,
  alt_text text,
  caption text,
  orientation text check (orientation in ('portrait', 'landscape', 'square')),
  platform text check (platform in ('Instagram Reels', 'TikTok', 'YouTube', 'Vimeo', 'Other')),
  external_url text,
  is_public boolean not null default false,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_assets_storage_bucket_check
    check (storage_bucket = 'portfolio-media'),
  constraint media_assets_has_source_check
    check (coalesce(storage_path, '') <> '' or external_url is not null)
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  discipline text not null check (
    discipline in ('Video Editing', 'Graphic Design', 'UX / Product', 'Development', 'AI')
  ),
  role text,
  tools text[] not null default '{}',
  project_year integer check (project_year between 1900 and 2200),
  description text,
  body_markdown text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A project can have a cover, stills, thumbnails, and video assets in order.
create table if not exists public.project_media (
  project_id uuid not null references public.portfolio_projects (id) on delete cascade,
  asset_id uuid not null references public.media_assets (id) on delete cascade,
  role text not null default 'gallery'
    check (role in ('cover', 'thumbnail', 'reel', 'gallery', 'before', 'after')),
  sort_order integer not null default 0,
  primary key (project_id, asset_id, role)
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body_markdown text not null default '',
  cover_asset_id uuid references public.media_assets (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_published_date_check
    check (status <> 'published' or published_at is not null)
);

-- Initial editable examples for the web-building and AI opinion posts.
insert into public.blog_posts (slug, title, excerpt, body_markdown, status, published_at)
values
  (
    'my-perspective-on-the-web-building-space',
    'My perspective on the web-building space',
    'A few early thoughts on making the web: the tools are changing quickly, but clarity, care and a real point of view still matter.',
    $post$
The web-building space moves quickly. New tools make it easier than ever to turn an idea into something people can use, and that is genuinely exciting. But making a website is still about more than getting pages online.

The best work starts with understanding who it is for and what it needs to do. A clear structure, thoughtful writing and a little attention to the details can make a simple site feel far more useful than a complicated one built without a purpose.

I am interested in the space where design, technology and storytelling meet. The tools will keep changing, but the opportunity to make the internet more useful, welcoming and human is what keeps me curious.
    $post$,
    'published',
    now()
  ),
  (
    'thoughts-on-the-future-of-ai',
    'Thoughts on the future of AI',
    'AI will keep evolving. My hope is that we use it to make more room for human curiosity, not less.',
    $post$
AI is moving from a novelty into the everyday tools people use to write, make, search and solve problems. It is easy to focus on what the technology can do next. I am just as interested in the choices we make around it.

Used thoughtfully, AI can help people explore more ideas, get past a blank page and spend less time on repetitive tasks. It can also be confidently wrong, reproduce bias and make it tempting to value speed over understanding. Those limits deserve to be part of the conversation.

I do not think the future is about handing every decision to a machine. It is about learning where these tools help, staying curious about how they work and keeping people responsible for the outcomes. The technology will change; care and good judgement should remain part of the process.
    $post$,
    'published',
    now()
  )
on conflict (slug) do nothing;

create index if not exists portfolio_projects_public_order_idx
  on public.portfolio_projects (status, sort_order, created_at desc);
create index if not exists project_media_order_idx
  on public.project_media (project_id, role, sort_order);
create index if not exists media_assets_public_idx
  on public.media_assets (is_public, created_at desc);
create index if not exists blog_posts_public_order_idx
  on public.blog_posts (status, published_at desc);

-- SECURITY DEFINER lets the helper check the allowlist without triggering
-- admin_users' own RLS policy recursively. An empty search_path and qualified
-- object names prevent search-path object substitution.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from public.admin_users as admins
    where admins.user_id = (select auth.uid())
      and admins.enabled = true
  );
$function$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Keep updated_at accurate for rows changed by the admin editor.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at
  before update on public.media_assets
  for each row execute function public.set_updated_at();

drop trigger if exists portfolio_projects_set_updated_at on public.portfolio_projects;
create trigger portfolio_projects_set_updated_at
  before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- Enable RLS on every application table.
alter table public.admin_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.project_media enable row level security;
alter table public.blog_posts enable row level security;

-- Remove prior policies with these names so this policy section can be re-run.
drop policy if exists "Admins can view their own enabled identity" on public.admin_users;
drop policy if exists "Public can view public media metadata" on public.media_assets;
drop policy if exists "Admins can manage media metadata" on public.media_assets;
drop policy if exists "Public can view published projects" on public.portfolio_projects;
drop policy if exists "Admins can manage projects" on public.portfolio_projects;
drop policy if exists "Public can view media for published projects" on public.project_media;
drop policy if exists "Admins can manage project media" on public.project_media;
drop policy if exists "Public can view published blog posts" on public.blog_posts;
drop policy if exists "Admins can manage blog posts" on public.blog_posts;

-- A signed-in user can see only their own enabled allowlist row. There are no
-- client INSERT/UPDATE/DELETE policies: manage allowlisted admins in SQL Editor.
create policy "Admins can view their own enabled identity"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()) and enabled = true);

-- Public portfolio pages may read metadata only for assets explicitly marked
-- public. Admins can read all rows, including uploaded assets not yet published.
create policy "Public can view public media metadata"
  on public.media_assets
  for select
  to anon, authenticated
  using (is_public = true or (select public.is_admin()));

create policy "Admins can manage media metadata"
  on public.media_assets
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can view published projects"
  on public.portfolio_projects
  for select
  to anon, authenticated
  using (status = 'published' or (select public.is_admin()));

create policy "Admins can manage projects"
  on public.portfolio_projects
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can view media for published projects"
  on public.project_media
  for select
  to anon, authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1
      from public.portfolio_projects as projects
      join public.media_assets as assets on assets.id = project_media.asset_id
      where projects.id = project_media.project_id
        and projects.status = 'published'
        and assets.is_public = true
    )
  );

create policy "Admins can manage project media"
  on public.project_media
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can view published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    (
      status = 'published'
      and published_at <= now()
    )
    or (select public.is_admin())
  );

create policy "Admins can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Give the API roles access to the tables; RLS policies still decide which rows
-- each caller may access.
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on
  public.media_assets,
  public.portfolio_projects,
  public.project_media,
  public.blog_posts
to authenticated;
grant select on
  public.media_assets,
  public.portfolio_projects,
  public.project_media,
  public.blog_posts
to anon;

-- Storage access: public bucket downloads do not need a SELECT policy. The
-- policies below allow only enabled admins to list, upload, update or delete
-- objects through the Storage API. Public bucket URLs remain publicly readable.
drop policy if exists "Admins can upload portfolio media" on storage.objects;
drop policy if exists "Admins can update portfolio media" on storage.objects;
drop policy if exists "Admins can delete portfolio media" on storage.objects;

create policy "Admins can upload portfolio media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and (select public.is_admin())
  );

create policy "Admins can update portfolio media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (select public.is_admin())
  )
  with check (
    bucket_id = 'portfolio-media'
    and (select public.is_admin())
  );

create policy "Admins can delete portfolio media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'portfolio-media'
    and (select public.is_admin())
  );
```

## 4. Create your admin login

1. In **Supabase Dashboard → Authentication → Users**, create or invite the email address that will administer the site. Set its password in the Supabase dashboard; do not put a password in SQL, source code, or this guide.
2. Copy that user's UUID from the Auth user list.
3. In SQL Editor, replace the example email and UUID, then run:

```sql
insert into public.admin_users (user_id, email, enabled)
values (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'you@example.com',
  true
)
on conflict (user_id) do update
set email = excluded.email, enabled = true;
```

There is intentionally no public registration or admin-self-enrollment policy. Add or disable admin accounts in Supabase SQL Editor. To revoke admin privileges while preserving the Auth account:

```sql
update public.admin_users
set enabled = false
where email = 'you@example.com';
```

For a single-owner site, add only your own Auth user to `admin_users`.

## 5. How uploaded object links are stored

`media_assets.storage_bucket` and `media_assets.storage_path` identify the uploaded object in Supabase Storage. Store a path relative to the bucket, for example:

```text
projects/field-notes/reel-cover.webp
projects/field-notes/reel.mp4
design/good-things/identity.png
blog/my-first-post/cover.webp
```

The application builds a public object URL from the project URL, bucket, and path:

```text
{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/{storage_bucket}/{storage_path}
```

`media_assets.external_url` is optional and is for an externally hosted video URL. Use `project_media` to attach one or more media assets to a project with roles such as `cover`, `thumbnail`, or `gallery`; use `blog_posts.cover_asset_id` for a blog cover. Set `is_public = true` only when the media is ready to appear publicly. A published project's linked public assets are visible through the metadata policies above.

The data tables deliberately store bucket/path rather than a duplicated full URL. This keeps links stable if the Supabase project URL changes and allows the front end to create the public URL consistently.

## 6. Use the portfolio editor

- Visit `/admin` and sign in with the Auth account added to `admin_users`. There is no public registration.
- The editor checks the allowlist before displaying content. Database and Storage operations are also restricted by the RLS policies; never rely on the client-side check alone.
- Add projects with a title, description, discipline, optional project story and image/video uploads. Published projects appear on `/work`, the discipline galleries, featured work when selected, and their project page. Uploads accept JPEG, PNG, WebP, GIF, AVIF, MP4, WebM and QuickTime video, up to 100 MiB per file. Large files use resumable uploads.
- Edit the two seeded blog examples or create more posts. Posts marked draft remain private; published posts with a publication date appear on `/blog`.
- Project and blog text is Markdown. It is rendered as safe Markdown content, not executable MDX. Do not evaluate user-provided JSX or MDX.
- The initial blog examples are inserted with `on conflict do nothing`; re-running setup will not overwrite edits or restore posts that you deleted.

## 7. Verify the setup

In **Database → Tables**, confirm the five application tables exist and RLS is enabled: `admin_users`, `media_assets`, `portfolio_projects`, `project_media`, and `blog_posts`.

Then test with two sessions:

1. An unauthenticated visitor should be able to read published projects/posts and public media metadata, but should not see drafts or list the Storage bucket.
2. Your allowlisted account should be able to upload and manage media, projects, project-media links, and posts.
3. A signed-in account that is not in `admin_users` must not be able to create, update, or delete rows or upload files.

If an access check fails, inspect the relevant table's RLS policies and the user's `admin_users.enabled` value. Never resolve an RLS issue by exposing the service-role key to the browser or disabling RLS.
