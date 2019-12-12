using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TaxOfficeService : ITaxOfficeService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public TaxOfficeService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetTaxOfficesAsync ()
        {
            var apiEndpoint = "TaxOffice/GetGTAOAllAsync/";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);

        }

        public async Task<ResponseItem<object>> GetTaxOfficeByIdAsync(Guid id)
        {
            var apiEndpoint = $"TaxOffice/GetGtaoByIdAsync/{id}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchTaxOfficeAsync(string term)
        {
            var apiEndpoint = $"TaxOffice/SearchOfficessAsync/{term}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetTaxOfficeTypesAsync(string code)
        {
            var apiEndpoint = $"GenericCodes/GetAllGCOTByTypeAsync/{code}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostTaxOfficeAsync(TaxOfficeForCreationDto data)
        {
            const string apiEndpoint = "TaxOffice/PostGTAO";
            var taxOfficeForCreation = new TaxOfficeForCreationDto
            {
                Id = data.Id,
                Code = data.Code,
                Name = data.Name,
                RegionId = data.RegionId,
                TaxOfficeTypeId = data.TaxOfficeTypeId,
                Status = data.Status
            };

            return await _adminRequestClient.PostRequestAsync(taxOfficeForCreation, apiEndpoint);
        }

    }
}
