import Link from "next/link";
export function Button({ href, kind = "primary", children, external = false, className = "", ...props }) {
    const classes = `button button--${kind} ${className}`.trim();
    if (external) {
        return (<a className={classes} href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>);
    }
    return (<Link className={classes} href={href} {...props}>
      {children}
    </Link>);
}
