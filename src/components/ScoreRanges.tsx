export function ScoreRanges() {
  return <section className="ranges" aria-label="Rangos de clasificación">
    <h2>Rangos del modelo original</h2>
    <div><span className="range-dot low" />Bajo<strong>0–2</strong></div>
    <div><span className="range-dot moderate" />Moderado<strong>3–5</strong></div>
    <div><span className="range-dot high" />Alto<strong>6–13</strong></div>
  </section>;
}
