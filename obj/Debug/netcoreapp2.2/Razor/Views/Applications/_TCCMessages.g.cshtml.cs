#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\_TCCMessages.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "702b147a06a06fa55a6744b8f5aa4fabad8d04c3"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Applications__TCCMessages), @"mvc.1.0.view", @"/Views/Applications/_TCCMessages.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Applications/_TCCMessages.cshtml", typeof(AspNetCore.Views_Applications__TCCMessages))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\_ViewImports.cshtml"
using ITAPS_HOST;

#line default
#line hidden
#line 2 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\_ViewImports.cshtml"
using ITAPS_HOST.Models;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"702b147a06a06fa55a6744b8f5aa4fabad8d04c3", @"/Views/Applications/_TCCMessages.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"39b145f2b90cb6de2fa77b9df3031b426358dafe", @"/Views/_ViewImports.cshtml")]
    public class Views_Applications__TCCMessages : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #line hidden
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 285, true);
            WriteLiteral(@"<div id=""applicantColumn"" class=""tabcontent"">
    <div class=""taxpayerMessageScroll"" id=""taxpayerMessageScroll"" style=""height: 250px; overflow-y: scroll; border-bottom: 1px solid silver; border-left: 1px solid silver;"">
        <div id=""chatUI"">

        </div>
    </div>

    ");
            EndContext();
            BeginContext(285, 385, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "702b147a06a06fa55a6744b8f5aa4fabad8d04c33742", async() => {
                BeginContext(291, 372, true);
                WriteLiteral(@"
        <label for=""commentToTaxpayer"" class=""control-label"" style=""font-weight: 600; padding: 2px;"">Message To <span id=""applicantFName""></span></label>
        <textarea type=""text"" rows=""2"" autocomplete=""off"" class=""form-control form-cascade-control input-sm"" id=""commentToTaxpayer"" style=""resize:none;"" placeholder=""Type message to Applicant here""></textarea>
    ");
                EndContext();
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            EndContext();
            BeginContext(670, 283, true);
            WriteLiteral(@"
</div>

<div id=""internalMessagesColumn"" class=""tabcontent"" style=""display: none;"">
    <div class=""internalMessageScroll"" id=""internalMessageScroll"" style=""height: 250px; overflow-y: scroll;"">
        <div style="""" id=""internalMessageUI"">

        </div>
    </div>

    ");
            EndContext();
            BeginContext(953, 348, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "702b147a06a06fa55a6744b8f5aa4fabad8d04c35879", async() => {
                BeginContext(959, 335, true);
                WriteLiteral(@"
        <label for=""commentToStaff"" class=""control-label"" style=""font-weight: 600; padding: 2px;"">Internal Message</label>
        <textarea type=""text"" rows=""2"" autocomplete=""off"" class=""form-control form-cascade-control input-sm"" id=""commentToStaff"" style=""resize:none;"" placeholder=""Type Internal messages here""></textarea>
    ");
                EndContext();
            }
            );
            __Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_FormTagHelper);
            __Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.RenderAtEndOfFormTagHelper>();
            __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_RenderAtEndOfFormTagHelper);
            await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
            if (!__tagHelperExecutionContext.Output.IsContentModified)
            {
                await __tagHelperExecutionContext.SetOutputContentAsync();
            }
            Write(__tagHelperExecutionContext.Output);
            __tagHelperExecutionContext = __tagHelperScopeManager.End();
            EndContext();
            BeginContext(1301, 974, true);
            WriteLiteral(@"
</div>

<div id=""attachmentColumn"" class=""tabcontent"" style=""display: none;"">
    <div style=""margin-top: 5px;"">
            <div class=""row"" id="""">
                <div class=""container"">
                    <table class=""table table-striped"">
                        <colgroup><col style=""width: 5%;""><col style=""width: 65%;""><col style=""width: 30%;""></colgroup>
                        <thead>
                            <tr class="""" style="" background-color: #364c66 !important;"">
                                <td scope=""col"" style=""color: white;"">#</td>
                                <td scope=""col"" style=""color: white;"">File Name</td>
                                <td scope=""col"" style=""color: white;"">Date</td>
                            </tr>
                        </thead>
                        <tbody id=""DocumentTableId""></tbody>
                    </table>
                </div>
            </div>
        </div>
</div>

");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
