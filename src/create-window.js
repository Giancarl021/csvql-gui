const { BrowserWindow } = require('electron');
const path = require('path');

module.exports = function () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.resolve(__dirname, '..', 'build', 'icon.png')
    });

    // win.removeMenu();

    win.loadFile('app/main.html');
}