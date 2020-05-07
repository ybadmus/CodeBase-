using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        public IActionResult PITReturnsReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/PitReturnsReport";
            return View();
        }

        public IActionResult PITTaxWithStandingReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/PitTaxWithstandingReport";
            return View();
        }

        public IActionResult PITTaxOverPaymentReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/PitWithTaxOverpaymentReport";
            return View();
        }

        public IActionResult PITZeroTaxOutstandingReport()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.ReportServer;
            ViewBag.ReportPath = "/ITaPS_Reports/PitWithZeroTaxOutstandingReport";
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
            }
        }

    }
}