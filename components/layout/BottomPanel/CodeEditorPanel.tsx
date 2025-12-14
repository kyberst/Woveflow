import React, { useEffect, useState, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { useEditor } from '../../../hooks/useEditor';
import { jsonToHtml } from '../../../utils/jsonToHtml';
import { htmlToJson } from '../../../utils/htmlToJson';
import { ViewMode } from '../../../types';
import { throttle } from '../../../utils/throttle';
import { AlertTriangle } from 'lucide-react';

loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });

export default function CodeEditorPanel() {
    const { state, dispatch } = useEditor();
    const [editorValue, setEditorValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isInternalUpdate, setIsInternalUpdate] = useState(false);
    
    useEffect(() => {
        if (isInternalUpdate) return;
        const currentPage = state.pages.find(p => p.id === state.currentPageId);
        if (currentPage) {
            const html = jsonToHtml(currentPage.content, state.components, true, ViewMode.Desktop);
            const formatted = html.replace(/>/g, '>\n').replace(/</g, '\n<').replace(/\n\n/g, '\n').trim();
            setEditorValue(formatted);
        }
    }, [state.pages, state.currentPageId, state.components, isInternalUpdate]);

    const handleEditorChange = (value: string | undefined) => {
        if (!value) return;
        
        // Strict Validation Rule: No <style> or <script> tags allowed in body content editor
        if (/<style/i.test(value) || /<script/i.test(value)) {
            setError("Security Error: <style> and <script> tags are not allowed in the body editor. Please use the Global Classes or Assets manager.");
            return; // Block update
        } else {
            setError(null);
        }

        setEditorValue(value);
        setIsInternalUpdate(true);
        updateState(value);
    };

    const updateState = useRef(throttle((value: string) => {
        try {
            const newContent = htmlToJson(value);
            dispatch({ 
                type: 'UPDATE_PAGE_CONTENT', 
                payload: { 
                    pageId: state.currentPageId, 
                    content: newContent 
                } 
            });
            setTimeout(() => setIsInternalUpdate(false), 500);
        } catch (e) {
            console.error("Invalid HTML", e);
        }
    }, 1000)).current;

    return (
        <div className="h-full w-full flex flex-col overflow-hidden bg-[#1e1e1e]">
            {error && (
                <div className="bg-red-900/50 text-red-200 px-4 py-2 text-xs flex items-center">
                    <AlertTriangle size={14} className="mr-2" />
                    {error}
                </div>
            )}
            <div className="flex-grow">
                <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={editorValue}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
}