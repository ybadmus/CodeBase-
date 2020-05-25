using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IWTHService
    {
        Task<ResponseItem<object>> SearchWithholdingByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter, string whttype);
        Task<ResponseItem<object>> SearchMonthlyWithholdingReturnsByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter);
        Task<ResponseItem<object>> SearchAllWHVatReturnsByTaxOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter);
        Task<ResponseItem<object>> GetAllGwtrAsync();
        Task<ResponseItem<object>> GetAllTaxRatesAsync();
        Task<ResponseItem<object>> GetGWTTByGwrtAsync(Guid periodId, string tin);
        Task<ResponseItem<object>> GetGWVTByGwvrAsync(Guid periodId, string tin);
        Task<ResponseItemForCreationDto<object>> PostGWTR(GwtrForCreationDto data);
        Task<ResponseItemForCreationDto<object>> PostWTR1(TaxRateForCreationDto data);
        Task<ResponseItem<object>> GetGWTTByInvoiceNumberAsync(Guid invoiceNumber);
        Task<ResponseItem<object>> GetGWVTByInvoiceNumberAsync(string invoiceNumber);
    }
}
