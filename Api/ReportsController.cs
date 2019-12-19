using BoldReports.Web;
using BoldReports.Web.ReportViewer;
using ITAPS_HOST.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.IO;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : Controller, IReportController
    {
        private readonly IReportConstants _config;
        private IHostingEnvironment _hostingEnvironment;
        private IMemoryCache _cache;

        public ReportsController(IMemoryCache memoryCache, IHostingEnvironment hostingEnvironment, IReportConstants config)
        {
            _cache = memoryCache;
            _config = config;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        public object PostReportAction([FromBody] Dictionary<string, object> jsonResult)
        {
            return ReportHelper.ProcessReport(jsonResult, this, this._cache);
        }

        [ActionName("GetResource")]
        [AcceptVerbs("GET")]
        public object GetResource(ReportResource resource)
        {
            return ReportHelper.GetResource(resource, this, _cache);
        }

        [HttpPost]
        public object PostFormReportAction()
        {
            return ReportHelper.ProcessReport(null, this, this._cache);
        }

        public void OnInitReportOptions(ReportViewerOptions reportOption)
        {
            reportOption.ReportModel.ReportServerCredential = new System.Net.NetworkCredential(_config.Username, _config.Password, _config.Domain);
            reportOption.ReportModel.DataSourceCredentials.Add(new DataSourceCredentials(_config.DatasourceName, _config.DatasourceUser, _config.DatasourcePassword));
        }

        public void OnReportLoaded(ReportViewerOptions reportOption)
        {

        }
    }
}