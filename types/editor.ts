import { User, SiteMember } from './user';
import { SiteName, ViewMode } from './enums';
import { Page, HistoryEntry } from './page';
import { Site } from './site';
import { BuilderComponent, BuilderElementNode } from './element';
import { GlobalClass, DesignToken } from './styles';
import { SnapGuide, ContainerHighlight, DragOverState } from './dragAndDrop';
import { HookContext, Plugin } from './plugin';

export interface EditorState {
  currentUser: User | null;
  currentSite: SiteName;
  currentPageId: string;
  pages: Page[];
  sites: Site[];
  siteMembers: SiteMember[];
  components: BuilderComponent[];
  globalClasses: GlobalClass[];
  designTokens: {
    colors: DesignToken[];
    fonts: DesignToken[];
    spacing: DesignToken[];
  };
  viewMode: ViewMode;
  zoom: number;
  theme: 'light' | 'dark';
  history: HistoryEntry[];
  historyIndex: number;
  selectedElementId: string | null;
  hoveredElementId: string | null;
  activeTab: string | null;
  showAIModal: boolean;
  isPreviewing: boolean;
  showAddComponentModal: boolean;
  insertionTarget: { elementId: string; mode: 'inside' | 'after' } | null;
  showCodeEditorModal: boolean;
  showSaveComponentModal: boolean;
  showSettingsModal: boolean;
  showSiteSettingsModal: boolean;
  inlineEditingElementId: string | null;
  contextMenu: { x: number; y: number; elementId: string } | null;
  clipboard: { styles: BuilderElementNode['styles'] } | null;
  isDragging: boolean;
  dragOverState: DragOverState | null;
  showBottomPanel: boolean;
  activeBottomTab: 'code' | 'logs' | null;
  showCommandPalette: boolean;
}
