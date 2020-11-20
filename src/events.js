const { ipcMain } = require('electron');
const initCsvql = require('./csvql');

module.exports = async function () {
    const csvql = await initCsvql();

    ipcMain.handle('csvql.init', async event => {
        await tableUpdater(event);
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

    ipcMain.handle('csvql.import', async (event, files) => {
        let result;
        try {
            result = await csvql.schema('import', files);
        } catch (err) {
            return {
                error: err.message
            };
        }
        tableUpdater(event);
        return result;
    });

    async function tableUpdater(event) {
        event.sender.send('csvql.update', await csvql.schema('list'));
    }


    return csvql.close;
}