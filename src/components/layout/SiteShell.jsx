import { Header } from "./Header";
import { Footer } from "./Footer";
export function SiteShell({ children }) {
    return (<>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      {children}
      <Footer />
    </>);
}
