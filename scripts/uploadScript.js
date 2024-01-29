// TODO: Code that allows for multiple uploads

let filesInputsArray;
let filesList;

// filesinput
//let filesInput;
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


let arrayOfPictures = [];
let arrayOfLinks = [];
let arrayOfOnlyLinks = [];
let btnUpload;
let divElement;

localStorage.removeItem('savedArray');
localStorage.removeItem('LinksArray');
localStorage.removeItem('LinksOnlyArray');

try {
    // this selects the upload button
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.body.querySelector('input[value="Upload"]').value == "Upload") {
            btnUpload = item.contentWindow.document.body.querySelector('input[value="Upload"]');
        }
    }
    )
}

catch (error) {
    console.error('An error occurred:', error);
}

try {
    // this selects the files list
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.body.querySelector('#files_list').id == "files_list") {
            divElement = item.contentWindow.document.body.querySelector('#files_list');
        }
    }
    )
}

catch (error) {
    console.error('An error occurred:', error);
}

let children = divElement.children;

try {
    // when uploading, save the file names to an array
    for (let i = 0; i < children.length; i++) {
        let childText = children[i].textContent + "_np";
        replacedChildText = childText.replace(/ /g, '%20');
        arrayOfPictures.push(replacedChildText);
    }

    for (let i = 0; i < children.length; i++) {
        let childText = children[i].textContent + "\nhttps://static.cdn.responsys.net/i8/responsysimages/content/valamarri/" + children[i].textContent;
        let childTextLinks = "https://static.cdn.responsys.net/i8/responsysimages/content/valamarri/" + children[i].textContent;
        replacedChildText = childText.replace(/ /g, '%2520');
        replacedChildTextLinks = childTextLinks.replace(/ /g, '%2520');
        arrayOfLinks.push(replacedChildText);
        arrayOfOnlyLinks.push(replacedChildTextLinks);
    }
}

catch (error) {
    console.error('An error occurred:', error);
}
localStorage.setItem('savedArray', JSON.stringify(arrayOfPictures));
localStorage.setItem('linksArray', JSON.stringify(arrayOfLinks));
localStorage.setItem('linksOnlyArray', JSON.stringify(arrayOfOnlyLinks));




btnUpload.click();