const { ipcRenderer } = require('electron');

function dragFile(panelElement) {
    let counter = 0;

    document.body.addEventListener('dragstart', e => e.preventDefault());
    document.body.addEventListener('drop', e => e.preventDefault());

    document.addEventListener('drop', event => {
        event.preventDefault();
        event.stopPropagation();

        counter = 0;
        hide();

        const files = [];

        for (const f of event.dataTransfer.files) {
            files.push(f.path);
        }

        fn.showImporting();

        ipcRenderer.invoke('csvql.import', files).then(data => {
            if(data && data.error) {
                fn.fireError(data.error);
            }

            fn.hideImporting();
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
        panelElement.querySelector('.menu-list').innerHTML = tables.map(formatTable).join('');
        return true;
    });

    function formatTable(table) {
        return `
        <li>
            <div class="is-flex is-justify-content-space-between">
                <a  style="flex: 1"
                    data-active="false"
                    onclick="this.parentElement.parentElement.querySelector('ul').style.display = this.getAttribute('data-active') === 'true' ? 'none' : ''; this.setAttribute('data-active', this.getAttribute('data-active') === 'true' ? 'false' : 'true');">
                    ${table.name}
                </a>
                <button class="button is-small is-warning is-inverted btn-table" onclick="fn.showRenameModal('${table.name}')">Rename</button>
                <button class="button is-small is-danger is-inverted btn-table" onclick="fn.deleteTable('${table.name}')">Delete</button>
            </div>
            <ul style="display: none">
                ${table.columns.map(e => `<li><a>${e.name}: <span class="type-${e.type}">${e.type}</span></a></li>`).join('')}
            </ul>
        </li>
        `;
    }
}

function events() {
    dragFile(document.getElementById('drag-panel'));
    tableView(document.getElementById('table-view'));
    ipcRenderer.invoke('csvql.init');
}