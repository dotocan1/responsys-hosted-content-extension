function removeDisabledAttributes () {
    if (window.location.href == DESIRED_URL) {
        elements = [];

        document.querySelectorAll('iframe').forEach(item => {
            const fileElement = item.contentWindow.document.body.querySelectorAll('[name^="file_"]');
            fileElement.forEach((element) => {
                elements.push(element);
            })
        });

        elements.forEach(element => {
            if (element.hasAttribute('disabled')) {
                element.removeAttribute('disabled');
            }
        });
        console.log(elements)
    }
}

console.log('script has been implemented')
let elements = [];
const DESIRED_URL = "https://interact.rsys8.net/interact/jsp/jindex.jsp";
// Listen for DOMContentLoaded event to run the code when the page is loaded

document.querySelectorAll('iframe').forEach(item => {
    const fileElement = item.contentWindow.document.body.querySelectorAll('form');
    fileElement.forEach((element) => {
        element.addEventListener('mousemove', removeDisabledAttributes);
    })
});



