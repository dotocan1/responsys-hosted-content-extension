export function createAPIHandler (campaignHandler, domHandler) {
    let authToken;
    let endPoint = "https://v8h1pzy-api.responsys.ocs.oraclecloud.com";
    let USERNAME;
    let PASSWORD;

    // getting the initial state of username and password

    function getUsername () {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get('usernameInput', function (data) {

                    if (typeof data.usernameInput === "undefined" || typeof data.usernameInput === "") {

                        return 0;
                    } else {
                        USERNAME = data.usernameInput;
                        resolve("Saved!");
                    }
                });
            }
            catch (error) {
                console.log(error)
            }
        })
    }

    function getPassword () {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get('passwordInput', function (data) {
                    if (typeof data.passwordInput === "undefined" || typeof data.passwordInput === "") {

                        return 0;
                    } else {
                        PASSWORD = data.passwordInput;
                        resolve("Saved!");
                    }
                });
            }
            catch (error) {
                console.log(error)
            }
        })
    }
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
        await getUsername();
        await getPassword();

        urlencoded.append("user_name", USERNAME);
        urlencoded.append("password", PASSWORD);

        urlencoded.append("auth_type", "password");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/auth/token", requestOptions)
            .then(response => response.text())
            .then(result => {

                let resultJSON;
                resultJSON = JSON.parse(result);

                if (resultJSON.errorCode === "INVALID_USER_NAME_PASSWORD") {
                    alert("Wrong username or password!")
                    return false;
                }
                authToken = resultJSON.authToken;
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
                let resultJSON;
                resultJSON = JSON.parse(result);
                campaignHandler.folderName = resultJSON.folderName;
                campaignHandler.originalClDocPath = resultJSON.htmlMessagePath;
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
                console.log("This is the original clFolderPath " + campaignHandler.originalClFolderPath)

            }
            )
            .catch(error => {
                console.log('error', error)
                alert("Campaign not found!")
                return false;
            });
    }

    // function that gets all other non content library folders
    async function getAllOtherFolders () {
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
                let resultJSON;
                resultJSON = JSON.parse(result);
                let folders = resultJSON.folders;

                // create new array with folder names
                let folderNames = [];
                folders.forEach(folder => folderNames.push(folder.name))
                folderNames.sort(customSort);
                folderNames.forEach(folder => {
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

                campaignHandler.copiedClFolderPath = campaignHandler.originalClFolderPath + "/" + campaignHandler.nameOfCopiedCampaign;
                campaignHandler.copiedClDocPath = campaignHandler.originalClFolderPath + "/" + campaignHandler.nameOfCopiedCampaign + "/" + campaignHandler.nameOfCopiedCampaign + ".htm";

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
                let resultJSON;
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
            .then(result => {

            })
            .catch(error => console.log('error', error));
    }

    async function createCopyOfClDoc (oldPath, newPath, newDocName) {

        var myHeaders = new Headers();

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


        return fetch(endPoint + "/rest/api/v1.3/clDocs" + newPath + "/" + newDocName, requestOptions)
            .then(response => response.text())
            .then(result => {

            })
            .catch(error => console.log('error', error));

    }

    async function setOgPath () {
        return new Promise(async (resolve, reject) => {
            // splitting the original content library document path into
            // an array so that I can get the original folder path
            let splitClDocPath = campaignHandler.originalClDocPath.split('');
            let count = numberOfOccurences(splitClDocPath)
            //count--;
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
            campaignHandler.ogPath = arrayOfOriginalClFolderPath.join('')
            let a_ClfolderName = campaignHandler.ogPath.split('/');
            let index = a_ClfolderName.length - 1;
            a_ClfolderName = a_ClfolderName[index]
            campaignHandler.originalClFolderName = a_ClfolderName;
            resolve();
        })
    }
    function extractPath (url) {
        const searchString = "/contentlibrary";
        const index = url.indexOf(searchString);

        if (index !== -1) {
            return url.substring(index);
        } else {
            return "Substring not found"; // or handle this case as needed
        }
    }
    // this functions lists all cl folders
    async function listClFolders (a_path) {

        var myHeaders = new Headers();
        myHeaders.append("Authorization", authToken);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/clFolders" + a_path, requestOptions)
            .then(response => response.text())
            .then(async result => {
                let resultJSON;
                resultJSON = JSON.parse(result);
                let folders = resultJSON.folders;

                console.log(resultJSON)
                console.log(folders)
                if (folders.length == 0) {
                    console.log(`No folders found!`)
                } else {

                    for (let i = 0; i < folders.length; i++) {

                        let folderPath = extractPath(folders[i].links[0].href)


                        let newFolderPath = folderPath.replace(campaignHandler.originalClFolderName, campaignHandler.nameOfCopiedCampaign)

                        console.log(`this is old folder path ${folderPath} and this is new path ${newFolderPath}`)

                        // list all subfolders
                        await listClFolders(folderPath);

                        // copy the folder
                        await createClLibFolder(newFolderPath);

                        // list all contents
                        await listClFolderContent(newFolderPath, folderPath)

                        console.log("Finished with the " + newFolderPath + " folder")
                    }


                }

            })
            .catch(error => console.log('error', error));

    }

    async function listClFolderContent (a_newPath, a_oldPath) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", authToken);


        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/clFolders" + a_oldPath, requestOptions)
            .then(response => response.text())
            .then(async result => {
                let resultJSON;
                resultJSON = JSON.parse(result);


                // copy items

                let items = resultJSON.items;

                for (let i = 0; i < items.length; i++) {
                    // splitting the original content library document path into
                    // an array so that I can get the original folder path
                    let splitClDocPath = items[i].itemPath.split('');
                    let count = numberOfOccurences(splitClDocPath)
                    // count--;
                    let boolCount = 0;
                    let arrayOfOriginalClFolderPath = [];
                    // getting the original folder path
                    for (let index = 0; index < splitClDocPath.length; index++) {
                        if (splitClDocPath[index] === "/") {
                            boolCount++;
                        } else if (boolCount == count) {
                            arrayOfOriginalClFolderPath.push(splitClDocPath[index])
                        }
                    }
                    let itemName = arrayOfOriginalClFolderPath.join('')
                    await copyItem(items[i].itemPath, a_newPath, itemName)
                }

                // copy documents

                let documents = resultJSON.documents;

                for (let i = 0; i < documents.length; i++) {
                    // splitting the original content library document path into
                    // an array so that I can get the original folder path
                    let splitClDocPath = documents[i].documentPath.split('');
                    let count = numberOfOccurences(splitClDocPath)
                    // count--;
                    let boolCount = 0;
                    let arrayOfOriginalClFolderPath = [];
                    // getting the original folder path
                    for (let index = 0; index < splitClDocPath.length; index++) {
                        if (splitClDocPath[index] === "/") {
                            boolCount++;
                        } else if (boolCount == count) {
                            arrayOfOriginalClFolderPath.push(splitClDocPath[index])
                        }
                    }
                    let documentName = arrayOfOriginalClFolderPath.join('')
                    // takes the first item of array which is the name without extension
                    // replace the first part with the campaign name and add the extension part to end of the new document name
                    console.log("This is document name " + documentName)
                    // get the document name without extension
                    console.log("This is document array split")
                    documentName = documentName.split(".");
                    if (documentName[1] === "htm") {
                        console.log(documentName)
                        documentName = campaignHandler.nameOfCopiedCampaign + "." + documentName[1]
                    } else {
                        documentName = documentName.join(".")
                    }

                    // await copyDocument(documents[i].documentPath, a_newPath, documentName)
                    await createCopyOfClDoc(documents[i].documentPath, a_newPath, documentName)
                }

                // copy

            })
            .catch(error => console.log('error', error));
    }

    async function copyItem (a_itemPath, a_newPath, a_ItemName) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", authToken);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "itemPath": a_itemPath
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/clItems" + a_newPath + "/" + a_ItemName, requestOptions)
            .then(response => response.text())
            .then(result => {

            })
            .catch(error => console.log('error', error));
    }

    async function copyDocument (a_documentPath, a_newPath, a_DocumentName) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", authToken);
        myHeaders.append("Content-Type", "application/json");



        var raw = JSON.stringify({
            "documentPath": a_documentPath
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch(endPoint + "/rest/api/v1.3/clDocs" + a_newPath + "/" + a_DocumentName, requestOptions)
            .then(response => response.text())
            .then(result => {

            })
            .catch(error => console.log('error', error));
    }

    return {
        getAuth: getAuth,
        fetchCampaign: fetchCampaign,
        getAllFolders: getAllOtherFolders,
        copyCampaign: copyCampaign,
        fetchTheCopiedCampaign: fetchTheCopiedCampaign,
        createClLibFolder: createClLibFolder,
        createCopyOfClDoc: createCopyOfClDoc,
        setOgPath: setOgPath,
        listClFolders: listClFolders,
        listClFolderContent: listClFolderContent,
        copyItem: copyItem,
    }
}