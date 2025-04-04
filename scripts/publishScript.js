async function loopWithDelay() {
    // select publish button here
    if (i == storedVariable.length) {
        storedLinks.forEach(function (item) {
            console.log(item)
        });

        // if user has turned on "Open every image in new tab"
        await getChkOpenImages();
        if (boolOpenImages == true) {
            storedOnlyLinks.forEach(function (item) {
                window.open(item, "_blank");
                // index * 2000 will create a 2-second delay for each item
            });
        }

        alert("All images have been published!")
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
        const output = storedVariable[i].replace(/(\.(?:jpg|png|jpeg|gif))_np/g, '$1');
        document.querySelectorAll('iframe').forEach(item => {
            if (item.contentWindow.document.body.querySelector(`input[value="${output}"]`).value == output) {

                try {
                    console.log("this is output", output)
                    inputElement = item.contentWindow.document.body.querySelector(`input[value="${output}"]`)
                }
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
    loopWithDelay();
    //setTimeout(loopWithDelay, 2000); // Delay of 1 second (1000 milliseconds)

}

let storedVariable = JSON.parse(localStorage.getItem('savedArray'));
let storedLinks = JSON.parse(localStorage.getItem('linksArray'));
let storedOnlyLinks = JSON.parse(localStorage.getItem('linksOnlyArray'));
let btnPublish;
let inputElement;
let i = 0;

let boolDownloadImages;
let boolOpenImages;

async function getChkOpenImages() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get('chkOpenImages', function (data) {
            console.log('Checkbox open image state is ' + data.chkOpenImages);
            boolOpenImages = data.chkOpenImages;
            console.log(data.boolOpenImages);
            resolve();
        });
    });
}

async function getchkDownloadImages() {
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
async function main() {
    try {
        await getchkDownloadImages();
        loopWithDelay();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main(); // Call the main function