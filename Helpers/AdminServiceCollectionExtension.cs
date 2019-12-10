﻿using ITAPS_HOST.Services;
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
            services.AddHttpClient<ITAPSMain, TAPSMain>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            //services.AddSingleton<ICurrencyService, CurrencyService>();
            //services.AddSingleton<ITaxOfficeService, TaxOfficeService>();
            //services.AddSingleton<ITaxHolidayService, TaxHolidayService>();
            //services.AddSingleton<ICodeSetupService, CodeSetupService>();
            //services.AddSingleton<ITransactionService, TransactionService>();

            //services.TryAddSingleton<IApplicationActivityService, ApplicationActivityService>();
            //services.TryAddSingleton<IApiClient, ApiClient>();
            //services.TryAddSingleton<IAppActReqService, AppActReqService>();
            //services.TryAddSingleton<IAppRequirementService, AppRequirementService>();
            //services.TryAddSingleton<IpsAdPersonnelService, psAdPersonnelService>();
            //services.TryAddSingleton<IRequirementTypeService, RequirementTypeService>();
            //services.TryAddSingleton<IDocumentService, DocumentService>();
            //services.TryAddSingleton<ITCCApplicationService, TCCApplicationService>();
            //services.TryAddSingleton<ITaxRateService, TaxRateService>();
            //services.TryAddSingleton<IWTHService, WHTService>();
            //services.TryAddSingleton<ITExService, TExService>();
            //services.TryAddSingleton<IPTRService, PTRService>();

            //services.TryAddSingleton<IEmpService, EmpService>();
            //services.TryAddSingleton<IMenuService, MenuService>();
            //services.TryAddSingleton<IUserService, UserService>();

            return services;
        }
    }
}
