using ITAPS_HOST.Data;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TExService: ITExService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        private readonly IAppTypeId _appConfig;

        public TExService(IAdminRequestClient adminRequestClient, IAppTypeId appConfig)
        {
            _adminRequestClient = adminRequestClient;
            _appConfig = appConfig;
        }

        public async Task<ResponseItem<object>> GetAllTExApplicationByTaxOfficeId(Guid id, string queryString)
        {
            var apiEndpoint = $"Application/GetAllWHTExApplicationsByTaxOfficeIdAndType/{id}/{_appConfig.TaxExemptionId}?filter={queryString}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllTaxExemptionPendingApprovalByTaxOfficeId(Guid taxOfficeId, string filter)
        {
            var apiEndpoint = $"Application/GetAllTaxExemptionPendingApprovalByTaxOfficeId/{taxOfficeId}?filter={filter}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetWHTExApplicationById(Guid whtId)
        {
            var apiEndpoint = $"Application/GetWHTExApplicationById/{whtId}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
