let diffEditor;

require.config({
  paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' }
});

require(['vs/editor/editor.main'], function () {

  /* define hacker theme again */
  monaco.editor.defineTheme('hackerTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: '33FF99' },
      { token: 'string', foreground: '33FF99' },
      { token: 'number', foreground: '33FF99' },
      { token: 'keyword', foreground: '33FF99' }
    ],
    colors: {
      'editor.background': '#000000',
      'editor.foreground': '#33FF99',
      'editorCursor.foreground': '#33FF99',
      'editorLineNumber.foreground': '#006622',
      'editor.selectionBackground': '#003311'
    }
  });

  const originalModel = monaco.editor.createModel('{\n}', 'json');
  const modifiedModel = monaco.editor.createModel('{\n}', 'json');

  diffEditor = monaco.editor.createDiffEditor(
    document.getElementById('diffEditor'),
    {
      theme: 'hackerTheme',      // apply here
      automaticLayout: true,
      originalEditable: true
    }
  );

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  });

});


function goBack() {
  window.location.href = "index.html";
}

function formatBoth() {

  const models = diffEditor.getModel();

  try {
    models.original.setValue(
      JSON.stringify(JSON.parse(models.original.getValue()), null, 4)
    );
  } catch { }

  try {
    models.modified.setValue(
      JSON.stringify(JSON.parse(models.modified.getValue()), null, 4)
    );
  } catch { }
}
