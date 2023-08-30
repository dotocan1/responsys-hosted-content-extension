
function numberOfOccurences (a_splitClDocPath) {
    // counting the number of occurences 
    // of the letter "/"
    let count = 0;
    for (let index = 0; index < a_splitClDocPath.length; index++) {
        if (a_splitClDocPath[index] === "/") {
            count++;
        }
    }
    return count;
}
const customSort = (a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        let charA = a.charCodeAt(i);
        let charB = b.charCodeAt(i);

        if (charA !== charB) {
            if (Math.abs(charA - charB) === 32) {
                return charA < charB ? -1 : 1;
            } else {
                let lowerA = a[i].toLowerCase();
                let lowerB = b[i].toLowerCase();

                if (lowerA === lowerB) {
                    return charA < charB ? -1 : 1;
                } else {
                    return lowerA < lowerB ? -1 : 1;
                }
            }
        }
    }
    return a.length - b.length;
};

// koristenje API-a od Responsysa

let authToken;
let endPoint;

let resultJSON;
let originalClDocPath;

// testing variables
let nameOfOriginalCampaign;
let nameOfCopiedCampaign;
let originalClFolderPath;
let copiedClFolderPath;
let copiedClDocPath;
let folderName;
let folderSelect = document.getElementById("folders")
let originalCampaignField = document.getElementById("original-campaign-field")
let copiedCampaignField = document.getElementById("copied-campaign-field")
//let originalClFolderPath = "/contentlibrary/dominik_o/2023_ma_generalni_mail_redone";
// let folderName = "dominik_o"
// let copiedClFolderPath = "/contentlibrary/dominik_o/2023_ma_api_test_prvi_danas1";
// let copiedClDocPath = "/contentlibrary/dominik_o/2023_ma_api_test_prvi_danas1/2023_ma_api_test_prvi_danas1.htm";

originalCampaignField.addEventListener("blur", async function () {
    // Disable all interactions
    document.body.style.pointerEvents = 'none';
    let body = document.getElementById("body")
    body.classList.add("hide-all");
    nameOfOriginalCampaign = originalCampaignField.value;
    let authSuccess = await getAuth(); // Wait for getAuth to complete

    if (authSuccess == false) {
        // Enable all interactions
        document.body.style.pointerEvents = 'auto';
        body.classList.remove("hide-all");
        return 0;
    }
    let fetchSuccess = await fetchCampaign();

    if (fetchSuccess == false) {
        // Enable all interactions
        document.body.style.pointerEvents = 'auto';
        body.classList.remove("hide-all");
        return 0;
    }

    // delete options
    folderSelect.innerHTML = '';
    getAllFolders();
})

async function getAuth () {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    //**********************************************************************************************************************************************************************
    // ONLY CHANGE THIS LINES OF CODE
    urlencoded.append("user_name", "dominik.otocan");
    urlencoded.append("password", "Babab!1Babab");
    // ONLY CHANGE THIS LINES OF CODE
    //**********************************************************************************************************************************************************************
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
            resultJSON = JSON.parse(result);
            if (resultJSON.errorCode === "INVALID_USER_NAME_PASSWORD") {
                alert("Wrong username or password!")
                return false;
            }
            authToken = resultJSON.authToken;
            endPoint = resultJSON.endPoint;
        })
        .catch(error => {
            console.log('error', error);
            alert("Something went wrong while authenticating!")
            return false;
        })
}

async function fetchCampaign () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,

        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/campaigns/" + nameOfOriginalCampaign, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result)
            resultJSON = JSON.parse(result);

            folderName = resultJSON.folderName;

            originalClDocPath = resultJSON.htmlMessagePath;

            originalClDocPath = resultJSON.htmlMessagePath;

            // splitting the original content library document path into
            // an array so that I can get the original folder path
            let splitClDocPath = originalClDocPath.split('');

            let count = numberOfOccurences(splitClDocPath)
            count--;
            let boolCount = 0;
            let arrayOfOriginalClFolderPath = [];
            // getting the original folder path
            for (let index = 0; index < splitClDocPath.length; index++) {
                if (splitClDocPath[index] === "/") {
                    boolCount++;
                    if (boolCount == count) {
                        break;
                    } else {
                        arrayOfOriginalClFolderPath.push(splitClDocPath[index]);
                    }
                } else {
                    arrayOfOriginalClFolderPath.push(splitClDocPath[index])
                }
            }
            originalClFolderPath = arrayOfOriginalClFolderPath.join('')
        }
        )
        .catch(error => {
            console.log('error', error)
            alert("Campaign not found!")
            return false;
        });
}

async function getAllFolders () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/folders", requestOptions)
        .then(response => response.text())
        .then(async result => {
            resultJSON = JSON.parse(result);
            let folders = resultJSON.folders;

            console.log(folders)
            // create new folder with folder names
            let folderNames = [];

            folders.forEach(folder => folderNames.push(folder.name))
            folderNames.sort(customSort);

            // TODO: Fix this so that I can sort
            folderNames.forEach(folder => {
                //console.log(folder.name)
                let option = document.createElement("option");
                option.value = folder;
                option.textContent = folder;
                folderSelect.appendChild(option);
            })

            const defaultOption = document.createElement('option');
            defaultOption.textContent = folderName;

            // Add the new option to the beginning of the dropdown list
            folderSelect.insertBefore(defaultOption, folderSelect.firstChild);

            // Set the new option as the default selected option
            defaultOption.selected = true;
            defaultOption.disabled = true;

            // Enable all interactions
            document.body.style.pointerEvents = 'auto';
            body.classList.remove("hide-all");
        })
        .catch(error => console.log('error', error));
}
async function copyCampaign () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "newCampaignName": nameOfCopiedCampaign,
        "description": "",
        "folderName": folderSelect.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/campaigns/" + nameOfOriginalCampaign + "/actions/copy", requestOptions)
        .then(response => response.text())
        .then(result => {
            copiedClFolderPath = originalClFolderPath + "/" + nameOfCopiedCampaign;
            copiedClDocPath = originalClFolderPath + "/" + nameOfCopiedCampaign + "/" + nameOfCopiedCampaign + ".htm";
            console.log("this is copied folder path: " + copiedClFolderPath)
            console.log("this is copied cl doc path" + copiedClDocPath)
        })
        .catch(error => console.log('error', error));
}

async function fetchTheCopiedCampaign () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/campaigns/" + nameOfCopiedCampaign, requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result)
            resultJSON = JSON.parse(result);
        })
        .catch(error => console.log('error', error));
}

async function createClLibFolder (a_copiedClFolderPath) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "folderPath": a_copiedClFolderPath
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/clFolders", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function createCopyOfClDoc (oldPath, newPath) {
    var myHeaders = new Headers();
    console.log(originalClDocPath + " this is originalClDocPath")
    console.log(copiedClDocPath + " this is copiedClDocPath")
    myHeaders.append("Authorization", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "documentPath": oldPath
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/clDocs" + newPath, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            alert("Campaign has been copied!\nNew folder path is:\n" + copiedClFolderPath)
        })
        .catch(error => console.log('error', error));
}

export async function main () {
    nameOfCopiedCampaign = copiedCampaignField.value;
    // Disable all interactions
    document.body.style.pointerEvents = 'none';
    let body = document.getElementById("body")
    body.classList.add("hide-all");

    await copyCampaign();
    await fetchTheCopiedCampaign();
    await createClLibFolder(copiedClFolderPath);
    await createCopyOfClDoc(originalClDocPath, copiedClDocPath);
    // Enable all interactions
    document.body.style.pointerEvents = 'auto';
    body.classList.remove("hide-all");
}

