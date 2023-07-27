// function that executes the upload script
function injectTheUploadScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['uploadScript.js'] })
    })
}

// function that executes the publish script
function injectThePublishScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['PublishScript.js'] })
    })
}

let boolOpenImages = false;
let boolDownloadImages = false;

// setting event handlers for upload and publish buttons
document.getElementById('btnUploadEx').addEventListener('click', injectTheUploadScript)
document.getElementById('btnPublishEx').addEventListener('click', injectThePublishScript)

// getting the initial state of the checkbox for opening all images
try{
    chrome.storage.sync.get('chkOpenImages', function(data) {
        console.log('Checkbox state is ' + data.chkOpenImages);
        // Use data.checkboxState in your webpage-modifying code...
        chkOpenImages.checked = data.chkOpenImages;
    });
}
catch(error){
    console.log(error)
}

// getting the initial state of the checkbox for downloading the CSV file
try{
    chrome.storage.sync.get('chkDownloadImages', function(data) {
        console.log('Checkbox state is ' + data.chkDownloadImages);
        // Use data.checkboxState in your webpage-modifying code...
        chkDownloadImages.checked = data.chkDownloadImages;
    });
}
catch(error){
    console.log(error)
}

// setting event handlers for the checkbox
document.getElementById('chkOpenImages').addEventListener('change', (event) => {
    // Persist checkbox state in extension storage
    chrome.storage.sync.set({ 'chkOpenImages': event.target.checked }, function() {
        console.log('Checkbox state is ' + event.target.checked);
    });
});

// setting event handlers for the checkbox
document.getElementById('chkDownloadImages').addEventListener('change', (event) => {
    // Persist checkbox state in extension storage
    chrome.storage.sync.set({ 'chkDownloadImages': event.target.checked }, function() {
        console.log('Checkbox state is ' + event.target.checked);
    });
});



