#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\PIT\_AnnualEstimatesDetails.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "16e09a4666c46a9ece51b3ffc4047ff81c417c94"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_PIT__AnnualEstimatesDetails), @"mvc.1.0.view", @"/Views/PIT/_AnnualEstimatesDetails.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/PIT/_AnnualEstimatesDetails.cshtml", typeof(AspNetCore.Views_PIT__AnnualEstimatesDetails))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"16e09a4666c46a9ece51b3ffc4047ff81c417c94", @"/Views/PIT/_AnnualEstimatesDetails.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"24e702857a8f67f65d32f4756a8d9329551657cd", @"/Views/_ViewImports.cshtml")]
    public class Views_PIT__AnnualEstimatesDetails : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 7140, true);
            WriteLiteral(@"<div id=""estimatesDetailsView"">
    <div class=""card-body"">
        <div class=""tab-content"" id=""myTabContent"">
            <div class=""tab-pane fade show active"" id=""tccDetails"" role=""tabpanel"" aria-labelledby=""nav-profile-tab"">
                <div class=""form-horizontal"">
                    <div class=""form-row"">

                        <div class=""col-md-6"" id=""estimateDetailsGrid6"">
                            <div class=""bordered-group"" id="""" style=""height: 300px"">
                                <p class=""card-title""><b>Entity Details</b></p>
                                <div class=""table-responsive border-bottom"">
                                    <table class=""table table-bordered"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Assessment Year</td>
                                                <td style=""padding-left:5px;w");
            WriteLiteral(@"idth:280px;"">
                                                    <b><span id=""assessmentYearView""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Start Date</td>
                                                <td style=""padding-left:5px;width:280px;"">
                                                    <b><span id=""startDateView""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">End Date</td>
                                                <td style=""padding-left:5px;width:280px;"">
                                                    <b><span id=""endDateView"">");
            WriteLiteral(@"</span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Nationality</td>
                                                <td style=""padding-left:5px;width:280px;"">
                                                    <b><span id=""nationality""></span></b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class=""col-md-6"" id=""estimateDetailsGrid7"">
                            <div class=""bordered-group"" id="""" style=""height: 300px"">
                                <p class=""card-title""><b>Income Details</b><");
            WriteLiteral(@"/p>
                                <div class=""table-responsive border-bottom"">
                                    <table class=""table table-bordered"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Business Income</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""businessIncome""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Employment Income</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                        ");
            WriteLiteral(@"            <b><span id=""employmentIncome""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Investment & Other</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""investmentOtherIncome""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Total Income</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""totalIncome""><");
            WriteLiteral(@"/span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Annual Chargeable</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""annualChargeableIncome""></span></b>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Annual Total</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""annualTotalIncomeTaxPayable""></span></b>
                ");
            WriteLiteral(@"                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:120px;font-weight:100;"">Quarterly Income</td>
                                                <td style=""padding-left:5px;width:280px;text-align: right;"">
                                                    <b><span id=""quarterlyIncomeTaxPayable""></span></b>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                    <button id=""backToGrid"" class=""btn btn-outline-primary""> Back</button>
                </div>
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
