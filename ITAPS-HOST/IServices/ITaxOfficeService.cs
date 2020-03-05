using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ITaxOfficeService
    {
        Task<ResponseItem<object>> GetTaxOfficesAsync();

        Task<ResponseItem<object>> GetTaxOfficeByIdAsync(Guid id);

        Task<ResponseItem<object>> SearchTaxOfficeAsync(string term);

        Task<ResponseItem<object>> GetTaxOfficeTypesAsync(string code);

        Task<ResponseItemForCreationDto<object>> PostTaxOfficeAsync(TaxOfficeForCreationDto data);
    }
}
