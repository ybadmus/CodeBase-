﻿using BoldReports.Models.ReportViewer;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ITAPS_HOST.Controllers
{
    [Authorize]
    public class PITController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;

        public PITController(IAppConstants config, IReportConstants reportConfig)
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

        public IActionResult Return()
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

        public IActionResult PITAnnualreport()
        {
            UserDetails();
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
            ViewBag.ReportPath = _reportConfig.PITAnnualReport;
            return View();
        }

        public IActionResult PITReturnsReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.PITReturnsReport;
            return View();
        }

        public IActionResult PITTaxOutStandingReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.PITTaxWithstandingReport;
            return View();
        }

        public IActionResult PITTaxOverPaymentReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.PITWithTaxOverpaymentReport;
            return View();
        }

        public IActionResult PITZeroTaxOutstandingReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = _reportConfig.PITWithZeroTaxOutstandingReport;
            return View();
        }

        public IActionResult Estimate()
        {
            UserDetails();
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

    }
}