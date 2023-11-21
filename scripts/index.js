// Import modules for campaign handling, API handling, and DOM manipulation
import * as campaignHandlerModule from './CampaignModel.js';
import * as apiHandlerModule from './APIModel.js'
import * as domHandlerModule from './DOMModel.js'

// Create instances of the imported modules
const campaignHandler = campaignHandlerModule.createCampaignHandler();
const domHandler = domHandlerModule.createDOMHandler();
const apiHandler = apiHandlerModule.createAPIHandler(campaignHandler, domHandler);

// Event listeners
// Listener for the "blur" event on the original campaign field
domHandler.originalCampaignField.addEventListener("blur", async function () {

    // Disable user interactions
    domHandler.disableInteractions();

    if (domHandler.originalCampaignField.value === "") {
        domHandler.enableInteractions();
        return 0;
    }

    // Set the name of the original campaign based on the user input
    campaignHandler.nameOfOriginalCampaign = domHandler.originalCampaignField.value;

    // Attempt to authenticate with the API
    let authSuccess = await apiHandler.getAuth();

    // If authentication fails, re-enable interactions and exit
    if (authSuccess == false) {
        domHandler.enableInteractions();
        return 0;
    }


    // Fetch campaign data
    let fetchSuccess = await apiHandler.fetchCampaign();

    // If fetching the campaign fails, re-enable interactions and exit
    if (fetchSuccess == false) {
        domHandler.enableInteractions();
        return 0;
    }

    // Clear out existing options in the folder select dropdown
    domHandler.folderSelect.innerHTML = '';

    // Fetch all folders
    await apiHandler.getAllFolders();

    // Get the first option in the folder select dropdown
    let firstOption = domHandler.folderSelect.querySelector('option:first-child');

    // Hide the first option if it's visible
    if (!firstOption.hidden) {
        firstOption.hidden = true;
    }
})

// domHandler.copiedCampaignField.addEventListener('click', () => domHandler.resetInputFieldData())
domHandler.originalCampaignField.addEventListener('click', () => domHandler.resetInputFieldData())

// Main function to copy a campaign
export async function main () {
    // Set the name of the copied campaign based on user input
    campaignHandler.nameOfCopiedCampaign = domHandler.copiedCampaignField.value;

    // Disable user interactions
    domHandler.disableInteractions();

    // Execute various API calls to copy the campaign and related tasks
    await apiHandler.copyCampaign();
    await apiHandler.fetchTheCopiedCampaign();
    await apiHandler.createClLibFolder(campaignHandler.copiedClFolderPath);
    await apiHandler.createCopyOfClDoc(campaignHandler.originalClDocPath, campaignHandler.copiedClDocPath);
    await apiHandler.setOgPath();

    // save data to input fields

    await domHandler.saveInputFieldData();

    // Re-enable user interactions
    domHandler.enableInteractions();

    
}
