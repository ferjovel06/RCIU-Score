import type { RiskBand } from '../types/scoreModel.types';

interface ScoreRangesProps {
  bands: RiskBand[];
}

export function ScoreRanges({
  bands,
}: ScoreRangesProps) {
  const orderedBands = [...bands].sort(
    (first, second) =>
      first.displayOrder - second.displayOrder,
  );

  return (
    <section
      className="ranges"
      aria-label="Rangos de clasificación"
    >
      <h2>Rangos del modelo original</h2>

      {orderedBands.map(band => (
        <div key={band.code}>
          <span
            className={`range-dot ${band.riskLevel}`}
          />

          {band.label}

          <strong>
            {band.minimumScore}–
            {band.maximumScore}
          </strong>
        </div>
      ))}
    </section>
  );
}
