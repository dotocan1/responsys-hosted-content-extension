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
let count = filesInputsArray.length;
let filesList = document.getElementById('files_list');

for (let i = 0; i < filesInputsArray.length; i++) {
    let newInput = filesInput.cloneNode(true);
    count = count - 1;
    newInput.name = "file_" + count;
    newInput.id = "";
    newInput.removeAttribute("id");
    newInput.removeAttribute("multiple");

    // Create a new FileList with a single file
    let newFileList = new DataTransfer();
    newFileList.items.add(filesInputsArray[i]);

    newInput.files = newFileList.files;

    filesInput.parentNode.insertBefore(newInput, filesInput);

    let div = document.createElement('div')
    div.textContent = filesInputsArray[i].name;
    filesList.appendChild(div);
}






