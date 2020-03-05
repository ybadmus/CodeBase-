using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IPTrService
    {
        Task<ResponseItem<object>> GetAllPtrApplicationsByTaxOfficeId(Guid id, string queryString);

        Task<ResponseItemForSingleObject<object>> GetReliefApplicationDetailsByIdAndType(Guid uniApplicationId, string applicationTypeCode);

        Task<ResponseItem<object>> GetAllPTRPendingApprovalByTaxOfficeId(Guid taxOfficeId, string filter);
    }
}
