import { factors, type FactorId } from '../score';

interface FactorSelectorProps {
  selected: readonly FactorId[];
  smoking: boolean;
  onFactorChange: (id: FactorId, checked: boolean) => void;
  onSmokingChange: (checked: boolean) => void;
}

export function FactorSelector({ selected, smoking, onFactorChange, onSmokingChange }: FactorSelectorProps) {
  return <section className="inputs" aria-labelledby="factors-title">
    <div className="section-heading">
      <h2 id="factors-title">Factores maternos</h2>
      <span>{selected.length} de {factors.length}</span>
    </div>
    <p className="instruction">Selecciona los factores presentes.</p>
    <div className="factor-list">{factors.map(factor =>
      <label className={`factor ${selected.includes(factor.id) ? 'selected' : ''}`} key={factor.id}>
        <input type="checkbox" checked={selected.includes(factor.id)} onChange={event => onFactorChange(factor.id, event.target.checked)} />
        <span>{factor.label}</span>
        <strong>+{factor.points}</strong>
      </label>)}
    </div>
    <div className="additional">
      <h2>Factor adicional (Literatura)</h2>
      <p>No incluido en el score ARAGON-FGR</p>
      <label className={`factor smoking ${smoking ? 'selected' : ''}`}>
        <input type="checkbox" checked={smoking} onChange={event => onSmokingChange(event.target.checked)} />
        <span>Tabaquismo materno activo</span>
        <strong>+1</strong>
      </label>
      <p className="small">OR 1.9 (IC95% 1.69-2.13) para RCIU · Figueras F et al., Eur J Obstet Gynecol Reprod Biol. 2008;138(2):171-175. No alcanzó significancia estadística en el estudio de derivación del ARAGON-FGR Score.</p>
    </div>
  </section>;
}
