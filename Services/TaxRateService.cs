using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TaxRateService: ITaxRateService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public TaxRateService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetAllGcirAsync()
        {
            var apiEndpoint = $"CompanyTaxRates/GetAllGcirAsync";  
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGcirByIdAsync(Guid lngId)
        {
            var apiEndpoint = $"CompanyTaxRates/GetGcirByIdAsync?lngId={lngId}"; 
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostGcir(CompanyTaxRateDto data)
        {
            const string apiEndpoint = "CompanyTaxRates/PostGcir";
            var companyTaxRateDto = new CompanyTaxRateDto
            {
                IdTR = data.IdTR,
                CodeTR = data.CodeTR,
                SectorTR = data.SectorTR,
                BusinessLocTR = data.BusinessLocTR,
                TaxRateTR = data.TaxRateTR,
                DescriptionTR = data.DescriptionTR,
                GivenTaxHolidayTR = data.GivenTaxHolidayTR,
                TaxHolidayRateTR = data.TaxHolidayRateTR,
                HolidayYearsTR = data.HolidayYearsTR,
                NotesTR = data.NotesTR,
                StatusTR = data.StatusTR
            };

            return await _adminRequestClient.PostRequestAsync(companyTaxRateDto, apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchTaxRateAsync(string searchTerm)
        {
            var apiEndpoint = $"CompanyTaxRates/SearchTaxRateAsync/{searchTerm}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
