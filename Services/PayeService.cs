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

        public async Task<ResponseItem<object>> GetPayeCompanyDetailsByTaxOficeId(Guid taxCollectId, Guid periodId, string queryString)
        {
            var apiEndpoint = $"GPaye/GetPayeCompanyDetailsByTaxOficeId/{taxCollectId}/{periodId}?filter={queryString}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllPayeEmpDeByEmpIdAndPayeId(Guid employeeId, Guid payeId)
        {
            var apiEndpoint = $"GPaye/GetAllPayeEmpDeByEmpIdAndPayeId/{employeeId}/{payeId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForSingleObject<object>> GetAllPayeTransacByPayeId(Guid payeId)
        {
            var apiEndpoint = $"GPaye/GetAllPayeTransacByPayeId/{payeId}";

            return await _adminRequestClient.GetRequestAsyncSingleObject(apiEndpoint); 
        }
    }
}
