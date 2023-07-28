function loopWithDelay () {
    // select publish button here
    if (i == storedVariable.length) {
        storedLinks.forEach(function (item) {
            console.log(item)
        });

        // if user has turned on "Open every image in new tab"
        if (boolOpenImages == true) {
            storedOnlyLinks.forEach(function (item) {
                window.open(item, "_blank");
            })
        }
        return;
    }

    try {
        // select the publish button
        document.querySelectorAll('iframe').forEach(item => {
            try {
                if (item.contentWindow.document.body.querySelector('#FilePublish').value == "Publish") {
                    btnPublish = item.contentWindow.document.body.querySelector('#FilePublish');
                }
            } catch (error) {
                console.log(error)
            }

        }
        )
    }
    catch (error) {
        console.error('An error occurred:', error);
    }

    // Perform some loop logic here
    console.log(`${i + 1}. iteration`)
    console.log(`This is the stored variable: ${storedVariable[i]}`)
    try {
        console.log(`This is the publish button: ${btnPublish}`);
    }

    catch (error) {
        console.error('An error occurred:', error);
    }
    try {
        document.querySelectorAll('iframe').forEach(item => {
            if (item.contentWindow.document.body.querySelector(`input[value="${storedVariable[i]}"]`).value == storedVariable[i]) {
                try { inputElement = item.contentWindow.document.body.querySelector(`input[value="${storedVariable[i]}"]`) }
                catch (error) {
                    console.error('An error occurred:', error);
                }
            }
        }
        )
    }
    catch (error) {
        console.error('An error occurred:', error);
    }

    try {
        inputElement.checked = "true";
    }
    catch (error) {
        console.error('An error occurred:', error);
    }
    try {
        btnPublish.click();
    }
    catch (error) {
        console.error('An error occurred:', error);
    }

    i++;
    setTimeout(loopWithDelay, 10000); // Delay of 1 second (1000 milliseconds)

}

let storedVariable = JSON.parse(localStorage.getItem('savedArray'));
let storedLinks = JSON.parse(localStorage.getItem('linksArray'));
let storedOnlyLinks = JSON.parse(localStorage.getItem('linksOnlyArray'));
let btnPublish;
let inputElement;
let i = 0;

let boolDownloadImages;
let boolOpenImages;

async function getChkOpenImages () {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('chkOpenImages', function (data) {
            console.log('Checkbox open image state is ' + data.chkOpenImages);
            boolOpenImages = data.chkOpenImages;
            console.log(data.boolOpenImages);
            resolve();
        });
    });
}

async function getchkDownloadImages () {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('chkDownloadImages', function (data) {
            console.log('Checkbox download images state is ' + data.chkDownloadImages);
            boolDownloadImages = data.chkDownloadImages;
            console.log(data.boolDownloadImages);
            resolve();
        });
    });
}

// Put your code in an async function
async function main () {
    try {
        await getchkDownloadImages();
        await getChkOpenImages();
        loopWithDelay();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main(); // Call the main function

// deleting images

// let deleteButton;

// try {
//     // Select the iframe items
//     document.querySelectorAll('iframe').forEach(item => {
//         try {
//             let buttons = item.contentWindow.document.body.querySelectorAll('#Delete');
//             if (buttons.length) {
//                 buttons.forEach(button => {
//                     if (button.value == "Delete")
//                         console.log(button.value)
//                     deleteButton = button;
//                     // dispatch the event on the body
//                     document.body.dispatchEvent(event);

//                 });
//             }
//         } catch (error) {
//             console.error('An error occurred in the iframe:', error);
//         }
//     });
// } catch (error) {
//     console.error('An error occurred:', error);
// }

// function deleteItems () {
//     try {
//         // Select the iframe items
//         document.querySelectorAll('iframe').forEach((item) => {
//             try {
//                 let radios = item.contentWindow.document.body.querySelectorAll('input[type="radio"]');
//                 if (radios.length) {
//                     for (let radio of radios) {
//                         if (radio.value.includes("dipsy")) {
//                             console.log(radio.value)
//                             radio.checked = true;
//                             deleteButton.click();
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('An error occurred in the iframe:', error);
//             }
//         });
//     } catch (error) {
//         console.error('An error occurred:', error);
//     }
// }

// deleteItems();