// TODO: Code that allows for multiple uploads

let filesInputsArray;
let filesList;

// filesinput
let filesInput;
try {
    document.querySelectorAll('iframe').forEach(item => {
        filesInput = item.contentWindow.document.getElementById('first_file_element');
        console.log('hee');
        filesInput.setAttribute('multiple', true);
    });
} catch (error) {
    console.log(error);
}



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

filesInput.remove();