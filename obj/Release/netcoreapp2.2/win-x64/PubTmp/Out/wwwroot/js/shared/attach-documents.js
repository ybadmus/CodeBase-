var AttachmentFiles = [],
    AttachmentFileExts = ["png", "jpg", "jpeg", "pdf"], //, "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    AttachmentFileTypes = [];

var GetEncodedAttachmentFile = (file) => {

    // Reset AttachmentFile
    var AttachmentFile = {};
    AttachmentFile.Size = file.size;
    AttachmentFile.Type = file.type;
    AttachmentFile.Ext = file.name.split('.').pop();
    AttachmentFile.Name = file.name.substring(0, file.name.lastIndexOf("."));
    AttachmentFile.Width = 0;
    AttachmentFile.Height = 0;

    // Initialize file reader
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = ((el) => {
        return (e) => {

            AttachmentFile.Data = e.target.result;
            var imgExts = ["png", "jpg", "jpeg"];
            if (imgExts.includes(AttachmentFile.Ext)) {
                var img = new Image;
                img.src = AttachmentFile.Data;

                img.onload = () => {
                    AttachmentFile.Width = img.width;
                    AttachmentFile.Height = img.height;
                }
            }
            // Check if file type is valid
            if (IsFileValid(AttachmentFile)) {
                AttachmentFiles.push(AttachmentFile);
            }
        };
    })(file);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
}

var IsFileValid = function (file) {
    if (!AttachmentFileExts.includes(file.Ext)) {
        let fileFormats = AttachmentFileExts.join(", "), laxComa = ", ", rexOr = ' or ';
        var pat = new RegExp('(\\b' + laxComa + '\\b)(?!.*\\b\\1\\b)', 'i');
        fileFormats = fileFormats.replace(pat, rexOr);

        toastr.info(`${file.Name} is an invalid file format. Please select a ${fileFormats} file.`);
        return false;
    }
    if (file.Size > 1048576) {
        toastr.info(`${file.Name} file size is too big. Please select a file not bigger than 1MB.`);
        return false;
    }
    return true;
}


var PromptConfig = {
    Title: null,
    Message: null,
    Size: null,
    Positive: {
        Title: null,
        Action: null,
        Alert: null,
        Call: null
    },
    Negative: {
        Title: null,
        Action: null,
        Alert: null,
        Call: null
    }
};
var ShowPrompt = () => {
    //console.log("PromptConfig", PromptConfig);

    $("#PromptTitle").html(PromptConfig.Title);
    $("#PromptMessage").html(PromptConfig.Message);

    // Size
    $("#PromptModalSize").removeClass("modal-sm");
    $("#PromptModalSize").removeClass("modal-md");
    $("#PromptModalSize").removeClass("modal-lg");
    if (PromptConfig.Size) {
        $("#PromptModalSize").addClass(`modal-${PromptConfig.Size}`);
    }

    // No Button
    $("#PromptNo").prop("hidden", true);
    if (PromptConfig.Negative && PromptConfig.Negative.Title) {
        $("#PromptNo").html(PromptConfig.Negative.Title);
        $("#PromptNo").prop("hidden", false);
    }

    //Yes Button
    $("#PromptYes").prop("hidden", true);
    if (PromptConfig.Positive && PromptConfig.Positive.Title) {
        $("#PromptYes").html(PromptConfig.Positive.Title);
        $("#PromptYes").prop("hidden", false);
    }

    $("#PromptModal").modal("show");
}


var PromptOK = () => {
    PromptYesNo();
}

var PromptNo = () => {
    PromptYesNo("No");
}

var PromptYesNo = (opt = "Yes") => {
    // console.log("PromptConfig", PromptConfig);

    var optAlert = PromptConfig.Positive.Alert;
    var optAction = PromptConfig.Positive.Action;
    var optCall = PromptConfig.Positive.Call;
    if (opt != "Yes") {
        optAlert = PromptConfig.Negative.Alert;
        optAction = PromptConfig.Negative.Action;
        optCall = PromptConfig.Negative.Call;
    }


    if (optAlert != null && optAlert != "") {
        toastr.success(optAlert);
    }

    if (optCall != null) {
        $("#PromptModal").modal("hide");
        Function(optCall());
    } else if (optAction === null) {
        $("#PromptModal").modal("hide");
    } else {
        if (optAlert != null && optAlert != "") {
            setTimeout(function () { window.location = `${AppServerUrl}/${optAction}`; }, 1000); //1000 means 1 secs
        } else {
            window.location = `${AppServerUrl}/${optAction}`;
        }
    }
}


/*
 * 
 * /
 */

//return a promise that resolves with a File instance
var Base64ToFile = (url, filename, mimeType) => {
    return (fetch(url)
        .then((res) => {return res.arrayBuffer();})
        .then((buf) => {return new File([buf], filename, {type:mimeType});})
    );
}


var GetExtensionFromMime = (mimeType) => {
    for (let x = 0; x < AttachmentFileExts.length; x++) {
        let fEx = AttachmentFileExts[x];
        if (mimeType.indexOf(fEx) !== -1) {
            return fEx;
        }
    }
}