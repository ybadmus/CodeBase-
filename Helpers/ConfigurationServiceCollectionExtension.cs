using ITAPS_HOST.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace ITAPS_HOST.Helpers
{
    public static class ConfigurationServiceCollectionExtension 
    {
        //This class makes appsettings values accessible in the Conrollers and Services
        public static IServiceCollection AddAppConfiguration(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<AppConstants>(config.GetSection("IDPSETTINGS"));
            services.Configure<ReportConstants>(config.GetSection("REPORTS"));

            services.TryAddSingleton<IAppConstants>(sp =>
                sp.GetRequiredService<IOptions<AppConstants>>().Value); // forwarding via implementation factory

            services.TryAddSingleton<IReportConstants>(sp =>
               sp.GetRequiredService<IOptions<ReportConstants>>().Value); // forwarding via implementation factory

            return services;
        }
    }
}
