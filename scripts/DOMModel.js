export function createDOMHandler () {
    let body = document.getElementById("body");
    let folderSelect = document.getElementById("folders");
    let originalCampaignField = document.getElementById("original-campaign-field");
    let copiedCampaignField = document.getElementById("copied-campaign-field");
    let flexboxContainer = document.getElementById("flexbox-container");

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

    return {
        folderSelect: folderSelect,
        originalCampaignField: originalCampaignField,
        copiedCampaignField: copiedCampaignField,
        body: body,
        flexboxContainer: flexboxContainer,
        enableInteractions: enableInteractions,
        disableInteractions: disableInteractions,
    }
}