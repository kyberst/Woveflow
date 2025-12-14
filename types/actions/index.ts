import { EditorState } from './../editor';
import { UiAction } from './ui';
import { ElementAction } from './element';
import { PageAction } from './page';
import { SiteAction } from './site';
import { HistoryAction } from './history';
import { ComponentAction } from './component';
import { ClipboardAction } from './clipboard';
import { ContextMenuAction } from './contextMenu';
import { ClassAction } from './class';
import { DesignTokenAction } from './designToken';
import { DragAndDropAction } from './dragAndDrop';
import { EditorInitializationAction } from './editorInitialization';

export type Action =
  | EditorInitializationAction
  | UiAction
  | ElementAction
  | PageAction
  | SiteAction
  | HistoryAction
  | ComponentAction
  | ClipboardAction
  | ContextMenuAction
  | ClassAction
  | DesignTokenAction
  | DragAndDropAction;
