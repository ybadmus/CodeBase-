var ExcelWorkbookExts = ["xls", "xlsx", "csv"],
    ExcelWorkbook = {},
    EnglishAlphabets = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];


var GetExcelAttachmentFile = (file) => {

    // Reset ExcelWookbook
    ExcelWorkbook = {};
    ExcelWorkbook.Size = file.size;
    ExcelWorkbook.Type = file.type;
    ExcelWorkbook.Ext = file.name.split('.').pop();
    ExcelWorkbook.Name = file.name.substring(0, file.name.lastIndexOf("."));

    // Initialize file reader
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        var excelSheets = [];
        workbook.SheetNames.forEach((sheetName) => {
            var xdt = workbook.Sheets[sheetName];

            var xData = Object.keys(xdt).map((key) => {
                return [key, xdt[key].v];
            });

            var xCells = [], xRows = [], xColums = [], vCells = {};
            for (let x = 0; x < xData.length; x++) {
                if (xData[x][1]) {

                    let row = xData[x][0].replace(/[^\d.]/g, '');
                    xRows.push(row);

                    let col = xData[x][0].replace(row, '');
                    xColums.push(col);
                    vCells[`${xData[x][0]}`] = xData[x][1];

                    xCells.push({
                        Row: row,
                        Column: col,
                        Cell: xData[x][0],
                        Value: xData[x][1],
                    });
                }
            };

            excelSheets.push({
                Data: xCells,
                Cells: vCells,
                Name: sheetName,
                First: xCells[0],
                Last: xCells[xCells.length - 1],
                Rows: xRows.filter((v, i, a) => a.indexOf(v) === i),
                Columns: xColums.filter((v, i, a) => a.indexOf(v) === i)
            });
        })

        // Add to Sheets
        ExcelWorkbook.Sheets = excelSheets;

    };

    // Read Excel as Array Buffer
    reader.readAsArrayBuffer(file);
}
