import * as APICalls from './scripts/index.js';

let originalCampFieldTxt = document.getElementById("original-campaign-field");
let copiedCampFieldTxt = document.getElementById("copied-campaign-field");

// function that executes the upload script
function injectTheUploadScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['./scripts/uploadScript.js'] })
    })
}

// function that executes the publish script
function injectThePublishScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['./scripts/PublishScript.js'] })
    })
}

// function that executes the publish script
function injectTheDeleteScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
        await saveDeleteValue();
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['./scripts/DeleteScript.js'] })
    })
}

let boolOpenImages = false;

// setting event handlers for upload and publish buttons
document.getElementById('btnUploadEx').addEventListener('click', injectTheUploadScript)
document.getElementById('btnPublishEx').addEventListener('click', injectThePublishScript)
document.getElementById('btnDeleteEx').addEventListener('click', injectTheDeleteScript)
document.getElementById("btnCopyEx").addEventListener('click', () => {
    APICalls.main();
})

// getting the initial state of the checkbox for opening all images
try {
    chrome.storage.sync.get('chkOpenImages', function (data) {
        console.log('Checkbox state is ' + data.chkOpenImages);
        // Use data.checkboxState in your webpage-modifying code...
        chkOpenImages.checked = data.chkOpenImages;
    });
}
catch (error) {
    console.log(error)
}

// setting event handlers for the checkbox
document.getElementById('chkOpenImages').addEventListener('change', (event) => {
    // Persist checkbox state in extension storage
    chrome.storage.sync.set({ 'chkOpenImages': event.target.checked }, function () {
        console.log('Checkbox state is ' + event.target.checked);
    });
});

function saveDeleteValue () {
    new Promise((resolve, reject) => {
        chrome.storage.sync.set({ 'txtDelete': document.getElementById('txtDelete').value }, function () {
            console.log('Text has been saved' + document.getElementById('txtDelete').value);
        });
        resolve();
    })
}