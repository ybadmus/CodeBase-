using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PTRController : ControllerBase
    {
        private readonly IPTrService _iPTrService;

        public PTRController(IPTrService iPTrService)
        {
            _iPTrService = iPTrService;
        }

        [HttpGet("GetAllPtrApplicationsByTaxOfficeId", Name = "GetAllPtrApplicationsByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllPtrApplicationsByTaxOfficeId(Guid officeId, string queryString)
        {
            return await _iPTrService.GetAllPtrApplicationsByTaxOfficeId(officeId, queryString);
        }

        [HttpGet("GetReliefApplicationDetailsByIdAndType", Name = "GetReliefApplicationDetailsByIdAndType")]
        public async Task<ResponseItemForSingleObject<object>> GetReliefApplicationDetailsByIdAndType(Guid uniApplicationId, string applicationTypeCode)
        {
            return await _iPTrService.GetReliefApplicationDetailsByIdAndType(uniApplicationId, applicationTypeCode);
        }

        [HttpGet("GetAllPTRPendingApprovalByTaxOfficeId", Name = "GetAllPTRPendingApprovalByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllPTRPendingApprovalByTaxOfficeId(Guid officeId, string queryString)
        {
            return await _iPTrService.GetAllPTRPendingApprovalByTaxOfficeId(officeId, queryString);
        }
    }
}