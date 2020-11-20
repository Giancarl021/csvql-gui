const { app, BrowserWindow } = require('electron');

const handleEvents = require('./src/events');
const createWindow = require('./src/create-window');
let closer;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        closer().then(() => app.quit());
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


async function main () {
    closer = await handleEvents();
    await app.whenReady();
    createWindow()
}

main().catch(console.error);