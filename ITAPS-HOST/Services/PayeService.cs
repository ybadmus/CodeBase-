using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class PayeService: IPayeService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public PayeService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetPayeCompanyDetailsByTaxOficeId(Guid taxOfficeId, Guid periodId, string searchItem)
        {
            var apiEndpoint = $"GPaye/GetPayeMonthlyByTaxOficeIdAndPeriod/{taxOfficeId}/{periodId}?filter={searchItem}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllAnnualPaye(Guid taxOfficeId, string year, string queryString)
        {
            var apiEndpoint = $"GPaye/GetPayeByTaxPayerIdAndPyrAndPmoYearly/{taxOfficeId}/{year}/{queryString}"; 

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAnnualPayeDetails(Guid payeId)
        {
            var apiEndpoint = $"GPaye/GetPayeYearlyTransByTaxPayerId/{payeId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForSingleObject<object>> GetPayeMonthlyEmployeeDetailsById(Guid payeId, int pageNumber = 1, int pageSize = 500)
        {
            //var apiEndpoint = $"GPaye/GetPayeMonthlyEmployeeDetailsById/{payeId}"; 
            var apiEndpoint = $"GPaye/GetPagedPayeMonthlyEmployeeDetailsById/{payeId}?PageNumber={pageNumber}&PageSize={pageSize}"; 

            return await _adminRequestClient.GetRequestAsyncSingleObject(apiEndpoint);
        }

        public async Task<ResponseItemForSingleObject<object>> GetAllPayeTransacByPayeId(Guid payeId)
        {
            var apiEndpoint = $"GPaye/GetPayeMonthlyDetailsById/{payeId}";

            return await _adminRequestClient.GetRequestAsyncSingleObject(apiEndpoint); 
        }
    }
}
