const { app, BrowserWindow } = require('electron');

const handleEvents = require('./src/events');
const createWindow = require('./src/create-window');
const createLoading = require('./src/create-loading');
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
    await app.whenReady();
    const loading = createLoading();

    closer = await handleEvents();

    createWindow()
        .once('ready-to-show', () => loading.close());

}

main().catch(console.error);