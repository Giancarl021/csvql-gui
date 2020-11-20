function codeMirror() {
    const element = document.getElementById('sql-panel');
    CodeMirror.fromTextArea(element, {
        mode: 'text/x-pgsql',
        indentWithTabs: true,
        smartIndent: true,
        theme: 'dracula',
        lineNumbers: true,
        matchBrackets : true,
        autofocus: true,
        extraKeys: {"Ctrl-Space": "autocomplete"}
    });
}

function init() {
    events();
    codeMirror();
}


document.addEventListener('DOMContentLoaded', init);