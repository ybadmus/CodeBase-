using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PayeApiController : ControllerBase
    {
        private readonly IPayeService _payeService;
        public PayeApiController(IPayeService payeService)
        {
            _payeService = payeService;
        }

        [HttpGet("GetAllCompanyPaye", Name = "GetAllCompanyPaye")]
        public async Task<ResponseItem<object>> GetAllCompanyPaye(Guid officeId, Guid periodId, string queryString)
        {
            return await _payeService.GetPayeCompanyDetailsByTaxOficeId(officeId, periodId, queryString);
        }

        [HttpGet("GetPayeDetails", Name = "GetPayeDetails")]
        public async Task<ResponseItemForSingleObject<object>> GetPayeDetails(Guid payeId)
        {
            return await _payeService.GetAllPayeTransacByPayeId(payeId);
        }

        [HttpGet("GetEmployeeDetails", Name = "GetEmployeeDetails")]
        public async Task<ResponseItem<object>> GetEmployeeDetails(Guid payeId, Guid empId)
        {
            return await _payeService.GetAllPayeEmpDeByEmpIdAndPayeId(empId, payeId);
        }
    }
}