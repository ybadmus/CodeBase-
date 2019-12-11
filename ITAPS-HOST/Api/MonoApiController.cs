using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonoApiController : ControllerBase
    {
        private readonly IMonoService _monoService;
        public MonoApiController(IMonoService monoService)
        {
            _monoService = monoService;
        }
       
        [HttpGet("GetAllActivePeriods", Name = "GetAllActivePeriods")]
        public async Task<ResponseItem<object>> GetAllActivePeriods()
        {
            return await _monoService.GetAllActivePeriods();
        }
    }
}