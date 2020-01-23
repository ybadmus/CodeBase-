using ITAPS_HOST.IServices;
using ITAPS_HOST.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ITAPS_HOST.Helpers
{
    public static class AdminServiceCollectionExtension
    {
        public static IServiceCollection AddHttpConfiguration(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpClient<ITAPSAdmin, TAPSAdmin>();
            services.AddHttpClient<IMainRequestClient, MainRequestClient>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSingleton<ICodeService, CodeService>();
            services.AddSingleton<IAdminRequestClient, AdminRequestClient>();
            services.AddSingleton<ITaxOfficeService, TaxOfficeService>();
            services.AddSingleton<ITaxHolidayService, TaxHolidayService>();
            services.AddSingleton<ICurrencyService, CurrencyService>();
            services.AddSingleton<IWTHService, WHTService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<ITCCService, TCCService>();
            services.AddSingleton<ITExService, TExService>();
            services.AddSingleton<ITransactionService, TransactionService>();
            services.AddSingleton<ITaxRateService, TaxRateService>();
            services.AddSingleton<IPTrService, PTrService>();
            services.AddSingleton<IMonoService, MonoService>();

            return services;
        }
    }
}
