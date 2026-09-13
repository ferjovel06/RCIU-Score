import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { registerCalculatorTool } from './webmcp';
import { createRoot } from 'react-dom/client';
import { calculateScore, factors, SCORE_VERSION, type FactorId } from './score';
import './style.css';

function App() {
  const [selected, setSelected] = useState<FactorId[]>([]);
  const [smoking, setSmoking] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [cacheError, setCacheError] = useState(false);
  const { offlineReady: [offlineReady], needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({ onRegisterError: () => setCacheError(true) });
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener('online', update); window.addEventListener('offline', update);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  useEffect(() => registerCalculatorTool((ids, smokingValue) => flushSync(() => { setSelected(ids); setSmoking(smokingValue); })), []);
  const result = calculateScore(selected);
  return <main className="shell">
    <header className="masthead"><span className="wordmark">A<span>·</span>FGR</span><span>HERRAMIENTA DE INVESTIGACIÓN</span></header>
    <article className="calculator">
      <header className="intro"><p className="eyebrow">ESCALA CLÍNICA · RCIU</p><h1>ARAGON<span>·</span>FGR</h1><p className="subtitle">Restricción del crecimiento intrauterino</p><span className="research-badge">En fase de validación · uso investigativo</span></header>
      <div className="workspace"><section className="inputs" aria-labelledby="factors-title"><div className="section-heading"><h2 id="factors-title">Factores maternos</h2><span>{selected.length} de 7</span></div><p className="instruction">Selecciona los factores presentes.</p>
      <div className="factor-list">{factors.map(f => <label className={`factor ${selected.includes(f.id) ? 'selected' : ''}`} key={f.id}><input type="checkbox" checked={selected.includes(f.id)} onChange={e => setSelected(prev => e.target.checked ? [...prev, f.id] : prev.filter(id => id !== f.id))}/><span>{f.label}</span><strong>+{f.points}</strong></label>)}</div>
      <div className="additional"><h2>Factor adicional</h2><p>Referencia de la interfaz · fuera del score</p><label className={`factor smoking ${smoking ? 'selected' : ''}`}><input type="checkbox" checked={smoking} onChange={e => setSmoking(e.target.checked)}/><span>Tabaquismo materno activo</span><strong>Sin puntos</strong></label><p className="small">Se muestra por separado. No modifica el puntaje ni la probabilidad de la tabla.</p></div>
      </section><aside className="results-column"><section className={`result ${result.level}`} aria-label="Resultado del score" aria-live="polite" aria-atomic="true"><div className="result-top"><p className="eyebrow">RESULTADO</p><span>0–13 puntos</span></div><div className="numbers"><div><p>Puntaje total</p><div className="score-number">{String(result.total).padStart(2, '0')}<span>/13</span></div></div><div className="probability"><p>Probabilidad de tabla</p><strong>{result.probability}</strong></div></div><div className="meter" aria-hidden="true">{Array.from({length:13},(_,i)=><span key={i} className={i<result.total?'filled':''}/>)}</div><div className="classification"><span aria-hidden="true">{result.level==='low'?'✓':'!'}</span>{result.label}</div><p className="result-copy">{result.total===0?'No se han seleccionado factores del score. Un puntaje de cero no descarta RCIU.':`Clasificación del puntaje según la tabla 3 del documento ARAGON-FGR.`}</p>{result.tableClassification && <p className="table-note">La tabla 4 denomina «muy alto» al rango de 10–13 puntos.</p>}<p className="probability-note">Porcentaje aproximado transcrito de la tabla 4; no es una probabilidad individual validada.</p></section>
      <button className="reset" onClick={() => {setSelected([]);setSmoking(false)}}><span aria-hidden="true">↺</span> Reiniciar calculadora</button>
      <section className="ranges" aria-label="Rangos de clasificación"><h2>Interpretación del puntaje</h2><div><span className="range-dot low"/>Bajo<strong>0–2</strong></div><div><span className="range-dot moderate"/>Moderado<strong>3–5</strong></div><div><span className="range-dot high"/>Alto<strong>6–13</strong></div><p>Clasificación principal · tabla 3</p></section>
      </aside></div>
      <details className="references"><summary>Acerca del score y sus fuentes <span aria-hidden="true">+</span></summary><div><h2>Cómo se calcula</h2><p>Se suman los puntos de los siete factores presentes, con un máximo de 13. El tabaquismo no forma parte del sistema de puntuación del documento.</p><h2>Fuente de esta versión</h2><p>ARAGON_FGR_Score.docx, tablas 2, 3 y 4. Los puntos y el ejemplo de 6 puntos se contrastaron con «Score prueba piloto.pdf».</p><h2>Alcance de las estimaciones</h2><p>Los documentos describen una función logística, pero no especifican su intercepto ni una ecuación completa calibrada. Esta calculadora reproduce la tabla de probabilidades, sin reconstruir esa ecuación. El protocolo plantea el desarrollo y la validación interna del modelo; aquí no se afirma una validación completada.</p><p>«Preeclampsia» conserva el nombre del documento. Su definición temporal debe precisarse en el protocolo antes del uso clínico.</p><p>La curva de crecimiento de la referencia visual era conceptual y no aportaba datos al score; se sustituye por los rangos de puntuación.</p><p>Los datos seleccionados permanecen en esta sesión. No se solicitan nombres ni se guardan registros de pacientes.</p><p className="small">{SCORE_VERSION}</p></div></details>
      <footer>Calculadora de referencia para investigación. No sustituye el juicio clínico ni establece recomendaciones de manejo.</footer>
      <div className="offline-status" role="status">{cacheError ? 'No se pudo preparar el modo sin conexión. Intenta recargar con conexión.' : offline ? 'Sin conexión · cálculo disponible' : offlineReady ? 'Lista para usar sin conexión' : 'Sin registros de pacientes'}</div>
      {needRefresh && <div className="update-notice"><p>Hay una nueva versión. Al actualizar se reinician las selecciones.</p><button onClick={() => void updateServiceWorker(true)}>Actualizar ahora</button></div>}
    </article><p className="bottom-note">ARAGON-FGR <span>·</span> Prototipo de investigación</p>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
