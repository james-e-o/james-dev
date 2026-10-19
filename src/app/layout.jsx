import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/data/site";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata = {
    metadataBase: new URL("https://your-domain.com"),
    title: {
        default: `${site.fullName} — Creative, editor & product-minded developer`,
        template: `%s — ${site.fullName}`,
    },
    description: site.description,
    openGraph: {
        title: `${site.fullName} — Multidisciplinary creative`,
        description: site.description,
        type: "website",
    },
};
export const viewport = {
    themeColor: "#171915",
    colorScheme: "dark light",
};
export default function RootLayout({ children }) {
    return (<html lang="en" data-theme="dark" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>);
}
