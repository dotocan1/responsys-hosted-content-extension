function removeDisabledAttributes() {
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

}

console.log('script has been implemented')
let elements = [];

removeDisabledAttributes();