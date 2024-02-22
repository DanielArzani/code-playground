window.addEventListener('DOMContentLoaded', () => {
  let mode = 'htmlmixed';
  //   const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
  //     lineNumbers: true,
  //     styleActiveLine: true,
  //     matchBrackets: true,
  //     scrollbarStyle: 'overlay',
  //     tabSize: 2,
  //     mode,
  //     theme: 'highcontrast-dark',
  //   });

  const htmlEditor = CodeMirror.fromTextArea(
    document.getElementById('html-code'),
    {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      scrollbarStyle: 'overlay',
      tabSize: 2,
      mode: 'htmlmixed',
      theme: 'highcontrast-dark',
    }
  );

  const cssEditor = CodeMirror.fromTextArea(
    document.getElementById('css-code'),
    {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      scrollbarStyle: 'overlay',
      tabSize: 2,
      mode: 'css',
      theme: 'highcontrast-dark',
    }
  );

  const jsEditor = CodeMirror.fromTextArea(document.getElementById('js-code'), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    scrollbarStyle: 'overlay',
    tabSize: 2,
    mode: 'javascript',
    theme: 'highcontrast-dark',
  });

  //   const changeMode = (btn) => {
  //     mode = { htmlmixed: 'css', css: 'javascript', javascript: 'htmlmixed' }[
  //       mode
  //     ];
  //     btn.title = `(click to change) Current Mode: ${mode}`;
  //     editor.setOption('mode', mode);
  //     updateIframe(); // Call iframe update function whenever the mode changes
  //   };

  //   document
  //     .querySelector('button.dots')
  //     .addEventListener('click', (e) => changeMode(e.target));

  // Function to update the iframe with editor content
  function updateIframe() {
    const previewIframe = document.getElementById('js--preview');
    const iframeDoc =
      previewIframe.contentDocument || previewIframe.contentWindow.document;
    // const editorContent = editor.getValue();
    const htmlContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    const jsContent = jsEditor.getValue();

    iframeDoc.open();
    iframeDoc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Preview</title>
      <style>${cssContent}</style>
    </head>
    <body>
      ${htmlContent}
      <script type="text/javascript">${jsContent}</script>
    </body>
    </html>
`);
    iframeDoc.close();
  }

  // Ensure the iframe is updated not only on mode change but also initially to reflect the correct mode
  updateIframe(); // Initial call to render the content correctly based on the initial mode

  // Debounce the updateIframe function to limit updates
  const debounceUpdateIframe = debounce(updateIframe, 300);
  htmlEditor.on('change', debounceUpdateIframe);
  cssEditor.on('change', debounceUpdateIframe);
  jsEditor.on('change', debounceUpdateIframe);
});

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
