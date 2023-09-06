export function createDOMHandler () {
    let body = document.getElementById("body");
    let folderSelect = document.getElementById("folders");
    let originalCampaignField = document.getElementById("original-campaign-field");
    let copiedCampaignField = document.getElementById("copied-campaign-field");
    let flexboxContainer = document.getElementById("flexbox-container");
    let rowContainer = document.getElementById("row-container");
    let folderPathLabel = document.getElementById("folder-path-label");

    // Enables all interactions on DOM
    function enableInteractions () {
        document.body.style.pointerEvents = 'auto';
        body.classList.remove("hide-all");
    }

    // Disables all interactions on DOM
    function disableInteractions () {
        document.body.style.pointerEvents = 'none';
        body.classList.add("hide-all");
    }

    // save content of original campaign and copied campaign input and also folder path label to storage

    function saveOriginalCampaignField () {
        return new Promise((resolve, reject) => {
            // save original campaign field
            chrome.storage.sync.set({ 'originalCampaignField': originalCampaignField.value }, function () {
                if (chrome.runtime.lastError) {
                    console.error('Error saving original campaign field:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log('Campaign field value is saved ' + originalCampaignField.value);
                    resolve();
                }
            });
        });
    }

    function saveCopiedCampaignField () {
        return new Promise((resolve, reject) => {
            // save copied campaign field
            chrome.storage.sync.set({ 'copiedCampaignField': copiedCampaignField.value }, function () {
                if (chrome.runtime.lastError) {
                    console.error('Error saving copied campaign field:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log('Copied campaign field value is saved ' + copiedCampaignField.value);
                    resolve();
                }
            });
        });
    }

    async function saveInputFieldData () {
        await saveOriginalCampaignField();
        await saveCopiedCampaignField();
    }

    function getOriginalCampaignField () {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get('originalCampaignField', function (data) {
                originalCampaignField.value = data.originalCampaignField;
                resolve();
            });
        })
    }

    function getCopiedCampaignField () {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get('copiedCampaignField', function (data) {
                copiedCampaignField.value = data.copiedCampaignField;
                resolve();
            });
        })
    }


    async function writeInputFieldData () {
        await getOriginalCampaignField();
        await getCopiedCampaignField();
    }

    return {
        folderSelect: folderSelect,
        originalCampaignField: originalCampaignField,
        copiedCampaignField: copiedCampaignField,
        body: body,
        flexboxContainer: flexboxContainer,
        rowContainer: rowContainer,
        folderPathLabel: folderPathLabel,
        enableInteractions: enableInteractions,
        disableInteractions: disableInteractions,
        saveInputFieldData: saveInputFieldData,
        writeInputFieldData: writeInputFieldData,
    }
}