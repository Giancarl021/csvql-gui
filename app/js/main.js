function codeMirror() {
    const element = document.getElementById('sql-panel');
    CodeMirror.fromTextArea(element, {
        indentWithTabs: true,
        smartIndent: true,
        theme: 'dracula',
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true,
        dragDrop: false,
        extraKeys: {
            'Ctrl-Space': 'autocomplete'
        }
    });
}

function init() {
    events();
    codeMirror();
}


document.addEventListener('DOMContentLoaded', init);