console.log('Content script loaded.');

// Your code here, which will run each time a webpage is loaded
let filesInput;

function setfilesInput () {

    try {
        document.querySelectorAll('iframe').forEach(item => {
            filesInput = item.contentWindow.document.getElementById('first_file_element');
            filesInput.setAttribute('multiple', true);
            // success
        });
    } catch (error) {
        // console.log(error);
    }
}

function loopMultiple (delay) {
    let count = 0;

    function iteration () {
        // console.log("Iteration:", count + 1);

        // Increment the count
        count++;

        // Check if we have reached the desired number of iterations
        if (filesInput === null || filesInput === undefined) {
            try {
                setfilesInput();
            } catch (error) {
                //  console.log(error)
            }
            // Schedule the next iteration with the specified delay
            setTimeout(iteration, delay);
        } else {
            console.log(filesInput)
        }
    }

    // Start the first iteration
    iteration();
}

// Example: Run the loop 5 times with a delay of 2 seconds (2000 milliseconds)
loopMultiple(500);



let editButtonEx;

function setEditButtonEx () {
    editButtonEx = document.querySelector('.uif-contentwidget-editPencilNew-white');
    editButtonEx.addEventListener('click', () => {
        setTimeout(() => {
            let wd = document.querySelector('.uif-redwood-window-2g');
            wd.style.top = "0px";
            wd.style.left = "0px";

            // testing out resizing
            wd.style.height = "1000px"

        }, 500);
    });
}

function loopEditButton (delay) {
    let count = 0;

    function iteration () {
        // console.log("Iteration:", count + 1);

        // Increment the count
        count++;

        // Check if we have reached the desired number of iterations
        if (editButtonEx === null || editButtonEx === undefined) {
            try {
                setEditButtonEx();
            } catch (error) {
                //  console.log(error)
            }
            // Schedule the next iteration with the specified delay
            setTimeout(iteration, delay);
        } else {
            // console.log(editButtonEx)
        }
    }

    // Start the first iteration
    iteration();
}

// Example: Run the loop 5 times with a delay of 2 seconds (2000 milliseconds)
loopEditButton(1000);
