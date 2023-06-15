let arrayOfPictures = [];
let arrayOfLinks = [];
let btnUpload;
let divElement;

try {
    // this selects the upload button
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.body.querySelector('input[value="Upload"]').value == "Upload") {
            btnUpload = item.contentWindow.document.body.querySelector('input[value="Upload"]');
        }
    }
    )
}

catch (error) {
    console.error('An error occurred:', error);
}

try {
    // this selects the files list
    document.querySelectorAll('iframe').forEach(item => {
        if (item.contentWindow.document.body.querySelector('#files_list').id == "files_list") {
            divElement = item.contentWindow.document.body.querySelector('#files_list');
        }
    }
    )
}

catch (error) {
    console.error('An error occurred:', error);
}

const children = divElement.children;

try {
    // when uploading, save the file names to an array
    for (let i = 0; i < children.length; i++) {
        let childText = children[i].textContent + "_np";
        replacedChildText = childText.replace(/ /g, '%20');
        arrayOfPictures.push(replacedChildText);
    }

    for (let i = 0; i < children.length; i++) {
        let childText = children[i].textContent + "\nhttps://static.cdn.responsys.net/i8/responsysimages/content/valamarri/" + children[i].textContent;
        replacedChildText = childText.replace(/ /g, '%2520');
        arrayOfLinks.push(replacedChildText);
    }

    localStorage.removeItem('savedArray');
    localStorage.removeItem('LinksArray');
    localStorage.setItem('savedArray', JSON.stringify(arrayOfPictures));
    localStorage.setItem('linksArray', JSON.stringify(arrayOfLinks));
}

catch (error) {
    console.error('An error occurred:', error);
}


btnUpload.click();