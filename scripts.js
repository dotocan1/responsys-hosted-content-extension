function testFunc(){
    console.log("Buttons works")
}

const btnUpdate = document.querySelector('#btnUpdate');
const btnPublish = document.querySelector('#btnPublish');

btnUpdate.addEventListener('click', testFunc)
btnPublish.addEventListener('click', testFunc)