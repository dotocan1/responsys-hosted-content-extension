//**********************************************************************************************************************************************************************
// ONLY CHANGE THIS LINES OF CODE
const USER_NAME = "dominik.otocan";
const PASSWORD = "Babab!1Babab";
// ONLY CHANGE THIS LINES OF CODE
//**********************************************************************************************************************************************************************

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

// factories

function createCampaignHandler () {
    let nameOfOriginalCampaign;
    let nameOfCopiedCampaign;
    let originalClFolderPath;
    let copiedClFolderPath;
    let copiedClDocPath;
    let folderName;
    let originalClDocPath;

    return {
        nameOfOriginalCampaign: nameOfOriginalCampaign,
        nameOfCopiedCampaign: nameOfCopiedCampaign,
        originalClFolderPath: originalClFolderPath,
        copiedClFolderPath: copiedClFolderPath,
        copiedClDocPath: copiedClDocPath,
        folderName: folderName,
        originalClDocPath: originalClDocPath,
    }
}

function createDOMHandler () {
    let body = document.getElementById("body");
    let folderSelect = document.getElementById("folders");
    let originalCampaignField = document.getElementById("original-campaign-field");
    let copiedCampaignField = document.getElementById("copied-campaign-field");
    return {
        folderSelect: folderSelect,
        originalCampaignField: originalCampaignField,
        copiedCampaignField: copiedCampaignField,
        body: body
    }


}

function createAPIHandler () {
    let resultJSON;
    let authToken;
    let endPoint;
    async function getAuth () {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();

        urlencoded.append("user_name", USER_NAME);
        urlencoded.append("password", PASSWORD);

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

        return fetch(endPoint + "/rest/api/v1.3/campaigns/" + domHandler.originalCampaignField.value, requestOptions)
            .then(response => response.text())
            .then(result => {
                // console.log(result)
                resultJSON = JSON.parse(result);

                campaignHandler.folderName = resultJSON.folderName;

                campaignHandler.originalClDocPath = resultJSON.htmlMessagePath;

                campaignHandler.originalClDocPath = resultJSON.htmlMessagePath;

                console.log(campaignHandler.originalClDocPath)

                // splitting the original content library document path into
                // an array so that I can get the original folder path
                let splitClDocPath = campaignHandler.originalClDocPath.split('');

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
                campaignHandler.originalClFolderPath = arrayOfOriginalClFolderPath.join('')
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

                // console.log(folders)
                // create new folder with folder names
                let folderNames = [];

                folders.forEach(folder => folderNames.push(folder.name))
                folderNames.sort(customSort);
                folderNames.forEach(folder => {
                    //console.log(folder.name)
                    let option = document.createElement("option");
                    option.value = folder;
                    option.textContent = folder;
                    domHandler.folderSelect.appendChild(option);
                })

                const defaultOption = document.createElement('option');
                defaultOption.textContent = campaignHandler.folderName;

                // Add the new option to the beginning of the dropdown list
                domHandler.folderSelect.insertBefore(defaultOption, domHandler.folderSelect.firstChild);

                // Set the new option as the default selected option
                defaultOption.selected = true;
                defaultOption.disabled = true;

                // Enable all interactions
                document.body.style.pointerEvents = 'auto';
                domHandler.body.classList.remove("hide-all");
            })
            .catch(error => console.log('error', error));
    }
    async function copyCampaign () {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", authToken);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "newCampaignName": campaignHandler.nameOfCopiedCampaign,
            "description": "",
            "folderName": domHandler.folderSelect.value
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/campaigns/" + campaignHandler.nameOfOriginalCampaign + "/actions/copy", requestOptions)
            .then(response => response.text())
            .then(result => {
                campaignHandler.copiedClFolderPath = campaignHandler.originalClFolderPath + "/" + campaignHandler.nameOfCopiedCampaign;
                campaignHandler.copiedClDocPath = campaignHandler.originalClFolderPath + "/" + campaignHandler.nameOfCopiedCampaign + "/" + campaignHandler.nameOfCopiedCampaign + ".htm";
                console.log("this is copied folder path: " + campaignHandler.copiedClFolderPath)
                console.log("this is copied cl doc path" + campaignHandler.copiedClDocPath)
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

        return fetch(endPoint + "/rest/api/v1.3/campaigns/" + campaignHandler.nameOfCopiedCampaign, requestOptions)
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
        console.log(campaignHandler.originalClDocPath + " this is originalClDocPath")
        console.log(campaignHandler.copiedClDocPath + " this is copiedClDocPath")
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
                alert("Campaign has been copied!\nNew folder path is:\n" + campaignHandler.copiedClFolderPath)
            })
            .catch(error => console.log('error', error));

    }
    return {
        authToken: authToken,
        endPoint: endPoint,
        getAuth: getAuth,
        fetchCampaign: fetchCampaign,
        getAllFolders: getAllFolders,
        copyCampaign: copyCampaign,
        fetchTheCopiedCampaign: fetchTheCopiedCampaign,
        createClLibFolder: createClLibFolder,
        createCopyOfClDoc: createCopyOfClDoc,
    }
}

// initalizations
const domHandler = createDOMHandler();
const campaignHandler = createCampaignHandler();
const apiHandler = createAPIHandler();

// event listeners
domHandler.originalCampaignField.addEventListener("blur", async function () {
    // Disable all interactions
    document.body.style.pointerEvents = 'none';
    domHandler.body.classList.add("hide-all");
    campaignHandler.nameOfOriginalCampaign = domHandler.originalCampaignField.value;
    let authSuccess = await apiHandler.getAuth(); // Wait for getAuth to complete

    if (authSuccess == false) {
        // Enable all interactions
        document.body.style.pointerEvents = 'auto';
        domHandler.body.classList.remove("hide-all");
        return 0;
    }
    let fetchSuccess = await apiHandler.fetchCampaign();

    if (fetchSuccess == false) {
        // Enable all interactions
        document.body.style.pointerEvents = 'auto';
        domHandler.body.classList.remove("hide-all");
        return 0;
    }

    // delete options
    domHandler.folderSelect.innerHTML = '';
    await apiHandler.getAllFolders();
    // Inside this function, "this" refers to the <select> element with id "mySelect"
    let firstOption = domHandler.folderSelect.querySelector('option:first-child');
    // Check if first option is still visible before hiding
    if (!firstOption.hidden) {
        firstOption.hidden = true;
    }
})

export async function main () {
    campaignHandler.nameOfCopiedCampaign = domHandler.copiedCampaignField.value;
    // Disable all interactions
    document.body.style.pointerEvents = 'none';
    domHandler.body.classList.add("hide-all");

    await apiHandler.copyCampaign();
    await apiHandler.fetchTheCopiedCampaign();
    await apiHandler.createClLibFolder(campaignHandler.copiedClFolderPath);
    await apiHandler.createCopyOfClDoc(campaignHandler.originalClDocPath, campaignHandler.copiedClDocPath);
    // Enable all interactions
    document.body.style.pointerEvents = 'auto';
    domHandler.body.classList.remove("hide-all");
}

