import React from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { DesignToken } from '../../../../../types';

export default function GlobalColorManager() {
    const { state, dispatch } = useEditor();
    const colors = state.designTokens.colors;

    const handleColorChange = (token: DesignToken, newValue: string) => {
        dispatch({
            type: 'UPDATE_DESIGN_TOKEN',
            payload: { ...token, value: newValue }
        });
    };

    if (colors.length === 0) {
        return <div className="p-4 text-xs text-slate-400 italic">No global colors defined.</div>;
    }

    return (
        <div className="p-4 space-y-3">
            {colors.map(token => (
                <div key={token.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-2">
                        <div className="relative w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600 overflow-hidden shadow-sm">
                            <input 
                                type="color" 
                                value={token.value} 
                                onChange={(e) => handleColorChange(token, e.target.value)}
                                className="absolute inset-0 w-full h-full p-0 border-none opacity-0 cursor-pointer"
                            />
                            <div 
                                className="w-full h-full"
                                style={{ backgroundColor: token.value }}
                            />
                        </div>
                        <div>
                            <div className="text-xs font-semibold">{token.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{token.value}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}