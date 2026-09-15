import { scoreToGraphicY } from '../utils/calculateScore';

interface GrowthGraphicProps {
  extendedTotal: number;
  extendedMaximum: number;
  originalTotal: number;
  originalMaximum: number;
  additionalTotal: number;
}

export function GrowthGraphic({
  extendedTotal,
  extendedMaximum,
  originalTotal,
  originalMaximum,
  additionalTotal,
}: GrowthGraphicProps) {
  const markerY = scoreToGraphicY(
    extendedTotal,
    extendedMaximum,
  );

  return (
    <figure className="growth-graphic">
      <svg
        viewBox="0 0 560 210"
        role="img"
        aria-labelledby="growth-title growth-description"
      >
        <title id="growth-title">
          Trayectoria conceptual para un puntaje de{' '}
          {extendedTotal} sobre {extendedMaximum}
        </title>

        <desc id="growth-description">
          Tres curvas conceptuales etiquetadas p90,
          p50 y p10. El marcador verde se desplaza
          desde p90 hacia p10 a medida que aumenta
          el puntaje calculado.
        </desc>

        <g
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path
            d="M24 184H508"
            stroke="#e1dce8"
          />

          <path
            d="M24 36C175 41 316 61 508 61"
            stroke="#d6cfdf"
          />

          <path
            d="M24 77C180 88 323 112 508 113"
            stroke="#afa2c1"
          />

          <path
            d="M24 118C180 137 323 164 508 166"
            stroke="#d6cfdf"
          />

          <path
            d="M400 23V184"
            stroke="#d8d2df"
            strokeDasharray="3 5"
            strokeWidth="1.5"
          />
        </g>

        <g
          fill="#83758f"
          fontSize="14"
          fontFamily="system-ui, sans-serif"
        >
          <text x="514" y="66">
            p90
          </text>

          <text x="514" y="118">
            p50
          </text>

          <text x="514" y="171">
            p10
          </text>
        </g>

        <circle
          className="score-marker"
          cx="400"
          cy={markerY}
          r="8"
          fill="#2d7460"
          stroke="white"
          strokeWidth="3"
        />
      </svg>

      <figcaption>
        Ilustración conceptual de trayectoria de
        crecimiento — marcador dinámico según el
        puntaje ({extendedTotal}/{extendedMaximum}).
        No representa percentiles reales de una
        paciente individual.
      </figcaption>

      <span
        className="graphic-calculation"
        aria-hidden="true"
      >
        Score original {originalTotal}/
        {originalMaximum} + factores adicionales{' '}
        {additionalTotal} = {extendedTotal}/
        {extendedMaximum}
      </span>
    </figure>
  );
}
