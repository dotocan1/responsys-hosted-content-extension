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

        // if user has turned on "Export to CSV"
        if (boolDownloadImages == true) {
            let newEntry = ["ImageName", "ImageLink"];
            storedOnlyLinks.unshift(newEntry);

            // Convert 2D array to CSV string
            function arrayToCSV (storedOnlyLinks) {
                return storedOnlyLinks.map(row => row.join(",")).join("\n");
            }

            // Download CSV file
            function downloadCSV (data, filename = 'export.csv') {
                let csv = arrayToCSV(data);
                let csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                let csvUrl = URL.createObjectURL(csvBlob);
                let hiddenElement = document.createElement('a');
                hiddenElement.href = csvUrl;
                hiddenElement.target = '_blank';
                hiddenElement.download = filename;
                hiddenElement.click();
            }

            downloadCSV(storedOnlyLinks)
        }

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

let storedVariable = JSON.parse(localStorage.getItem('savedArray'));
let storedLinks = JSON.parse(localStorage.getItem('linksArray'));
let storedOnlyLinks = JSON.parse(localStorage.getItem('linksOnlyArray'));
let btnPublish;
let inputElement;
let i = 0;
 
new Promise((resolve, reject) => {
    chrome.storage.sync.get('chkOpenImages', function(data) {
        console.log('Checkbox state is ' + data.chkOpenImages);
        // Use data.checkboxState in your webpage-modifying code...
        boolOpenImages = data.chkOpenImages;
        console.log('data.boolOpenImages');
        resolve();
    });
})
.then(() => {
    loopWithDelay();
})
.catch((error) => {
    console.error('An error occurred:', error);
});

console.log("This works!!!" + boolOpenImages)
// _np is only added to pictures that arent published