// TODO: Code that allows for multiple uploads

let filesInputsArray;
let filesList;

// filesinput
let filesInput;
try {
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.getElementById('first_file_element').id === "first_file_element") {
            filesInput = item.contentWindow.document.getElementById('first_file_element');
            console.log('Got through!');
            console.log(filesInput);
        }
    });
} catch (error) {
    console.log(error);
}

// get filesInputsArray
console.log('this is files input');
console.log(filesInput);
filesInputsArray = filesInput.files;

// get count
let count = filesInputsArray.length;

try {
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.getElementById('first_file_element').id === "first_file_element") {
            filesList = item.contentWindow.document.getElementById('files_list');
            console.log('Got through!!!');
            console.log(filesList);
        }
    });
} catch (error) {
    console.log(error);
}
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

    // Set the new FileList to the new input
    newInput.files = newFileList.files;

    // Append the new input before the original input
    filesInput.parentNode.insertBefore(newInput, filesInput);

    if (i == 0) {
        continue;
    }
    // Append the file name to the filesList
    let div = document.createElement('div');
    div.textContent = filesInputsArray[i].name;
    filesList.appendChild(div);
}

// Optionally, remove the original input after the loop if needed
// filesInput.remove();
