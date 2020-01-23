using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models.Codes;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Authorize]
    [Route("api/[controller]/")]
    public class CodesApiController : Controller
    {
        private readonly ICodeService _codeSetupService;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public CodesApiController(ICodeService codeSetupService)
        {
            _codeSetupService = codeSetupService;
        }

        [HttpGet("{code}")]
        public async Task<ResponseItem<object>> GetCodeTableData(string code)
        {
            return await _codeSetupService.GetCodesTableAsync(code);
        }

        [HttpPost("{code}")]
        public async Task<ResponseItemForCreationDto<object>> PostCodeTableAsync(string code, [FromBody]SetupForCreationDto data)
        {
            return await _codeSetupService.PostCodesTableAsync(code, data);
        }

        [HttpPut("{code}")]
        public async Task<ResponseItemForCreationDto<object>> PutCodeTableAsync(string code, [FromBody]SetupForCreationDto data)
        {
            return await _codeSetupService.PostCodesTableAsync(code, data);
        }

        [HttpGet("SearchCodesTableAsync/")]
        public async Task<ResponseItem<object>> SearchCodesTableAsync(string type, string term)
        {
            return await _codeSetupService.SearchCodesTableAsync(type, term);
        }

        [HttpGet("GetAllPeriods", Name = "GetAllPeriods")]
        public async Task<ResponseItem<object>> GetAllActivePeriods()
        {
            return await _codeSetupService.GetAllActivePeriods();
        }
    }
}