console.log('script implemented')

function myFunction() {
    // console.log("This will be executed every 1000 milliseconds (1 second).");
    let filesInput;
    try {
        document.querySelectorAll('iframe').forEach(item => {
            filesInput = item.contentWindow.document.getElementById('first_file_element');
            filesInput.setAttribute('multiple', true);
            // success
        });
    } catch (error) {
        // console.log(error);
    }

}

setInterval(myFunction, 1000);
