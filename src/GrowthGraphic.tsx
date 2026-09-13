export function GrowthGraphic() {
  return <figure className="growth-graphic">
    <svg viewBox="0 0 560 210" role="img" aria-labelledby="growth-title growth-description">
      <title id="growth-title">Ilustración conceptual de trayectoria de crecimiento</title>
      <desc id="growth-description">Tres curvas de referencia etiquetadas p90, p50 y p10, con un punto ilustrativo verde y una guía vertical. No representa mediciones de una paciente ni cambia con el score.</desc>
      <g fill="none" strokeWidth="2" strokeLinecap="round">
        <path d="M24 184H508" stroke="#e1dce8" />
        <path d="M24 36C175 41 316 61 508 61" stroke="#d6cfdf" />
        <path d="M24 77C180 88 323 112 508 113" stroke="#afa2c1" />
        <path d="M24 118C180 137 323 164 508 166" stroke="#d6cfdf" />
        <path d="M400 23V184" stroke="#d8d2df" strokeDasharray="3 5" strokeWidth="1.5" />
      </g>
      <g fill="#83758f" fontSize="14" fontFamily="system-ui, sans-serif">
        <text x="514" y="66">p90</text><text x="514" y="118">p50</text><text x="514" y="171">p10</text>
      </g>
      <circle cx="400" cy="59" r="8" fill="#2d7460" stroke="white" strokeWidth="3" />
    </svg>
    <figcaption>Ilustración conceptual de trayectoria de crecimiento. No representa percentiles reales de una paciente individual ni se calcula a partir del score.</figcaption>
  </figure>;
}
