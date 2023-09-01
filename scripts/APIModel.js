import * as CONFIGModule from "../CONFIG.js"

const CONFIGHandler = CONFIGModule.createConfig();

export function createAPIHandler (campaignHandler, domHandler) {
    let resultJSON;
    let authToken;
    let endPoint;
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
    async function getAuth () {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();

        urlencoded.append("user_name", CONFIGHandler.CONFIG.USER_NAME);
        urlencoded.append("password", CONFIGHandler.CONFIG.PASSWORD);

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

                domHandler.enableInteractions();
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
                console.log(`${campaignHandler.nameOfCopiedCampaign} this is the name of the copied campaign!`)
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
                let label = document.createElement('label');
                label.textContent = `New folder path is: ${campaignHandler.copiedClFolderPath}`
                domHandler.flexboxContainer.appendChild(label);
            })
            .catch(error => console.log('error', error));

    }
    return {
        getAuth: getAuth,
        fetchCampaign: fetchCampaign,
        getAllFolders: getAllFolders,
        copyCampaign: copyCampaign,
        fetchTheCopiedCampaign: fetchTheCopiedCampaign,
        createClLibFolder: createClLibFolder,
        createCopyOfClDoc: createCopyOfClDoc,
    }
}