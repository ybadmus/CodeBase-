using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class MonoService: IMonoService
    {
        private readonly IMainRequestClient _mainRequestClient;

        public MonoService(IMainRequestClient mainRequestClient)
        {
            _mainRequestClient = mainRequestClient;
        }
        public async Task<ResponseItem<object>> GetAllActivePeriods()
        {
            string apiEndpoint = $"GenericCodes/GetAllActivePeriodsByYearAndType/{DateTime.Now.Year.ToString()}/WHPER";
            return await _mainRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
