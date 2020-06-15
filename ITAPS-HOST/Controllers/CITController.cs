using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BoldReports.Models.ReportViewer;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    public class CITController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;

        public CITController(IAppConstants config, IReportConstants reportConfig)
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

        public IActionResult Estimates()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult RevisedEstimates()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Returns()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult ReportsDialog()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CITReturnFinalReport()
        {
            UserDetails();
            ReportEmailOnly();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.CITReturnFinalReport;
            return View();
        }

        public IActionResult CITReturnsReport()
        {
            UserDetails();
            ReportEmailAndRefresh();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.CITReturnsReport;
            return View();
        }

        public IActionResult CitTaxOutStandingReport()
        {
            UserDetails();
            ReportEmailAndRefresh();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.CITTaxOutstandingReport; 
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CITTaxOverPaymentReport()
        {
            UserDetails();
            ReportEmailAndRefresh();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.CITTaxOverPaymentOutstandingReport;
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CITZeroTaxOutstandingReport()
        {
            UserDetails();
            ReportEmailAndRefresh();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.CITZeroTaxOutstandingReport;
            ViewBag.ServerUrl = _config.AppServerUrl;
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

        public void ReportEmailAndRefresh()
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

            var customItem2 = new CustomItem()
            {
                GroupIndex = 3,
                Index = 1,
                CssClass = "e-icon e-document e-reportviewer-icon",
                Type = BoldReports.ReportViewerEnums.ToolBarItemType.Default,
                Id = "Update-Parameter",
                Tooltip = new ToolTip() { Header = "Update Parameters", Content = "Update the parameters of the report" }
            };

            toolbarSettings.CustomItems.Add(customItem);
            toolbarSettings.CustomItems.Add(customItem2);

            ViewBag.toolbarSettings = toolbarSettings;
        }

        public void ReportEmailOnly()
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
        }
    }
}