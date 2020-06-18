using BoldReports.Models.ReportViewer;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace ITAPS_HOST.Controllers
{
    [Authorize]
    public class ApplicationsController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;

        public ApplicationsController(IAppConstants config, IReportConstants reportConfig)
        {
            _config = config;
            _reportConfig = reportConfig;
        }

        public IActionResult Index()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        //TCC
        public IActionResult TCC()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Assign()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
        
        public IActionResult BulkAssignment()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TCCDashboard()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TCCProcessing()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Options()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
        //TCC END

        //WHT Exemption
        public IActionResult TEX()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TEXAssign()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
       
        public IActionResult TEXDashboard()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TEXProcessing()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
        public IActionResult TEXOptions()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
       
        public IActionResult Blank()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        //PTR
        public IActionResult PTR()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult PTRAssign()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult PTROptions()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult PTRDashboard()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult PTRProcessing()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }
        //PTR END

        public IActionResult TaxPosition(string applicantName, Guid taxpayerId, Guid appId)
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ApplicantName = applicantName;
            ViewBag.TaxpayerId = taxpayerId;
            ViewBag.AppId = appId;
            return View();
        }

        public IActionResult Certificate()
        {
            ToolbarSettings toolbarSettings = new ToolbarSettings();
            toolbarSettings.CustomItems = new List<CustomItem>();

            var customItem = new CustomItem()
            {
                GroupIndex = 1,
                Index = 1,
                CssClass = "e-icon e-mail e-reportviewer-icon",
                Type = BoldReports.ReportViewerEnums.ToolBarItemType.Default,
                Id = "E-Mail",
                Tooltip = new ToolTip() { Header = "E-Mail", Content = "Send rendered report as mail attachment" }
            };

            toolbarSettings.CustomItems.Add(customItem);

            ViewBag.toolbarSettings = toolbarSettings;
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.TCCReport;
            UserDetails();

            return View();
        }

        private void UserDetails()
        {
            foreach (var claim in User.Claims)
            {
                if (claim.Type == "preferred_username")
                {
                    ViewBag.UserName = claim.Value;
                }
                if (claim.Type == "name")
                {
                    ViewBag.FullName = claim.Value;
                }
                if (claim.Type == "email")
                {
                    ViewBag.EmailAddress = claim.Value;
                }
                if (claim.Type == "sub")
                {
                    ViewBag.UserId = claim.Value;
                }
                if (claim.Type == "usergroup") {
                    ViewBag.UserGroup = claim.Value;
                }
            }
        }
    }
}