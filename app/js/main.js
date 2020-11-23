const config = {};
const fn = {};

function codeMirror() {
    const element = document.getElementById('sql-panel');
    const cm = CodeMirror.fromTextArea(element, {
        indentWithTabs: true,
        smartIndent: true,
        theme: 'dracula',
        lineNumbers: true,
        matchBrackets: true,
        autofocus: true,
        dragDrop: false,
        extraKeys: {
            'Ctrl-Space': 'autocomplete'
        }
    });

    const table = document.getElementById('result-table');
    const btnExec = document.getElementById('btn-exec');
    const btnClear = document.getElementById('btn-clear');
    const historyPanel = document.getElementById('history-panel');
    const historyTable = historyPanel.querySelector('#history-table');
    const history = [];

    cm.on('change', () => {
        if (!cm.getValue()) {
            btnExec.disabled = true;
            btnClear.disabled = true;
        } else {
            btnExec.disabled = false;
            btnClear.disabled = false;
        }
    });

    fn.importFiles = () => {
        ipcRenderer.invoke('dialog.import').then(data => {
            if (data && data.error) {
                fn.fireError(data.error);
            }
        });
    }

    fn.clear = () => {
        cm.setValue('');
        handleQuery(null, table);
    }

    fn.exec = async () => {
        const now = Date.now();
        const selection = cm.getSelection();
        const value = cm.getValue();

        const query = ipcRenderer.invoke('csvql.exec', selection || value);

        const isSuccessful = await handleQuery(query, table);

        history.push({
            timestamp: new Date(now),
            query: selection || value,
            isSuccessful
        });
    };

    fn.showHistory = () => {
        cm.display.input.blur()
        historyTable.querySelector('tbody').innerHTML = history.length ? history.map(formatHistory).join('') : `<tr><td colspan="3" style="text-align: center">Empty</td></tr>`;

        function formatHistory(record) {
            return `
                <tr>
                    <td>${record.timestamp.toISOString()}</td>
                    <td>${record.query}</td>
                    <td>${record.isSuccessful ? 'Yes' : 'No'}</td>
                </tr>
            `;
        }
        historyPanel.style.opacity = 1;
        historyPanel.style.pointerEvents = 'all';
    }

    fn.hideHistory = () => {
        historyPanel.style.opacity = 0;
        historyPanel.style.pointerEvents = 'none';
    }
}

async function handleQuery(promise, tableElement) {
    const result = await promise;

    if (result === null) {
        tableElement.innerHTML = '';
        return true;
    }

    if (result.error) {
        tableElement.innerHTML = `
        <thead>
            <tr>
                <th>Error</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${result.error}</td>
            </tr>
        </tbody>
        `;
    } else if (!result.length) {
        tableElement.innerHTML = `
        <thead>
            <tr>
                <th>Empty</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Empty result</td>
            </tr>
        </tbody>
        `;
    } else {
        const headers = Object.keys(result[0]);

        tableElement.innerHTML = `
        <thead>
            <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${result.map(parseRow(headers)).join('')}
        </tbody>
        `;
    }

    return result.error ? false : true;

    function parseRow(headers) {
        return row => {
            let str = '<tr>';
            for (const header of headers) {
                let value = row[header];
                const type = parseType(value);

                if (type === 'date' && config.dateType.parse) {
                    if (config.dateType.formatToLocale) {
                        value = new Date(value).toLocaleString();
                    } else {
                        value = new Date(value).toISOString();
                    }
                }

                str += `<td class="type-${type}">${value}</td>`;
            }

            return str + '</tr>';

            function parseType(value) {
                if (value === null || value === undefined) {
                    return 'null';
                } else if (!isNaN(Number(value))) {
                    return 'number';
                } else if (new Date(value).toString() !== "Invalid Date" && !isNaN(new Date(value))) {
                    return 'date';
                } else {
                    return 'string';
                }
            }
        }
    }
}

async function getConfigs() {
    const configs = await ipcRenderer.invoke('env.config');

    for (const key in configs) {
        config[key] = configs[key];
    }
}

async function init() {
    await getConfigs();
    setFn();
    events();
    codeMirror();
}


document.addEventListener('DOMContentLoaded', init);