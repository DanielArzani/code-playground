// An empty event listener for the DOMContentLoaded event, potentially for future use
window.addEventListener('DOMContentLoaded', () => {
  // Set initial mode for the CodeMirror editor
  let mode = 'htmlmixed';

  // Initialize CodeMirror with a configuration object
  const editor = CodeMirror.fromTextArea(code, {
    lineNumbers: true, // Display line numbers in the gutter
    styleActiveLine: true, // Highlight the line the cursor is on
    matchBrackets: true, // Highlight matching brackets
    scrollbarStyle: 'overlay', // Use an overlay for the scrollbar to save space
    Tab: 'indentMore', // Custom behavior for Tab key to increase indentation
    defaultTab: function (cm) {
      // Function to handle Tab key when no text is selected
      if (cm.somethingSelected())
        cm.indentSelection('add'); // Indent selected text
      else cm.replaceSelection('  ', 'end'); // Insert spaces on Tab when no selection
    },
    mode, // Set the initial mode for syntax highlighting
  });
  editor.setOption('theme', 'highcontrast-dark'); // Set the editor theme

  // Select the element that will be used to adjust the editor size dynamically
  const x = document.querySelector('.code');

  // Create a ResizeObserver to adjust the size of the editor dynamically
  const ro = new ResizeObserver((entries) => {
    editor.setSize(x.offsetWidth, x.offsetHeight); // Update editor size based on '.code' element
  });
  ro.observe(document.querySelector('.code-container')); // Observe changes to the '.code-container' element

  // Function to cycle through different syntax highlighting modes
  const changeMode = (btn) => {
    // Object to map the current mode to the next one
    mode = {
      htmlmixed: 'css',
      css: 'javascript',
      javascript: 'htmlmixed',
    }[mode];

    btn.title = `(click to change) Current Mode: ${mode}`; // Update button title to show current mode
    editor.setOption('mode', mode); // Apply the new mode to the editor
  };

  // change mode on button click
  const changeModeButton = document.querySelector('button.dots');
  changeModeButton.addEventListener('click', (e) => {
    const target = e.target;

    changeMode(target);
  });

  // -----------------------------------------
  //                PREVIEW
  //------------------------------------------

  // // 1. connected the editor to the preview iframe
  // const preview = document.querySelector('.preview--iframe');

  // //    Select the preview iframe and obtain its document for content updates
  // const iframeDoc =
  //   previewIframe.contentDocument || previewIframe.contentWindow.document;

  // //    Create a debounced function that updates the iframe, to limit the rate of updates during continuous edits
  // const debouncedUpdateIframe = debounce(
  //   () => updateIframe(jsEditor, htmlEditor, cssEditor, iframeDoc),
  //   500 // The delay in milliseconds before the iframe is updated after the last edit
  // );

  // // Perform an initial update of the iframe with the content loaded from local storage or defaults
  // debouncedUpdateIframe();
});
