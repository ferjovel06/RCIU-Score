import { SCORE_VERSION } from '../score';

export function AboutScore() {
  return <details className="references">
    <summary>Acerca del score
      <span aria-hidden="true">+</span>
    </summary>
    <div>
      <h2>Cómo se calcula</h2>
      <p>El score original suma siete factores, con un máximo de 13 puntos. En esta extensión experimental, el tabaquismo materno activo añade 1 punto y el total ampliado llega a 14. Esta modificación no está incluida en el documento original ni tiene probabilidades o umbrales de riesgo establecidos.</p>
      <h2>Alcance de las estimaciones</h2>
      <p>Los documentos describen una función logística, pero no especifican su intercepto ni una ecuación completa calibrada. Esta calculadora reproduce la tabla de probabilidades, sin reconstruir esa ecuación. El protocolo plantea el desarrollo y la validación interna del modelo; aquí no se afirma una validación completada.</p>
      <p>«Preeclampsia» conserva el nombre del documento. Su definición temporal debe precisarse en el protocolo antes del uso clínico.</p>
      <p>La gráfica conserva las tres curvas conceptuales de la referencia. El marcador se mueve en tiempo real desde la zona p90 hacia p10 a medida que aumenta el puntaje ampliado. Esta posición es una visualización del score y no un percentil fetal calculado.</p>
      <p>Los datos seleccionados permanecen en esta sesión. No se solicitan nombres ni se guardan registros de pacientes.</p>
      <p className="small">{SCORE_VERSION}</p>
    </div>
  </details>;
}
