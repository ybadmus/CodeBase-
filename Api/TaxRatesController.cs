using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaxRatesController : Controller
    {
        private readonly ITaxRateService _taxRateServices;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public TaxRatesController(ITaxRateService taxRateServices)
        {
            _taxRateServices = taxRateServices;
        }

        [HttpGet("GetAllGcir", Name = "GetAllGcir")]
        public async Task<ResponseItem<object>> GetAllGcir()
        {
            return await _taxRateServices.GetAllGcirAsync();
        }

        [HttpGet("GetGcirById", Name = "GetGcirById")]
        public async Task<ResponseItem<object>> GetGcirById(Guid lngId)
        {
            return await _taxRateServices.GetGcirByIdAsync(lngId);
        }

        [HttpPost("PostGcir", Name = "PostGcir")]
        public async Task<ResponseItemForCreationDto<object>> PostGcir([FromBody]CompanyTaxRateDto data)
        {
            return await _taxRateServices.PostGcir(data);
        }

        [HttpGet("SearchTaxRateAsync", Name = "SearchTaxRateAsync")]
        public async Task<ResponseItem<object>> SearchTaxRateAsync(string searchItem)
        {
            return await _taxRateServices.SearchTaxRateAsync(searchItem);
        }
        
    }
}