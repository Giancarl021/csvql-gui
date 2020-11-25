const { BrowserWindow } = require('electron');

module.exports = function () {
    const win = new BrowserWindow({
        width: 500,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        resizable: false
    });

    win.removeMenu();

    win.loadFile('app/loading.html');

    return win;
}