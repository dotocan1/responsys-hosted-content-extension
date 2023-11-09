function removeDisabledAttributes () {
    elements = [];

    document.querySelectorAll('iframe').forEach(item => {
        const fileElement = item.contentWindow.document.body.querySelectorAll('[name^="file_"]');
        fileElement.forEach((element) => {
            elements.push(element);
        })
    });

    elements.forEach(element => {
        if (element.hasAttribute('disabled')) {
            element.removeAttribute('disabled');
        }
    });
    console.log(elements)
}

console.log('script has been implemented')
let elements = [];

function attachEventListener () {
    document.querySelectorAll('iframe').forEach(item => {
        const fileElement = item.contentWindow.document.body.querySelectorAll('form');
        fileElement.forEach((element) => {
            element.addEventListener('mousemove', removeDisabledAttributes);
        })
    });
}
attachEventListener();

document.addEventListener('mousemove', attachEventListener);



let filesInput = document.getElementById('first_file_element');
let filesInputsArray = filesInput.files;

for (let i = 1; i < filesInputsArray.length; i++) {
    let newInput = filesInput.cloneNode(true);
    let count = i + 1;
    newInput.name = "file_" + count;
    newInput.id = "";

    // Create a new FileList with a single file
    let newFileList = new DataTransfer();
    newFileList.items.add(filesInputsArray[i]);

    // Set the new FileList as the files property of the cloned input element
    Object.defineProperty(newInput, "files", {
        writable: true,
        value: newFileList.files
    });

    filesInput.parentNode.insertBefore(newInput, filesInput);
}



