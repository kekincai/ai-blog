export default function Enso() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg width="440" height="440" viewBox="0 0 440 440">
        <line x1="220" y1="0" x2="220" y2="440" stroke="var(--hair)" />
        <line x1="0" y1="220" x2="440" y2="220" stroke="var(--hair)" />
        <circle cx="220" cy="220" r="170" fill="none" stroke="var(--ink)" strokeWidth="3" strokeDasharray="930 140" strokeLinecap="round" transform="rotate(-70 220 220)" />
        <g className="enso-ring">
          <circle cx="220" cy="220" r="138" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 8" />
        </g>
        <circle cx="220" cy="220" r="6" fill="var(--accent)" />
        <rect x="310" y="96" width="14" height="14" fill="none" stroke="var(--ink)" />
        <line x1="324" y1="103" x2="400" y2="103" stroke="var(--ink)" />
      </svg>
      <div className="node">NODE_07</div>
      <div className="vert">学び、識り、感じる。</div>
      <div className="coords">
        <span>35.6762°N / 139.6503°E</span>
        <span>SIGNAL ▮▮▮▮▯ STABLE</span>
      </div>
    </div>
  );
}
