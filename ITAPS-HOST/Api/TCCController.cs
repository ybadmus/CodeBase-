using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TCCController : ControllerBase
    {
        private readonly ITCCService _tccApplicationService;
        public TCCController(ITCCService tccApplicationService)
        {
            _tccApplicationService = tccApplicationService;
        }

        [HttpGet("GetAllTCCApplication", Name = "GetAllTCCApplication")]
        public async Task<ResponseItem<object>> GetAllTCCApplication()
        {
            return await _tccApplicationService.GetAllTCCApplication();
        }

        [HttpGet("GetTccApplicationById", Name = "GetTccApplicationById")]
        public async Task<ResponseItem<object>> GetTccApplicationById(Guid tccId, Guid appTypeId)
        {
            return await _tccApplicationService.GetTccApplicationById(tccId, appTypeId);
        }

        [HttpGet("GetAllTccApplicationComments", Name = "GetAllTccApplicationComments")]
        public async Task<ResponseItem<object>> GetAllTccApplicationComments(Guid tccId)
        {
            return await _tccApplicationService.GetAllTccApplicationComments(tccId);
        }

        [HttpGet("SearchAllTCCApplication", Name = "SearchAllTCCApplication")]
        public async Task<ResponseItem<object>> SearchAllTCCApplication(string searchTerm)
        {
            return await _tccApplicationService.SearchAllTCCApplication(searchTerm);
        }

        [HttpPut("UpdateTccApplication", Name = "UpdateTccApplication")]
        public async Task<ResponseItem<object>> UpdateTccApplication(Guid id, [FromBody] UpdateTccDto data)
        {
            return await _tccApplicationService.UpdateTccApplication(id, data);
        }

        [HttpPut("SendTCCApplicationMessage", Name = "SendTCCApplicationMessage")]
        public async Task<ResponseItem<object>> SendTCCApplicationMessage(Guid id, [FromBody] MessageOnlyDto data)
        {
            return await _tccApplicationService.SendTCCApplicationMessage(id, data);
        }

        [HttpPost("PostTaxPositionSummary", Name = "PostTaxPositionSummary")]
        //public async Task<ResponseItemForCreationDto<object>> PostTaxPositionSummary(Guid taxpayerId, Guid appId, [FromBody] ArrayObjectSummary data)
        public async Task<ResponseItemForCreationDto<object>> PostTaxPositionSummary(Guid appId, [FromBody] ArrayObjectSummary data)
        {

            return await _tccApplicationService.PostTaxPositionSummary(appId, data);
        }

        [HttpGet("GetTCCCertificateNo", Name = "GetTCCCertificateNo")]
        public async Task<ResponseItem<object>> GetTCCCertificateNo()
        {
            return await _tccApplicationService.GetTCCCertificateNo();
        }

        [HttpGet("GetTCCApplicationDocumentByApplicationId", Name = "GetTCCApplicationDocumentByApplicationId")]
        public async Task<ResponseItem<object>> GetTCCApplicationDocumentByApplicationId(Guid id)
        {
            return await _tccApplicationService.GetTCCApplicationDocumentByApplicationId(id);
        }

        [HttpPut("UpdateTccApplicationWithCertificate", Name = "UpdateTccApplicationWithCertificate")]
        public async Task<ResponseItem<object>> UpdateTccApplicationWithCertificate(Guid id, [FromBody] UpdateTccWithCertificate data)
        {
            return await _tccApplicationService.UpdateTccApplicationWithCertificate(id, data);
        }

        [HttpGet("GetAllTccApplicationByTaxOfficeId", Name = "GetAllTccApplicationByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllTccApplicationByTaxOfficeId(string queryString)
        {
            return await _tccApplicationService.GetAllTccApplicationByTaxOfficeId(queryString);
        }

        [HttpGet("GetAllTccApplicationPendingApprovalByTaxOfficeId", Name = "GetAllTccApplicationPendingApprovalByTaxOfficeId")]
        public async Task<ResponseItem<object>> GetAllTccApplicationPendingApprovalByTaxOfficeId(Guid officeId, string queryString)
        {
            return await _tccApplicationService.GetAllTccApplicationPendingApprovalByTaxOfficeId(officeId, queryString);
        }

        [HttpGet("GetAppByOfficeTypeAndStatus", Name = "GetAppByOfficeTypeAndStatus")]
        public async Task<ResponseItem<object>> GetAppByOfficeTypeAndStatus(Guid officeId, int status, string searchitem)
        {
            return await _tccApplicationService.GetAppByOfficeTypeAndStatus(officeId, status, searchitem);
        }

        [HttpGet("GetAllAssignedApplicationsToReassign", Name = "GetAllAssignedApplicationsToReassign")]
        public async Task<ResponseItem<object>> GetAllAssignedApplicationsToReassign(Guid officeId, string searchitem)
        {

            return await _tccApplicationService.GetAllAssignedApplicationsToReassign(officeId, searchitem);
        }

        [HttpPost("PostAssignApplication", Name = "PostAssignApplication")]
        public async Task<ResponseItemForCreationDto<object>> PostAssignApplication(IEnumerable<AssignApplication> objData)
        {
            string userId = "";

            foreach (var claim in User.Claims)
            {
                if (claim.Type == "sub")
                {
                    userId = claim.Value;
                }
            };

            foreach (var objdat in objData)
            {
                objdat.AssignerId = userId;
            }

            return await _tccApplicationService.PostAssignApplication(objData);
        }

        [HttpPut("ReassignApplication", Name = "ReassignApplication")]
        public async Task<ResponseItemForCreationDto<object>> ReassignApplication(IEnumerable<ReassignApplication> objData)
        {
            
            return await _tccApplicationService.ReassignApplication(objData);
        }

        [HttpGet("GetTCCApplicationTaxPositionByApplicationId", Name = "GetTCCApplicationTaxPositionByApplicationId")]
        public async Task<ResponseItem<object>> GetTCCApplicationTaxPositionByApplicationId(Guid applicationId)
        {
            return await _tccApplicationService.GetTCCApplicationTaxPositionByApplicationId(applicationId);
        }

        [HttpGet("RenewToken", Name = "RenewToken")]
        public bool RenewToken()
        {
            return true;
        }

    }
}