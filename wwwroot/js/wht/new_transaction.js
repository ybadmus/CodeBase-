var container = {};
var amount;
var taxpayerName;

// Get TaxPayer Data
var TaxPayerData = {};
var userId;
var periodId;
var taxOfficeId;
var whtAgentTaxpayerid;
var postalAddress;
var taxpayerPhone;
var taxpayerEmailAdd;
var getflRate, nhilRate, taxRate, whVatRate;
var RatesData = [];
var AttachmentFiles = [];
var DataSet = [];

var Header = [];
var GridHeader = [];



var attachedData = {};
var checkExemptionFlag = 0;



function ResetSheetList() {
    var sheets = document.getElementById('SheetList');
    for (var i in sheets) {
        sheets.remove(i)
    }
    $('#SheetList').append($("<option selected disabled></option>").attr("value", 0).text('Select sheet'));
    document.getElementById("SheetList").style.borderColor = "orange";
}

function generateGrid(DataSet) {
    $("#import_grid").kendoGrid({
        dataSource: {
            type: "odata",
            data: DataSet
        },

        //dataBound: onDataBound,
        height: "400px",
        selectable: true,
        resizable: true,
        groupable: false,
        sortable: false,
        //editable: true,
        toolbar: true,

        columns: [

                { field: "tin", title: "TIN", width: "7%" },
                { field: "transactionDate", title: "Date", width: "7%" },
                { field: "contractNo", title: "Contract #", width: "7%" },
                { field: "contractDesc", title: "Contract Description", width: "10%" },
                { field: "invoiceNumber", title: "Invoice #", width: "10%" },
                { field: "invoiceDesc", title: "Invoice Description", width: "10%" },
                { field: "taxpayerName", title: "Entity", width: "10%" },
                { field: "taxpayerTel", title: "Phone No", width: "10%" },
                { field: "taxpayerEmail", title: "Email", width: "10%" },
                { field: "busLocation", title: "Address", width: "10%" },
                { field: "contractAmt", title: "Contract Amount", width: "10%" },
                { field: "grossPaymentAmt", title: "Gross Amount", width: "10%" },
                //{ field: "vatableAmt", title: "VATable Amount", width: "10%" },
                { field: "whtType", title: "WH Type", width: "10%" },
                { field: "taxWithHeld", title: "Withheld", width: "9%" },
                //{ command: "edit", width: "7%" }                   

        ]
    });
}

function generateFreshGrid() {
    //console.log("Loading fresh grid");
    $("#import_grid").kendoGrid({
        dataSource: {
            type: "odata",
            data: []

        },

        //dataBound: onDataBound,
        height: "400px",
        selectable: true,
        resizable: true,
        groupable: false,
        sortable: false,
        editable: "popup",
        toolbar: true,

        columns: [
            { field: "tin", title: "TIN", width: "7%" },
            { field: "transactionDate", title: "Date", width: "7%" },
            { field: "contractNo", title: "Contract #", width: "7%" },
            { field: "contractDesc", title: "Contract Description", width: "10%" },
            { field: "invoiceNumber", title: "Invoice #", width: "10%" },
            { field: "invoiceDesc", title: "Invoice Description", width: "10%" },
            { field: "taxpayerName", title: "Entity", width: "10%" },
            { field: "taxpayerTel", title: "Phone No", width: "10%" },
            { field: "taxpayerEmail", title: "Email", width: "10%" },
            { field: "busLocation", title: "Address", width: "10%" },
            { field: "contractAmt", title: "Contract Amount", width: "10%" },
            { field: "grossPaymentAmt", title: "Gross Amount", width: "10%" },
            //{ field: "vatableAmt", title: "VATable Amount", width: "10%" },
            { field: "whtType", title: "WH Type", width: "10%" },
            { field: "taxWithHeld", title: "Withheld", width: "9%" },
            //{ command: "edit", width: "7%" }                       


        ]
    });
}

//initial load of grid with empty data
//DataSet = [];
//generateGrid(DataSet);

Dropzone.options.fileUploader = {
    
    paramName: 'file',
    maxFilesize: 10, // MB
    maxFiles: 1,
    dictDefaultMessage: 'Drag your excel file here to upload, or click to select one',
    addRemoveLinks: true,
    autoProcessQueue: false,
    acceptedFiles: ".xlsx,.xls,.csv",      
    dictInvalidFileType: "Please upload only excel file types",
    
   
    accept: function (file, done) {

        //reset sheet names
        ResetSheetList();

        document.getElementById('SheetNames').hidden = false;
       
        var ext = (file.name).split('.')[1]; // get extension from file name
        if (ext != 'xlsx') {
            toastr.error("Please upload only excel file types with the extension '.xlsx'");
            done("Please upload only excel file types"); // error message for user
            //myDropzone.removeAllFiles();

        }
        else {           
            done();
        } // accept file

        //extract accepted file data
        var selectedFile = file;
        var reader = new FileReader();
        
       
        var RowsSelect = [];
       
        reader.onload = function (event) {
            var data = event.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            var excelSheets = [];
            workbook.SheetNames.forEach(function (sheetName) {

                var sheets = document.getElementById('SheetList');
                //console.log(workbook.SheetNames.length);
               
                 
                sheets.append(new Option(sheetName, sheetName));
                //$('#SheetList').append($("<option></option>").attr("value", sheetName).text(sheetName));
                          

                document.getElementById('SheetList').addEventListener("change", function (event) {                                       

                    var e = document.getElementById("SheetList");
                    var selectedItem = e.options[e.selectedIndex].value;

                    if (sheetName == selectedItem) {
                        //console.log("Found: ", sheetName);
                        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[selectedItem]);
                        //console.log(XL_row_object);
                        //DataSet = XL_row_object;
                        document.getElementById("SheetList").style.borderColor = null;

                        //console.log("Sheet Data: ", workbook.Sheets[sheetName]); 


                        //-------------------Scrum Code --------------//
                        var xdt = workbook.Sheets[sheetName];

                        var xData = Object.keys(xdt).map((key) => {
                            return [key, xdt[key].v];
                        });

                        //console.log("xDATA:", xData);

                        var xCells = [], vCells = [], xRows = [], xColums = [], vCell = {};
                        for (let x = 0; x < xData.length; x++) {
                            if (xData[x][1]) {

                                let row = xData[x][0].replace(/[^\d.]/g, '');
                                xRows.push(row);

                                let col = xData[x][0].replace(row, '');
                                xColums.push(col);
                                vCell[`${xData[x][0]}`] = xData[x][1];
                                vCells.push(vCell);

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
                            Cells: vCell,
                            Name: sheetName,
                            First: xCells[0],
                            Last: xCells[xCells.length - 1],
                            Rows: xRows.filter((v, i, a) => a.indexOf(v) === i),
                            Columns: xColums.filter((v, i, a) => a.indexOf(v) === i)
                        });

                        console.log("Data:", excelSheets);
                        var col = excelSheets[0].Columns;
                        var row = excelSheets[0].Rows;
                        var cellNames = excelSheets[0].Cells;
                                   

                        for (var j in row) {
                            //console.log();
                            RowsSelect.push(row[j]);
                        }                   


                        //reset Header Row
                        $("#headerRow").html(`<option disabled selected value="">Select</option><option value="N/A">Not Applicable</option>`);
                        for (var c in RowsSelect) {
                            document.getElementById("startRow").add(new Option(RowsSelect[c], RowsSelect[c]));
                            document.getElementById("endRow").add(new Option(RowsSelect[c], RowsSelect[c]));
                            document.getElementById("headerRow").add(new Option(RowsSelect[c], RowsSelect[c]));
                        }                                
                                           

                        document.getElementById("endRow").addEventListener("change", function (e) {
                            document.getElementById('upload').disabled = false;
                        });

                        var headerID;
                        document.getElementById("headerRow").addEventListener("change", function (event) {
                            // Reset Column Data
                            $("#dateCol, #contractNoCol, #amountConCol,#invNoCol, #invDescCol, #withNameCol, #whtTypeCol, #amountGrossCol, #phoneNumCol, #emailCol, #addressCol, #descConCol ")
                                .html(`<option disabled selected value="">Select</option><option value="N/A">Not Applicable</option>`);

                            headerID = document.getElementById("headerRow").value;
                            //console.log(headerID);
                            for (var i in cellNames) {
                                //console.log(i.substring(i.indexOf(i[0]) + 1));
                                if ((i.substring(i.indexOf(i[0]) + 1) == headerID)) {
                                    //console.log("Headers:", cellNames[i]);
                                    document.getElementById("dateCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1,i.indexOf(i[0]))));
                                    document.getElementById("contractNoCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("amountConCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("invNoCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("invDescCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("withNameCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("whtTypeCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("amountGrossCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("phoneNumCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("emailCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("addressCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));
                                    document.getElementById("descConCol").add(new Option(cellNames[i] + " [" + i + "]", i.substring(1, i.indexOf(i[0]))));                                
                                }
                            }

                            //reset 
                            RowsSelect = [];   
                                                                                   
                        });              
                                            
                        
                        document.getElementById('upload').addEventListener('click', function (event) {

                            var date = document.getElementById("dateCol").value;
                            var conNum = document.getElementById("contractNoCol").value;
                            var conAmt = document.getElementById("amountConCol").value;
                            var invNo = document.getElementById("invNoCol").value;
                            var invDesc = document.getElementById("invDescCol").value;
                            var entity = document.getElementById("withNameCol").value;
                            var whType = document.getElementById("whtTypeCol").value;
                            var gross = document.getElementById("amountGrossCol").value;
                            var phone = document.getElementById("phoneNumCol").value;
                            var email = document.getElementById("emailCol").value;
                            var addrss = document.getElementById("addressCol").value;
                            var conDesc = document.getElementById("descConCol").value; 

                            var startIndex = Number(document.getElementById('startRow').value);
                            var endIndex = Number(document.getElementById('endRow').value);

                            //console.log(startIndex + " - " + endIndex);
                            //console.log(cellNames.C8);
                            var finalData = [];

                           

                            for (var i = startIndex; i <= endIndex; i++) {
                               
                                var tempData = {
                                    tin: "P000804709X",
                                    transactionDate: cellNames[`${date}${i}`],
                                    //resStatusId: "",
                                    //taxOfficeId: "",
                                    //userId: "",
                                    invoiceNumber: cellNames[`${invNo}${i}`],                                   
                                    busLocation: cellNames[`${addrss}${i}`], 
                                    taxpayerName: cellNames[`${entity}${i}`],
                                    whtAgentTIN: "P0009618155",
                                    whtType: cellNames[`${whType}${i}`],
                                    contractAmt: cellNames[`${conAmt}${i}`],
                                    grossPaymentAmt: cellNames[`${gross}${i}`],
                                    taxRate: "7.00",
                                    taxWithHeld: '5000',
                                    taxpayerTel: cellNames[`${phone}${i}`],
                                    taxpayerEmail: cellNames[`${email}${i}`],
                                    vatableAmt: "2500",
                                    //vatTypeId: "",
                                    contractNo: cellNames[`${conNum}${i}`],
                                    contractDesc: cellNames[`${conDesc}${i}`],                                    
                                    invoiceDesc: cellNames[`${invDesc}${i}`]                                   

                                };

                                //console.log("TempDta:", tempData);
                                finalData.push(tempData);

                            }
                            

                            console.log(finalData);

                            //set it to my grid DataSet
                            DataSet = finalData;
                                                                 
                                                                                                        
                        });
                        
                    }

                   
                });  
            })

           
        };

        reader.onerror = function (event) {
            console.error("File could not be read!");
        };

        reader.readAsBinaryString(selectedFile);
    },

    init: function () {
        var self = this;
        //self.options.addRemoveLinks = true;

        var submitButton = document.querySelector("#upload");
        myDropzone = self;

        submitButton.addEventListener("click", function () {             
            
            console.log("Length before Process: " + myDropzone.getQueuedFiles().length);

            myDropzone.processQueue();
            console.log("Length after Process: " + myDropzone.getQueuedFiles().length);

            
            //$('#modal-import-trans-form').modal('hide');

            myDropzone.on("complete", function (file) {
                if (myDropzone.getQueuedFiles().length == 0 && myDropzone.getUploadingFiles().length == 0) {                   
                    
                     $('body').showLoading();
                     // Reset AttachmentFiles to Empty
                     AttachmentFiles = [];
                     AttachmentFiles.length = 0;
                    for (j = 0; j < myDropzone.files.length; j++) {                         

                         //console.log(myDropzone.files[j]);
                         toastr.success("Successfully uploaded " + file.name);
                         
                     }
                     setTimeout(function () {
                         //If any valid files
                         if (AttachmentFiles && AttachmentFiles.length > 0) {
                             // Get First Object
                             attachedData = AttachmentFiles[0];
                             //console.log("Attached Data:", attachedData);
                         }

                         // Hide Preloader
                         $('body').hideLoading();
                     }, 1000); // Delay 1sec for the file collection to be loaded completely...
                    

                    myDropzone.removeAllFiles();
                    $('#modal-import-trans-form').modal('hide');              

                   
                     //now we can populate the grid with file content here
                    generateGrid(DataSet);


                    document.getElementById('submitImportTrans').disabled = false;
                    document.getElementById('import_grid').hidden = false;                    
                 
                }

                else {
                     toastr.warning("File could not be uploaded. Please try again");
                }
            });
           
        });

      
       
        this.on("addedfile", function (file) {              
           
            //this.emit("thumbnail", file, "~/icons/iconx-excel.png");
            if ((file.name).split('.')[1] == 'xlsx') {
                //$(file.previewElement).find(".dz-image img").attr("src", "/icons/iconx-excel.jpg");
                $(file.previewElement).find(".dz-image img").attr("src", AppServerUrl + "/icons/iconx-excel.jpg");
                $(file.previewElement).find(".dz-remove").text("Click here to Remove");
               
            }
            else {
                toastr.error("Please upload only Excel file types.");
                self.removeFile(file);
            }
            
            file.previewElement.addEventListener("click", function () {
                self.removeFile(file);
                
            });
        });

        //this.on("removedfile", function (file) {
        //    toastr.warning(file.name+" Removed");
        //});       

        this.on("maxfilesexceeded", function (file) {            
            toastr.error("Max number reached.");
            self.removeFile(file);
        });

    }
};


$(document).ready(function () {

    //alert("Some updates been made");

    $(".datepicker").flatpickr({
        maxDate: "today",
        dateFormat: "d-m-Y"
    });

    //$("#transDate").click(function () {
    //    $("#transDate").datepicker({ dateFormat: 'dd-mm-yyyy' });
    //});

    //$(".phoneNumbers").css("width", "280px");
    $(".phoneNumbers").focus(function () {
        if (!this.value) {
            $(this).css("padding-left", "88px");
        }
    });
  
    document.getElementById('submitTrans').disabled = true;   

    getVatTypes();

    var dataModel = {
        TIN: nameTIN.TIN // Get from localStorage
    };

    var postData = JSON.stringify(dataModel);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerData`;
    $.post(postUrl, postData, function (data, status) {
        //console.log('GetTaxPayerData Data: ', data);

        // Display on view
        if (data.status === "Successful") {
           
            // Keep object for future use.
            TaxPayerData = data.body;

            userId = TaxPayerData.id;
            periodId = TaxPayerData.id;
            taxOfficeId = TaxPayerData.taxOffice.id;
            whtAgentTaxpayerid = TaxPayerData.id;           

           // console.log(TaxPayerData);

        }

    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
        });
 
});

//All ajax requests are made through this
function newAjaxRequest(url, method, data = "") {
    return $.ajax({
        url: url,
        method: method,
        crossDomain: true,
        data: JSON.stringify(data)
    }).done(function () {

    })
        .fail(function (xhr) {
            switch (xhr.status) {
                case 401:
                    // console.log("msg.unauthorized");
                    break;
                case 404:
                    // console.log("msg.notFound");
                    break;
                case 409:
                    //  console.log("msg.conflict");
                    break;
                default:
                     console.log("msg.fail + msg.contactAdmin");
                    break;
            }
        });
}


function viewTaxPayerForm() {
  
    //populate residency
    populateResidency();

    $('#invoiceDiv').css({ 'height': '435px' });
    $("#taxpayerinfo").prop("hidden", false); 
    $("#taxpayerinfo2").prop("hidden", false);
    $("#taxpayerinfo3").prop("hidden", false);
    $("#contractAndTransDecNums").prop("hidden", false);    
    $("#contractAndTransDec").prop("hidden", false);    
    $("#nontaxpayerphone").prop("hidden", true);
    $("#nontaxpayerinfo").prop("hidden", true);
    $("#nontaxpayerinfo2").prop("hidden", true);
    $("#nontaxpayeraddress").prop("hidden", true);

    clearTaxCalc();

    //clear Non Taxpayer fields
    $('#nameOfNonTaxPayer,  #emailOfNonTaxpayer, #phoneOfNonTaxPayer, #residencyOfNonTaxPayer, #addOfNonTaxPayer, #descOfContract, #descOfTrans, #invoice, #contractNum, #amount, #contract_amount').val('');
            
    $("#transDate").focus();
    document.getElementById('taxCalculations').hidden = false;     
}

function viewNonTaxPayerForm() {

    //populate residency
    populateResidency();

    $('#nameOfTaxpayer, #TaxIdentificationNumber,  #emailOfTaxpayer, #phoneOfTaxPayer, #residencyOfTaxPayer, #descOfContract, #descOfTrans, #invoice, #contractNum, #amount, #contract_amount').val('');
    $('#invoiceDiv').css({ 'height': '435px' });
    $("#nontaxpayerinfo").prop("hidden", false);
    $("#nontaxpayerphone").prop("hidden", false);
    $("#nontaxpayeraddress").prop("hidden", false);
    $("#nontaxpayerinfo").prop("hidden", false);
    $("#nontaxpayerinfo2").prop("hidden", false);
    $("#taxpayerinfo").prop("hidden", true);
    $("#taxpayerinfo2").prop("hidden", true);
    $("#taxpayerinfo3").prop("hidden", true);
    $("#contractAndTransDecNums").prop("hidden", false);
    $("#contractAndTransDec").prop("hidden", false);   

    //clear Taxpayer fields
    clearTaxCalc();


    $("#transDate").focus();
    document.getElementById('taxCalculations').hidden = false;     
}

$("#btnGetTransactionModal").click(function () {
   
    document.getElementById("WHTPageDataBody").hidden = false;
    document.getElementById("WHTPageImportDataBody").hidden = true;
});

$("#btnImport").click(function () {
    ResetSheetList();
    document.getElementById("WHTPageImportDataBody").hidden = false;
    document.getElementById("WHTPageDataBody").hidden = true;
    
    //quickly unhide and populate with empty kendo grid then hide again for the data to be loaded correctly
    document.getElementById("import_grid").hidden = false;
    generateFreshGrid();
    document.getElementById("import_grid").hidden = true;
   
});

$("#cancelTrans").click(function () {
    document.getElementById("WHTPageDataBody").hidden = true;
}); 

$("#whtType").change(function () {
    if (document.getElementById('contractNum').value == '') {
        document.getElementById('contractNum').value = document.getElementById('invoice').value;
    }
    GetWhtTypeByWhtId();
   
});

function checkAmountValues() {
    var contr_amount = Number(commaRemover(document.getElementById('contract_amount').value));
    var gross_amount = Number(commaRemover(document.getElementById('amount').value));

    //console.log(contr_amount);
    //console.log(gross_amount);

    if (gross_amount > contr_amount) {
        toastr.warning("Gross Amount can not be greater than Contract Amount. Please enter the right amount");
        document.getElementById('submitTrans').disabled = true;
        document.getElementById('amountCalculations').hidden = true;
    }
    else {
        document.getElementById('amountCalculations').hidden = false;

    }
    
}

function checkAmountValuesBefore() {
    if (document.getElementById('amount').value != '') {
        var contr_amount = Number(commaRemover(document.getElementById('contract_amount').value));
        var gross_amount = Number(commaRemover(document.getElementById('amount').value));

        //console.log(contr_amount);
        //console.log(gross_amount);

        if (gross_amount > contr_amount) {
            toastr.warning("Gross Amount can not be greater than Contract Amount. Please enter the right amount");
            document.getElementById('submitTrans').disabled = true;
            document.getElementById('amountCalculations').hidden = true;
        }
        else {
            document.getElementById('amountCalculations').hidden = false;

        }
    }

}
   

function submitNewTransaction() {
    PostWHTTransaction();
    document.getElementById("WHTPageDataBody").hidden = true;
}
    
document.getElementById('invoice').addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        checkInvoiceNumberLenth(); 
        checkInvoiceNumber();
          
    }
}); 

document.getElementById('emailOfNonTaxpayer').addEventListener("blur", function (event) {
    isEmailValid(document.getElementById('emailOfNonTaxpayer').value)    
}); 

document.getElementById('emailOfTaxpayer').addEventListener("blur", function (event) {
    isEmailValid(document.getElementById('emailOfTaxpayer').value)
}); 

function getTINData() {
    //document.getElementById("nameOfTaxpayer").value = "Augustine Akoto Larbi-Ampofo";
    GetTaxPayerEntityData();
   
}

function populateResidency() {
    var dataModel = {
        CodeType: "RES",
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetGenericCodes`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);
        if (data.body.length > 0) {
            //var options = "<option value=''>Please select</option>";
            var options = "<option value='0' selected disabled>Select Residency Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].description}</option>`;
            }
            //Residency Type
            $("#residencyOfNonTaxPayer").html(options);
            $("#residencyOfTaxPayer").html(options);

        }
    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
    });

}

function checkInvoiceNumberLenth() {

    if (document.getElementById('invoice').value == '') {
        toastr.warning("Invoice number cannot be left blank");
        document.getElementById('taxCalculations').hidden = true;
        document.getElementById('contractAndTransDec').hidden = true;
    }
    else {
        document.getElementById('taxCalculations').hidden = false;
        document.getElementById('contractAndTransDec').hidden = false;
    }
}

function checkInvoiceNumber() {
   
        $('#invoiceDiv').css({ 'height': '435px' });
        var dataModel = {
            CodeType: document.getElementById("invoice").value,
        };

        var postData = JSON.stringify(dataModel);

        var postUrl = `?handler=CheckInvoiceNumber`;
        //console.log('Checking the Invoice number:')
        $.post(postUrl, postData, function (data, status) {
            // Log response to console
            //console.log('Invoice Number Exists?: ', data)
            if (data.body == false) {
                document.getElementById('descOfContract').disabled = false;
                document.getElementById('descOfTrans').disabled = false;
                document.getElementById('taxCalculations').hidden = false;
            }
            else {

                document.getElementById('descOfContract').disabled = true;
                document.getElementById('descOfTrans').disabled = true;
                document.getElementById('taxCalculations').hidden = true;
               
                toastr.warning("This Invoice has already been entered by this Entity. Please try another.")
            }

        }).fail(function (response) {
            console.log('Response Error: ' + response.responseText);
        });
       
}

function getVatTypes() {
    
    var postUrl = AppServerUrl + "/api/WHT/GetAllVatRates";
   
    $.post(postUrl, null, function (data, status) {
        // Log response to console
        //console.log('VAT Types Data: ', data);
        if (data.body.length > 0) {
           
            var options = "<option value='0' selected disabled>Select VAT Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                options += `<option value='${data.body[i].id}'>${data.body[i].name}</option>`;
               
            }
            //Residency Type
            $("#vatType").html(options);
        }       

    }).fail(function (response) {
        console.log('Response Error: ' + response.responseText);
        });
       
}

function checkIfVatRateIsLoadedBeforeComputingValues() {

    var id = document.getElementById("vatType").value;
    if (id == 0) {
        //do nothing
        //console.log("I'm doing nothing");
    }
    else {
        getVatRates();
    }

    
}


function populateWHTType() {
    var code;

    if (document.getElementById("TaxIdentificationNumber").value == "") {
        code = document.getElementById("residencyOfNonTaxPayer").value;        
        //code = "11111"
    }
    else {      
        code = document.getElementById("residencyOfTaxPayer").value;
        //code = "22222"
    }
    //console.log(code);

    var dataModel = {
        CodeType: code
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetWHTTypeByResStatus`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.table(data.body);
        if (data.body.length > 0) {
            //var options = "<option value=''>Please select</option>";
            var options = "<option value='0' selected disabled>Select WHT Type</option>";
            for (var i = 0; i < data.body.length; i++) {
                //options += `<option value='${data.body[i].taxRate}' id='${data.body[i].whtCode}' class='wht'>${data.body[i].description}</option>`;
                options += `<option value='${data.body[i].id}' class='wht'>${data.body[i].description}</option>`;
            }
            //Residency Type
            $("#whtType").html(options);
        }
        else {
            var options = "<option value='0' selected disabled>No WHT Type Available</option>";
            $("#whtType").html(options);
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });

}


function CheckForTaxpayerExemption() {

    
    var dataModel = {
        whtType: document.getElementById("whtCode").value,
        tin: document.getElementById('TaxIdentificationNumber').value
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    //Call Local API   
    var postUrl = AppServerUrl + '/api/WHT/CheckForTaxpayerExemption';
    $.post(postUrl, postData, function (data, status) {
        $('body').hideLoading();
        // Log response to console
        console.log('Response Data: ', data);
        if (data.body == true) {
            checkExemptionFlag = 1;
        }
        else {
            checkExemptionFlag = 0;
        }
        
    }).fail(function (response) {
       
        // Hide Preloader
        $('body').hideLoading();
    });

}

function GetWhtTypeByWhtId() {

    var code;
    code = document.getElementById('whtType').value;
   

    var dataModel = {
        CodeType: code
    };

    var postData = JSON.stringify(dataModel);
    //console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetWhtTypeByWhtId`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.table(data.body);
        if (data.body.length > 0) {            
            document.getElementById('getflRateLabel').textContent = moneyInTxt(data.body[0].getFundLevyRate, 'en', 2);
            document.getElementById('nhilRateLabel').textContent = moneyInTxt(data.body[0].nhilRate, 'en', 2);
            document.getElementById('vatWHTAmountRateLabel').textContent = moneyInTxt(data.body[0].whVatRate, 'en', 2);
            document.getElementById('whtRateLabel').textContent = moneyInTxt(data.body[0].taxRate, 'en', 2);
            document.getElementById('whtCode').value = data.body[0].whtCode ;

            //calc nhil
            amount = document.getElementById("amount").value;
            var nhil = ((data.body[0].nhilRate/100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("NHIL").value = moneyInTxt(nhil, 'en', 2);

            //calc getfund

            var getfund = ((data.body[0].getFundLevyRate/100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("getFund").value = moneyInTxt(getfund, 'en', 2);

            //calc vatable amt
            nhil = document.getElementById("NHIL").value;
            var temp_vatable = (((Number(commaRemover(amount)) + Number(commaRemover(nhil)) + Number(commaRemover(getfund)))).toFixed(2));
            document.getElementById("vatAmount").value = moneyInTxt(temp_vatable, 'en', 2);

            //calc vat withholding amt      
            vat_amount = document.getElementById("vatAmount").value;
            var vatWithHolding = ((data.body[0].whVatRate / 100) * Number(commaRemover(amount))).toFixed(2);
            document.getElementById("vatWHTAmount").value = moneyInTxt(vatWithHolding, 'en', 2);

            //cal withholding tax
            var whtRate = data.body[0].taxRate;            
            var paymentAmount = document.getElementById('amount').value;

            if (Number(commaRemover(paymentAmount)) > 2000 ) {
                var taxWithHeld = ((whtRate / 100) * Number(commaRemover(paymentAmount))).toFixed(2);
                document.getElementById("taxWTH").value = moneyInTxt(taxWithHeld, 'en', 2);
                //console.log("Greater", Number(commaRemover(paymentAmount)))
            }
            
            else if (Number(commaRemover(paymentAmount)) < 2000) {
                //console.log("Less: ", Number(commaRemover(paymentAmount)))
                //var taxWithHeld = ((whtRate / 100) * Number(commaRemover(paymentAmount))).toFixed(2);
                document.getElementById('whtRateLabel').textContent = 0.00;
                document.getElementById("taxWTH").value = moneyInTxt("0.0000", 'en', 2);
            }

            //CheckForTaxpayerExemption
            CheckForTaxpayerExemption();

            if (checkExemptionFlag == 1) {
                document.getElementById('whtRateLabel').textContent = 0.00;
                document.getElementById("taxWTH").value = moneyInTxt("0.0000", 'en', 2);
            }
           

            var withHeld = document.getElementById("taxWTH").value;
            document.getElementById("netPayAmt").value = NumberToMoney(commaRemover(paymentAmount) - commaRemover(withHeld));

            //check if required fields have been filled
            var phoneCheck = document.getElementById('phoneOfNonTaxPayer').value + '' + document.getElementById('phoneOfTaxPayer').value;
            if (document.getElementById('invoice').value != '' && document.getElementById('taxWTH').value != '' && document.getElementById('transDate').value != '' && phoneCheck != ''){
                document.getElementById('submitTrans').disabled = false;
            }
            else {
                toastr.warning("Please make sure all required fields have been filled");
            }


           

        }
        else {
            toastr.warning("No rates available currently");
        }
    }).fail(function (response) {
        //console.log('Response Error: ' + response.responseText);
    });
}

function calTaxWithHeld() {
    //var whtRate = document.getElementById("whtType").value;
    //vat_amount = document.getElementById("vatAmount").value;
    //var phoneCheck = document.getElementById('phoneOfNonTaxPayer').value + '' + document.getElementById('phoneOfTaxPayer').value;
    //var taxWithHeld = ((whtRate / 100) * Number(commaRemover(vat_amount))).toFixed(2);
    
    //document.getElementById('whtRateLabel').textContent = moneyInTxt($("#whtType option:selected").val(), 'en', 2);
    //document.getElementById("taxWTH").value = moneyInTxt(taxWithHeld, 'en', 2); 

    //var vatWHTAmount = document.getElementById("vatWHTAmount").value;
    //var totalWithheld = NumberToMoney((commaRemover(taxWithHeld) + commaRemover(vatWHTAmount)));

    //document.getElementById("totalTaxWTH").value = totalWithheld;

    //var paymentAmount = document.getElementById('amount').value;
    //var withHeld = document.getElementById("totalTaxWTH").value;

    ////console.log("Withheld: ", commaRemover(withHeld));
    ////console.log("Payment Amt: ", commaRemover(paymentAmount));

    //document.getElementById("netPayAmt").value = NumberToMoney(commaRemover(paymentAmount) - commaRemover(withHeld));

    ////check if required fields have been filled
    //if (document.getElementById('invoice').value != '' && document.getElementById('taxWTH').value != '' && document.getElementById('transDate').value != '' && phoneCheck != '') {
              
    //    document.getElementById('submitTrans').disabled = false;

    //}
    //else {
    //    toastr.warning("Please make sure all required fields have been filled");
    //}
   
}

function isEmailValid(email) {

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (re.test(String(email).toLowerCase()) == false) {
        toastr.warning('Not a valid Email Format');
        // document.getElementById('btnContinue').disabled = true;
    }
    else {
        return;
    }

}

var GetTaxPayerEntityData = function () {
    // Show Preloader
    $('body').showLoading();

    var dataModel = {
        CodeType:  document.getElementById('TaxIdentificationNumber').value,
    };

    var postData = JSON.stringify(dataModel);
   // console.log("postData", postData);

    // Call Local API
    var postUrl = `?handler=GetTaxPayerEntityData`;
    $.post(postUrl, postData, function (data, status) {
        // Log response to console
        //console.log('Response Data: ', data);

        if (data.caption == "No Content") {
            $('body').hideLoading();
            document.getElementById('nameOfTaxpayer').value = "";
            toastr.warning("Invalid TIN");
        }

        if (data.body.length > 0) {
            $('body').hideLoading();
            document.getElementById('nameOfTaxpayer').value = ucwords(data.body[0].requestingEntityName, true);
            var numb = data.body[0].phoneNo;
            $("#phoneOfTaxPayer").css("padding-left", "88px");
            //display phone number without country code
            if (numb.substring(0, 4) == '+233') {
                document.getElementById('phoneOfTaxPayer').value = numb.substring(4, numb.length);
            }
            else {
                document.getElementById('phoneOfTaxPayer').value = numb.substring(1, numb.length);
            }
                      
            document.getElementById('emailOfTaxpayer').value = data.body[0].emailAddress;   
           

        }
       
       
        
    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning("Invalid TIN");
       // console.log('Response Error: ' + response.responseText);
    });
}


function toCamelCase() {
    var nameText = document.getElementById('nameOfNonTaxPayer').value;
    document.getElementById('nameOfNonTaxPayer').value = ucwords(nameText, true);
}

function clearTaxCalc() {
    document.getElementById('whtRateLabel').textContent = '';
    document.getElementById('getflRateLabel').textContent = '';
    document.getElementById('nhilRateLabel').textContent = '';
    document.getElementById("contract_amount").value = ''; 
    document.getElementById("amount").value = ''; 
    document.getElementById("getFund").value = ''; 
    document.getElementById("netPayAmt").value = ''; 
    document.getElementById("taxRate").value = ''; 
    document.getElementById("vatAmount").value = ''; 
    document.getElementById("totalTaxWTH").value = ''; 
    document.getElementById("vatWHTAmount").value = ''; 
    document.getElementById("taxWTH").value = '';
    document.getElementById("NHIL").value = ''; 
}

function clearFields() {
    $('#nameOfNonTaxPayer, #nameOfTaxpayer, #emailOfTaxpayer, #emailOfNonTaxpayer, #phoneOfNonTaxPayer, #phoneOfTaxPayer, #transDate, #invoice, #contractNum, #descOfContract, #descOfTrans').val('');
    $('#TaxIdentificationNumber, #residencyOfTaxPayer, #residencyOfNonTaxPayer, #addOfNonTaxPayer').val('');
    $('#contract_amount, #amount, #vatType, #whtType, #taxWTH, #NHIL, #getFund, #taxRate, #vatAmount, #vatWHTAmount, #taxWHT, #netPayAmt').val('');
    document.getElementById("yesTaxPayer").checked = false;
    document.getElementById("nonTaxPayer").checked = false;
    document.getElementById('whtRateLabel').textContent = '';
    document.getElementById('getflRateLabel').textContent = '';
    document.getElementById('nhilRateLabel').textContent = '';
    document.getElementById('contractAndTransDec').hidden = true;
    $('#invoiceDiv').css({ 'height': '92px' });
}



function clearTINdetails() {
    document.getElementById('emailOfTaxpayer').value = '';
    document.getElementById('nameOfTaxpayer').value = '';
    document.getElementById('phoneOfTaxPayer').value = '';
}

function showCode(id) {
    // console.log(id);
    var code = ($(`#${id}`).parent('.intl-tel-input').find(".selected-dial-code").text());
    var countryCode = $(`#${id}`).parent('.intl-tel-input').find(".iti-flag").attr("class");
    //console.log(countryCode.split(" ")[1] + code);
    country_code = code;

}

function validatePhone() {
    $('body').showLoading();
    // send API request
    var countryCode = $(".iti-flag").attr("class");
    var code = countryCode.split(" ")[1];

    //switch the phones for taxpayers and non taxpayers for the data {if taxpayer on  itaps or not}
    if (document.getElementById("nameOfNonTaxPayer").value == "") {
        PhoneNumber = document.getElementById('phoneOfTaxPayer').value;
    }
    else {
        PhoneNumber = document.getElementById('phoneOfNonTaxPayer').value;
    }
     //console.log(code);

    // set endpoint and your access key
    var free_access_key = '7c37b761adbea422bb6f1beffbd3d234';
    var paid_access_key = '05d7f2c6c167f4bd2e737b276e01b594'
    var phone_number = PhoneNumber;

    // verify phone number via AJAX call
    $.ajax({
        url: 'https://apilayer.net/api/validate?access_key=' + paid_access_key + '&number=' + phone_number + '&country_code=' + code,
        dataType: 'jsonp',
        success: function (json) {
            $('body').hideLoading();
            

            if (json.valid == true && json.line_type == 'landline') {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "darkred";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "darkred";
                
                toastr.warning('Landlines are not accepted. Please use a mobile number.')
            }

            else if (json.valid == false) {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "darkred";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "darkred";
                
                toastr.warning('Invalid Phone Number');
            }
            else if (json.valid == true && json.line_type == 'mobile') {
                document.getElementById("phoneOfTaxPayer").style.borderColor = "green";
                document.getElementById("phoneOfNonTaxPayer").style.borderColor = "green";

                setTimeout(function () {
                    document.getElementById("phoneOfTaxPayer").style.border = '1px solid #dbdfe4';
                    document.getElementById("phoneOfNonTaxPayer").style.border = '1px solid #dbdfe4';
                }, 1000);               
                
               
            }

        }
    }).fail(function (response) {
        $('body').hideLoading();
        toastr.warning('Number validation failed. Please try re-entering your number')
        
    });
   
}

function resetForm() {
    
    clearFields();
    $("#taxpayerinfo").prop("hidden", true);
    $("#taxpayerinfo2").prop("hidden", true);
    $("#taxpayerinfo3").prop("hidden", true);
    $("#nontaxpayerphone").prop("hidden", true);
    $("#nontaxpayerinfo").prop("hidden", true);
    $("#nontaxpayerinfo2").prop("hidden", true);
    $("#nontaxpayeraddress").prop("hidden", true); 
    $("#taxCalculations").prop("hidden", true); 
    $("#registrationCheck").prop("hidden", false); 
    $("#contractAndTransDecNums").prop("hidden", true); 
    //console.log("Resetting the form");

}

function checkAllRequiredFields() {
    var contract = document.getElementById("contractNum").value;
    var invoice = document.getElementById("invoice").value;
    var conDesc = document.getElementById("descOfContract").value;
    var invDesc = document.getElementById("descOfTrans").value;
    var tDate = document.getElementById("transDate").value;

    if (contract == '' || invoice == '' || conDesc == '' || invDesc == ''
        || tDate == '') {
        return false;
    }
    else {
        return true;
    }
}

var PostWHTTransaction = function() {
       
    //switch the names for taxpayers and non taxpayers for the data {if taxpayer on  itaps or not}
    if (document.getElementById("nameOfNonTaxPayer").value == ""){
        taxpayerName = document.getElementById("nameOfTaxpayer").value;
        busLocation = "";
        taxpayerEmail = document.getElementById("emailOfTaxpayer").value;
        taxpayerTel = document.getElementById("phoneOfTaxPayer").value;
        resStatusId = document.getElementById("residencyOfTaxPayer").value;

    }
    else {
        taxpayerName = document.getElementById("nameOfNonTaxPayer").value;
        taxpayerEmail = document.getElementById("emailOfNonTaxpayer").value;
        busLocation = document.getElementById("addOfNonTaxPayer").value;
        taxpayerTel = document.getElementById("phoneOfNonTaxPayer").value;
        resStatusId = document.getElementById("residencyOfNonTaxPayer").value;
    }

    //PostWHTTransaction
    var tDate = document.getElementById("transDate").value;
    
    var dataModel = {
        whtAgentTaxpayerId: whtAgentTaxpayerid,
        tin: document.getElementById("TaxIdentificationNumber").value,
        transactionDate: tDate.substring(6, tDate.length) + '-' + tDate.substring(3, 5) + '-' + tDate.substring(0, 2),
        //periodId: periodId,
        resStatusId: resStatusId,
        taxOfficeId: taxOfficeId,
        userId: userId,
        invoiceNumber: document.getElementById("invoice").value,
        busLocation: busLocation,
        taxpayerName: taxpayerName,
        whtAgentTIN: nameTIN.TIN,
        //whtType: document.getElementById("whtType").getElementsByClassName("wht")[document.getElementById("whtType").selectedIndex - 1].id,
        whtType: document.getElementById("whtCode").value,
        contractAmt: document.getElementById("contract_amount").value,
        grossPaymentAmt: document.getElementById("amount").value,
        taxRate: document.getElementById('whtRateLabel').textContent,
        //taxRate: document.getElementById("taxRate").value,
        taxWithHeld: document.getElementById('taxWTH').value,          
        taxpayerTel: taxpayerTel,
        taxpayerEmail: taxpayerEmail,
        vatableAmt: document.getElementById('vatAmount').value,
        vatTypeId: "76fc27c6-7033-47cc-b97d-6816f82f1654",
        contractNo: document.getElementById("contractNum").value,  
        contractDesc: document.getElementById("descOfContract").value,
        invoiceDesc: document.getElementById("descOfTrans").value,
        Permissions: nameTIN.Codes
    };

    var postData = JSON.stringify(dataModel);
    console.log("postData", postData);

    //check if require fields have been filled

        if (checkAllRequiredFields() == false) {
            toastr.error("Unsuccessful Transaction. Please make sure all required fields have been filled")
        }
        else {
            //Call Local API
            var postUrl = `?handler=PostWHTTransaction`;
            $.post(postUrl, postData, function (data, status) {
                // Log response to console
                //console.log('Response Data: ', data);

                if (data.status == "Successful") {
                    toastr.success("Your Transaction has been submitted successfully.");
                    //clearFields();
                    //setTimeout(function () { window.location = `${AppServerUrl}/wht`; }, 1000); //1000 means 1 secs       
                    setTimeout(resetForm(), 1000);
                } else {

                    toastr.warning("Your Transaction could not be submitted. Please try again.");

                    // Hide Preloader
                    $('body').hideLoading();
                }
            }).fail(function (response) {
                console.log('Response Error: ' + response.responseText);
                clearFields();
                // Hide Preloader
                $('body').hideLoading();
            });
        }
     
}

