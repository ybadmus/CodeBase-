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
    [Authorize]
    public class TaxHolidayController : ControllerBase
    {
        private readonly ITaxHolidayService _taxHolidayService;

        public TaxHolidayController(ITaxHolidayService taxHolidayService)
        {
            _taxHolidayService = taxHolidayService;
        }

        [HttpGet("{id}")]
        public async Task<ResponseItem<object>> GetTaxHolidayAsync(Guid id)
        {

            return await _taxHolidayService.GetTaxHolidayAsync(id);
        }

        [HttpPost()]
        public async Task<ResponseItemForCreationDto<object>> PostTaxHoliday([FromBody]TaxHolidayForCreationDto data)
        {

            return await _taxHolidayService.PostTaxHolidayAsync(data);
        }

        [HttpPut()]
        public async Task<ResponseItemForCreationDto<object>> PutTaxHoliday([FromBody]TaxHolidayForCreationDto data)
        {

            return await _taxHolidayService.PostTaxHolidayAsync(data);
        }

        [HttpGet("SearchTaxHolidayAsync/{term}")]
        public async Task<ResponseItem<object>> SearchTaxHolidayAsync(string term)
        {

            return await _taxHolidayService.SearchTaxHolidayAsync(term);
        }
    }
}