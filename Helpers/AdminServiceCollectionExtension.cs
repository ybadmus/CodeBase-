using itaps_host.Models;
using itaps_host.Services;
using itaps_host.Services.Network;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;

namespace ITAPS_HOST.Helpers
{
    public static class AdminServiceCollectionExtension
    {
        public static IServiceCollection AddHttpConfiguration(this IServiceCollection services, IConfiguration config)
        {
            //var configidp = new IDPSETTINGS();
            //config.Bind("IDPSETTINGS", configidp);

            services.AddHttpClient<IAdminClient, AdminClient>();
            services.AddHttpClient<ITaxpayerMonoClient, TaxpayerMonoApiClient>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSingleton<ICurrencyService, CurrencyService>();
            services.AddSingleton<ITaxOfficeService, TaxOfficeService>();
            services.AddSingleton<ITaxHolidayService, TaxHolidayService>();
            services.AddSingleton<ICodeSetupService, CodeSetupService>();
            services.AddSingleton<ITransactionService, TransactionService>();

            services.TryAddSingleton<IApplicationActivityService, ApplicationActivityService>();
            services.TryAddSingleton<IApiClient, ApiClient>();
            services.TryAddSingleton<IAppActReqService, AppActReqService>();
            services.TryAddSingleton<IAppRequirementService, AppRequirementService>();
            services.TryAddSingleton<IpsAdPersonnelService, psAdPersonnelService>();
            services.TryAddSingleton<IRequirementTypeService, RequirementTypeService>();
            services.TryAddSingleton<IDocumentService, DocumentService>();
            services.TryAddSingleton<ITCCApplicationService, TCCApplicationService>();
            services.TryAddSingleton<ITaxRateService, TaxRateService>();
            services.TryAddSingleton<IWTHService, WHTService>();
            services.TryAddSingleton<ITExService, TExService>();
            services.TryAddSingleton<IPTRService, PTRService>();

            services.TryAddSingleton<IEmpService, EmpService>();
            services.TryAddSingleton<IMenuService, MenuService>();
            services.TryAddSingleton<IUserService, UserService>();

            return services;
        }
    }
}
