const { BrowserWindow } = require('electron');

module.exports = function () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // win.removeMenu();

    win.loadFile('app/main.html');
    win.webContents.openDevTools();
}