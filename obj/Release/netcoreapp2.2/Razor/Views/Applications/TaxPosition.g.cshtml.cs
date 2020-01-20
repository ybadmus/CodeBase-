#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "003b8b540a72d346b6b5d8a4f8dda6a953e0ee0c"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Applications_TaxPosition), @"mvc.1.0.view", @"/Views/Applications/TaxPosition.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Applications/TaxPosition.cshtml", typeof(AspNetCore.Views_Applications_TaxPosition))]
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
#line 4 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\_ViewImports.cshtml"
using BoldReports.TagHelpers;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"003b8b540a72d346b6b5d8a4f8dda6a953e0ee0c", @"/Views/Applications/TaxPosition.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"24e702857a8f67f65d32f4756a8d9329551657cd", @"/Views/_ViewImports.cshtml")]
    public class Views_Applications_TaxPosition : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", new global::Microsoft.AspNetCore.Html.HtmlString("~/js/applications/taxposition.js"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 2 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml"
  
    ViewData["Title"] = "TaxPosition";

#line default
#line hidden
            BeginContext(49, 77, true);
            WriteLiteral("\r\n<!--Defined this on page level because of control-->\r\n<input id=\"serverUrl\"");
            EndContext();
            BeginWriteAttribute("value", " value=\"", 126, "\"", 152, 1);
#line 7 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml"
WriteAttributeValue("", 134, ViewBag.ServerUrl, 134, 18, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(153, 34, true);
            WriteLiteral(" hidden />\r\n<input id=\"taxpayerId\"");
            EndContext();
            BeginWriteAttribute("value", " value=\"", 187, "\"", 214, 1);
#line 8 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml"
WriteAttributeValue("", 195, ViewBag.TaxpayerId, 195, 19, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(215, 29, true);
            WriteLiteral(" hidden />\r\n<input id=\"appId\"");
            EndContext();
            BeginWriteAttribute("value", " value=\"", 244, "\"", 266, 1);
#line 9 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml"
WriteAttributeValue("", 252, ViewBag.AppId, 252, 14, false);

#line default
#line hidden
            EndWriteAttribute();
            BeginContext(267, 2176, true);
            WriteLiteral(@" hidden />

<div id=""taxPositionView"">
    <div class=""card"">

        <div class=""card-body"">
            <div class=""tab-content"" id=""myTabContent"">
                <div class=""tab-pane fade show active"" id=""taxPosition"" role=""tabpanel"" aria-labelledby=""nav-profile-tab"">

                    <div class=""form-horizontal"">
                        <div class=""form-row"">
                            <div class=""col-md-12"">
                                <div class=""bordered-group"" id="""">
                                    <p class=""card-title""><b>Add Tax Position</b></p>
                                    <div class=""table-responsive border-bottom"">
                                        <table class=""table table-bordered"">
                                            <thead>
                                                <tr class=""table-info"">
                                                    <th scope=""col"" style=""color: black;"">Year</th>
                                              ");
            WriteLiteral(@"      <th scope=""col"" style=""color: black;"">Status </th>
                                                    <th scope=""col"" style=""color: black;"">Chargeable Income</th>
                                                    <th scope=""col"" style=""color: black;"">Tax Charged</th>
                                                    <th scope=""col"" style=""color: black;"">Tax Paid</th>
                                                    <th scope=""col"" style=""color: black;"">Tax Outstanding</th>
                                                </tr>
                                            </thead>
                                            <tbody id=""TaxPositionSummaryGrid""></tbody>
                                        </table>
                                    </div>

                                    <div class=""row"" style=""margin: 15px 0px 15px 0px; font-size: 16px;"">
                                        <div class=""checkbox col-sm-12"">
                                            <label c");
            WriteLiteral("lass=\"row ml-3 mb-3 checkgroup\">\r\n                                                I confirm from the Information available that ");
            EndContext();
            BeginContext(2444, 21, false);
#line 42 "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Applications\TaxPosition.cshtml"
                                                                                         Write(ViewBag.ApplicantName);

#line default
#line hidden
            EndContext();
            BeginContext(2465, 2471, true);
            WriteLiteral(@" has paid all Tax liabilites up to and including the&nbsp;<span id=""previousYear""></span>&nbsp;year of assessment.
                                                <input type=""checkbox"" id=""confirmationBox"" />
                                                <span class=""checkmark""></span>
                                            </label>
                                        </div>
                                        <div class=""checkbox col-sm-12"">
                                            <label class=""row ml-3 mb-3 checkgroup"">
                                                Has paid P.A.Y.E and other Witholding Taxes up to and including&nbsp; <span id=""currentMonthYear""></span>.
                                                <input type=""checkbox"" id=""confirmationBoxPaye"" />
                                                <span class=""checkmark""></span>
                                            </label>
                                        </div>
                              ");
            WriteLiteral(@"          <div class=""checkbox col-sm-12"">
                                            <label class=""row ml-3 mb-3 checkgroup"">
                                                Has submitted all Tax returns up to date.
                                                <input type=""checkbox"" id=""confirmationBoxAll"" />
                                                <span class=""checkmark""></span>
                                            </label>
                                        </div>
                                        <div class=""checkbox col-sm-12"">
                                            <label class=""row ml-3 mb-3 checkgroup"">
                                                Has registered with Ghana Revenue Authority.
                                                <input type=""checkbox"" id=""confirmationBoxGRA"" />
                                                <span class=""checkmark""></span>
                                            </label>
                                 ");
            WriteLiteral(@"       </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <button id=""saveTaxPositionSummary"" style=""float: right"" class=""btn btn-success"" disabled>  Save Tax Position</button>
                </div>
            </div>
        </div>
    </div>
</div>


");
            EndContext();
            DefineSection("scripts", async() => {
                BeginContext(4954, 6, true);
                WriteLiteral("\r\n    ");
                EndContext();
                BeginContext(4960, 56, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "003b8b540a72d346b6b5d8a4f8dda6a953e0ee0c11045", async() => {
                }
                );
                __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(5016, 2, true);
                WriteLiteral("\r\n");
                EndContext();
            }
            );
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
