import * as campaignHandlerModule from './CampaignModel.js';
import * as apiHandlerModule from './APIModel.js'
import * as domHandlerModule from './DOMModel.js'

const campaignHandler = campaignHandlerModule.createCampaignHandler();
const domHandler = domHandlerModule.createDOMHandler();

const apiHandler = apiHandlerModule.createAPIHandler(campaignHandler, domHandler);
// event listeners
domHandler.originalCampaignField.addEventListener("blur", async function () {
    domHandler.disableInteractions();
    campaignHandler.nameOfOriginalCampaign = domHandler.originalCampaignField.value;
    let authSuccess = await apiHandler.getAuth(); // Wait for getAuth to complete

    if (!authSuccess) {
        domHandler.enableInteractions();
        return 0;
    }
    let fetchSuccess = await apiHandler.fetchCampaign();

    if (!fetchSuccessF) {
        domHandler.enableInteractions();
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
    console.log(campaignHandler.nameOfCopiedCampaign);
    domHandler.disableInteractions();

    await apiHandler.copyCampaign();
    await apiHandler.fetchTheCopiedCampaign();
    await apiHandler.createClLibFolder(campaignHandler.copiedClFolderPath);
    await apiHandler.createCopyOfClDoc(campaignHandler.originalClDocPath, campaignHandler.copiedClDocPath);
    domHandler.enableInteractions();
}

