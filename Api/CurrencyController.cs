using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencyService _currencyService;
        public CurrencyController(ICurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet("{id}")]
        public async Task<ResponseItem<object>> GetCurrencyByIdAsync(Guid id)
        {
            return await _currencyService.GetCurrencyByIdAsync(id);
        }

        [HttpPost]
        public async Task<ResponseItemForCreationDto<object>> PostCurrencyAsync([FromBody]CurrencyForCreationDto data)
        {
            return await _currencyService.PostCurrencyAsync(data);
        }

        [HttpGet("SearchCurrency/{term}")]
        public async Task<ResponseItem<object>> SearchCurrencyAsync(string term)
        {
            return await _currencyService.SearchCurrencyAsync(term);
        }
    }
}