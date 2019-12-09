using IdentityModel;
using IdentityModel.AspNetCore;
using itaps_host.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;

namespace ITAPS_HOST.Helpers
{
    public static class AuthenticationServiceExtension
    {
        public static IServiceCollection AddAuthenticationConfiguration(this IServiceCollection services, IConfiguration config)
        {
            //var configitaps = new ITAPSHOSTCONFIGURATION();
            var configidp = new IDPSETTINGS();

            config.Bind("ITAPSHOSTCONFIG", config);
            config.Bind("IDPSETTINGS", configidp);

            var apiUrl = configidp.ApiUrl;
            var authority = configidp.Authority;
            var clientSecret = configidp.ClientSecret;
            var clientId = configidp.ClientId;
            var requireHttpsMetadata = configidp.RequireHttpsMetadata;

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                options.Cookie.Name = "itapshostmvchybridautorefresh";
            })
            .AddAutomaticTokenManagement()
            .AddOpenIdConnect("oidc", options =>
            {
                options.Authority = authority;
                options.RequireHttpsMetadata = requireHttpsMetadata;
                options.ClientSecret = clientSecret;
                options.ClientId = clientId;
                options.ResponseType = "code id_token";

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("phone");
                options.Scope.Add("admin");
                options.Scope.Add("offline_access");

                options.ClaimActions.MapAllExcept("iss", "nbf", "exp", "aud", "nonce", "iat", "c_hash");
                options.GetClaimsFromUserInfoEndpoint = true;
                options.SaveTokens = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = JwtClaimTypes.Name,
                    RoleClaimType = JwtClaimTypes.Role,
                };
            });

            return services;
        }
    }
}
