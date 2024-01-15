let columnName = "CUSTOMER_ID";

// get table
let table = document.querySelector('.table-color-gridline')
let rows = table.rows
// Convert rows from a HTML document to a Javascript array
rows = Array.from(rows)
// create an array which will hold all the data
let cellsData = [];
// array loop all rows
let cellIndex = 0;

for (let i = 0; i < rows.length; i++) {
    cells = rows[i].cells;
    // loop cells to get the cell index where email is
    for (let j = 0; j < cells.length; j++) {
        if (cells[j].innerHTML === columnName + "&nbsp;") {
            cellIndex = j;
            break;
        }
    }
}

console.log("Cell index is = " + cellIndex);

for (let i = 0; i < rows.length; i++) {
    // specify which cell you want to select
    let specificCell = rows[i].cells[cellIndex]
    // if the cell value is the column name, skip one loop
    if (specificCell.innerHTML === columnName + "&nbsp;") {
        continue;
    }
    // save the cell data into the array
    cellsData.push(specificCell.innerHTML);
}
console.log(cellsData)

function downloadArrayAsCSV (array, filename, header) {

    array.unshift(header);

    // Step 1: Convert Array to CSV
    const csvString = array.join('\n');

    // Step 2: Create Blob
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Step 3: Create Blob URL
    const url = URL.createObjectURL(blob);

    // Step 4: Create Download Link
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    // Step 5: Trigger Download
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Step 6: Clean Up
    URL.revokeObjectURL(url);
}

downloadArrayAsCSV(cellsData, columnName + "_list.csv", columnName);
