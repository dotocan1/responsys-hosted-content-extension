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

    // FIXME: This needs to be changedso that it copies every document
    async function createCopyOfClDoc (oldPath, newPath) {
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

        return fetch(endPoint + "/rest/api/v1.3/clDocs" + newPath, requestOptions)
            .then(response => response.text())
            .then(result => {

                // FIXME: Put this somewhere else on the end
                alert("Campaign has been copied!\nNew folder path is:\n" + campaignHandler.copiedClFolderPath);
                domHandler.folderPathLabel.textContent = `New folder path is: ${campaignHandler.copiedClFolderPath}`;
                window.scrollBy(0, 100);

            })
            .catch(error => console.log('error', error));

    }

    //  FIXME: All new code for copying the images, make it  cleaner

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
                if (folders.length == 0) {
                    console.log(`No folders found!`)
                } else {
                    for (const folder of folders) {

                        // splitting the original content library document path into
                        // an array so that I can get the original folder path
                        let splitClDocPath = folder.folderPath.split('');
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
                        let folderName = arrayOfOriginalClFolderPath.join('')

                        console.log(`This is the folder name:  ${folderName}`)
                        console.log("This is the path: " + extractPath(folder.links[0].href));
                        let folderPath = extractPath(folder.links[0].href)
                        // FIXME: Only creates the subfolder but not a sub subfolder, should
                        // create a recursive function here
                        // await createClLibFolder(campaignHandler.copiedClFolderPath + "/" + folderName)
                        // FIXME: Only lists the subfolder but not a sub subfolder
                        //await listClFolderContent(campaignHandler.ogPath + "/" + folderName, folderName)
                        await listClFolders(folderPath)
                    }
                }

            })
            .catch(error => console.log('error', error));

    }

    async function listClFolderContent (a_path, a_folderName) {
        return new Promise((resolve, reject) => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", authToken);

            // TODO: REMOVE THIS
            // a_path = campaignHandler.ogPath + "/images";
            let a_newPath = campaignHandler.copiedClFolderPath + "/" + a_folderName;

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(endPoint + "/rest/api/v1.3/clFolders" + a_path, requestOptions)
                .then(response => response.text())
                .then(result => {
                    let resultJSON;
                    resultJSON = JSON.parse(result);

                    let items = resultJSON.items;
                    items.forEach(async (item) => {

                        // TODO: For every item, copy to new folder

                        // splitting the original content library document path into
                        // an array so that I can get the original folder path
                        let splitClDocPath = item.itemPath.split('');
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
                        await copyItem(item.itemPath, a_newPath, itemName)
                    })
                })
                .catch(error => console.log('error', error));
            resolve();
        })
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