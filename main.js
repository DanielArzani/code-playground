import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

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
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

import { selectElement } from './helpers.js';
import './style.css';

/**
 * Debounces a function call, delaying its execution until after a specified wait time has elapsed since the last time it was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} The debounced function.
 */
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

/**
 * Saves the content of all editors to local storage.
 * @param {EditorView} htmlEditor - The HTML editor instance.
 * @param {EditorView} cssEditor - The CSS editor instance.
 * @param {EditorView} jsEditor - The JavaScript editor instance.
 */
function saveContentToLocal(htmlEditor, cssEditor, jsEditor) {
  const userHtml = htmlEditor.state.doc.toString();
  const userCss = cssEditor.state.doc.toString();
  const userJs = jsEditor.state.doc.toString();

  localStorage.setItem('userHtml', userHtml);
  localStorage.setItem('userCss', userCss);
  localStorage.setItem('userJs', userJs);

  alert('Content saved locally!');
}

/**
 * Sets up a new editor view.
 * @param {string} doc - The initial content of the editor.
 * @param {Array} extensions - The array of extensions for the editor.
 * @param {string} editorParentId - The parent element ID where the editor will be appended.
 * @returns {EditorView} The new editor view.
 */
function setupEditor(doc, extensions, editorParentId) {
  return new EditorView({
    state: EditorState.create({
      doc,
      extensions,
    }),
    parent: document.querySelector(editorParentId),
  });
}

/**
 * Updates the preview iframe with the content from the editors.
 * @param {EditorView} jsEditor - The JavaScript editor instance.
 * @param {EditorView} htmlEditor - The HTML editor instance.
 * @param {EditorView} cssEditor - The CSS editor instance.
 * @param {Document} iframeDoc - The document of the iframe to update.
 */
function updateIframe(jsEditor, htmlEditor, cssEditor, iframeDoc) {
  const userJs = `(function() {
    ${jsEditor.state.doc.toString()}
  })();`;
  const userHtml = htmlEditor.state.doc.toString();
  const userCss = cssEditor.state.doc.toString();

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
}

/**
 * Initializes all the editors and returns their instances.
 * @param {Array} commonExtensions - The common extensions to be applied to all editors.
 * @returns {Object} The instances of the HTML, CSS, and JavaScript editors.
 */
function initializeEditors(commonExtensions) {
  const savedHtml =
    localStorage.getItem('userHtml') || `<!-- HTML content here -->\n`;
  const savedCss =
    localStorage.getItem('userCss') || `/* CSS content here */\n`;
  const savedJs =
    localStorage.getItem('userJs') || `// JavaScript content here\n`;

  const htmlEditor = setupEditor(
    savedHtml,
    [...commonExtensions, html()],
    '#js--html-editor'
  );
  const cssEditor = setupEditor(
    savedCss,
    [...commonExtensions, css()],
    '#js--css-editor'
  );
  const jsEditor = setupEditor(
    savedJs,
    [...commonExtensions, javascript()],
    '#js--editor'
  );

  return { htmlEditor, cssEditor, jsEditor };
}

/**
 * Attaches a click event listener to the save button which triggers saving the content.
 * @param {HTMLElement} button - The save button element.
 * @param {EditorView} htmlEditor - The HTML editor instance.
 * @param {EditorView} cssEditor - The CSS editor instance.
 * @param {EditorView} jsEditor - The JavaScript editor instance.
 */
function attachSaveButtonListener(button, htmlEditor, cssEditor, jsEditor) {
  if (button instanceof HTMLButtonElement) {
    button.addEventListener('click', () =>
      saveContentToLocal(htmlEditor, cssEditor, jsEditor)
    );
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Define the common extensions to be used by all editors for functionality like line numbers, autocompletion, etc.
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

  // Initialize editors with common functionalities and any previously saved content
  const { htmlEditor, cssEditor, jsEditor } =
    initializeEditors(commonExtensions);

  // Select the preview iframe and obtain its document for content updates
  const previewIframe = selectElement('#js--preview', 'iframe');
  const iframeDoc =
    previewIframe.contentDocument || previewIframe.contentWindow.document;

  // Create a debounced function that updates the iframe, to limit the rate of updates during continuous edits
  const debouncedUpdateIframe = debounce(
    () => updateIframe(jsEditor, htmlEditor, cssEditor, iframeDoc),
    500 // The delay in milliseconds before the iframe is updated after the last edit
  );

  // Perform an initial update of the iframe with the content loaded from local storage or defaults
  debouncedUpdateIframe();

  // Attach a click event listener to the save button for saving the content to local storage
  const saveButton = selectElement('.btn', 'button');
  attachSaveButtonListener(saveButton, htmlEditor, cssEditor, jsEditor);
});
