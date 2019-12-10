using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;

namespace ITAPS_HOST.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            UserDetails();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private void UserDetails()
        {
            foreach (var claim in User.Claims)
            {
                if (claim.Type == "given_name")
                {
                    ViewData["UserName"] = claim.Value;
                }
                if (claim.Type == "name")
                {
                    ViewData["FullName"] = claim.Value;
                }
                if (claim.Type == "email")
                {
                    ViewData["EmailAddress"] = claim.Value;
                }
                if (claim.Type == "sub")
                {
                    ViewData["UserId"] = claim.Value;
                }

            }
        }
    }
}
