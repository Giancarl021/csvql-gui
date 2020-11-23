const { ipcMain, dialog, shell, app } = require('electron');
const storage = require('./storage');
const initCsvql = require('./csvql');

module.exports = async function () {
    const csvql = await initCsvql();

    ipcMain.handle('csvql.init', async event => {
        await _tableUpdater(event);
    });

    ipcMain.handle('env.config', () => {
        return storage.get('interface');
    });

    ipcMain.handle('csvql.exec', async (_, query) => {
        const pieces = query
            .replace(/\s\s+/g, ' ')
            .trim()
            .split(' ')
            .slice(1);

        let result;
        try {
            result = csvql.select(pieces.join(' '));
        } catch (err) {
            return {
                error: err.message
            };
        }

        return result;
    });

    ipcMain.handle('csvql.import', _importTables);

    ipcMain.handle('csvql.delete', async (event, table) => {
        try {
            csvql.schema('drop', table);
        } catch (err) {
            return {
                error: err.message
            };
        }

        await _tableUpdater(event);

        return null;
    });

    ipcMain.handle('csvql.reset', async event => {
        const tables = (await csvql.schema('list'))
            .map(t => t.name);

        for (const table of tables) {
            await csvql.schema('drop', table);
        }
        await _tableUpdater(event);
    });

    ipcMain.handle('dialog.import', async event => {
        const { filePaths: files, canceled } = await dialog.showOpenDialog({
            title: 'Import CSV',
            filters: [{
                name: '',
                extensions: ['csv']
            }],
            properties: [ 'multiSelections', 'openFile' ]
        });

        if (canceled) {
            return null;
        }

        return await _importTables(event, files);
    });

    ipcMain.handle('shell.config', () => {
        shell.openPath(app.getPath('userData') + '/config.json');
    });

    return csvql.close;

    async function _tableUpdater(event) {
        event.sender.send('csvql.update', await csvql.schema('list'));
    }

    async function _importTables(event, files) {
        let result;
        try {
            result = await csvql.schema('import', files);
        } catch (err) {
            return {
                error: err.message
            };
        }
        _tableUpdater(event);
        return result;
    }
}