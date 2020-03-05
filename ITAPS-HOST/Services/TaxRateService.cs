using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TaxRateService : ITaxRateService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public TaxRateService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> SearchTaxRateAsync(string searchTerm)
        {
            var apiEndpoint = $"CompanyTaxRates/SearchTaxRateAsync/{searchTerm}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllGcirAsync()
        {
            var apiEndpoint = $"CompanyTaxRates/GetAllGcirAsync";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllGtaxAsync()
        {
            var apiEndpoint = $"TaxRates/GetAllGtaxAsync";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllGtaxByYearAsync(string year)
        {
            var apiEndpoint = $"TaxRates/GetAllGtaxByYearAsync/{year}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGcirByIdAsync(Guid lngId)
        {
            var apiEndpoint = $"CompanyTaxRates/GetGcirByIdAsync?lngId={lngId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllGtaxByIdAsync(Guid lngId)
        {
            var apiEndpoint = $"TaxRates/GetAllGtaxByIdAsync/{lngId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostGcir(CompanyTaxRateDto data)
        {
            const string apiEndpoint = "CompanyTaxRates/PostGcir";
            var companyTaxRateDto = new CompanyTaxRateDto
            {
                Id = data.Id,
                Code = data.Code,
                Sector = data.Sector,
                BusinessLoc = data.BusinessLoc,
                TaxRate = data.TaxRate,
                Description = data.Description,
                GivenTaxHoliday = data.GivenTaxHoliday,
                TaxHolidayRate = data.TaxHolidayRate,
                HolidayYears = data.HolidayYears,
                Notes = data.Notes,
                Status = data.Status
            };

            return await _adminRequestClient.PostRequestAsync(companyTaxRateDto, apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostGtax(PitTaxRateDto data)
        {
            const string apiEndpoint = "TaxRates/PostGtax";
            var companyTaxRateDto = new PitTaxRateDto
            {
                Id = data.Id,
                Code = data.Code,
                CompanyId = data.CompanyId,
                Description = data.Description,
                AmtBased = data.AmtBased,
                TaxFreeAmt = data.TaxFreeAmt,
                PerBasedOnTable = data.PerBasedOnTable,
                FixedAmtTable = data.FixedAmtTable,
                StartDate = data.StartDate,
                EndDate = data.EndDate,
                Default = data.Default,
                Tax1 = new List<Tax1>()
            };


            foreach(Tax1 taxBand in data.Tax1)
            {
                var taxBandDto = new Tax1
                {
                    Id = taxBand.Id,
                    TaxMasterId = taxBand.TaxMasterId,
                    TaxBand = taxBand.TaxBand,
                    TaxableAmt = taxBand.TaxableAmt,
                    Percentage = taxBand.Percentage
                };

                companyTaxRateDto.Tax1.Add(taxBandDto);
            };

            return await _adminRequestClient.PostRequestAsync(companyTaxRateDto, apiEndpoint);
        }
    }
}
