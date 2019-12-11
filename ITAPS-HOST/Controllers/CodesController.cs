using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    public class CodesController : Controller
    {
        private readonly IAppConstants _config;

        public CodesController(IAppConstants config)
        {
            _config = config;
        }

        [Authorize]
        public IActionResult Index(string type)
        {
            UserDetails();
            ViewBag.Type = type;
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