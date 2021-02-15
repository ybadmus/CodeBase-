using ITAPS_HOST.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ITExService
    {
        Task<ResponseItem<object>> GetAllTExApplicationByTaxOfficeId(Guid id, string queryString);
        Task<ResponseItem<object>> GetAllTaxExemptionPendingApprovalByTaxOfficeId(Guid taxOfficeId, string filter);
        Task<ResponseItem<object>> GetAllExemptionApplicationForCommissioner(Guid taxOfficeId, string status, string filter);
        Task<ResponseItem<object>> GetWHTExApplicationById(Guid whtId);
    }
}
