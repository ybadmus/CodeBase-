using IdentityModel;
using IdentityModel.AspNetCore;
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
            //This is how we pull things from appsettings on Startup 
            var idpSettings = Startup.StaticConfig.GetSection("APPCONSTANTS");

            var apiUrl = idpSettings["ApiUrl"];
            var authority = idpSettings["Authority"];
            var clientSecret = idpSettings["ClientSecret"];
            var clientId = idpSettings["ClientId"];
            bool requireHttpsMetadata = bool.Parse(idpSettings["RequireHttpsMetadata"]);

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = "oidc";
            })
            .AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                options.Cookie.Name = "mvcHybridITAPSHOST";
            })
            .AddAutomaticTokenManagement()
            .AddOpenIdConnect("oidc", options =>
            {
                options.Authority = authority;
                options.RequireHttpsMetadata = requireHttpsMetadata;
                options.ClientSecret = clientSecret;
                options.ClientId = clientId;
                options.CallbackPath = "/signin-oidc";
                options.ResponseType = "code id_token";
                options.UseTokenLifetime = true;
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
