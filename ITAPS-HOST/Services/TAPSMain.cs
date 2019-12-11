using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Net.Http;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TAPSMain: ITAPSMain
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _httpClientFactory;

        public TAPSMain(IHttpContextAccessor httpContextAccessor, IHttpClientFactory httpClientFactory)
        {
            _httpContextAccessor = httpContextAccessor;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<HttpClient> GetClientAsync()
        {
            var client = _httpClientFactory.CreateClient("tokenITAPS");
            var currentContext = _httpContextAccessor.HttpContext;

            var accessToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);

            client.SetBearerToken(accessToken);

            return client;
        }
    }

    public interface ITAPSMain
    {
        Task<HttpClient> GetClientAsync();
    }
}
