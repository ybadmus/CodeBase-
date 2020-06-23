using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IPayeService
    {
        Task<ResponseItem<object>> GetPayeCompanyDetailsByTaxOficeId(Guid taxCollectId, Guid periodId, string queryString);
        Task<ResponseItem<object>> GetAllAnnualPaye(Guid taxOfficeId, string year);
        Task<ResponseItem<object>> GetAnnualPayeDetails(Guid payeId);
        Task<ResponseItem<object>> GetAllPayeEmpDeByEmpIdAndPayeId(Guid employeeId, Guid payeId);
        Task<ResponseItemForSingleObject<object>> GetAllPayeTransacByPayeId(Guid payeId);
    }
}
