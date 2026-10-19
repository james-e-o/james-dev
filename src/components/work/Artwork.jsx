export function Artwork({ item, className = "" }) {
    return (<div className={`artwork artwork--${item.art} ${className}`} style={{ "--art-one": item.colors[0], "--art-two": item.colors[1] }} role="img" aria-label={`Abstract placeholder artwork for ${item.title}`}>
      <span className="artwork-grain"/>
      <span className="artwork-shape artwork-shape--one"/>
      <span className="artwork-shape artwork-shape--two"/>
      <span className="artwork-shape artwork-shape--three"/>
      <span className="artwork-type">{item.title}</span>
      <span className="artwork-index" aria-hidden="true">J—01</span>
    </div>);
}
