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

  // save content
  function saveContentToLocal() {
    const userHtml = htmlEditor.state.doc.toString();
    const userCss = cssEditor.state.doc.toString();
    const userJs = jsEditor.state.doc.toString();

    localStorage.setItem('userHtml', userHtml);
    localStorage.setItem('userCss', userCss);
    localStorage.setItem('userJs', userJs);

    alert('Content saved locally!');
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

  // Fetch saved content
  const savedHtml =
    localStorage.getItem('userHtml') ||
    `<!-- HTML content here -->
    ${'\n'.repeat(10)}`;
  const savedCss =
    localStorage.getItem('userCss') ||
    `<!-- css content here -->
    ${'\n'.repeat(10)}`;
  const savedJs =
    localStorage.getItem('userJs') ||
    `<!-- js content here -->
    ${'\n'.repeat(10)}`;

  // HTML Editor Initialization with savedHtml
  let htmlEditor = new EditorView({
    state: EditorState.create({
      doc: savedHtml,
      extensions: [...commonExtensions, html()],
    }),
    parent: document.querySelector('#js--html-editor'),
  });

  // CSS Editor Initialization with savedCss
  let cssEditor = new EditorView({
    state: EditorState.create({
      doc: savedCss,
      extensions: [...commonExtensions, css()],
    }),
    parent: document.querySelector('#js--css-editor'),
  });

  // JavaScript Editor Initialization with savedJs
  let jsEditor = new EditorView({
    state: EditorState.create({
      doc: savedJs,
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

  // Now, call updateIframe directly to update the iframe content with the saved content
  updateIframe();

  // Example: Update the iframe when the DOM is loaded
  // You might want to trigger this under different circumstances, e.g., a button click
  const button = createElement('button', 'Save', 'btn');
  if (button instanceof HTMLButtonElement) {
    button.addEventListener('click', () => {
      saveContentToLocal();
    });

    appendElement(button);
  }

  const debouncedUpdateIframe = debounce(updateIframe, 500); // Adjust the delay as needed
});
