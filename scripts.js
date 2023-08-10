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

// function that executes the publish script
function injectTheDeleteScript () {
    chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
        await saveDeleteValue();
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, files: ['DeleteScript.js'] })
    })
}

let boolOpenImages = false;

// setting event handlers for upload and publish buttons
document.getElementById('btnUploadEx').addEventListener('click', injectTheUploadScript)
document.getElementById('btnPublishEx').addEventListener('click', injectThePublishScript)
document.getElementById('btnDeleteEx').addEventListener('click', injectTheDeleteScript)

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

// setting event handler for delete button
// it will save the value inside the text field then call the function
// that executes the delete script

function executeDeleteScript () {
    document.getElementById('btnDeleteEx').addEventListener('click', async () => {
        // Persist extension storage
        await saveDeleteValue();
        injectTheDeleteScript();
    });
    resolve();
};

// koristenje API-a od Responsysa

let authToken;
let endPoint;

getAuth();

async function getAuth () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("user_name", "dominik.otocan");
    urlencoded.append("password", "Babab!1Babab");
    urlencoded.append("auth_type", "password");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    return fetch("https://login.rsys8.net/rest/api/v1.3/auth/token", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            resultJSON = JSON.parse(result);
            authToken = resultJSON.authToken;
            endPoint = resultJSON.endPoint;
            console.log(authToken)
            console.log(endPoint)
        })
        .catch(error => console.log('error', error));
}

function getAccountInfo () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`${endPoint}/rest/api/v1.3/user/info`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function main() {
    await getAuth(); // Wait for getAuth to complete
    getAccountInfo();
  }

  main();