export type ClipboardAction =
  | { type: 'COPY_STYLES'; payload: string }
  | { type: 'PASTE_STYLES'; payload: string };
