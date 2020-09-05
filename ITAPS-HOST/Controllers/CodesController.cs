using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    [Authorize]
    public class CodesController : Controller
    {
        private readonly IAppConstants _config;

        public CodesController(IAppConstants config)
        {
            _config = config;
        }

        public IActionResult Index(string type)
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TaxOffice()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult TaxHoliday()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Currency()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult ACTR()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult RateAndCode()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult CompanyRates()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult PitRates()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Setup()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        } 
        
        public IActionResult Changemypassword()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult UpdateTaxpayerTaxOffice()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult ReliefSetup()
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