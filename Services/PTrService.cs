using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class PTrService: IPTrService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public PTrService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetAllPtrApplicationsByTaxOfficeId(Guid id, string queryString)
        {
            var apiEndpoint = $"Application/GetAllPtrApplicationsByTaxOfficeId/{id}?filter={queryString}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForSingleObject<object>> GetReliefApplicationDetailsByIdAndType(Guid uniApplicationId, string applicationTypeCode)
        {
            var apiEndpoint = $"Application/GetReliefApplicationDetailsByIdAndType/{uniApplicationId}/{applicationTypeCode}";

            return await _adminRequestClient.GetRequestAsyncSingleObject(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllPTRPendingApprovalByTaxOfficeId(Guid taxOfficeId, string filter)
        {
            var apiEndpoint = $"Application/GetAllReliefApplicationPendingApprovalByTaxOfficeId/{taxOfficeId}?filter={filter}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
