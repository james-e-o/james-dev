export function Container({ children, className = "" }) {
    return <div className={`container ${className}`.trim()}>{children}</div>;
}
export function Section({ children, id, className = "", tone, }) {
    return (<section id={id} className={`section ${tone === "soft" ? "section--soft" : ""} ${className}`.trim()}>
      <Container>{children}</Container>
    </section>);
}
