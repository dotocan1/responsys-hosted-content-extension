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

for (let i = 0; i < filesInputsArray.length; i++) {
    console.log(filesInputsArray[i])
    let input = document.createElement('input');
    input.type = "file";
    input.name = "file_" + i+1;
    input.file = filesInputsArray[i+1].file;
    filesInput.parentNode.insertBefore(input, filesInput);
}
