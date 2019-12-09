
var GetEmployeeDashboard = (elId = 'Dashboard') => {
    // Set Page Id
    EmployeeDashboard.PageId = elId;
    switch (elId) {
        case "Manual":
            EmployeeDashboard.Toolbox =
                `<button type="button" class="btn btn-outline-dark" onclick="GetEmployeeDashboard()">Close</button>
                 <button type="button" disabled id="SaveAddContinue" class="btn btn-success" onclick="SaveAddContinue()">Save And Continue</button>`;
            EmployeeDashboard.PageContent =
                `<div class="col-md-6 pr-1">
                    <div class="bordered-group">
                        <p class="card-title"><b>Employee Details</b></p>
                        <div class="row mb-2">
                            <div class="col-md-12">
                                <div class="input-group">
                                    <span class="input-group-prepend">
                                        <span class="input-group-text bg-transparent border-right-0"><i class="fa fa-search"></i></span>
                                    </span>
                                    <input id="PAYEEmployeeTIN" class="form-control py-2 border-left-0 border" type="search" placeholder="Enter TIN of the Employee" style="font-weight: 600 !important; color: #364c66 !important;height:35px!important;" onkeyup="ProperEmployeeTIN()" onchange="ProperEmployeeTIN()">
                                    <span class="input-group-append">
                                        <button class="btn btn-outline-secondary border-left-0 border" type="button" id="PAYEEmployeeDetail" onclick="GetEmployeeDetails()">
                                            Search
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>Name</label>
                                <input type="text" class="form-control" id="PAYEEmployeeName" disabled value="N/A" style="font-weight: 600" onchange="ValidatePAYEForm()">
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>Phone</label>
                                <input type="text" class="form-control" id="PAYEEmployeePhone" value="N/A" style="font-weight: 600" onchange="ValidatePAYEForm()">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>Email</label>
                                <input type="text" class="form-control" id="PAYEEmployeeEmail" value="N/A" style="font-weight: 600" onchange="ValidatePAYEForm()">
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>Serial Number</label>
                                <input type="text" class="form-control" id="PAYESerialNumber" onchange="ValidatePAYEForm()" style="font-weight: 600">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6 pr-1">
                                <label>Position</label>
                                <select id="PAYEEmployeePosition" class="form-control" onchange="ValidatePAYEForm()">
                                    <option>Choose one</option>
                                </select>
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>Residence</label>
                                <select id="PAYEEmployeeResidential" class="form-control" onchange="ValidatePAYEForm()">
                                    <option>Choose one</option>
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-md-6 pl-1">
                    <div class="bordered-group">
                        <p class="card-title"><b>Income Details</b></p>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>Basic Salary <i class="text-danger">*</i></label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYEBasicSalary" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>Cash Allowances</label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYECashAllowances" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>Bonus Income</label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYEBonusIncome" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>Overtime Income</label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYEOvertimeIncome" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>2<sup>nd</sup> Employment <i class="fa fa-info-circle" title="Secondary Employment"></i></label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYESecondaryEmployment" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                            <div class="col-md-6 pl-1">
                                <label>3<sup>rd</sup> Tier (Rate %)</label>
                                <input type="text" class="form-control text-right" id="PAYEProvidentRate" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6 pr-1">
                                <label>Severance Pay <i class="fa fa-info-circle" title="Severance Pay Paid"></i></label>
                                <input type="text" class="form-control text-right formattedMoney" id="PAYESeverancePayPaid" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                            </div>
                            <div class="col-md-6 pl-1">
                                &nbsp;
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="bordered-group bg-light-gray">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="row mb-2">
                                    <div class="col-md-4 pr-1">
                                        <label>Tax Deductible</label>
                                        <input type="text" class="form-control text-right formattedMoney" disabled id="PAYETaxDeductible" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                                    </div>
                                    <div class="col-md-4 px-1">
                                        <label>Overtime Tax</label>
                                        <input type="text" class="form-control text-right formattedMoney" disabled id="PAYEOvertimeTax" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                                    </div>
                                    <div class="col-md-4 pl-1">
                                        <label>Tax Payable</label>
                                        <input type="text" class="form-control text-right formattedMoney" disabled id="PAYETaxPayable" onchange="ValidatePAYEForm()" placeholder="0.0" style="font-weight: 600;">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row mb-2">
                                    <div class="col-md-6 pt-2">
                                        <button type="button" id="SavePAYERecord" class="btn btn-success" onclick="ManualComputeTaxes()">Compute Taxes</button>
                                    </div>
                                    <div class="col-md-6 text-right">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            break;
        case "Excel":
            EmployeeDashboard.Toolbox =
                `<button type="button" class="btn btn-outline-dark" onclick="GetEmployeeDashboard()">Close</button>
                <button id="LoadExcelEmployees" disabled type="button" class="btn btn-success float-right" onclick="LoadExcelEmployees()">Load Data</button>
                <button type="button" hidden id="SubmitPAYEReturns" class="btn btn-success" onclick="SubmitPAYEReturns()">Submit Returns</button>`;
            let tHead = "", tBody = "", xFields = "";
            for (let k = 0; k < EmployeeExcelFields.length; k++) {
                if (EmployeeExcelFields[k].Input === InputType.User) {
                    tHead += `<th style="width:180px;text-align:center;">${EmployeeExcelFields[k].Label}</th>`;
                    tBody += `<td style="width:180px!important;" class="p-0">
                                    <select id="${EmployeeExcelFields[k].Name}" disabled onchange="ValidateExcelEmployees()" class="form-control m-0" style="width:180px!important;font-weight:600">
                                        <option>Choose one</option>
                                    </select>
                                </td>`;
                    xFields += `
                            <div class="col-md-2 px-1 pb-2">
                                <label>${EmployeeExcelFields[k].Label}</label>
                                <select id="Excel${EmployeeExcelFields[k].Name}" class="form-control" disabled onchange="ValidateExcelEmployees()" style="font-weight:600">
                                    <option>Choose one</option>
                                </select>
                            </div>`;
                }
            }
            EmployeeDashboard.PageContent =
                `<div class="col-md-12">
                    <div class="bordered-group">
                        <p class="card-title"><b>Excel Workbook Details</b></p>
                        <div class="row mb-2">
                            <div class="col-md-4 pr-1">
                               <label>Select Excel Workbook</label>
                               <input type="file" hidden id="ImportFromExcel" style="font-weight: 600" onchange="ImportFromExcel(this)">
                               <div class="input-group">
                                    <input id="ExcelBookName" disabled class="form-control py-2 border-left-0 border" type="search" placeholder="Browse Excel File">
                                    <span class="input-group-append" style="height:25px;">
                                        <button class="btn btn-outline-secondary border-left-0 border my-0 py-0" type="button" id="BrowseExcelFile" onclick="BrowseExcelFile()">
                                            Browse Excel File
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-2 px-1">
                                <label>Sheet Name</label>
                                <select id="ExcelSheetName" class="form-control" onchange="GetExcelSheetName()">
                                    <option>Choose one</option>
                                </select>
                            </div>
                            <div class="col-md-2 px-1">
                                <label>Header Row</label>
                                <select id="ExcelHeaderRow" class="form-control" onchange="ExcelHeaderRow()">
                                    <option>Choose one</option>
                                </select>
                            </div>
                            <div class="col-md-2 px-1">
                                <label>Records Start Row</label>
                                <select id="ExcelStartRow" class="form-control" onchange="ExcelStartRow()" disabled>
                                    <option>Choose one</option>
                                </select>
                            </div>
                            <div class="col-md-2 pl-1">
                                <label>Records End Row</label>
                                <select id="ExcelEndRow" class="form-control" onchange="ExcelEndRow()" disabled>
                                    <option>Choose one</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="bordered-group">
                        <p class="card-title"><b>Employee Record Columns (<i class="text-dark">All fields required.</i>)</b></p>
                        <div class="row md-2 px-2">
                            ${xFields}
                            <!--
                            <label><b>Specify the colum names</b></label>
                            <div class="table-responsive border-bottom" style="height: 100px; overflow-x: scroll;">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>${tHead}</tr>
                                    </thead>
                                    <tbody> 
                                        <tr>${tBody}</tr>
                                    </tbody>
                                </table>
                            </div>
                            -->
                        </div>
                    </div>
                </div>`;
            break;
        case "Dashboard":
            EmployeeDashboard.Toolbox = ``;
            let gHead = "", gBody = "";
            for (let h = 0; h < EmployeeExcelFields.length; h++) {
                gHead += `<th style="width:${EmployeeExcelFields[h].Width}px;text-align:center;">${EmployeeExcelFields[h].Label}</th>`;
            }

            for (let e = 0; e < EmployeeDeductions.length; e++) {
                gBody += "<tr>";
                for (let b = 0; b < EmployeeExcelFields.length; b++) {
                    let align = EmployeeExcelFields[b].Type === DataType.Double ? `style="text-align:right;"` : ``;
                    let valuz = EmployeeDeductions[e][EmployeeExcelFields[b].Name];
                    let datum = EmployeeExcelFields[b].Type === DataType.Double ? NumberToMoney(valuz ? valuz : 0) : valuz ? valuz.toUpperCase() : "N/A";
                    gBody += `<td ${align}>${datum}</td>`;
                }
                gBody += "</tr>";
            }
            EmployeeDashboard.PageContent =
                `<div class="col-md-12">
                    <div class="row mx-1 mt-1">
                        <div class="col-md-6 px-1">
                            <button type="button" class="btn btn-success" onclick="GetEmployeeDashboard('Manual')">Add Employee Record</button>
                        </div>
                        <div class="col-md-6 px-1">
                            <div class="float-right">
                                <button type="button" class="btn btn-outline-success" onclick="GetEmployeeDashboard('Excel')">Import From Excel</button>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="col-md-12">
                    <div class="row mx-2">
                        <div class="table-responsive border-bottom" id="GridEmployeeDeductions" style="height:${GridTableHeight}px; overflow-x: scroll;">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>${gHead}</tr>
                                </thead>
                                <tbody>${gBody}</tbody>
                            </table>
                        </div>
                    </div>
                </div>`;
            break;
    }
    SetEmployeeDashboard();
}

var SetEmployeeDashboard = () => {
    // Set Page Content
    if (EmployeeDashboard && EmployeeDashboard.PageContent) {
        $("#EmployeeDashboard").html(EmployeeDashboard.PageContent);
    }

    //Set Toolbox
    if (EmployeeDashboard) {
        $("#EmployeeToolbox").html(EmployeeDashboard.Toolbox);
    }

    switch (EmployeeDashboard.PageId) {
        case "Manual":

            // Set Employee Positions
            var eOpts = `<option value="">Choose one</option>`;
            for (let x = 0; x < EmployeePositions.length; x++) {
                eOpts += `<option value="${EmployeePositions[x].Code}">${EmployeePositions[x].Name}</option>`;
            }
            $("#PAYEEmployeePosition").html(eOpts);

            // Set Residential Status
            let optRes = `<option value="">Choose one</option>`;
            for (let r = 0; r < ResidencyTypes.length; r++) {
                optRes += `<option value="${ResidencyTypes[r].Id}">${ResidencyTypes[r].Description}</option>`;
            }
            $("#PAYEEmployeeResidential").html(optRes);


            $('.formattedMoney').focusout(function () {
                $(this).val(commaRemover($(this).val())); //first, clean value by removing all commas
                $(this).val(moneyInTxt($(this).val(), 'en', 2));
            });


            $('.formattedMoney').focus(function () {
                $(this).val(Number($(this).val()) === 0 ? "" : commaRemover($(this).val()));
            });

            $('.formattedMoney').keydown(function (e) {
                if (!e.key.match(/^[0-9.()]+$/) && Number(e.key.length) === 1) {
                    e.preventDefault();
                    return;
                }
            });

            break;
        case "Excel":

            break;
        case "Dashboard":
            setTimeout(() => {
                $("#GridEmployeeDeductions").freezeTable({
                    'columnNum': 2,
                    'shadow': true,
                    'scrollable': true,
                });
            }, 1000); // 1 second delay
            break;
    }

}
