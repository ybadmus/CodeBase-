#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Codes\_PITRatesDetail.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "b7c2b41d5a3ef666707d4b6ee66915d5585da1b1"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Codes__PITRatesDetail), @"mvc.1.0.view", @"/Views/Codes/_PITRatesDetail.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Codes/_PITRatesDetail.cshtml", typeof(AspNetCore.Views_Codes__PITRatesDetail))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b7c2b41d5a3ef666707d4b6ee66915d5585da1b1", @"/Views/Codes/_PITRatesDetail.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"24e702857a8f67f65d32f4756a8d9329551657cd", @"/Views/_ViewImports.cshtml")]
    public class Views_Codes__PITRatesDetail : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 1200, true);
            WriteLiteral(@"<input id=""codeId"" value="""" hidden />
<input id=""code"" value="""" hidden />

<div id=""crDetails"">
    <div class=""card-body"">
        <div class=""tab-content"" id=""myTabContent"">
            <div class=""tab-pane fade show active"" id=""taxPosition"" role=""tabpanel"" aria-labelledby=""nav-profile-tab"">

                <div class=""form-horizontal"">
                    <div class=""form-row"">
                        <div class=""col-sm-5"">
                            <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>Application Detail - <span id=""ratesCode""></span> </b></p>
                                <div class=""table-responsive border-bottom"">
                                    <table class=""table table-bordered"" id=""detailsViewTR"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">St");
            WriteLiteral("art Date</td>\r\n                                                <td title=\"Date Format: YYYY/MM/DD\" style=\"padding-left:5px;width:250px;font-weight:bold;\" id=\"startDate\"></td>\r\n");
            EndContext();
            BeginContext(1423, 381, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">End Date</td>
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""endDate""></td>
");
            EndContext();
            BeginContext(2023, 732, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Description</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""description""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Amount Based</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""amtBased""></td>
");
            EndContext();
            BeginContext(3276, 741, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Tax Free Amount</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""taxFreeAmt""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Based on Table</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""basedOnTable""></td>
");
            EndContext();
            BeginContext(4542, 387, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Fixed Amount Table</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""fixedAmtTable""></td>
");
            EndContext();
            BeginContext(5455, 1345, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Default</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""default""></td>
                                            </tr>
                                        </tbody>
                                    </table>


                                    <table class=""table table-bordered"" id=""AddViewTR"" style=""display: none;"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Description</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""descriptionTR""></td>
                                            </tr>
      ");
            WriteLiteral(@"                                      <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Amount Based</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""amtBasedTR""></td>
");
            EndContext();
            BeginContext(7321, 745, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Tax Free Amount</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""taxFreeAmtTR""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Based on Table</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""basedOnTableTR""></td>
");
            EndContext();
            BeginContext(8591, 389, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Fixed Amount Table</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""fixedAmtTableTR""></td>
");
            EndContext();
            BeginContext(9506, 1436, true);
            WriteLiteral(@"                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Default</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""defaultTR""></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class=""col-sm-7"">
                            <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>Tax Band</b></p>
                                <div class=""table-responsive border-bottom"" style=""height: 300px;"">
                                    <button id=""newRow"" style=""float: right;"" class=""btn btn-success btn-sm");
            WriteLiteral(@"""><i class='fa fa-plus-circle'></i>  Add Rows</button>
                                    <button id=""saveRow"" style=""float: right;"" class=""btn btn-primary btn-sm""><i class='fa fa-plus-circle'></i>  Save Row</button>
                                    <table class=""table table-bordered"">
                                        <thead>
                                            <tr class=""table-info"">
");
            EndContext();
            BeginContext(11040, 315, true);
            WriteLiteral(@"                                                <th scope=""col"" style=""color: black;"">Tax Band</th>
                                                <th scope=""col"" style=""color: black;"">Taxable Amount</th>
                                                <th scope=""col"" style=""color: black;"">Percentage (%)</th>
");
            EndContext();
            BeginContext(11452, 837, true);
            WriteLiteral(@"                                            </tr>
                                        </thead>
                                        <tbody id=""taxGrid""></tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                    <button id=""backToGrid"" class=""btn btn-outline-primary""> Back</button>
                    <button id=""saveDetails"" style=""float: right; margin-left: 2px;"" class=""btn btn-success"">  Save</button>
                    <button id=""editDetails"" style=""float: right; margin-left: 2px;"" class=""btn btn-light"">  Edit Fields</button>
                    <button id=""lockDetails"" style=""float: right; margin-left: 2px;"" class=""btn btn-primary"">  Lock Fields</button>
");
            EndContext();
            BeginContext(12453, 82, true);
            WriteLiteral("                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n");
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