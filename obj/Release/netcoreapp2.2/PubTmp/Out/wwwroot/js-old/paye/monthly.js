var TaxPayerData = {},
    YearOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    DataType = { Double: "D", String: "S", Number: "N", Float: "F" },
    InputType = { User: "U", System: "S" },
    PAYEYears = [],
    PAYEYear = {},
    PAYEMonths = [
        { Id: 1, Code: "Jan", Name: "January", Days: 31, Leap: 31 },
        { Id: 2, Code: "Feb", Name: "February", Days: 28, Leap: 29 },
        { Id: 3, Code: "Mar", Name: "March", Days: 31, Leap: 31 },
        { Id: 4, Code: "Apr", Name: "April", Days: 30, Leap: 30 },
        { Id: 5, Code: "May", Name: "May", Days: 31, Leap: 31 },
        { Id: 6, Code: "Jun", Name: "June", Days: 30, Leap: 30 },
        { Id: 7, Code: "Jul", Name: "July", Days: 31, Leap: 31 },
        { Id: 8, Code: "Aug", Name: "August", Days: 31, Leap: 31 },
        { Id: 9, Code: "Sep", Name: "September", Days: 30, Leap: 30 },
        { Id: 10, Code: "Oct", Name: "October", Days: 31, Leap: 31 },
        { Id: 11, Code: "Nov", Name: "November", Days: 30, Leap: 30 },
        { Id: 12, Code: "Dec", Name: "December", Days: 31, Leap: 31 }
    ],
    PAYEMonth = {},
    FromPeriod,
    ToPeriod,
    TabList = [
        { Id: 0, TabId: "PAYEGeneral-tab", ContentId: "PAYEGeneral" },
        { Id: 1, TabId: "PAYEEmployees-tab", ContentId: "PAYEEmployees" }
    ],
    CurrentTabId = 0,
    EmployeePositions = [
        { Id: 0, Code: "JUNR", Name: "Junior" },
        { Id: 1, Code: "SENR", Name: "Senior" },
        { Id: 2, Code: "MNGT", Name: "Management" },
        { Id: 3, Code: "EXPT", Name: "Expatriate" },
        { Id: 4, Code: "OTHR", Name: "Other" },
    ],
    EmployeePosition = {},
    AddDeduction = {},
    EmployeeDeductions = [], // from API
    EmployeeDeduction = {}, // from API
    EmployeeDeductionsN = [], // new records (eg: import from excel)
    EmployeeDeductionsE = [],
    EmployeeDeductionN = {}, // new record (manual input)
    EmployeeDashboard = {},
    ResidencyTypes = [],
    EmployeeExcelSheet = {},
    EmployeeExcelFields = [
        { Name: "EmployeeTIN", Label: "TIN", Width: 120, Type: DataType.String, Input: InputType.User },
        { Name: "EmployeeName", Label: "Employee Name", Width: 200, Type: DataType.String, Input: InputType.User },
        // { Name: "EmployeePhone", Label: "Phone Number", Width: 120, Type: DataType.String, Input: InputType.System },
        // { Name: "EmployeeEmail", Label: "Email Address", Width: 180, Type: DataType.String, Input: InputType.System },
        { Name: "EmployeePosition", Label: "Posistion", Width: 140, Type: DataType.String, Input: InputType.User },
        { Name: "SerialNumber", Label: "Serial Number", Width: 120, Type: DataType.String, Input: InputType.User },
        { Name: "EmployeeResidential", Label: "Residential", Width: 140, Type: DataType.String, Input: InputType.User },
        { Name: "BasicSalary", Label: "Basic Salary", Width: 120, Type: DataType.Double, Input: InputType.User },
        { Name: "CashAllowances", Label: "Cash Allowances", Width: 140, Type: DataType.Double, Input: InputType.User },
        { Name: "BonusIncome", Label: "Bonus Income", Width: 120, Type: DataType.Double, Input: InputType.User },
        { Name: "OvertimeIncome", Label: "Overtime Income", Width: 140, Type: DataType.Double, Input: InputType.User },
        { Name: "SecondaryEmployment", Label: "Secondary Employment", Width: 180, Type: DataType.Double, Input: InputType.User },
        { Name: "NonCashBenefit", Label: "Non Cash Benefit", Width: 160, Type: DataType.Double, Input: InputType.User },
        { Name: "AccommodationElement", Label: "Accommodation Element", Width: 180, Type: DataType.Double, Input: InputType.System },
        { Name: "VehicleElement", Label: "Vehicle Element", Width: 140, Type: DataType.Double, Input: InputType.System },
        { Name: "DeductibleReliefs", Label: "Deductible Reliefs", Width: 140, Type: DataType.Double, Input: InputType.System },
        { Name: "TotalReliefs", Label: "Total Reliefs", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "SocialSecurity", Label: "Social Security", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "ApprovedTrustee", Label: "Approved Trustee", Width: 140, Type: DataType.Double, Input: InputType.System },
        { Name: "ProvidentRate", Label: "Third Tier Pension", Width: 160, Type: DataType.Double, Input: InputType.User },
        { Name: "ProvidentFund", Label: "Provident Fund", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "FinalTaxOnBonus", Label: "Final Tax On Bonus", Width: 160, Type: DataType.Double, Input: InputType.System },
        { Name: "ExcessBonus", Label: "Excess Bonus", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "TotalCashEmolument", Label: "Total Cash Emolument", Width: 180, Type: DataType.Double, Input: InputType.System },
        { Name: "TotalAssessableIncome", Label: "Total Assessable Income", Width: 180, Type: DataType.Double, Input: InputType.System },
        { Name: "ChargeableIncome", Label: "Chargeable Income", Width: 140, Type: DataType.Double, Input: InputType.System },
        { Name: "SeverancePayPaid", Label: "Severance Pay Paid", Width: 180, Type: DataType.Double, Input: InputType.User },
        { Name: "TaxDeductible", Label: "Tax Deductible", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "OvertimeTax", Label: "Overtime Tax", Width: 120, Type: DataType.Double, Input: InputType.System },
        { Name: "TaxPayable", Label: "Tax Payable", Width: 120, Type: DataType.Double, Input: InputType.System }
    ],
    EmployeeExcelColumns = {},
    EmployeeExcelRows = [],
    ExcelWorkbook = {},
    GridTableHeight = 290;

$(document).ready(() => {
    // GetTaxPayerData();
    GetPAYEYears();
    
    // Get Residency Types
    GetResidencyTypes();
});


var GetResidencyTypes = () => {
    var dataModel = {
        CodeType: "RES",
    };
    var postData = JSON.stringify(dataModel);
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, (data, status) => {
        // console.log({ data });

        if (data.body && data.body.length > 0) {
            ResidencyTypes = [];
            for (let i = 0; i < data.body.length; i++) {
                ResidencyTypes.push({
                    Id: data.body[i].id,
                    Description: data.body[i].description
                });
            }
        }
    }).fail((res) => {
    });
}


var GetPAYEYears = () => {
    let eY = Number(new Date().getFullYear());
    let bY = eY - 20;

    for (let y = eY; y > bY; y--) {
        PAYEYear = { Id: y, Name: y, IsLeapYear: IsLeapYear(y) };
        PAYEYears.push(PAYEYear);
    }
    SetPAYEYears();
}

var IsLeapYear = (year) => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

var FindItem = (items, id) => $.grep(items, (item) => item.Id === Number(id))[0];

var SetPAYEYears = () => {
    var yOpts = "<option>Choose one</option>";
    for (let x = 0; x < PAYEYears.length; x++) {
        yOpts += `<option value="${PAYEYears[x].Id}">${PAYEYears[x].Name}</option>`;
    }
    $("#PAYEYears").html(yOpts);
}

var GetTaxPayerData = function () {

    var dataModel = {
        TIN: nameTIN.TIN
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, (data, status) => {
        // console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {
            // Keep object for future use.
            TaxPayerData = data.body;

        }
    }).fail((response) => {
        //console.log('Response Error: ' + response.responseText);
    });
}

var SetPAYEMonths = () => {
    let ys = $("#PAYEYears").val();
    if (Number(ys) >= 1990) {
        var mOpts = "<option>Choose one</option>";
        for (let x = 0; x < PAYEMonths.length; x++) {
            mOpts += `<option value="${PAYEMonths[x].Id}">${PAYEMonths[x].Name}</option>`;
        }
        $("#PAYEMonths").html(mOpts);
        $("#FromPeriod").html("");
        $("#ToPeriod").html("");
        $("#YearPeriod").prop("hidden", true);
    } else {
        toastr.info("Please select a valid year.");
        ResetPeriod();
    }
}

var SetPAYEPeriods = () => {
    let ys = $("#PAYEYears").val();
    PAYEYear = FindItem(PAYEYears, ys);
    
    let ms = $("#PAYEMonths").val();
    PAYEMonth = FindItem(PAYEMonths, ms);
    
    if (Number(ms) > 0) {
        FromPeriod = new Date(`${PAYEYear.Name}-${PAYEMonth.Id}-01`);
        let len = PAYEYear.IsLeapYear ? PAYEMonth.Leap : PAYEMonth.Days
        ToPeriod = new Date(`${PAYEYear.Name}-${PAYEMonth.Id}-${len}`);
        $("#FromPeriod").html(FromPeriod.toLocaleDateString("en-US", YearOptions));
        $("#ToPeriod").html(ToPeriod.toLocaleDateString("en-US", YearOptions));
        // Control Views
        $("#btnResetPeriod").prop("hidden", false);
        $("#YearPeriod").prop("hidden", false);
        // Check for Already Submission
        GetPAYERecordsByPeriod();
        GetEmployeeDeductions();
    } else {
        toastr.info("Please select a valid year.");
        ResetPeriod();
    }
}

var ResetPeriod = () => {
    // Reset Options
    $("#FromPeriod").html("");
    $("#ToPeriod").html("");
    $("#YearPeriod").prop("hidden", true);
    $("#PAYETabs").prop("hidden", true);
    $("#PageDataBody").prop("hidden", true);
    $("#btnResetPeriod").prop("hidden", true);
    SetPAYEYears();
}

var GetPAYERecordsByPeriod = () => {
    $("#PAYETabs").prop("hidden", false);
    $("#PageDataBody").prop("hidden", false);
    ActivateTab();
}

var GetEmployeeDeductions = () => {
    // Show Preloader
    $('body').showLoading();

    /*
    var dataModel = {
        TaxYear: PAYEYear.Name,
        TaxMonth: PAYEMonth.Id,
        TaxPayerId: nameTIN.Id
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetPAYERecordsByPeriod`;
    $.post(postUrl, postData, function (data, status) {
        // console.log('GetPTRApplicationsByYear Data: ', data);

        // Empty list
        EmployeeDeductions = [];

        // Display on view
        if (data.status === "Successful" && data.body) {
            // Keep object for future use.
            for (var i = 0; i < data.body.length; i++) {
                EmployeeDeductions.push({
                    // SystemId
                    Id: data.body[i].id,
                    // Employee
                    EmployeeTIN: data.body[i].id,
                    EmployeeName: data.body[i].id,
                    EmployeePhone: data.body[i].id,
                    EmployeeEmail: data.body[i].id,
                    EmployeePosition: data.body[i].id,
                    SerialNumber: data.body[i].id,
                    EmployeeResidential: data.body[i].id,
                    // Income
                    BasicSalary: data.body[i].id,
                    CashAllowances: data.body[i].id,
                    BonusIncome: data.body[i].id,
                    OvertimeIncome: data.body[i].id,
                    SecondaryEmployment: data.body[i].id,
                    NonCashBenefit: data.body[i].id,
                    AccommodationElement: data.body[i].id,
                    VehicleElement: data.body[i].id,
                    DeductibleReliefs: data.body[i].id,
                    TotalReliefs: data.body[i].id,
                    // Tax
                    SocialSecurity: data.body[i].id,
                    ApprovedTrustee: data.body[i].id,
                    ProvidentRate: data.body[i].id,
                    ProvidentFund: data.body[i].id,
                    FinalTaxOnBonus: data.body[i].id,
                    ExcessBonus: data.body[i].id,
                    TotalCashEmolument: data.body[i].id,
                    TotalAssessableIncome: data.body[i].id,
                    ChargeableIncome: data.body[i].id,
                    SeverancePayPaid: data.body[i].id,
                    TaxDeductible: data.body[i].id,
                    OvertimeTax: data.body[i].id,
                    TaxPayable: data.body[i].id,
                    // SystemDate
                    Date: data.body[i].submittedDate
                });
            }
        }
        GetEmployeeDashboard();

        // Hide Preloader
        $('body').hideLoading();
    }).fail(function (res) {
        // Hide Preloader
        $('body').hideLoading();
    });
    */

    // ===== DELETE AFTER API CALL ====== /
    for (var i = 0; i < 57; i++) {
        let x = 1 + i;
        EmployeeDeductions.push({
            // Employee
            EmployeeTIN: nameTIN.TIN,
            EmployeeName: nameTIN.Name,
            EmployeePhone: "N/A",
            EmployeeEmail: "N/A",
            EmployeePosition: "N/A",
            SerialNumber: "N/A",
            EmployeeResidential: "N/A",
            // Income
            BasicSalary: 100 * x,
            CashAllowances: 100 * x,
            BonusIncome: 100 * x,
            OvertimeIncome: 100 * x,
            SecondaryEmployment: 100 * x,
            NonCashBenefit: 100 * x,
            AccommodationElement: 100 * x,
            VehicleElement: 100 * x,
            DeductibleReliefs: 100 * x,
            TotalReliefs: 100 * x,
            // Tax
            SocialSecurity: 100 * x,
            ApprovedTrustee: 100 * x,
            ProvidentRate: 100 * x,
            ProvidentFund: 100 * x,
            FinalTaxOnBonus: 100 * x,
            ExcessBonus: 100 * x,
            TotalCashEmolument: 100 * x,
            TotalAssessableIncome: 100 * x,
            ChargeableIncome: 100 * x,
            SeverancePayPaid: 100 * x,
            TaxDeductible: 100 * x,
            OvertimeTax: 100 * x,
            TaxPayable: 100 * x
        });
    }
    GetEmployeeDashboard();

    // Hide Preloader
    $('body').hideLoading();
    // ===== DELETE AFTER API CALL ====== /
}

var BrowseExcelFile = () => {
    // Open File Browser
    $("#ImportFromExcel").trigger("click");
}

var ImportFromExcel = (el) => {
    // Show Preloader
    $('body').showLoading();

    // Read Excel Wookbook
    GetExcelAttachmentFile(el.files[0]);
    setTimeout(() => {
        ProcessExcelFile();
        // Hide Preloader
        $('body').hideLoading();
    }, 600); // 0.6 Seconds delay
}

// Read From Excel File
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

var ProcessExcelFile = () => {
    //console.log({ ExcelWorkbook });

    // Book Name
    $("#ExcelBookName").val(ExcelWorkbook.Name);
    $("#BrowseExcelFile").text("[1] Excel File Selected");

    // Sheet Names
    var sOpts = `<option value="">Choose one</option>`;
    for (let x = 0; x < ExcelWorkbook.Sheets.length; x++) {
        sOpts += `<option value="${x}">${ExcelWorkbook.Sheets[x].Name}</option>`;
    }
    $("#ExcelSheetName").html(sOpts);

    // Reset Rows
    $("#ExcelHeaderRow, #ExcelStartRow, #ExcelEndRow").html(`<option value="">Choose one</option>`);

    // Reset Columns
    for (let k = 0; k < EmployeeExcelFields.length; k++) {
        $(`#${EmployeeExcelFields[k].Name}`).html(`<option value="">Choose one</option>`);
    }

    // Disable Load Employees Data
    $("#LoadExcelEmployees, #ExcelStartRow, #ExcelEndRow").prop("disabled", true);
    
}

var GetExcelSheetName = () => {
    let sheet = $("#ExcelSheetName").val();

    if (sheet) {
        //Excel Sheet
        EmployeeExcelSheet = ExcelWorkbook.Sheets[parseInt(sheet)];

        // Excel Cell Range
        EmployeeExcelSheet.StartRow = EmployeeExcelSheet.Data[0].Cell;
        EmployeeExcelSheet.EndRow = EmployeeExcelSheet.Data[EmployeeExcelSheet.Data.length - 1].Cell;
        
        // Row Names
        var rOpts = `<option value="">Choose one</option>`;
        EmployeeExcelSheet.Rows.forEach((row) => {
            rOpts += `<option value="${row}">${row}</option>`;
        });
        rOpts += `<option value="0">Not Applicable</option>`;

        $("#ExcelHeaderRow").html(rOpts);

        // Disable Column Names
        for (let k = 0; k < EmployeeExcelFields.length; k++) {
            $(`#${EmployeeExcelFields[k].Name}`).prop("disabled", true);
        }

        // Disable Load Employees & End Row
        $("#LoadExcelEmployees, #ExcelStartRow, #ExcelEndRow").prop("disabled", true);

    } else {
        // Reset Rows
        $("#ExcelStartRow, #ExcelHeaderRow, #ExcelEndRow").html(`<option value="">Choose one</option>`);

        // Reset Columns
        for (let k = 0; k < EmployeeExcelFields.length; k++) {
            $(`#${EmployeeExcelFields[k].Name}`).html(`<option value="">Choose one</option>`);
        }

        // Disable Load Employees Data
        $("#LoadExcelEmployees").prop("disabled", true);

    }
}

var ExcelHeaderRow = () => {
    // console.log({ EmployeeExcelSheet });

    // Set Start Row
    let xHeaderRow = $("#ExcelHeaderRow").val();
    var rOpts = `<option value="">Choose one</option>`;
    EmployeeExcelSheet.Rows.forEach((row) => {
        if (row > parseInt(xHeaderRow))
            rOpts += `<option value="${row}">${row}</option>`;
    });
    $("#ExcelStartRow").html(rOpts).prop("disabled", false);

    // Set Column Rows
    var cOpts = `<option value="">Choose one</option>`;
    EmployeeExcelSheet.Columns.forEach((col) => {
        if (xHeaderRow === 0) {
            cOpts += `<option value="${col}">[${col}]</option>`;
        } else {
            let cCell = `${col}${xHeaderRow}`;
            let cCellVal = EmployeeExcelSheet.Cells[cCell] ? `${EmployeeExcelSheet.Cells[cCell]}` : `[${col}]`;
            cOpts += `<option value="${col}">${cCellVal}</option>`;
        }
    });

    // Fill Column Inputs
    for (let k = 0; k < EmployeeExcelFields.length; k++) {
        $(`#Excel${EmployeeExcelFields[k].Name}`).html(cOpts).prop("disabled", false);
        // if (EmployeeExcelFields[k].Input === InputType.User) {}
    }

}

var ExcelStartRow = () => {
    let xStartRow = $("#ExcelStartRow").val();
    var xOpts = `<option value="">Choose one</option>`;
    EmployeeExcelSheet.Rows.forEach((row) => {
        if (row >= parseInt(xStartRow))
            xOpts += `<option value="${row}">${row}</option>`;
    });
    $("#ExcelEndRow").html(xOpts).prop("disabled", false);

    // Ensure Employee Fields count in checking for required fields
    ValidateExcelEmployees();
}

var ExcelEndRow = () => {
    EmployeeExcelRows = [];
    let nStartRow = $("#ExcelStartRow").val();
    let nEndRow = $("#ExcelEndRow").val();
    EmployeeExcelSheet.Rows.forEach((row) => {
        if (row >= parseInt(nStartRow) && row <= parseInt(nEndRow))
            EmployeeExcelRows.push(row);
    });

    // Enable Load Employees Data
    $("#LoadExcelEmployees").prop("disabled", false);

    // Ensure Employee Fields count in checking for required fields
    ValidateExcelEmployees();
}

var ValidateExcelEmployees = () => {
    EmployeeExcelColumns = {}, EmployeeDeductionsE = [];
    for (let k = 0; k < EmployeeExcelFields.length; k++) {
        let xVal = $(`#Excel${EmployeeExcelFields[k].Name}`).val();
        EmployeeExcelColumns[`${EmployeeExcelFields[k].Name}`] = xVal;
        if (!xVal && EmployeeExcelFields[k].Input === InputType.User) {
            EmployeeDeductionsE.push(EmployeeExcelFields[k].Name);
        }
    }
}

var LoadExcelEmployees = () => {

    EmployeeDeductionsN = [];
    EmployeeExcelRows.forEach((zRow) => {
        let zData = {
            Id: UUIDv4()
        };
        Object.keys(EmployeeExcelColumns).map((zCol) => {
            let xColumn = EmployeeExcelColumns[zCol];
            let zCell = `${xColumn}${zRow}`;
            zData[`${zCol}`] = EmployeeExcelSheet.Cells[zCell] ? EmployeeExcelSheet.Cells[zCell] : "";
        });
        EmployeeDeductionsN.push(zData);
    });

    if (EmployeeDeductionsN.length > 0 && EmployeeDeductionsE.length > 0) {
        toastr.info("All fields are require.");
    } else {
        // Set Page Id
        EmployeeDashboard.PageId = "Dashboard";
        EmployeeDashboard.Toolbox =
            `<button type="button" class="btn btn-outline-dark" onclick="GetEmployeeDashboard()">Close</button>
             <button type="button" class="btn btn-success" onclick="SubmitExcellEmployees()">Submit</button>`;
        let gHead = "", gBody = "";
        for (let h = 0; h < EmployeeExcelFields.length; h++) {
            gHead += `<th style="width:${EmployeeExcelFields[h].Width}px;text-align:center;">${EmployeeExcelFields[h].Label}</th>`;
        }

        for (let e = 0; e < EmployeeDeductionsN.length; e++) {
            gBody += "<tr>";
            for (let b = 0; b < EmployeeExcelFields.length; b++) {
                // gBody += `<td>${EmployeeDeductionsN[e][EmployeeExcelFields[k].Name]}</td>`;
                let align = EmployeeExcelFields[b].Type === DataType.Double ? `style="text-align:right;"` : ``;
                let valuz = EmployeeDeductionsN[e][EmployeeExcelFields[b].Name];
                let datum = EmployeeExcelFields[b].Type === DataType.Double ? NumberToMoney(valuz ? valuz : 0) : valuz ? valuz.toUpperCase() : "N/A";
                gBody += `<td ${align}>${datum}</td>`;
            }
            gBody += `
                <td class="px-1">
                    <button onclick="ExcelEmployeeRecordEdit('${EmployeeDeductionsN[e].Id}')" class="btn btn-xs py-1 px-2 m-0" title="Edit Details"><i class="fa fa-file"></i></button>
                    <button onclick="ExcelEmployeeRecordPreview('${EmployeeDeductionsN[e].Id}')" class="btn btn-xs py-1 px-2 m-0" title="Print Preview"><i class="fa fa-print"></i></button>
                    <button onclick="ExcelEmployeeRecordDelete('${EmployeeDeductionsN[e].Id}')" class="btn btn-xs py-1 px-2 m-0" title="Delete Record"><i class="fa fa-trash"></i></button>
                </td>
            </tr>`;
        }
        EmployeeDashboard.PageContent =
            `<div class="col-md-12">
            <div class="table-responsive border-bottom" id="GridEmployeeDeductions" style="height:${GridTableHeight}px; overflow-x: scroll;">
                <table class="table table-bordered">
                    <thead>
                        <tr>${gHead}<th style="width:120px;text-align:center;">Action</th></tr>
                    </thead>
                    <tbody>${gBody}</tbody>
                </table>
            </div>
        </div>`;
        SetEmployeeDashboard();
    }

}

var ExcelEmployeeRecordEdit = (id) => {
    console.log({ EmployeeDeductionsN }, { id });

}

var ExcelEmployeeRecordPreview = (id) => {
    console.log({ EmployeeDeductionsN }, { id });

}

var ExcelEmployeeRecordDelete = (id) => {
    console.log({ EmployeeDeductionsN }, { id });

}

var SubmitExcellEmployees = () => {
    console.log({ EmployeeDeductionsN });
}


// Back Button Click
var MoveBack = () => {
    CurrentTabId = GetPreviousTab().Id;
    ActivateTab();
}

// Next Button Click
var MoveNext = () => {
    CurrentTabId = GetNextTab().Id;
    ActivateTab();
}

// Activate the Current Tab
function ActivateTab() {
    //console.log({ TabList });

    if (TabList && TabList.length > 0) {
        // Disable All TabList
        for (var j = 0; j < TabList.length; j++) {
            var tabId = TabList[j].TabId;
            var contentId = TabList[j].ContentId;
            $(`#${tabId}`).removeClass("active").addClass("disabled");
            $(`#${contentId}`).removeClass("active show");
        }

        // Hide All Buttons
        $("#rowBack").prop('hidden', true);
        $("#rowBackNext").prop('hidden', true);
        $("#rowNext").prop('hidden', true);

        // Get CurrentTab Object  
        var CurrentTab = GetCurrentTab();
        // console.log(CurrentTab.TabId);

        // Activate the tab with CurrentTabId
        $(`#${CurrentTab.TabId}`).addClass("active").removeClass("disabled");
        $(`#${CurrentTab.ContentId}`).addClass("active show");

        // Control Active Tab Elements [Buttons]
        $("#PostPAYEReturns").prop("hidden", true);
        if (CurrentTabId === GetFirstTab().Id) {
            $("#rowNext").removeAttr("hidden");
        } else if (CurrentTabId === GetLastTab().Id) {
            $("#rowBack").removeAttr("hidden");
            $("#PostPAYEReturns").prop("hidden", false);
        } else {
            $("#rowBackNext").removeAttr("hidden");
        }

        // Is CurrentTab Dashboard?
        if (CurrentTab.Id === 1) {
            SetEmployeeDashboard();
        }
    }
}

// Count Number of Visible Tabs
function GetTabListCount() {
    return TabList.length;
}


// Get First Visible Tab
function GetFirstTab() {
    return TabList[0];
}

// Get Previous Visible Tab
function GetPreviousTab() {
    let currentTab = GetCurrentTab();
    return TabList[($.inArray(currentTab, TabList) - 1 + TabList.length) % TabList.length];
}

function GetCurrentTab() {
    // Get CurrentTab Object
    var CurrentTab = TabList.filter(obj => {
        return obj.Id === CurrentTabId
    })
    return CurrentTab[0];
}

// Get Next Visible Tab
function GetNextTab() {
    let currentTab = GetCurrentTab();
    return TabList[($.inArray(currentTab, TabList) + 1) % TabList.length];
}

// Get Last Visible Tab
function GetLastTab() {
    return TabList[TabList.length - 1];
}


var PAYESumStaff = () => {
    let managementNo = $("#PAYEManagementNo").val();
    let othersNo = $("#PAYEOthersNo").val();
    $("#PAYETotalsNo").val(Number(managementNo) + Number(othersNo));
}

var PAYESumCash = () => {
    let managementCash = $("#PAYEManagementCash").val();
    let othersCash = $("#PAYEOthersCash").val();
    let totalsCash = MoneyToNumber(managementCash) + MoneyToNumber(othersCash);
    $("#PAYETotalsCash").val(NumberToMoney(totalsCash));
}

var PAYESumTax = () => {
    let managementTax = $("#PAYEManagementTax").val();
    let othersTax = $("#PAYEOthersTax").val();
    let totalsTax = MoneyToNumber(managementTax) + MoneyToNumber(othersTax);
    $("#PAYETotalsTax").val(NumberToMoney(totalsTax));
}

var PAYESumMovement = () => {
    let startingStaff = $("#PAYEStartingStaff").val();
    let engagedStaff = $("#PAYEEngagedStaff").val();
    let disengagedStaff = $("#PAYEDisenagedStaff").val();
    $("#PAYEEndingStaff").val((Number(startingStaff) + Number(engagedStaff)) - Number(disengagedStaff));
}

// Control Employee TIN
var ProperEmployeeTIN = () => {
    let employeeTIN = $("#PAYEEmployeeTIN").val();
    $("#PAYEEmployeeTIN").val(employeeTIN.toUpperCase())
}

// Get Employee Details
var GetEmployeeDetails = () => {
    let employeeTIN = $("#PAYEEmployeeTIN").val();
    if (employeeTIN.length === 11) {
        // Show Preloader
        $('body').showLoading();
       
        var postData = JSON.stringify({
            TIN: employeeTIN
        });

        // Call Local API
        var postUrl = `?handler=GetTaxPayerEntityData`;
        $.post(postUrl, postData, (data, status) => {
            // console.log('GetTaxPayerData Data: ', data);

            // Display on view
            if (data.status === "Successful" && data.body) {
                console.log(data.body);

                // Populate Fields
                $("#PAYEEmployeeName").val(data.body[0].entityName);
                $("#PAYEEmployeePhone").val(data.body[0].phoneNo);
                if (!data.body[0].phoneNo) {
                    $("#PAYEEmployeePhone").prop("disabled", false);
                    SetAsIntlTelInputField(PAYEEmployeePhone);
                    $("#PAYEEmployeePhone").focus();
                }
                $("#PAYEEmployeeEmail").val(data.body[0].emailAddress.toLowerCase());
                if (!data.body[0].emailAddress) {
                    $("#PAYEEmployeeEmail").prop("disabled", false);
                }
            } else {
                toastr.info("An error occurred. Please check the TIN and try again.");
            }
            // Hide Preloader
            $('body').hideLoading();
        }).fail((res) => {
            //console.log('Response Error: ' + response.responseText);
            
            // Hide Preloader
            $('body').hideLoading();
        });
    } else {
        toastr.info("The Employee TIN is invalid. Please check and try again.");
    }
}


var CancelPAYE = () => {
    //Clear Employee Data
    $("#PAYEEmployeeSearch").val("").prop("disabled", false);
    $("#PAYEEmployeeName").val("N/A");
    $("#PAYEEmployeePhone").val("N/A");
    $("#PAYEEmployeeEmail").val("N/A");
    $("#PAYEEmployeePosition").prop('selectedIndex', 0);
    $("#PAYESerialNumber").val("");

    // Clear Form Data
    $("#PAYEBasicSalary").val("0.0");
    $("#PAYECashAllowances").val("0.0");
    $("#PAYEBonusIncome").val("0.0");
    $("#PAYEOvertimePay").val("0.0");
    $("#PAYEProvidentFund").val("0.0");
    $("#PAYEPersonalRelief").val("0.0");

}

var ValidatePAYEForm = () => {
    // Calculate Computed Fields


    // Collect Form Data
    EmployeeDeductionN = {
        // Employee
        EmployeeTIN: $("#PAYEEmployeeTIN").val(),
        EmployeeName: $("#PAYEEmployeeName").val(),
        EmployeePhone: $("#PAYEEmployeePhone").val(),
        EmployeeEmail: $("#PAYEEmployeeEmail").val(),
        EmployeePosition: $("#PAYEEmployeePosition").val(),
        SerialNumber: $("#PAYESerialNumber").val(),
        EmployeeResidential: $("#PAYEEmployeeResidential").val(),
        // Income
        BasicSalary: MoneyToNumber($("#PAYEBasicSalary").val()),
        CashAllowances: MoneyToNumber($("#PAYECashAllowances").val()),
        BonusIncome: MoneyToNumber($("#PAYEBonusIncome").val()),
        OvertimeIncome: MoneyToNumber($("#PAYEOvertimeIncome").val()),
        SecondaryEmployment: MoneyToNumber($("#PAYESecondaryEmployment").val()),
        NonCashBenefit: MoneyToNumber($("#PAYENonCashBenefit").val()),
        AccommodationElement: MoneyToNumber($("#PAYEAccommodationElement").val()),
        VehicleElement: MoneyToNumber($("#PAYEVehicleElement").val()),
        DeductibleReliefs: MoneyToNumber($("#PAYEDeductibleReliefs").val()),
        TotalReliefs: MoneyToNumber($("#PAYETotalReliefs").val()),
        // Tax
        SocialSecurity: MoneyToNumber($("#PAYESocialSecurity").val()),
        ApprovedTrustee: MoneyToNumber($("#PAYEApprovedTrustee").val()),
        ProvidentRate: Number($("#PAYEProvidentRate").val()),
        ProvidentFund: MoneyToNumber($("#PAYEProvidentFund").val()),
        FinalTaxOnBonus: MoneyToNumber($("#PAYEFinalTaxOnBonus").val()),
        ExcessBonus: MoneyToNumber($("#PAYEExcessBonus").val()),
        TotalCashEmolument: MoneyToNumber($("#PAYETotalCashEmolument").val()),
        TotalAssessableIncome: MoneyToNumber($("#PAYETotalAssessableIncome").val()),
        ChargeableIncome: MoneyToNumber($("#PAYEChargeableIncome").val()),
        SeverancePayPaid: MoneyToNumber($("#PAYESeverancePayPaid").val()),
        TaxDeductible: MoneyToNumber($("#PAYETaxDeductible").val()),
        OvertimeTax: MoneyToNumber($("#PAYEOvertimeTax").val()),
        TaxPayable: MoneyToNumber($("#PAYETaxPayable").val()),
    };

    // Disable Save Button
    $("#ViewAddDeduction").prop("disabled", true);
    $("#SaveAddDeduction").prop("disabled", true);
    if (EmployeeDeductionN && EmployeeDeductionN.EmployeeTIN && EmployeeDeductionN.EmployeePosition &&
        EmployeeDeductionN.BasicSalary && EmployeeDeductionN.EmployeeName != "N/A") {
        // Enable Save Button
        $("#ViewAddDeduction").prop("disabled", false);
        $("#SaveAddDeduction").prop("disabled", false);
    }
}

var ManualComputeTaxes = () => {

}

var SaveAddContinue = () => {
    console.log({ EmployeeDeductionN });
    
}


// Set Input as Tel
var SetAsIntlTelInputField = (el) => {
    window.intlTelInput(el, {
        utilsScript: "~/build/js/utils.js",
    });
}
