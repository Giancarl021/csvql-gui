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
            if(data && data.error) {
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
        panelElement.querySelector('.menu-list').innerHTML = tables.map(formatTable).join('');
        return true;
    });

    function formatTable(table) {
        return `
        <li>
            <a  data-active="false"
                onclick="this.parentElement.querySelector('ul').style.display = this.getAttribute('data-active') === 'true' ? 'none' : ''; this.setAttribute('data-active', this.getAttribute('data-active') === 'true' ? 'false' : 'true');">
                ${table.name}
            </a>
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