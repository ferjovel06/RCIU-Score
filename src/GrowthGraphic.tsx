export function GrowthGraphic({ total, original, smokingPoints }: { total: number; original: number; smokingPoints: number }) {
  const x = (value: number) => 32 + value / 14 * 476;
  return <figure className="growth-graphic">
    <h2>Puntaje en tiempo real</h2>
    <svg viewBox="0 0 560 228" role="img" aria-labelledby="growth-title growth-description">
      <title id="growth-title">Puntaje ampliado: {total} de 14 puntos</title>
      <desc id="growth-description">Score original {original} puntos más {smokingPoints} punto por tabaquismo. El marcador muestra el total actual en una escala de 0 a 14; no representa crecimiento fetal ni probabilidad.</desc>
      <g stroke="#e1dce8" strokeWidth="1">
        {[0,2,4,6,8,10,12,14].map(n => <line key={n} x1={x(n)} x2={x(n)} y1="44" y2="166" strokeDasharray="3 5" />)}
      </g>
      <g fill="none" strokeLinecap="round" strokeWidth="8">
        <path d="M32 78H508" stroke="#eeeaf2" />
        {original > 0 && <path d={`M32 78H${x(original)}`} stroke="#afa2c1" />}
        {smokingPoints > 0 && <path d={`M${x(original)} 78H${x(total)}`} stroke="#ae8a37" />}
        <path d="M32 148H508" stroke="#eeeaf2" strokeWidth="3" />
        {original > 0 && <path d={`M32 148H${x(original)}`} stroke="#afa2c1" strokeWidth="3" />}
      </g>
      <line x1={x(total)} x2={x(total)} y1="58" y2="166" stroke="#2d7460" strokeDasharray="3 5" />
      <circle cx={x(total)} cy="78" r="9" fill="#2d7460" stroke="white" strokeWidth="3" />
      <circle cx={x(original)} cy="148" r="5" fill="#afa2c1" />
      <g fontFamily="system-ui, sans-serif" fontSize="16" fill="#6c6678">
        <text x="32" y="30">Total ampliado</text><text x="508" y="30" textAnchor="end" fill="#2d7460" fontWeight="700">{total} / 14</text>
        <text x="32" y="121">Score original</text><text x="508" y="121" textAnchor="end">{original} / 13</text>
        {[0,2,4,6,8,10,12,14].map(n => <text key={n} x={x(n)} y="192" textAnchor="middle">{n}</text>)}
        <text x="270" y="222" textAnchor="middle">Puntos</text>
      </g>
    </svg>
    <figcaption>{original} puntos del score original + {smokingPoints} por tabaquismo = <strong>{total} puntos</strong>. Extensión experimental; la gráfica muestra puntos, no percentiles de crecimiento.</figcaption>
  </figure>;
}
