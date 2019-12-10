using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Net.Http;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TAPSAdmin: ITAPSAdmin
    {
        public readonly HttpClient Client;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _httpClientFactory;

        public TAPSAdmin(HttpClient client, IHttpContextAccessor httpContextAccessor, IHttpClientFactory httpClientFactory)
        {

            _httpContextAccessor = httpContextAccessor;
            _httpClientFactory = httpClientFactory;
            Client = client;
        }

        public async Task<HttpClient> GetClientAsync()
        {
            var client = _httpClientFactory.CreateClient("tokenAdmin");
            var currentContext = _httpContextAccessor.HttpContext;

            var accessToken = await currentContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);

            client.SetBearerToken(accessToken);
            return client;
        }
    }

    public interface ITAPSAdmin
    {
        Task<HttpClient> GetClientAsync();
    }
}
