import React from 'react';
import { useEditor } from '../../../hooks/useEditor';
import ContextMenu from '../ContextMenu';
import AIModal from '../modals/AIModal';
import AddComponentModal from '../modals/AddComponentModal';
import CodeEditorModal from '../modals/CodeEditorModal';
import SaveComponentModal from '../modals/SaveComponentModal';
import SettingsModal from '../modals/SettingsModal';
import SiteSettingsModal from '../modals/SiteSettingsModal';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function EditorModals({ iframeRef }: Props) {
  const { state } = useEditor();

  return (
    <>
       {!state.isPreviewing && state.contextMenu && <ContextMenu />}
       {!state.isPreviewing && state.showAIModal && <AIModal />}
       {state.showAddComponentModal && <AddComponentModal />}
       {state.showCodeEditorModal && <CodeEditorModal iframeRef={iframeRef} />}
       {state.showSaveComponentModal && <SaveComponentModal iframeRef={iframeRef} />}
       {state.showSettingsModal && <SettingsModal iframeRef={iframeRef} />}
       {state.showSiteSettingsModal && <SiteSettingsModal />}
    </>
  );
}