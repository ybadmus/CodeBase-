using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Controllers
{
    public class PayeController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;

        public PayeController(IAppConstants config, IReportConstants reportConfig)
        {
            _config = config;
            _reportConfig = reportConfig;
        }

        public IActionResult Monthly()
        {
            UserDetails();
            ViewBag.ServerUrl = _config.AppServerUrl;
            return View();
        }

        public IActionResult Annual()
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