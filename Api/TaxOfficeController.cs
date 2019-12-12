using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace itaps_host.Controllers
{

    [Route("api/[controller]/")]
    [Authorize]
    public class TaxOfficeController : Controller
    {
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly ITaxOfficeService _taxofficeService;

        public TaxOfficeController(ITaxOfficeService taxofficeService)
        {
            _taxofficeService = taxofficeService;
        }

        [HttpGet()]
        public async Task<ResponseItem<object>> GetTaxOfficesAsync()
        {

            return await _taxofficeService.GetTaxOfficesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ResponseItem<object>> GetTaxOfficeByIdAsync(Guid id)
        {

            return await _taxofficeService.GetTaxOfficeByIdAsync(id);
        }

        [HttpGet("SearchTaxOfficeAsync/{term}")]
        public async Task<ResponseItem<object>> SearchTaxOfficeAsync(string term)
        {
            
            return await _taxofficeService.SearchTaxOfficeAsync(term);
        }

        [HttpPost]
        public async Task<ResponseItemForCreationDto<object>> PostTaxOfficeAsync([FromBody] TaxOfficeForCreationDto data)
        {

            return await _taxofficeService.PostTaxOfficeAsync(data);
        }

        [HttpPut]
        public async Task<ResponseItemForCreationDto<object>> PutTaxOfficeAsync([FromBody] TaxOfficeForCreationDto data)
        {

            return await _taxofficeService.PostTaxOfficeAsync(data);
        }


        [HttpGet("GetTaxOfficeTypesAsync/{code}")]
        public async Task<ResponseItem<object>> GetTaxOfficeTypesAsync(string code)
        {

            return await _taxofficeService.GetTaxOfficeTypesAsync(code);
        }
    }
}