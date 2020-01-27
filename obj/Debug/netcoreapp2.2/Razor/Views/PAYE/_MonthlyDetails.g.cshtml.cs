#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\PAYE\_MonthlyDetails.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "6574177ea521874de72c057200819338b88e0622"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_PAYE__MonthlyDetails), @"mvc.1.0.view", @"/Views/PAYE/_MonthlyDetails.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/PAYE/_MonthlyDetails.cshtml", typeof(AspNetCore.Views_PAYE__MonthlyDetails))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"6574177ea521874de72c057200819338b88e0622", @"/Views/PAYE/_MonthlyDetails.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"24e702857a8f67f65d32f4756a8d9329551657cd", @"/Views/_ViewImports.cshtml")]
    public class Views_PAYE__MonthlyDetails : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 15399, true);
            WriteLiteral(@"<input id=""applicationId"" value="""" hidden />

<div id=""monDetails"">
    <div class=""card-body"">
        <div class=""tab-content"" id=""myTabContent"">
            <div class=""tab-pane fade show active"" id=""taxPosition"" role=""tabpanel"" aria-labelledby=""nav-profile-tab"">

                <div class=""form-horizontal"">
                    <div class=""form-row"">
                        <div class=""col-sm-5"">
                            <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>PAYE Detail - <span id=""ratesCode""></span> </b></p>
                                <div class=""table-responsive border-bottom"" style=""overflow-y: scroll;height: 280px;"">
                                    <table class=""table table-bordered"" id=""detailsViewTR"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:10");
            WriteLiteral(@"0;"">TIN</td>
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""payerTIN""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Period</td> <!--Concat Month and Year-->
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""periodYear""></td>
                                            </tr>
                                            <tr>
                                                <td colspan=""2"" style=""padding-left:5px;width:150px;font-weight:bold;"">Number Of Staffs</td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-we");
            WriteLiteral(@"ight:100;"">Management</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""managementNo""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Other</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""otherNo""></td>
                                            </tr>
                                            <tr>
                                                <td colspan=""2"" style=""padding-left:5px;width:150px;font-weight:bold;"">Cash Emolument</td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Management</");
            WriteLiteral(@"td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""managementPay""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Other</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""otherPay""></td>
                                            </tr>
                                            <tr>
                                                <td colspan=""2"" style=""padding-left:5px;width:150px;font-weight:bold;"">Tax Deductions</td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Management<");
            WriteLiteral(@"/td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""managementTax""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Other</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""otherTax""></td>
                                            </tr>
                                            <tr>
                                                <td colspan=""2"" style=""padding-left:5px;width:150px;font-weight:bold;"">Staff Movement</td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Starting Staff</td>
                                 ");
            WriteLiteral(@"               <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""startingStaff""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Engaged Staff</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""engagedStaff""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Disengaged Staff</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;text-align: right;"" id=""disengagedStaff""></td>
                                            </tr>
                                        </tbody>
                                    </table>");
            WriteLiteral(@"
                                </div>
                            </div>
                        </div>

                        <div class=""col-sm-7"">
                            <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>Employee Details</b></p>
                                <div class=""table-responsive border-bottom"" style=""height: 300px;"">
                                    <table class=""table table-bordered"">
                                        <thead>
                                            <tr class=""table-info"">
                                                <th scope=""col"" style=""color: black;"">Employee Name</th>
                                                <th scope=""col"" style=""color: black;"">TIN</th>
                                                <th scope=""col"" style=""color: black;"">Position</th>
                                                <th scope=""col"" style=""color: black;"">Tax Deducted</");
            WriteLiteral(@"th>
                                                <th scope=""col"" style=""color: black;"">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody id=""employeeGrid""></tbody>
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


<div id=""employeeDetails"">
    <div class=""card-body"">
        <div class=""tab-content"" id=""myTabContent"">
            <div class=""tab-pane fade show active"" id=""taxPosition"" role=""tabpanel"" aria-labelledby=""nav-profile-tab"">

                <div class=""form-horizontal"">
                    <div class=""form-row"">
                        <div class=""col-sm-6"">
           ");
            WriteLiteral(@"                 <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>EMPLOYEE DETAIL<span id=""ratesCode""></span> </b></p>
                                <div class=""table-responsive border-bottom"" style=""height: 300px;"">
                                    <table class=""table table-bordered"" id=""employeeViewTR"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">TIN</td>
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empTin""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Name</td>
                                                <td ");
            WriteLiteral(@"title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empName""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Phone</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empPhone""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Email</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empEmail""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:");
            WriteLiteral(@"100;"">Position</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empPosition""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Serial No.</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empSerialNumber""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Residential</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""empResidential""></td>
                                            </tr>

                                        </tbody>
       ");
            WriteLiteral(@"                             </table>
                                </div>
                            </div>
                        </div>

                        <div class=""col-sm-6"">
                            <div class=""bordered-group"" id="""" style=""height: 350px"">
                                <p class=""card-title""><b>EMPLOYEE DETAIL<span id=""ratesCode""></span> </b></p>
                                <div class=""table-responsive border-bottom"" style=""height: 300px;"">
                                    <table class=""table table-bordered"" id=""detailsViewTR"">
                                        <tbody>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Basic Salary</td>
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;text-align:right;"" id=""basicSalary""></td>
                                ");
            WriteLiteral(@"            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Cash Allowance</td> <!--Concat Month and Year-->
                                                <td title=""Date Format: YYYY/MM/DD"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""cashAllowances""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Bonus Income</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""bonusIncome""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Overtime Income</td>
                         ");
            WriteLiteral(@"                       <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""overtimeIncome""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Secondary Employment</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""secondaryEmployement""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Non-Cash Benefit</td>
                                                <td title=""True or False"" style=""padding-left:5px;width:250px;font-weight:bold;"" id=""nonCashBenefit""></td>
                                            </tr>
                                            <tr>
                                ");
            WriteLiteral(@"                <td style=""padding-left:5px;width:150px;font-weight:100;"">Provident Rate</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""providentRate""></td>
                                            </tr>
                                            <tr>
                                                <td style=""padding-left:5px;width:150px;font-weight:100;"">Severance Pay Paid</td>
                                                <td style=""padding-left:5px;width:250px;font-weight:bold;"" id=""severancePayPaid""></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                    <button id=""backToGridEmployee"" class=""btn btn-outline-primary""> Back</button>
                </div>

            </div");
            WriteLiteral(">\r\n        </div>\r\n    </div>\r\n</div>\r\n");
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
