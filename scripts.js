function injectTheUploadScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['uploadScript.js'] })
    })
}

function injectThePublishScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['PublishScript.js'] })
    })
}

let boolOpenImages = false;
let boolDownloadImages = false;
document.getElementById('btnUploadEx').addEventListener('click', injectTheUploadScript)
document.getElementById('btnPublishEx').addEventListener('click', injectThePublishScript)
let chkOpenImages = document.getElementById('chkOpenImages');
let chkDownloadImages = document.getElementById('chkDownloadImages');

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




document.getElementById('chkOpenImages').addEventListener('change', (event) => {
    // Persist checkbox state in extension storage
    chrome.storage.sync.set({ 'chkOpenImages': event.target.checked }, function() {
        console.log('Checkbox state is ' + event.target.checked);
    });
});

// TODO: https://chat.openai.com/share/80c5cd39-3b53-4634-9cf8-1ed692c1eb73


