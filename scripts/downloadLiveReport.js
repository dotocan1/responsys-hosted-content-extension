function downloadTableAsCSV(filename = 'liveReport.csv') {
    const table = document.querySelector('.table-color-gridline');
    let csvContent = '';

    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        let rowContent = '';

        for (let j = 0; j < row.cells.length; j++) {
            let cellText = row.cells[j].innerText.replace(/"/g, '""'); // Handle quotes
            rowContent += '"' + cellText + '"';
            if (j < row.cells.length - 1) rowContent += ',';
        }

        csvContent += rowContent + '\r\n';
    }

    // Create a Blob object and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

downloadTableAsCSV()