using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public IActionResult CITReturnsReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/CitReturnsReport";
            return View();
        }

        public IActionResult CitTaxOutStandingReport()
        {
            UserDetails();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/CitTaxOutstandingReport";
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CITTaxOverPaymentReport()
        {
            UserDetails();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/CitTaxOverPaymentOutstandingReport";
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CITZeroTaxOutstandingReport()
        {
            UserDetails();
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/CitZeroTaxOutstandingReport";
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
            }
        }
    }
}