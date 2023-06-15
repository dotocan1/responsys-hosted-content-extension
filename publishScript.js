function loopWithDelay () {
    // select publish button here
    if (i == storedVariable.length) {
        storedLinks.forEach(item => console.log(item));
        return;
    }

    try {
        // select the publish button
        document.querySelectorAll('iframe').forEach(item => {
            if (item.contentWindow.document.body.querySelector('#FilePublish').value == "Publish") {
                btnPublish = item.contentWindow.document.body.querySelector('#FilePublish');
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
    // if (i < storedVariable.length) {
    //     return;
    // }
    setTimeout(loopWithDelay, 10000); // Delay of 1 second (1000 milliseconds)

}

const storedVariable = JSON.parse(localStorage.getItem('savedArray'));
const storedLinks = JSON.parse(localStorage.getItem('linksArray'));
let btnPublish;
let inputElement;
let i = 0;

loopWithDelay();
// _np is only added to pictures that arent published