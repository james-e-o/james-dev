import Link from "next/link";
import { site } from "@/data/site";
export function Footer() {
    return (<footer className="site-footer">
      <div className="container footer-inner">
        <Link href="/" className="wordmark"><span className="wordmark-mark">j.</span><span>{site.name}<span className="wordmark-period">.</span></span></Link>
        <span className="footer-note">Made with care, curiosity & too many open tabs.</span>
        <a className="back-top" href="#top">Back to top ↑</a>
        <span className="footer-copy">© {site.fullName}</span>
      </div>
    </footer>);
}
