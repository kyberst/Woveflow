import React, { useState, useEffect } from 'react';
import { useEditor } from '../../../../hooks/useEditor';

interface Props {
  label: string;
  prop: string;
  type: 'text' | 'select' | 'color' | 'range';
  value: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export default function StyleInput({ label, prop, type, value, options, min, max, step }: Props) {
  const { state, dispatch } = useEditor();
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    if (state.selectedElementId) {
      dispatch({ type: 'UPDATE_ELEMENT_STYLE', payload: { elementId: state.selectedElementId, property: prop, value: newValue } });
    }
  };

  const handleBlur = () => {
    dispatch({ type: 'ADD_HISTORY' });
  };
  
  const renderInput = () => {
    switch (type) {
      case 'color':
        return (
          <div className="relative">
            <input
              type="text"
              value={currentValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600 pr-8"
            />
            <input
              type="color"
              value={currentValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 p-0 border-none cursor-pointer bg-transparent"
            />
          </div>
        );
      case 'select':
        return (
          <select value={currentValue} onChange={handleChange} onBlur={handleBlur} className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600">
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'range':
          return (
             <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                onMouseUp={handleBlur} // Use mouseup for range to create history entry
                className="w-full"
             />
          );
      default: // text
        return <input type="text" value={currentValue} onChange={handleChange} onBlur={handleBlur} className="w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600" />;
    }
  };

  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      {renderInput()}
    </div>
  );
}