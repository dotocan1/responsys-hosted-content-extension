// worker.js
function doSomething() {
    postMessage('Worker is doing something.');
    setTimeout(doSomething, 1000);
}

doSomething();
