#pragma checksum "C:\Users\Ybadmus\source\microverse_repo\ITAPS-HOST\ITAPS-HOST\Views\Codes\_TaxHolidayModal.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "3553e1360e25171de68e092decdb3921b6e0013c"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Codes__TaxHolidayModal), @"mvc.1.0.view", @"/Views/Codes/_TaxHolidayModal.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Codes/_TaxHolidayModal.cshtml", typeof(AspNetCore.Views_Codes__TaxHolidayModal))]
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
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"3553e1360e25171de68e092decdb3921b6e0013c", @"/Views/Codes/_TaxHolidayModal.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"24e702857a8f67f65d32f4756a8d9329551657cd", @"/Views/_ViewImports.cshtml")]
    public class Views_Codes__TaxHolidayModal : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("value", "A", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("value", "I", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
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
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(0, 791, true);
            WriteLiteral(@"<div id=""modal-add-setup"" class=""modal fade"" tabindex=""-1"" role=""dialog"" data-backdrop=""static"" aria-labelledby=""modal-standard-title"" aria-hidden=""true"">
    <div class=""modal-dialog"" role=""document"">
        <div class=""modal-content"">
            <div class=""modal-header"">
                <h6 class=""modal-title"" id=""modal-income-title"">Add Tax Holiday</h6>
                <button type=""button"" class=""close"" data-dismiss=""modal"" aria-label=""Close"">
                    <span aria-hidden=""true"" style=""color: white"">&times;</span>
                </button>
            </div>
            <div class=""modal-body"">
                <div class=""form-horizontal"">
                    <div class=""row"">
                        <div class=""col-md-12"">
                            ");
            EndContext();
            BeginContext(791, 2015, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c5137", async() => {
                BeginContext(797, 782, true);
                WriteLiteral(@"
                                <div class=""form-group row"">
                                    <div class=""col-md-6 formDiv"">
                                        <label for=""Code"" class=""col-form-label"">
                                            Code
                                        </label>
                                        <input type=""text"" class=""form-control"" id=""Code"" placeholder="""">
                                    </div>
                                    <div class=""col-md-6 formDiv"">
                                        <label for=""Status"" class="" col-form-label"">Status</label>
                                        <select type=""text"" id=""Status"" class=""form-control"" required>
                                            ");
                EndContext();
                BeginContext(1579, 33, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("option", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c6328", async() => {
                    BeginContext(1597, 6, true);
                    WriteLiteral("Active");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper.Value = (string)__tagHelperAttribute_0.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(1612, 46, true);
                WriteLiteral("\r\n                                            ");
                EndContext();
                BeginContext(1658, 35, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("option", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c7837", async() => {
                    BeginContext(1676, 8, true);
                    WriteLiteral("Inactive");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper.Value = (string)__tagHelperAttribute_1.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(1693, 1106, true);
                WriteLiteral(@"
                                        </select>
                                    </div>
                                </div>
                                <div class=""form-group row"">
                                    <div class=""col-md-12 formDiv"">
                                        <label for=""Description"" class="" col-form-label"">Description</label>
                                        <input type=""text"" class=""form-control"" id=""Description"" placeholder="""">
                                    </div>
                                </div>
                                <div class=""form-group row"">
                                    <div class=""col-md-12 formDiv"">
                                        <label for=""Note"" class=""col-form-label"">
                                            Notes
                                        </label>
                                        <textarea class=""form-control"" rows=""3"" id=""Note""></textarea>
                              ");
                WriteLiteral("      </div>\r\n                                </div>\r\n                            ");
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
            BeginContext(2806, 1189, true);
            WriteLiteral(@"
                        </div>
                    </div>
                </div>
            </div>
            <div class=""modal-footer"">
                <button type=""button"" class=""btn btn-danger"" data-dismiss=""modal"">Close</button>
                <button type=""button"" id=""SubmitSetup"" class=""btn btn-primary"">Save</button>
            </div>
        </div>
    </div>
</div>

<div id=""modal-edit-setup"" class=""modal fade"" tabindex=""-1"" role=""dialog"" data-backdrop=""static"" aria-labelledby=""modal-standard-title"" aria-hidden=""true"">
    <div class=""modal-dialog"" role=""document"">
        <div class=""modal-content"">
            <div class=""modal-header"">
                <h6 class=""modal-title"" id=""modal-income-title"">Edit Tax Holiday</h6>
                <button type=""button"" class=""close"" data-dismiss=""modal"" aria-label=""Close"">
                    <span aria-hidden=""true"" style=""color: white"">&times;</span>
                </button>
            </div>
            <div class=""modal-body"">");
            WriteLiteral("\r\n                <div class=\"form-horizontal\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-12\">\r\n                            ");
            EndContext();
            BeginContext(3995, 2230, false);
            __tagHelperExecutionContext = __tagHelperScopeManager.Begin("form", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c12833", async() => {
                BeginContext(4001, 924, true);
                WriteLiteral(@"
                                <input type=""text"" class=""form-control"" id=""EntryId"" placeholder="""" hidden>
                                <div class=""form-group row"">
                                    <div class=""col-md-6 formDiv"">
                                        <label for=""UpdateCode"" class=""col-form-label"">
                                            Code
                                        </label>
                                        <input type=""text"" class=""form-control"" id=""UpdateCode"" placeholder="""" disabled>
                                    </div>
                                    <div class=""col-md-6 formDiv"">
                                        <label for=""UpdateStatus"" class="" col-form-label"">Status</label>
                                        <select type=""text"" id=""UpdateStatus"" class=""form-control"" disabled>
                                            ");
                EndContext();
                BeginContext(4925, 33, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("option", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c14176", async() => {
                    BeginContext(4943, 6, true);
                    WriteLiteral("Active");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper.Value = (string)__tagHelperAttribute_0.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_0);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(4958, 46, true);
                WriteLiteral("\r\n                                            ");
                EndContext();
                BeginContext(5004, 35, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("option", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "3553e1360e25171de68e092decdb3921b6e0013c15686", async() => {
                    BeginContext(5022, 8, true);
                    WriteLiteral("Inactive");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_OptionTagHelper.Value = (string)__tagHelperAttribute_1.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(5039, 1179, true);
                WriteLiteral(@"
                                        </select>
                                    </div>
                                </div>
                                <div class=""form-group row"">
                                    <div class=""col-md-12 formDiv"">
                                        <label for=""UpdateDescription"" class="" col-form-label"">Description</label>
                                        <input type=""text"" class=""form-control"" id=""UpdateDescription"" placeholder="""" disabled>
                                    </div>
                                </div>
                                <div class=""form-group row"">
                                    <div class=""col-md-12 formDiv"">
                                        <label for=""UpdateNote"" class=""col-form-label"">
                                            Notes
                                        </label>
                                        <textarea class=""form-control"" rows=""3"" id=""UpdateNote"" style=""res");
                WriteLiteral("ize: none;\" value=\"\" disabled></textarea>\r\n                                    </div>\r\n                                </div>\r\n                            ");
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
            BeginContext(6225, 545, true);
            WriteLiteral(@"
                        </div>
                    </div>
                </div>
            </div>
            <div class=""modal-footer"">
                <button type=""button"" class=""btn btn-danger"" data-dismiss=""modal"">Close</button>
                <button type=""button"" id=""BtnEdit"" class=""btn btn-light""><i class=""fa fa-lock"" aria-hidden=""true""></i> Edit</button>
                <button type=""button"" id=""BtnUpdate"" class=""btn btn-primary"" style=""display:none"">Save</button>
            </div>
        </div>
    </div>
</div>");
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