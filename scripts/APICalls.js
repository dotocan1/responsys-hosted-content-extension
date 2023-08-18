
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


// koristenje API-a od Responsysa

let authToken;
let endPoint;
let originalCampFieldTxt = document.getElementById("original-campaign-field");
let copiedCampFieldTxt = document.getElementById("copied-campaign-field");

let nameOfOriginalCampaign = "2023_ma_generalni_mail_redone"
let originalClDocPath;
let originalClFolderPath = "/contentlibrary/dominik_o/2023_ma_generalni_mail_redone";
let folderName = "dominik_o"
let nameOfCopiedCampaign = "2023_ma_api_test_prvi_danas";
let copiedClFolderPath = "/contentlibrary/dominik_o/2023_ma_api_test_prvi_danas";
let copiedClDocPath = "/contentlibrary/dominik_o/2023_ma_api_test_prvi_danas/2023_ma_api_test_prvi_danas.htm";
let resultJSON;
let originalFolders;

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
            resultJSON = JSON.parse(result);
            authToken = resultJSON.authToken;
            endPoint = resultJSON.endPoint;
        })
        .catch(error => console.log('error', error));
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

            originalClDocPath = resultJSON.htmlMessagePath;

            originalClDocPath = resultJSON.htmlMessagePath;

            // splitting the original content library document path into
            // an array so that I can get the original folder path
            let splitClDocPath = originalClDocPath.split('');

            let count = numberOfOccurences(splitClDocPath)

            boolCount = 0;
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
        .catch(error => console.log('error', error));
}

async function copyCampaign () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "newCampaignName": nameOfCopiedCampaign,
        "description": "",
        "folderName": folderName
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/campaigns/2023_ma_generalni_mail_redone/actions/copy", requestOptions)
        .then(response => response.text())
        .then(result => {
            copiedClFolderPath = "/contentlibrary/dominik_o/" + nameOfCopiedCampaign;
            copiedClDocPath = "/contentlibrary/dominik_o/" + nameOfCopiedCampaign + "/" + nameOfCopiedCampaign + ".htm";
            console.log(copiedClFolderPath)
            console.log(copiedClDocPath)
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
            console.log(resultJSON);
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

async function createCopyOfClDoc () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "documentPath": originalClDocPath
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/clDocs" + copiedClDocPath, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function listContentsClFolder () {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch(endPoint + "/rest/api/v1.3/clFolders" + originalClFolderPath, requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            resultJSON = JSON.parse(result);
            console.log(resultJSON);
            originalFolders = resultJSON.folders;
            console.log(originalFolders)
        })
        .catch(error => console.log('error', error));
}

async function copyFoldersAndFilesOriginalCamp () {
    try {
        await Promise.all(originalFolders.map(async folder => {
            console.log(folder.folderPath)
            let folderForCopy = folder.folderPath;
            let count = numberOfOccurences(folderForCopy)
            let splitfolderForCopy = folderForCopy.split('');
            let array = [];
            let boolCount = 0;
            for (let index = 0; index < splitfolderForCopy.length; index++) {
                if (boolCount == count) {
                    array.push(splitfolderForCopy[index])
                } else if (splitfolderForCopy[index] === "/") {
                    boolCount++;
                }
            }
            let subdirectory = array.join('');
            console.log(subdirectory)
            await createClLibFolder(copiedClFolderPath + '/' + subdirectory)
        }))
        return 'Successful copy of all folders!'

    }
    catch (error) {
        throw error;
    }


}

export async function main () {
    await getAuth(); // Wait for getAuth to complete
    //getAccountInfo();
    await fetchCampaign();
    await copyCampaign();
    await fetchTheCopiedCampaign();
    await createClLibFolder(copiedClFolderPath);
    await createCopyOfClDoc();
    await listContentsClFolder();
    await copyFoldersAndFilesOriginalCamp();
}

