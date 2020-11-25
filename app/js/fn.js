function setFn() {
    const errorPanel = document.getElementById('error-panel');
    const renamePanel = document.getElementById('rename-panel');
    const renameButton = renamePanel.querySelector('#rename-btn');
    const importingPanel = document.getElementById('loading-panel');

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

        fn.hideRenameModal();
    };

    fn.showRenameModal = originTable => {
        renamePanel.style.opacity = 1;
        renamePanel.style.pointerEvents = 'all';

        const input = renamePanel.querySelector('input');

        input.placeholder = originTable;
    };

    fn.hideRenameModal = () => {
        renamePanel.style.opacity = 0;
        renamePanel.style.pointerEvents = 'none';
    };

    fn.validateRename = ({ target: input }) => {
        
        if (input.value) {
            renameButton.disabled = false;
        } else {
            renameButton.disabled = true;
        }
    }

    fn.showImporting = () => {
        importingPanel.style.opacity = 1;
        importingPanel.style.pointerEvents = 'all';
    };

    fn.hideImporting = () => {
        importingPanel.style.opacity = 0;
        importingPanel.style.pointerEvents = 'none';
    };
}