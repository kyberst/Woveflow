import React from 'react';
import { useEditor } from '../../../../../hooks/useEditor';
import { DesignToken } from '../../../../../types';
import { FONT_FAMILIES } from '../../../../../constants';

export default function GlobalTypographyManager() {
    const { state, dispatch } = useEditor();
    const fonts = state.designTokens.fonts;

    const handleFontChange = (token: DesignToken, newValue: string) => {
        dispatch({
            type: 'UPDATE_DESIGN_TOKEN',
            payload: { ...token, value: newValue }
        });
    };

    if (fonts.length === 0) {
        return <div className="p-4 text-xs text-slate-400 italic">No global fonts defined.</div>;
    }

    return (
        <div className="p-4 space-y-4">
            {fonts.map(token => (
                <div key={token.id} className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-semibold">{token.name}</span>
                         <span className="text-[10px] text-slate-400">Var</span>
                    </div>
                    <select 
                        value={token.value}
                        onChange={(e) => handleFontChange(token, e.target.value)}
                        className="w-full text-xs p-2 rounded border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                        {FONT_FAMILIES.map(font => (
                            <option key={font} value={font}>{font.split(',')[0]}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}