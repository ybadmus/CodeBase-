using itaps_host.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace ITAPS_HOST.Helpers
{
    public static class ConfigurationServiceCollectionExtension
    {
        public static IServiceCollection AddAppConfiguration(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<IDPSETTINGS>(config.GetSection("IDPSETTINGS"));
            services.Configure<ITAPSHOSTCONFIGURATION>(config.GetSection("ITAPSHOSTCONFIG"));
            services.Configure<SSRSConfiguration>(config.GetSection("SSRSConfiguration"));
            services.Configure<AppTypeId>(config.GetSection("ApplicationTypeId"));

            services.TryAddSingleton<IHOSTConfiguration>(sp =>
                sp.GetRequiredService<IOptions<ITAPSHOSTCONFIGURATION>>().Value); // forwarding via implementation factory

            services.TryAddSingleton<ISETTINGS>(sp =>
                sp.GetRequiredService<IOptions<IDPSETTINGS>>().Value); // forwarding via implementation factory

            services.TryAddSingleton<ISSRSConfiguration>(sp =>
              sp.GetRequiredService<IOptions<SSRSConfiguration>>().Value); // forwarding via implementation factory

            services.TryAddSingleton<IAppTypeId>(sp =>
                sp.GetRequiredService<IOptions<AppTypeId>>().Value); // forwarding via implementation factory


            return services;
        }
    }
}
