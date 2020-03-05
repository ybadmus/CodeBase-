using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Marvin.StreamExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class MonoService: IMonoService
    {
        private readonly IMainRequestClient _mainRequestClient;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public MonoService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }
        public async Task<ResponseItem<object>> GetAllActivePeriods()
        {
            string currentYear = DateTime.Now.Year.ToString();
            string endpoint = "http://psl-app-vm3/TaxPayerMonoAPI/api/GenericCodes/GetAllActivePeriodsByYearAndType/" + currentYear + "/WHPER";
            var client = _httpClientFactory.CreateClient();
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));

            using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
            {
                IEnumerable<object> apiResponse = Enumerable.Empty<object>();

                if (!response.IsSuccessStatusCode)
                {
                    return new ResponseItem<object>
                    {
                        Status = "Failure",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }

                var stream = await response.Content.ReadAsStreamAsync();
                apiResponse = stream.ReadAndDeserializeFromJson<IEnumerable<object>>();

                return new ResponseItem<object>
                {
                    Status = "Successful",
                    Caption = response.ReasonPhrase,
                    Body = apiResponse
                };
            }
        }
    }
}
