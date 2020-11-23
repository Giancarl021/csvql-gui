function setFn() {
    const errorPanel = document.getElementById('error-panel');

    fn.fireError = message => {
        errorPanel.querySelector('.message-body').innerText = message;
        errorPanel.style.opacity = 1;
        setTimeout(() => errorPanel.style.opacity = 0, 3000);
    };

    fn.openConfigs = async () => {
        await ipcRenderer.invoke('shell.config');
    };

    fn.resetSession = async () => {
        await ipcRenderer.invoke('csvql.reset');
        fn.clear();
    };

    fn.deleteTable = async tableName => {
        const result = await ipcRenderer.invoke('csvql.delete', tableName);
        if (result && result.error) {
            fn.fireError(result.error);
        }
    };

    fn.renameTable = async (tableName, newName) => {
        const result = await ipcRenderer.invoke('csvql.rename', tableName, newName);
        if (result && result.error) {
            fn.fireError(result.error);
        }
    };

    fn.showRenameModal = originTable => {

    };

    fn.hideRenameModal = () => {
        
    };
}