using BoldReports.Models.ReportViewer;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;

namespace ITAPS_HOST.Controllers
{
    [Authorize]
    public class ReportViewerController : Controller
    {
        private readonly IAppConstants _config;
        private readonly IReportConstants _reportConfig;

        public ReportViewerController(IAppConstants config, IReportConstants reportConfig)
        {
            _config = config;
            _reportConfig = reportConfig;
        }

        public IActionResult Index()
        {
            ViewBag.ServiceAuthorizationToken = this.GenerateToken(_reportConfig.BoldReportServerUser, _reportConfig.BoldReportServerPassword);
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

            //ViewBag.toolbarSettings = toolbarSettings;
            ViewBag.ServerUrl = _config.AppServerUrl;
            ViewBag.ReportServer = _reportConfig.BoldReportingService;
            ViewBag.ReportServerSite = _reportConfig.BoldReportingSite;
            ViewBag.ReportPath = _reportConfig.TCCReport;
            UserDetails();
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        public string GenerateToken(string userName, string password)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();

                var content = new FormUrlEncodedContent(new[]
                {
                new KeyValuePair<string, string>("grant_type", "password"),
                new KeyValuePair<string, string>("username", userName),
                new KeyValuePair<string, string>("password", password)
                  });

                var result = client.PostAsync(_reportConfig.BoldReportingSite + "/token", content).Result;
                string resultContent = result.Content.ReadAsStringAsync().Result;
                var token = JsonConvert.DeserializeObject<Token>(resultContent);

                return token.token_type + " " + token.access_token;
            }
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
                if (claim.Type == "usergroup")
                {
                    ViewBag.UserGroup = claim.Value;
                }
            }
        }
    }

    public class Token
    {
        public string access_token { get; set; }

        public string token_type { get; set; }

        public string expires_in { get; set; }

        public string userName { get; set; }

        public string serverUrl { get; set; }

        public string password { get; set; }
    }
}