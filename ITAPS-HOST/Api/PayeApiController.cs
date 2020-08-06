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
        public async Task<ResponseItem<object>> GetAllCompanyPaye(Guid officeId, Guid periodId, string searchItem)
        {
            return await _payeService.GetPayeCompanyDetailsByTaxOficeId(officeId, periodId, searchItem);
        }

        [HttpGet("GetAllAnnualPaye", Name = "GetAllAnnualPaye")]
        public async Task<ResponseItem<object>> GetAllAnnualPaye(Guid officeId, string year, string queryString)
        {
            return await _payeService.GetAllAnnualPaye(officeId, year, queryString);
        }

        [HttpGet("GetAnnualPayeDetails", Name = "GetAnnualPayeDetails")]
        public async Task<ResponseItem<object>> GetAnnualPayeDetails(Guid payeId)
        {
            return await _payeService.GetAnnualPayeDetails(payeId);
        }

        [HttpGet("GetPayeDetails", Name = "GetPayeDetails")]
        public async Task<ResponseItemForSingleObject<object>> GetPayeDetails(Guid payeId)
        {
            return await _payeService.GetAllPayeTransacByPayeId(payeId);
        }

        [HttpGet("GetEmployeeDetails", Name = "GetEmployeeDetails")]
        public async Task<ResponseItem<object>> GetEmployeeDetails(Guid payeId)
        {
            return await _payeService.GetPayeMonthlyEmployeeDetailsById(payeId);
        }
    }
}