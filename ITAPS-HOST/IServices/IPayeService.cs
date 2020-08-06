using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IPayeService
    {
        Task<ResponseItem<object>> GetPayeCompanyDetailsByTaxOficeId(Guid taxOfficeId, Guid periodId, string searchItem);
        Task<ResponseItem<object>> GetAllAnnualPaye(Guid taxOfficeId, string year, string queryString);
        Task<ResponseItem<object>> GetAnnualPayeDetails(Guid payeId);
        Task<ResponseItem<object>> GetPayeMonthlyEmployeeDetailsById(Guid payeId);
        Task<ResponseItemForSingleObject<object>> GetAllPayeTransacByPayeId(Guid payeId);
    }
}
