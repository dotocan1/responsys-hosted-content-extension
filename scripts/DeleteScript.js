// deleting images

let deleteButton;

try {
    // Select the iframe items
    document.querySelectorAll('iframe').forEach(item => {
        try {
            let buttons = item.contentWindow.document.body.querySelectorAll('#Delete');
            if (buttons.length) {
                buttons.forEach(button => {
                    if (button.value == "Delete")
                        console.log(button.value)
                    deleteButton = button;
                    // dispatch the event on the body
                    document.body.dispatchEvent(event);

                });
            }
        } catch (error) {
            console.error('An error occurred in the iframe:', error);
        }
    });
} catch (error) {
    console.error('An error occurred:', error);
}

let deleteTextField;

async function getDeleteText () {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('txtDelete', function (data) {
            console.log('Delete text field is ' + data.txtDelete);
            deleteTextField = data.txtDelete;
            console.log(data.txtDelete);
            resolve();
        });
    });
}

function deleteItems () {
    try {
        // Select the iframe items
        document.querySelectorAll('iframe').forEach((item) => {
            try {
                let radios = item.contentWindow.document.body.querySelectorAll('input[type="radio"]');
                if (radios.length) {
                    for (let radio of radios) {
                        if (radio.value.includes(deleteTextField)) {
                            console.log(radio.value)
                            radio.checked = true;
                            deleteButton.click();
                        }
                    }
                }

            } catch (error) {
                console.error('An error occurred in the iframe:', error);
            }
        });
        alert("All images have been deleted!")
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Put your code in an async function
async function main () {
    try {
        await getDeleteText();
        deleteItems();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main(); // Call the main function