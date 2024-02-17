import { EditorState } from '@codemirror/state';
import { ViewUpdate, EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
// import { html } from '@codemirror/lang-html';
// import { css } from '@codemirror/lang-css';

import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  // EditorView,
  // ViewUpdate,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

import { appendElement, createElement, selectElement } from './helpers.js';
import './style.css';

window.addEventListener('DOMContentLoaded', () => {
  // Debounce function to limit the rate of iframe updates
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const commonExtensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
    // for updates on change with debouncing
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        debouncedUpdateIframe();
      }
    }),
  ];

  const previewIframe = selectElement('#js--preview', 'iframe');
  const iframeDoc =
    previewIframe.contentDocument || previewIframe.contentWindow.document;

  // HTML Editor
  let htmlEditor = new EditorView({
    state: EditorState.create({
      doc: `<-- html content here -->
        ${'\n'.repeat(9)}
      `,
      extensions: [...commonExtensions, html()],
    }),
    parent: document.querySelector('#js--html-editor'),
  });

  // CSS Editor
  let cssEditor = new EditorView({
    state: EditorState.create({
      doc: `<-- css content here -->
        ${'\n'.repeat(9)}
      `,
      extensions: [...commonExtensions, css()],
    }),
    parent: document.querySelector('#js--css-editor'),
  });

  // Javascript editor
  let jsEditor = new EditorView({
    state: EditorState.create({
      doc: `<-- javascript content here -->
        ${'\n'.repeat(9)}
      `,
      extensions: [...commonExtensions, javascript()],
    }),
    parent: document.querySelector('#js--editor'),
  });

  const updateIframe = () => {
    // Capture the code from the editors
    const userJs = `(function() {
      ${jsEditor.state.doc.toString()}
    })();`;
    const userHtml = htmlEditor.state.doc.toString();
    const userCss = cssEditor.state.doc.toString();

    // Construct a complete HTML document with the user's HTML, CSS, and JavaScript
    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview</title>
      <style>
        ${userCss}
      </style>
    </head>
    <body>
      ${userHtml}
      <script type="text/javascript">
        ${userJs}
      </script>
    </body>
    </html>
  `);
    iframeDoc.close();
  };

  // Example: Update the iframe when the DOM is loaded
  // You might want to trigger this under different circumstances, e.g., a button click
  const button = createElement('button', 'Click', 'btn');
  if (button instanceof HTMLButtonElement) {
    button.addEventListener('click', () => {
      updateIframe();
    });

    appendElement(button);
  }

  const debouncedUpdateIframe = debounce(updateIframe, 500); // Adjust the delay as needed
});
