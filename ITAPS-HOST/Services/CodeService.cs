using ITAPS_HOST.IServices;
using ITAPS_HOST.Models.Codes;
using ITAPS_HOST.Models;
using Marvin.StreamExtensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class CodeService: ICodeService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        public CodeService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetCodesTableAsync(string code)
        {
            string apiEndpoint = $"GenericCodes/GetAllGCOTByTypeAsync/{code}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostCodesTableAsync(string code, SetupForCreationDto data)
        {
            string apiEndpoint = $"GenericCodes/PostGCOT?type={code}";
            var codeSetupForCreation = new SetupForCreationDto
            {
                Id = data.Id,
                Description = data.Description,
                cStatus = data.cStatus,
                Code = data.Code,
                Type = data.Type,
                Notes = data.Notes
            };
            return await _adminRequestClient.PostRequestAsync(codeSetupForCreation, apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchCodesTableAsync(string type, string term)
        {
            string apiEndpoint = $"GenericCodes/SearchCodesAsync?type={type}&term={term}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllActivePeriods()
        {
            string apiEndpoint = $"GenericCodes/GetAllActivePeriodsByYearAndType/{DateTime.Now.Year.ToString()}/WHPER";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
