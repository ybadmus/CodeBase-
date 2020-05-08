using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    public class NotificationController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;
        public NotificationController(IAppConstants config, IReportConstants reportConfig)
        {
            _config = config;
            _reportConfig = reportConfig;
        }
        public IActionResult AllNotifications()
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