const { app } = require('electron');
const fs = require('fs');
const createCsvql = require('csvql');
const store = require('./storage');
const { create } = require('domain');

module.exports = async function () {
    const userData = app.getPath('userData');
    const sessionPath = store.get('persistentSessions') ? userData + '/session.sqlite' : null;
    const diskPath = store.get('diskSessions') ? userData + '/temp.disk.sqlite': null;

    let csvql = await create();

    async function reset() {
        await csvql.close();
        csvql = await create();
    }

    async function create() {
        const instance = await createCsvql([], {
            persist: sessionPath,
            from: sessionPath && fs.existsSync(sessionPath) ? sessionPath : null,
            disk: diskPath
        });
        
        instance.reset = reset;
        return instance;
    }

    return csvql;
}