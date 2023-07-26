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


if(chkOpenImages.checked){
    boolOpenImages = true;
}

if(chkDownloadImages.checked){
    boolDownloadImages = true;
}



// TODO: https://chat.openai.com/share/80c5cd39-3b53-4634-9cf8-1ed692c1eb73


