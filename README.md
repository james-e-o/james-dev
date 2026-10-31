# Personal creative portfolio

A dark-first portfolio with a warm charcoal foundation, light lemon accent and deep green details, alongside varied color in the visual work. Built with Next.js App Router, JavaScript/JSX, Tailwind CSS, file-based MDX, Framer Motion, `next/image`, and `next-sitemap`.

> **Personalize before launch:** update the sample name, contact details, social links, bio, experience, placeholder artwork, video IDs, testimonials and CV. Sample project descriptions and placeholder media are not real client work.

## Scaffold command

To create a fresh project with the same Next.js foundation:

```bash
npx create-next-app@latest my-portfolio --js --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Then from the new project directory, add the dependencies used here:

```bash
npm install framer-motion @next/mdx @mdx-js/loader @mdx-js/react next-sitemap @supabase/supabase-js react-markdown tus-js-client
```

This repository is already scaffolded; the command above is provided for recreating it elsewhere.

## Run locally

```bash
npm install
npm run dev
```

The development server uses port `3001`; open <http://localhost:3001>. Run a production build with `npm run build`, then `npm start`.

## Routes

- `/` — introduction, disciplines, reel, featured work, process, notes on AI, tools and testimonials.
- `/work` — filterable portfolio.
- `/work/video` — reel and four sample video projects.
- `/work/design` — a mixed visual gallery of eight sample design pieces and four video thumbnails. Portrait edits use 9:16 framing; a widescreen edit uses 16:9. Design pieces open in a keyboard-operable lightbox (Escape and arrow keys), while video thumbnails link to their project pages or an external video URL.
- `/work/[slug]` — project pages; the `clear-day` and `made-for-more` case studies render MDX from `content/case-studies/`.
- `/cv` — on-page CV, PDF download and embedded PDF.
- `/blog` and `/blog/[slug]` — two sample opinion posts about web building and the future of AI.
- `/admin` — Supabase-authenticated editor for projects, image/video uploads and blog posts.
- `/about` and `/contact` — personal story and contact options.

Public routes end with the reusable work/CV CTA pair. The sticky navigation has five primary links and a persistent CV button.

## Edit the content

- `src/data/site.jsx` — name, positioning, email, location, booking link and socials.
- `src/data/work.jsx` — portfolio records, discipline tags, tools, roles, years and visual placeholder colors. The work hub and both discipline pages read from this file.
- `src/data/blog.jsx` — sample blog posts shown until Supabase is configured.
- `src/data/resume.jsx` — CV experience, skills and education.
- `src/app/page.jsx` — landing page narrative, process steps and tools; update placeholder testimonials there too.
- `content/case-studies/` — project story content, written in MDX.

The name currently uses the repository owner's likely first name as a sample (`James O.`); replace it if that isn't your preferred public name. Add real portrait photography under `public/images/` and update the `next/image` source and descriptive alt text in `src/app/about/page.jsx`. Keep local raster images sized for display; Next.js will create responsive optimized variants.

## Add a video

1. Add a record to `workItems` in `src/data/work.jsx` with `discipline: "Video Editing"`, a unique `slug`, descriptive copy, role, tools and placeholder color pair. The video and main work routes update automatically.
2. Replace placeholder artwork with a project thumbnail in `public/images/` and render it with `next/image` where you add the real project media.
3. In `src/components/work/VideoPlayer.jsx`, replace the sample YouTube IFrame Player demo ID (`M7lc1UVf-VE`) with your real video ID. Pass `provider="vimeo"` for Vimeo videos. The player loads no third-party iframe until the visitor activates the play button. The landing and portfolio reel use the same facade pattern.
4. For a self-hosted short preview, add an optimized, muted MP4 preview and use a `<video autoPlay muted loop playsInline>` element with a poster image. Keep the full reel behind a click-to-play facade and provide captions/transcript or an equivalent accessible description.

## Add a design piece

Add a record to `workItems` in `src/data/work.jsx` with `discipline: "Graphic Design"` and a unique slug. The mixed `/work/design` gallery automatically includes it. Replace its abstract CSS artwork with a real image under `public/images/`, and use `next/image` with an accurate alt description. The included eight pieces are intentionally abstract placeholders, not portfolio claims.

## Add a social video thumbnail

Add a `Video Editing` record to `workItems` in `src/data/work.jsx` with `mediaOrientation: "portrait"` for a 9:16 TikTok/Instagram Reel, or `"landscape"` for a 16:9 video. Set `platform` to `"TikTok"`, `"Instagram Reels"` or `"YouTube"` for the thumbnail label. Add `videoUrl: "https://..."` to link directly to the published video; until then, the thumbnail links to its local project page. The mixed visual gallery includes these videos alongside the graphic design work.

## Replace the CV

The CV download and embedded viewer use `public/James_Onwuasoanya_CV.pdf`, configured by `resume` in `src/data/site.jsx`. Replace that file when updating the PDF, or update `resume` to point to a different file. Edit the on-page experience, skills and education in `src/data/resume.jsx` and `src/app/cv/page.jsx`. Verify the CV is readable at mobile widths and that the PDF is accessible.

## Deploy to Vercel

1. Push the repository to your Git provider and import it in Vercel.
2. Set `SITE_URL` to your production origin (for example `https://your-domain.com`). `next-sitemap` uses this value after the production build; update `metadataBase` in `src/app/layout.jsx` to match.
3. Deploy with the default Next.js build command, `npm run build`. The `postbuild` script writes `sitemap.xml` and `robots.txt`.
4. Before launch, replace all placeholder identity details, portrait/media, sample testimonials and CV; verify each social, contact and booking URL.

To enable `/admin` and publish edits from Supabase, follow [Supabase upload setup](./SUPABASE_UPLOAD_SETUP.md), including the database schema, Storage bucket, RLS policies and sample blog post seed. Add the Supabase URL and publishable key to `.env.local`; never expose a service-role key. Without Supabase configuration, the blog and portfolio use their sample content and the admin editor remains unavailable.

## Accessibility and performance notes

- Semantic landmarks, a skip link, visible focus indicators, descriptive image text, high-contrast theme tokens and keyboard-operable filters/lightbox.
- Dark theme by default, with a saved light/dark toggle.
- Framer Motion is limited to a small reveal wrapper and honors reduced-motion preferences.
- Video embeds are click-to-play and use YouTube's privacy-enhanced domain.
- Image artwork is CSS/SVG placeholder content; real raster project photos should use `next/image` and local assets.
- The contact form uses `mailto:` and stores no data. Connect a form service if you need server-side submissions.
