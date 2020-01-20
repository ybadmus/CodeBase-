$(document).ready(function () {
    var selectedBusiness = "";
    $("#divBusiness").kendoGrid({
        dataSource: {pageSize: 5 },
        sortable: true,
        selectable: true,
        pageable: { refresh: false, pageSizes: true, buttonCount: 5 },
        columns: [
            { field: "id", hidden: true },
            { field: "tradingName", title: "Name" },
            { field: "businessActivity", title: "Activity" },
            {
                command: [
                    { name: "edit", template: "<button class='editBusiness btn btn-primary btn-sm' title='Edit Business details'><span class='fa fa-pencil-alt'></span></div>" }
                ],
                title: "Action",
                width: "70px"
            }
        ]
    });

    loadBusinessDetails();

    function loadBusinessDetails() {
        $('body').showLoading();
        newAjaxRequest(`?handler=GetTaxPayerBusinesses`, "POST", { TaxPayerId: $("#UserTaxPayerId").text() })
            .done(function (data) {
                // console.log("loadBusinessDetails", data);
                $("#divBusiness").data('kendoGrid').dataSource.data(data.body);
            });
    }

    $(document).on("click", ".editBusiness", function (e) {
        selectedBusiness = "";
        var grid = $('#divBusiness').data('kendoGrid'),
            dataItem = grid.dataItem($(e.target).closest("tr"));
        selectedBusiness = dataItem;
        $("#txtBusinessName").text(ucwords(dataItem.tradingName));
        $("#txtBusinessAct").text(ucwords(dataItem.businessActivity));
        $("#txtLLTIN").val(dataItem.landlordTin);
        $("#txtLLPhone").val(dataItem.landlordPhone);
        $("#txtLLName").val(ucwords(dataItem.landlordName));
        $("#modal-business").modal("show");
        $(".LLData").prop("disabled", dataItem.landlordTin === "" ? false : true); //if landlord has no TIN, you can enter the details yourself.
        $("#txtLoadTenancyStatus").val(dataItem.tenancyStatusId);
        $("#txtAccMethods").val(dataItem.accountingMethodId);
    });

    $("#btnBusiness").click(function () {
        var data = {
            "id": selectedBusiness.id,
            "taxPayerId": $("#UserTaxPayerId").text(),
            "businessActivity": selectedBusiness.businessActivity,
            "tradingName": selectedBusiness.tradingName,
            "accountingMethodId": $("#txtAccMethods").val(),
            "tenancyStatusId": $("#txtLoadTenancyStatus").val(),
            "residentialStatusId": $("#txtLoadTenancyStatus").val(),
            "landlordTin": $("#txtLLTIN").val(),
            "landlordName": $("#txtLLName").val(),
            "landlordPhone": $("#txtLLPhone").val()
        };

        $('body').showLoading();
        newAjaxRequest(`?handler=UpdateBusinessDetails`, "POST", data)
            .done(function (ret) {
                loadBusinessDetails();
                $("#modal-business").modal("hide");
                toastr.success("Business successfully updated");
            });
    });

});