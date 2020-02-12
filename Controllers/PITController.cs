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

        public IActionResult FormView()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        private void UserDetails()
        {
            foreach (var claim in User.Claims)
            {
                if (claim.Type == "given_name")
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