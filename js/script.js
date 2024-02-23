// @ts-check
// editor
import { EditorState } from '@codemirror/state';
// view
import {
  EditorView,
  highlightSpecialChars,
  highlightActiveLine,
  lineNumbers,
} from '@codemirror/view';
// language features
import { bracketMatching } from '@codemirror/language';
// auto-complete
import { closeBrackets } from '@codemirror/autocomplete';
// programming languages
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
// scrollbar styles
// themes

// import { scrollbarStyle } from '@codemirror/scroll';
// import { theme } from '@codemirror/theme';

//------------------------------------------------------------
//                       IMPORTS
//------------------------------------------------------------
import { selectElement } from './helpers.js';

//------------------------------------------------------------
//                       SCRIPT
//------------------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  // 1. INSTANTIATE NEW EDITORS FROM CODE MIRROR

  const htmlTextarea = selectElement('#html-code', 'div');
  const cssTextarea = selectElement('#css-code', 'div');
  const jsTextarea = selectElement('#js-code', 'div');

  const highContrastDarkTheme = EditorView.theme(
    {
      '&': {
        color: 'white',
        backgroundColor: '#1e1e1e', // Dark background
      },
      '.cm-content': {
        caretColor: '#ffffff', // White caret
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: '#ffffff', // White cursor
      },
      '&.cm-focused .cm-selectionBackground, ::selection': {
        backgroundColor: '#555555', // Darker background for selection
      },
      '.cm-gutters': {
        backgroundColor: '#1e1e1e', // Match editor background
        color: '#c6c6c6', // Slightly lighter color for gutter text
        border: 'none',
      },
      '.cm-line': {
        borderBottom: 'solid 1px #2a2d2e', // Line separator
      },
    },
    { dark: true }
  );

  const commonExtensions = [
    lineNumbers(),
    highlightSpecialChars(),
    highlightActiveLine(),
    bracketMatching(),
    closeBrackets(),
    highContrastDarkTheme,
  ];

  const htmlEditor = new EditorView({
    state: EditorState.create({
      doc: '<!-- HTML CONTENT HERE -->',
      extensions: [...commonExtensions, html()],
    }),
    parent: htmlTextarea,
  });

  const cssEditor = new EditorView({
    state: EditorState.create({
      doc: 'body { color: red; }',
      extensions: [css(), ...commonExtensions],
    }),
    parent: cssTextarea,
  });

  const jsEditor = new EditorView({
    state: EditorState.create({
      doc: 'console.log("Hello, world!");',
      extensions: [
        javascript(),
        ...commonExtensions,
        // theme('highcontrast-dark'),
        // scrollbarStyle({ style: 'overlay' }),
      ],
    }),
    parent: jsTextarea,
  });

  // 2. CONNECT EDITOR AND PREVIEW PANE TOGETHER
  const previewIframe = /** @type {HTMLIFrameElement} */ (
    selectElement('#js--preview', 'iframe')
  );
  const iframeDoc =
    previewIframe.contentDocument || previewIframe.contentWindow?.document;

  // Create a debounced function that updates the iframe, to limit the rate of updates during continuous edits
  if (iframeDoc !== undefined) {
    const debouncedUpdateIframe = debounce(
      () => updateIframe(jsEditor, htmlEditor, cssEditor, iframeDoc),
      500 // The delay in milliseconds before the iframe is updated after the last edit
    );

    // Perform an initial update of the iframe with the content loaded from local storage or defaults
    debouncedUpdateIframe();

    // 3. UPDATE THE PREVIEW PANE BASED ON CHANGES IN THE EDITOR
    const codeContainer = /** @type {HTMLDivElement} */ (
      selectElement('.code-container', 'div')
    );

    codeContainer.addEventListener('keypress', () => {
      debouncedUpdateIframe();
    });
  } else {
    throw new Error('Iframe doc is undefined');
  }
});

//------------------------------------------------------------
//                      FUNCTIONS
//------------------------------------------------------------

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
