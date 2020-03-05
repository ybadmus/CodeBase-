using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ITaxRateService
    {
        Task<ResponseItem<object>> GetAllGcirAsync();

        Task<ResponseItem<object>> GetAllGtaxAsync();

        Task<ResponseItem<object>> GetGcirByIdAsync(Guid lngId);

        Task<ResponseItem<object>> GetAllGtaxByYearAsync(string year);

        Task<ResponseItem<object>> GetAllGtaxByIdAsync(Guid lngId);

        Task<ResponseItemForCreationDto<object>> PostGcir(CompanyTaxRateDto data);

        Task<ResponseItemForCreationDto<object>> PostGtax(PitTaxRateDto data);

        Task<ResponseItem<object>> SearchTaxRateAsync(string searchTerm);

    }
}
