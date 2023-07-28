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

function deleteItems () {
    try {
        // Select the iframe items
        document.querySelectorAll('iframe').forEach((item) => {
            try {
                let radios = item.contentWindow.document.body.querySelectorAll('input[type="radio"]');
                if (radios.length) {
                    for (let radio of radios) {
                        if (radio.value.includes("dipsy")) {
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
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// deleteItems();