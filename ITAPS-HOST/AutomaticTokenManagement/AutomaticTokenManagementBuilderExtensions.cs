using ITAPS_HOST;
using ITAPS_HOST.AutomaticTokenManagement;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;

namespace IdentityModel.AspNetCore
{
    public static class AutomaticTokenManagementBuilderExtensions
    {
        public static AuthenticationBuilder AddAutomaticTokenManagement(this AuthenticationBuilder builder, Action<AutomaticTokenManagementOptions> options)
        {
            builder.Services.Configure(options);
            return builder.AddAutomaticTokenManagement();
        }

        public static AuthenticationBuilder AddAutomaticTokenManagement(this AuthenticationBuilder builder)
        {
            var connString = Startup.StaticConfig.GetSection("APPCONSTANTS");

            builder.Services.AddHttpClient("tokenAdmin", client =>
            {
                client.BaseAddress = new Uri(connString["APIUrl"]);
                client.Timeout = new TimeSpan(0, 0, 30);
                client.DefaultRequestHeaders.Clear();
            }).AddHttpMessageHandler(handler => new TimeOutDelegatingHandler(TimeSpan.FromSeconds(20)))
                .ConfigurePrimaryHttpMessageHandler(handler =>
                    new HttpClientHandler()
                    {
                        AutomaticDecompression = System.Net.DecompressionMethods.GZip
                    });

            builder.Services.AddHttpClient("tokenITAPS", client =>
            {
                client.BaseAddress = new Uri(connString["TaxpayerMonoAPI"]);
                client.Timeout = new TimeSpan(0, 0, 30);
                client.DefaultRequestHeaders.Clear();
            }).AddHttpMessageHandler(handler => new TimeOutDelegatingHandler(TimeSpan.FromSeconds(20)))
                .ConfigurePrimaryHttpMessageHandler(handler =>
                    new HttpClientHandler()
                    {
                        AutomaticDecompression = System.Net.DecompressionMethods.GZip
                    });


            builder.Services.AddTransient<TokenEndpointService>();

            builder.Services.AddTransient<AutomaticTokenManagementCookieEvents>();
            builder.Services.AddSingleton<IConfigureOptions<CookieAuthenticationOptions>, AutomaticTokenManagementConfigureCookieOptions>();

            return builder;
        }
    }
}
