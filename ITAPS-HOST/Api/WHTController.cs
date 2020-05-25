using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WHTController : ControllerBase
    {
        private readonly IWTHService _whtService;
        public WHTController(IWTHService whtService)
        {
            _whtService = whtService;
        }

        [HttpGet("SearchWithholdingByOffice/")]
        public async Task<ResponseItem<object>> SearchWithholdingByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {

            return await _whtService.SearchWithholdingByOffice(taxOfficeId, periodId, startDate, endDate, tin == String.Empty ? "" : tin, szFilter == String.Empty ? "" : szFilter, "whttax");
        }

        [HttpGet("SearchMonthlyWithholdingReturnsByOffice/")] //
        public async Task<ResponseItem<object>> SearchMonthlyWithholdingReturnsByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {

            return await _whtService.SearchMonthlyWithholdingReturnsByOffice(taxOfficeId, periodId == String.Empty ? "" : periodId, startDate, endDate, tin == String.Empty ? "" : tin, szFilter == String.Empty ? "" : szFilter);
        }

        [HttpGet("SearchWithHoldingVatReturns/")]
        public async Task<ResponseItem<object>> SearchWithHoldingVatReturns(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {

            return await _whtService.SearchAllWHVatReturnsByTaxOffice(taxOfficeId, periodId == String.Empty ? "" : periodId, startDate, endDate, tin == String.Empty ? "" : tin, szFilter == String.Empty ? "" : szFilter);
        }

        [HttpGet("GetAllGwtrAsync/")]
        public async Task<ResponseItem<object>> GetAllGwtrAsync()
        {

            return await _whtService.GetAllGwtrAsync();
        }

        [HttpGet("GetAllTaxRatesAsync/")]
        public async Task<ResponseItem<object>> GetAllTaxRatesAsync()
        {

            return await _whtService.GetAllTaxRatesAsync();
        }

        [HttpPost("PostGWTR", Name = "PostGWTR")]
        public async Task<ResponseItemForCreationDto<object>> PostGWTR([FromBody]GwtrForCreationDto data)
        {

            return await _whtService.PostGWTR(data);
        }

        [HttpPost("PostWTR1", Name = "PostWTR1")]
        public async Task<ResponseItemForCreationDto<object>> PostWTR1([FromBody]TaxRateForCreationDto dataForCreation)
        {

            return await _whtService.PostWTR1(dataForCreation);
        }

        [HttpGet("GetGWTTByGwrtAsync", Name = "GetGWTTByGwrtAsync")] //
        public async Task<ResponseItem<object>> GetGWTTByGwrtAsync(Guid periodId, string tin)
        {

            return await _whtService.GetGWTTByGwrtAsync(periodId, tin);
        }

        [HttpGet("GetGWVTByGwvrAsync", Name = "GetGWVTByGwvrAsync")]
        public async Task<ResponseItem<object>> GetGWVTByGwvrAsync(Guid periodId, string tin)
        {

            return await _whtService.GetGWVTByGwvrAsync(periodId, tin);
        }

        [HttpGet("GetGWTTByInvoiceNumber", Name = "GetGWTTByInvoiceNumber")] 
        public async Task<ResponseItem<object>> GetGWTTByInvoiceNumber(Guid whtId)
        {

            return await _whtService.GetGWTTByInvoiceNumberAsync(whtId);
        }

        [HttpGet("GetGWVTByInvoiceNumber", Name = "GetGWVTByInvoiceNumber")]
        public async Task<ResponseItem<object>> GetGWVTByInvoiceNumber(string invoiceNumber)
        {

            return await _whtService.GetGWVTByInvoiceNumberAsync(invoiceNumber);
        }

        [HttpGet("SearchAllWHVatByTaxOffice/")]
        public async Task<ResponseItem<object>> SearchAllWHVatByTaxOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {

            return await _whtService.SearchWithholdingByOffice(taxOfficeId, periodId, startDate, endDate, tin == String.Empty ? "" : tin, szFilter == String.Empty ? "" : szFilter, "whtvat");
        }
    }
}