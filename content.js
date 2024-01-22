// console.log('script implemented');
// let editButtonEx;
// try {
//     editButtonEx = document.querySelector('.uif-contentwidget-editPencilNew-white');
// } catch (error) {
//     console.log(error)
// }
// console.log("editButtonEx Selected")
// console.log(editButtonEx)
// editButtonEx.addEventListener('click', () => {
//     setTimeout(() => {
//         let wd = document.querySelector('.uif-redwood-window-2g');
//         wd.style.top = "0px";
//         wd.style.left = "0px";
//     }, 5000); // 5000 milliseconds = 5 seconds
// });

// function myFunction () {
//     console.log("This will be executed every 1000 milliseconds (1 second).");
//     let filesInput;
//     try {
//         document.querySelectorAll('iframe').forEach(item => {
//             filesInput = item.contentWindow.document.getElementById('first_file_element');
//             filesInput.setAttribute('multiple', true);
//             // success
//         });
//     } catch (error) {
//         // console.log(error);
//     }
// }

// myFunction();

console.log('Content script loaded.');
// Your code here, which will run each time a webpage is loaded

setTimeout(main, 1000);

function main () {
    let editButtonEx = document.querySelector('.uif-contentwidget-editPencilNew-white');;
    console.log("editButtonEx Selected")
    console.log(editButtonEx)
    editButtonEx.addEventListener('click', () => {
        setTimeout(() => {
            let wd = document.querySelector('.uif-redwood-window-2g');
            wd.style.top = "0px";
            wd.style.left = "0px";
        }, 1000);
    });
}