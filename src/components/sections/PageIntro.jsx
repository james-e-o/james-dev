export function PageIntro({ eyebrow, title, children, }) {
    return (<div className="page-intro">
      <p className="eyebrow"><span className="eyebrow-dot"/>{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-intro-copy">{children}</p>
    </div>);
}
