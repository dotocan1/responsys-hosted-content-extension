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
console.log(filesInputsArray)

for (let i = i; i < filesInputsArray.length; i++) {
    console.log(filesInputsArray[i])
    let input = document.createElement('input');
    input.type = "file";
    input.name = "file_" + i;
    input.file = filesInputsArray[i].file;
    filesInput.parentNode.insertBefore(input, filesInput);
}
