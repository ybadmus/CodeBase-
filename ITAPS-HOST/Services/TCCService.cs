using BoldReports.Web;
using BoldReports.Writer;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TCCService : ITCCService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        private readonly IHostingEnvironment _env;

        public TCCService(IAdminRequestClient adminRequestClient, IHostingEnvironment env)
        {
            _adminRequestClient = adminRequestClient;
        }
        public async Task<ResponseItem<object>> GetAllTCCApplication()
        {

            var apiEndpoint = $"Application/GetAllTCCApplication";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetTccApplicationById(Guid tccId, Guid appTypeId)
        {
            var apiEndpoint = "";

            Guid guid = Guid.Parse("870301ea-f62e-4788-9905-7c94a26813d3");
            int res = guid.CompareTo(appTypeId);

            if (res == 0)
                apiEndpoint = $"Application/GetAllTCCApplicationById/{tccId}";
            else
                apiEndpoint = $"Application/GetApplicationDetailsByTypeAndId/{appTypeId}/{tccId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllTccApplicationComments(Guid tccId)
        {

            var apiEndpoint = $"Application/GetAllTccApplicationComments/{tccId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchAllTCCApplication(string searchTerm)
        {

            var apiEndpoint = $"Application/SearchAllTCCApplication/{searchTerm}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> UpdateTccApplication(Guid id, UpdateTccDto objectToSend)
        {
            var apiEndpoint = $"Application/UpdateTCCApplication?id={id}";
            var objectForUpdateTccDto = new UpdateTccDto() { };

            if (objectToSend.Status == 2)
            {
                objectForUpdateTccDto.Status = objectToSend.Status;
                objectForUpdateTccDto.TaxpayerComment = objectToSend.TaxpayerComment;
                objectForUpdateTccDto.InternalComment = objectToSend.InternalComment;
                objectForUpdateTccDto.ExpiryDate = objectToSend.ExpiryDate;
            }
            else
            {
                objectForUpdateTccDto.Status = objectToSend.Status;
                objectForUpdateTccDto.TaxpayerComment = objectToSend.TaxpayerComment;
                objectForUpdateTccDto.InternalComment = objectToSend.InternalComment;
                objectForUpdateTccDto.ExpiryDate = DateTime.UtcNow.Date;
            }
 
            return await _adminRequestClient.PutRequestAsync(objectForUpdateTccDto, apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostTaxPositionSummary(Guid appId, ArrayObjectSummary data)
        {
            //var apiEndpoint = $"Application/AddUpdateTaxPosition/{appId}";
            var apiEndpoint = $"Application/AddListTaxPositions/{appId}";

            List<TaxPositionSummary> arrayForCreation = new List<TaxPositionSummary> { };

            foreach (TaxPositionSummary summary in data.TaxPositions)
            {
                TaxPositionSummary item = new TaxPositionSummary
                {
                    Status = summary.Status,
                    AssessmentYear = Convert.ToInt64(summary.AssessmentYear),
                    TaxOutstanding = Convert.ToDouble(summary.TaxOutstanding),
                    TaxCharged = Convert.ToDouble(summary.TaxCharged),
                    TaxPaid = Convert.ToDouble(summary.TaxPaid),
                    ChargeableIncome = Convert.ToDouble(summary.ChargeableIncome)
                };

                arrayForCreation.Add(item);
            }

            data.TaxPositions = arrayForCreation;

            return await _adminRequestClient.PostRequestAsync(data, apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetTCCCertificateNo()
        {

            var apiEndpoint = $"Application/GetTCCCertificateNo";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetTCCApplicationDocumentByApplicationId(Guid id)
        {

            var apiEndpoint = $"Application/GetTCCApplicationDocumentByApplicationId/{id}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllTccApplicationByTaxOfficeId(string queryString)
        {
            //var apiEndpoint = $"Application/GetAllTccApplicationByTaxOfficeId/{id}?QueryString={queryString}";
            var apiEndpoint = $"Application/GetAllAssignedApplicationsByPersonnelId";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllTccApplicationPendingApprovalByTaxOfficeId(Guid id, string queryString)
        {
            var apiEndpoint = $"Application/GetAllTccApplicationPendingApprovalByTaxOfficeId/{id}?filter={queryString}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAppByOfficeTypeAndStatus(Guid id, int status, string searchitem)
        {
            var apiEndpoint = $"Application/GetAllApplicationByOfficeTypeAndStatus/{id}/{status}?QueryString={searchitem}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllAssignedApplicationsToReassign(Guid id, string searchitem)
        {
            var apiEndpoint = $"Application/GetAllAssignedApplicationsToReassign/{id}?Fields={searchitem}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostAssignApplication(IEnumerable<AssignApplication> objData)
        {
            var apiEndpoint = $"Application/ApplicationAssignment";

            return await _adminRequestClient.PostRequestArrayAsync(objData, apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> ReassignApplication(IEnumerable<ReassignApplication> objData)
        {
            var apiEndpoint = $"Application/ReAssignApplication";

            return await _adminRequestClient.PutRequestArrayAsync(objData, apiEndpoint);
        }
       

        public async Task<ResponseItem<object>> GetTCCApplicationTaxPositionByApplicationId(Guid applicationId)
        {
            var apiEndpoint = $"Application/GetTaxpositionByApplicationId/{applicationId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> UpdateTccApplicationWithCertificate(Guid id, UpdateTccWithCertificate objectToSend)
        {

            var apiEndpoint = $"Application/UpdateTccWithCertificate/{id}";

            //var base64String = GenerateTccForMail(id);

            var objectForUpdateDto = new UpdateTccWithCertificateDto
            {
                tccCerticate = objectToSend.tccCerticate == null || objectToSend.tccCerticate == "" ? "JvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGlu" +
                        "dWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4 = " : objectToSend.tccCerticate,

                //tccCerticate = base64String,
                TaxpayerComment = objectToSend.TaxpayerComment,
                InternalComment = objectToSend.InternalComment
            };

            return await _adminRequestClient.PutRequestAsync(objectForUpdateDto, apiEndpoint);
        }

        private string GenerateTccForMail(Guid tccId)
        {
            ReportWriter reportWriter = new ReportWriter();
            reportWriter.ReportProcessingMode = ProcessingMode.Remote;
            reportWriter.ReportPath = "/ITaPS_Reports/TestReports";
            reportWriter.ReportServerUrl = "http://psl-dbserver-vm/Reports_SSRS";
            reportWriter.ReportServerCredential = new System.Net.NetworkCredential("installmanager", "install@bj2013");
            DataSourceCredentials dataSourceCredential = new DataSourceCredentials();
            dataSourceCredential.Name = "ItapsSource";
            dataSourceCredential.UserId = "sa";
            dataSourceCredential.Password = "Persol@123";

            IList<ReportParameter> parameters = new List<ReportParameter>();
            ReportParameter param = new ReportParameter();
            param.Name = "uniApplicationId";
            param.Values.Add(tccId.ToString());
            parameters.Add(param);
            reportWriter.SetParameters(parameters);

            List<DataSourceCredentials> DSCredentialList = new List<DataSourceCredentials>();
            IEnumerable<DataSourceCredentials> dataSourceCredentials;
            DSCredentialList.Add(dataSourceCredential);
            dataSourceCredentials = DSCredentialList;
            reportWriter.SetDataSourceCredentials(dataSourceCredentials);
            //MemoryStream memoryStream = new MemoryStream();

            //reportWriter.Save(memoryStream, WriterFormat.PDF);
            //FileStreamResult fileStreamResult = null;

            //memoryStream.Position = 0;
            //fileStreamResult = new FileStreamResult(memoryStream, "application/pdf");
            //var _temp_file = Path.Combine(_env.WebRootPath, "Tcc.pdf");

            //using (FileStream writeStream = new FileStream(_temp_file, FileMode.Create, FileAccess.Write))
            //{
            //    if (System.IO.File.Exists(_temp_file))
            //    {
            //        System.IO.File.Delete(_temp_file);
            //    }

            //    int length = 1024;
            //    Byte[] buffer = new Byte[length];
            //    int bytesRead = fileStreamResult.FileStream.Read(buffer, 0, length);

            //    while (bytesRead > 0)
            //    {
            //        writeStream.Write(buffer, 0, bytesRead);
            //        bytesRead = fileStreamResult.FileStream.Read(buffer, 0, length);
            //    }
            //    fileStreamResult.FileStream.Close();
            //    writeStream.Close();
            //}

            var _temp_file = Path.Combine(_env.WebRootPath, "Tcc.pdf");

            try
            {
                if (System.IO.File.Exists(_temp_file))
                {
                    System.IO.File.Delete(_temp_file);
                }

                //Create the file.
                using (FileStream _temp_file_fs = System.IO.File.Create(_temp_file))
                {
                    reportWriter.Save(_temp_file_fs, WriterFormat.PDF);
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine("Error Information:" + ex);
            }

            var path = Path.Combine(_temp_file);
            Byte[] bytes = File.ReadAllBytes(path);
            String file = Convert.ToBase64String(bytes);

            return file;
        }
    }
}
