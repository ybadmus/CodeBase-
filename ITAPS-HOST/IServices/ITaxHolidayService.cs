using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ITaxHolidayService
    {
        Task<ResponseItem<object>> GetTaxHolidayAsync(Guid id);

        Task<ResponseItem<object>> SearchTaxHolidayAsync(string term);

        Task<ResponseItemForCreationDto<object>> PostTaxHolidayAsync(TaxHolidayForCreationDto data);
    }
}
