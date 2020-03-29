using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class CurrencyService: ICurrencyService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        public CurrencyService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetCurrencyByIdAsync(Guid id)
        {
            var apiEndpoint = $"Currency/GetGTRCByIdAsync/{id}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostCurrencyAsync(CurrencyForCreationDto data)
        {
            const string apiEndpoint = "Currency/PostGTRC";

            var currencyForCreation = new CurrencyForCreationDto
            {
                Code = data.Code,
                HomeCurrency = data.HomeCurrency,
                Symbol = data.Symbol,
                Notes = data.Notes,
                Status = data.Status,
                Description = data.Description
            };

            return await _adminRequestClient.PostRequestAsync(currencyForCreation, apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchCurrencyAsync(string term)
        {
            var apiEndpoint = $"Currency/SearchCurrenciesAsync/{term}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
