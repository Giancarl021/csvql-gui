const { app } = require('electron');
const fs = require('fs');
const createCsvql = require('csvql');
const store = require('./storage');

module.exports = async function () {
    const userData = app.getPath('userData');
    const sessionPath = store.get('persistentSessions') ? userData + '/session.sqlite' : null;
    const diskPath = store.get('diskSessions') ? userData + '/temp.disk.sqlite': null;

    const csvql = await createCsvql([], {
        persist: sessionPath,
        from: sessionPath && fs.existsSync(sessionPath) ? sessionPath : null,
        disk: diskPath
    });

    return csvql;
}