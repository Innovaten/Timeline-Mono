
import { LexicalEditor, EditorState } from 'lexical';

import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { LinkNode } from '@lexical/link';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './lexical-plugins/toolbar.plugin' 
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

const theme = {
  code: 'editor-code',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  image: 'editor-image',
  link: 'editor-link',
  list: {
    listitem: 'editor-listitem',
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
  },
  ltr: 'ltr',
  paragraph: 'editor-paragraph',
  placeholder: 'editor-placeholder',
  quote: 'editor-quote',
  rtl: 'rtl',
  text: {
    bold: 'editor-text-bold',
    code: 'editor-text-code',
    hashtag: 'editor-text-hashtag',
    italic: 'editor-text-italic',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'editor-text-strikethrough',
    underline: 'editor-text-underline',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};

function onError(error: any) {
    console.error(error);
}

type TextEditorProps ={
    onChange: (editorState: EditorState, editor: LexicalEditor) => void
}

export default function TextEditor({
    onChange
}: TextEditorProps){
    
  const initialConfig = {
    namespace: 'lexical-editor',
    nodes: [
      TableNode,
      TableCellNode,
      TableRowNode,
      LinkNode,
    ],
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input"
                aria-placeholder={"Enter some text..."}
              />
            }
            placeholder={<div className="editor-placeholder">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LinkPlugin />
          <CheckListPlugin />
          <TablePlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
