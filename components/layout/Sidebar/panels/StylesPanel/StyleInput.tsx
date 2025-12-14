import React, { useState, useEffect } from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { RefreshCw } from 'lucide-react';

interface Props {
  label: string;
  prop: string;
  type: 'text' | 'select' | 'color' | 'range';
  value: string;
  options?: readonly string[];
  onStyleChange: (prop: string, value: string) => void;
  isOverridden?: boolean;
}

export default function StyleInput({ label, prop, type, value, options, onStyleChange, isOverridden }: Props) {
  const { state } = useEditor();
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => setCurrentValue(value), [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newVal = e.target.value;
    setCurrentValue(newVal);
    onStyleChange(prop, newVal);
  };

  const renderInput = () => {
    const cls = "w-full p-1 border rounded dark:bg-slate-700 dark:border-slate-600 text-xs";
    if (type === 'color') return (
       <div className="flex items-center relative">
         <input type="text" value={currentValue} onChange={handleChange} className={`${cls} pr-6`} />
         <div className="absolute right-1 w-4 h-4 rounded border" style={{ backgroundColor: currentValue }} />
         <input type="color" value={currentValue} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
       </div>
    );
    if (type === 'select') return (
        <select value={currentValue} onChange={handleChange} className={cls}>
            <option value="">Default</option>
            {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );
    return <input type={type} value={currentValue} onChange={handleChange} className={cls} />;
  };

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center">
              {isOverridden && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse" title={`Overridden in ${state.viewMode}`} />}
              <label className={`text-xs font-semibold ${isOverridden ? 'text-blue-600' : 'text-slate-600'}`}>{label}</label>
          </div>
          {isOverridden && (
              <button onClick={() => { setCurrentValue(''); onStyleChange(prop, ''); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                  <RefreshCw size={10} />
              </button>
          )}
      </div>
      {renderInput()}
    </div>
  );
}