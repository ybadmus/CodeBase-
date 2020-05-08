using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    [Authorize]
    public class WTHTController : Controller
    {
        private readonly IAppConstants _config;
        public WTHTController(IAppConstants config)
        {
            _config = config;
        }

        public IActionResult Index()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult AllTransaction()
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

        public IActionResult VATTransaction()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult VATReturns()
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