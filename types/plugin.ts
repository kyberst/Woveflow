import { Page } from './page';
import { EditorState } from './editor';
import { BuilderElementNode } from './element';

export interface HookContext {
  page: Page;
  state: EditorState;
}

export interface Plugin {
  name: string;
  onPublish?: (content: BuilderElementNode[], context: HookContext) => Promise<BuilderElementNode[]>;
}