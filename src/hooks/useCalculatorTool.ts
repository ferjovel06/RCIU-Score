import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { flushSync } from 'react-dom';
import type { FactorId } from '../score';
import { registerCalculatorTool } from '../webmcp';

export function useCalculatorTool(
  setSelected: Dispatch<SetStateAction<FactorId[]>>,
  setSmoking: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => registerCalculatorTool((ids, smoking) => {
    flushSync(() => {
      setSelected(ids);
      setSmoking(smoking);
    });
  }), [setSelected, setSmoking]);
}
