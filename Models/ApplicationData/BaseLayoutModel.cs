using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Models
{
    public class BaseLayoutModel : PageModel
    {
        private readonly IHOSTConfiguration _hostConfiguration;
        private readonly ISSRSConfiguration _ssrsConfig;

        public BaseLayoutModel(IHOSTConfiguration hostConfiguration, ISSRSConfiguration ssrsConfig)
        {
            _hostConfiguration = hostConfiguration;
            _ssrsConfig = ssrsConfig;
        }

        public void OnGet()
        {
            ViewData["AppServerUrl"] = _hostConfiguration.AppServerUrl;
            ViewData["ReportServerUrl"] = _ssrsConfig.ReportServer;
        }
    }
}
