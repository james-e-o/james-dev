import Link from "next/link";
import { navigation, site } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";
export function Header() {
    return (<header id="top" className="site-header">
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label={`${site.name} — home`}>
          <span className="wordmark-mark" aria-hidden="true">j.</span>
          <span>{site.name}<span className="wordmark-period">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (<Link key={item.href} href={item.href}>{item.label}</Link>))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Button href="/cv" kind="secondary" className="header-cv">View CV <span aria-hidden="true">↗</span></Button>
        </div>
      </div>
    </header>);
}
