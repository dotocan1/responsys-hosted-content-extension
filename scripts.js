import * as APICalls from './scripts/index.js';
import * as DOMModel from './scripts/DOMModel.js';
import * as APIModel from './scripts/APIModel.js';

let originalCampFieldTxt = document.getElementById("original-campaign-field");
let copiedCampFieldTxt = document.getElementById("copied-campaign-field");
let usernameInput = document.getElementById("username-input");
let passwordInput = document.getElementById("password-input");
let btnLogin = document.getElementById("exLoginBtn");

const domHandler = DOMModel.createDOMHandler();
const apiHandler = APIModel.createAPIHandler();

domHandler.writeInputFieldData();

function saveUsername () {
    return new Promise((resolve, reject) => {
        {
            chrome.storage.sync.set({ 'usernameInput': usernameInput.value }, function () {
                resolve("Username saved!");
            });
        }
    })
}

function savePassword () {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ 'passwordInput': passwordInput.value }, function () {
            if (chrome.runtime.lastError) {
                console.log("Password not saved!")
                reject(new Error(chrome.runtime.lastError));
            } else {
                console.log("Password saved!");
                resolve("Password saved!");
            }
        });
    })
}

// authenticate login

btnLogin.addEventListener('click', async () => {
    domHandler.disableInteractions();
    await saveUsername();
    await savePassword();
    // Attempt to authenticate with the API
    let authSuccess = await apiHandler.getAuth();

    // If authentication fails, re-enable interactions and exit
    if (authSuccess == false) {
        domHandler.enableInteractions();
        return 0;
    }
    domHandler.enableInteractions();
    alert("Login successful!")
})

// getting the initial state of username and password
try {
    chrome.storage.sync.get('usernameInput', function (data) {
        console.log("Username is: " + data.usernameInput);
        if (typeof data.usernameInput === "undefined" || typeof data.usernameInput === "") {
            return 0;
        } else {
            usernameInput.value = data.usernameInput;
        }
    });
}
catch (error) {
    console.log(error)
}

try {
    chrome.storage.sync.get('passwordInput', function (data) {
        if (typeof data.passwordInput === "undefined" || typeof data.passwordInput === "") {
            return 0;
        } else {
            passwordInput.value = data.passwordInput;
        }
    });
}
catch (error) {
    console.log(error)
}

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

function checkOpenImages (event) {
    return new Promise((resolve, reject) => {
        // Persist checkbox state in extension storage
        chrome.storage.sync.set({ 'chkOpenImages': event.target.checked }, function () {
            resolve('Checkbox state is ' + event.target.checked);
        });
    })
}

// setting event handlers for the checkbox
document.getElementById('chkOpenImages').addEventListener('change', async (event) => {
    domHandler.disableInteractions();
    await checkOpenImages(event);
    domHandler.enableInteractions();
});

function saveDeleteValue () {
    new Promise((resolve, reject) => {
        chrome.storage.sync.set({ 'txtDelete': document.getElementById('txtDelete').value }, function () {
            console.log('Text has been saved' + document.getElementById('txtDelete').value);
        });
        resolve();
    })
}