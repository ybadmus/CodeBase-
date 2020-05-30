using BoldReports.Web;
using BoldReports.Web.ReportViewer;
using ITAPS_HOST.Data;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Net.Mime;

namespace ITAPS_HOST.Api
{
    public class RecipientsObj
    {
        public string Id { get; set; }
        public string EmailAddress { get; set; }
    }

    [Authorize]
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

        public object SendEmail([FromBody] Dictionary<string, object> jsonResult)
        {
            string _token = jsonResult["reportViewerToken"].ToString();
            var stream = ReportHelper.GetReport(_token, jsonResult["exportType"].ToString(), this, this._cache);
            IList<RecipientsObj> listOfRecipients = JsonConvert.DeserializeObject<List<RecipientsObj>>(jsonResult["Recipients"].ToString());

            stream.Position = 0;

            if (!ComposeEmail(stream, jsonResult["ReportName"].ToString(), listOfRecipients))
            {
                return new ResponseItem<object>
                {
                    Status = "Failure",
                    Caption = "Emails Not Sent"
                };
            }

            return new ResponseItem<object>
            {
                Status = "Succesfull",
                Caption = "Email Sent"            };
        }

        public bool ComposeEmail(Stream stream, string reportName, IList<RecipientsObj> recipients)
        {
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
                mail.IsBodyHtml = true;
                mail.From = new MailAddress("yusif.badmus@gmail.com");
                foreach(RecipientsObj recipient in recipients)
                {
                    mail.To.Add(recipient.EmailAddress);
                }
                mail.Subject = "Report Name : " + reportName;
                stream.Position = 0;

                if (stream != null)
                {
                    ContentType ct = new ContentType();
                    ct.Name = reportName + DateTime.Now.ToString() + ".pdf";
                    System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(stream, ct);
                    mail.Attachments.Add(attachment);
                }

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("yusif.badmus@gmail.com", "Spoilthere2010");
                SmtpServer.EnableSsl = true;
                SmtpServer.Send(mail);

                return true;
            }

            catch (Exception ex)
            {
                return false;
            }
        }

    }
}