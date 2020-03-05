using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TaxHolidayService: ITaxHolidayService
    {

        private readonly IAdminRequestClient _adminRequestClient;

        public TaxHolidayService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }
        public async Task<ResponseItem<object>> GetTaxHolidayAsync(Guid id)
        {
            string apiEndpoint = $"TaxPayerTaxHoliday/GetGTAHByIdAsync/{id}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchTaxHolidayAsync(string term)
        {
            string apiEndpoint = $"TaxPayerTaxHoliday/SearchTaxHolidayAsync/{term}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostTaxHolidayAsync(TaxHolidayForCreationDto data)
        {
            const string apiEndpoint = "TaxPayerTaxHoliday/PostGTAH";
            var taxHolidayForCreation = new TaxHolidayForCreationDto
            {
                Id = data.Id,
                Code = data.Code,
                Description = data.Description,
                Notes = data.Notes,
                Status = data.Status
            };
            return await _adminRequestClient.PostRequestAsync(taxHolidayForCreation, apiEndpoint);
        }

    }
}
