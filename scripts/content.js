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

// TODO: Code that allows for multiple uploads

let filesInput;
let filesInputsArray;
let filesList;

// get filesInput

document.querySelectorAll('iframe').forEach(item => {
    filesInput = item.contentWindow.document.body.getElementById('first_file_element');
});

// get filesInputsArray

filesInputsArray = filesInput.files;

// get count

let count = filesInputsArray.length;

// get filesList

document.querySelectorAll('iframe').forEach(item => {
    filesInput = item.contentWindow.document.body.getElementById('files_list');
});

// background work that creates new inputs that contain files

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