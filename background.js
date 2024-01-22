chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        // Do something when a page is fully loaded
        console.log('Tab updated:', tab.url);
        // function that executes the content script

        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['./content.js'] })
        })

    }
});

chrome.webNavigation.onCompleted.addListener(function (details) {
    // Do something when navigation is complete
    console.log('Navigation completed on:', details.url);
}, { url: [{ urlMatches: 'http://*/*' }, { urlMatches: 'https://*/*' }] });
