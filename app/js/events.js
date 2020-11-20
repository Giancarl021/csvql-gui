const { ipcRenderer } = require('electron');

function dragFile(panelElement) {
    let counter = 0;
    document.addEventListener('drop', event => {
        event.preventDefault();
        event.stopPropagation();

        counter = 0;
        hide();

        const files = [];

        for (const f of event.dataTransfer.files) {
            files.push(f.path);
        }

        ipcRenderer.invoke('csvql.import', files).then(data => {
            if(data.error) {
                fn.fireError(data.error);
            }
        });
    });

    document.addEventListener('dragover', event => {
        event.preventDefault();
        event.stopPropagation();
    });

    document.addEventListener('dragenter', event => {
        event.preventDefault();
        counter++;
        show();
    });

    document.addEventListener('dragleave', event => {
        event.preventDefault();
        counter--;
        if(counter === 0) {
            hide();
        }
    });

    function show() {
        panelElement.style.opacity = '1';
    }

    function hide() {
        panelElement.style.opacity = '0';
    }
}

function tableView(panelElement) {
    ipcRenderer.on('csvql.update', (_, tables) => {

        tables.innerHTML = tables.map(formatTable);
        return true;
    });

    function formatTable(table) {
        return ``;
    }
}

function events() {
    dragFile(document.getElementById('drag-panel'));
    tableView(document.getElementById('table-view'));
}