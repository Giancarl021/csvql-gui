const {
    ipcMain,
    dialog
} = require('electron');
const initCsvql = require('./csvql');

module.exports = async function () {
    const csvql = await initCsvql();

    ipcMain.handle('csvql.init', async event => {
        await _tableUpdater(event);
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

    ipcMain.handle('dialog.import', async event => {
        const { filePaths: files } = await dialog.showOpenDialog({
            title: 'Import CSV',
            filters: [{
                name: '',
                extensions: ['csv']
            }],
            properties: [ 'multiSelections', 'openFile' ]
        });

        return await _importTables(event, files);
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