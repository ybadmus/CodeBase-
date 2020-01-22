using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class TEXController : ControllerBase
    {
        private readonly ITExService _iTExService;
        public TEXController(ITExService iTExService)
        {
            _iTExService = iTExService;
        }

        [HttpGet("GetAllTExApplicationByTaxOfficeId", Name = "GetAllTExApplicationByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllTExApplicationByTaxOfficeId(Guid officeId, string queryString)
        {
            return await _iTExService.GetAllTExApplicationByTaxOfficeId(officeId, queryString);
        }

        [HttpGet("GetAllTaxExemptionPendingApprovalByTaxOfficeId", Name = "GetAllTaxExemptionPendingApprovalByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllTaxExemptionPendingApprovalByTaxOfficeId(Guid officeId, string queryString)
        {
            return await _iTExService.GetAllTaxExemptionPendingApprovalByTaxOfficeId(officeId, queryString);
        }

        [HttpGet("GetWHTExApplicationById", Name = "GetWHTExApplicationById")]
        public async Task<ResponseItem<object>> GetWHTExApplicationById(Guid whtId)
        {
            return await _iTExService.GetWHTExApplicationById(whtId);
        }
    }
}