function dragFile(panelElement) {
    let counter = 0;
    document.addEventListener('drop', event => {
        event.preventDefault();
        event.stopPropagation();

        counter = 0;
        hide();

        for (const f of event.dataTransfer.files) {
            console.log('File Path of dragged files: ', f.path)
        }
    });

    document.addEventListener('dragover', event => {
        event.preventDefault();
        event.stopPropagation();
    });

    document.addEventListener('dragenter', event => {
        event.preventDefault();
        counter++;
        show();
    });

    document.addEventListener('dragleave', event => {
        event.preventDefault();
        counter--;
        if(counter === 0) {
            hide();
        }
    });

    function show() {
        panelElement.style.opacity = '1';
    }

    function hide() {
        panelElement.style.opacity = '0';
    }
}

function events() {
    dragFile(document.getElementById('drag-panel'));
}