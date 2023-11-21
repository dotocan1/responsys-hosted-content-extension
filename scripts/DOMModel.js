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
                    
                    resolve();
                }
            });
        });
    }

    function saveFolderPathLabel () {
        new Promise((resolve, reject) => {
            // save folder path label
            chrome.storage.sync.set({ 'folderPathLabel': folderPathLabel.innerHTML }, function () {
                if (chrome.runtime.lastError) {
                    console.error('Error saving copied campaign field:', chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    
                    resolve();
                }
            });
        })
    }

    async function saveInputFieldData () {
        
        await saveOriginalCampaignField();
        await saveCopiedCampaignField();
        await saveFolderPathLabel();
    }

    function getOriginalCampaignField () {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get('originalCampaignField', function (data) {
                if (typeof data.originalCampaignField === "undefined") {
                    data.originalCampaignField = "";
                }
                originalCampaignField.value = data.originalCampaignField;
                resolve();
            });
        })
    }

    function getCopiedCampaignField () {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get('copiedCampaignField', function (data) {
                if (typeof data.copiedCampaignField === "undefined") {
                    data.copiedCampaignField = "";
                }
                copiedCampaignField.value = data.copiedCampaignField;
                resolve();
            });
        })
    }

    function getFolderPathLabel () {
        new Promise((resolve, reject) => {
            chrome.storage.sync.get('folderPathLabel', function (data) {
                if (typeof data.folderPathLabel === "undefined") {
                    data.folderPathLabel = "";
                }
                folderPathLabel.innerHTML = data.folderPathLabel;
                resolve();
            });
        })
    }


    async function writeInputFieldData () {
        await getOriginalCampaignField();
        await getCopiedCampaignField();
        await getFolderPathLabel();
    }

    function resetInputFieldData () {
        originalCampaignField.value = "";
        copiedCampaignField.value = "";
        folderPathLabel.textContent = "";
        saveInputFieldData();
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
        resetInputFieldData: resetInputFieldData,
    }
}