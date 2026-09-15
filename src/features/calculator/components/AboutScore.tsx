import type { ScoreModelDefinition } from '../types/scoreModel.types';

interface AboutScoreProps {
  model: ScoreModelDefinition;
}

export function AboutScore({
  model,
}: AboutScoreProps) {
  const originalFactors = model.factors.filter(
    factor => factor.source === 'original',
  );

  const additionalFactors = model.factors.filter(
    factor => factor.source === 'literature',
  );

  return (
    <details className="references">
      <summary>
        Acerca del score
        <span aria-hidden="true">+</span>
      </summary>

      <div>
        <h2>Cómo se calcula</h2>

        <p>
          El modelo original utiliza{' '} {originalFactors.length} factores y tiene un máximo de {model.originalMaximum}{' '} puntos.
        </p>

        {additionalFactors.length > 0 && (
          <p>
            Esta versión incluye{' '}
            {additionalFactors.length}{' '}
            {additionalFactors.length === 1
              ? 'factor adicional'
              : 'factores adicionales'}
            . El total ampliado tiene un máximo de{' '}
            {model.extendedMaximum} puntos.
          </p>
        )}

        <h2>Alcance de las estimaciones</h2>

        <p>
          El porcentaje y la clasificación de riesgo corresponden al modelo original. Los factores adicionales no tienen probabilidades ni umbrales de riesgo establecidos.
        </p>

        <p>
          Esta calculadora reproduce las probabilidades y clasificaciones
          configuradas para la versión activa del modelo. No reconstruye una ecuación logística.
        </p>

        <p>
          La gráfica es una visualización conceptual del score. No representa percentiles reales de una paciente individual.
        </p>

        <p>
          Los datos seleccionados permanecen en esta sesión. No se solicitan nombres ni se guardan registros de pacientes.
        </p>

        <p className="small">
          {model.code} · versión {model.version}
        </p>
      </div>
    </details>
  );
}
