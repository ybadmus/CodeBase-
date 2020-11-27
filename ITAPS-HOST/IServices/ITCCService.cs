using ITAPS_HOST.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ITAPS_HOST.Models.Applications;

namespace ITAPS_HOST.IServices
{
    public interface ITCCService
    {
        Task<ResponseItem<object>> GetAllTCCApplication();
        Task<ResponseItem<object>> GetTccApplicationById(Guid tccId, Guid appTypeId);
        Task<ResponseItem<object>> GetAllTccApplicationComments(Guid tccId);
        Task<ResponseItem<object>> UpdateTccApplication(Guid id, UpdateTccDto objectToSend);
        Task<ResponseItem<object>> SearchAllTCCApplication(string searchTerm);
        Task<ResponseItemForCreationDto<object>> PostTaxPositionSummary(Guid appId, ArrayObjectSummary data);
        Task<ResponseItem<object>> GetTCCCertificateNo();
        Task<ResponseItem<object>> GetTCCApplicationDocumentByApplicationId(Guid id);
        Task<ResponseItem<object>> GetAllTccApplicationByTaxOfficeId(string queryString);
        Task<ResponseItem<object>> GetTCCApplicationTaxPositionByApplicationId(Guid applicationId);
        Task<ResponseItem<object>> GetAllTccApplicationPendingApprovalByTaxOfficeId(Guid id, string queryString);
        Task<ResponseItem<object>> GetAppByOfficeTypeAndStatus(Guid id, int status, string searchitem);
        Task<ResponseItem<object>> GetAllAssignedApplicationsToReassign(Guid id, string searchitem);
        Task<ResponseItem<object>> UpdateTccApplicationWithCertificate(Guid id, UpdateTccWithCertificate data);
        Task<ResponseItemForCreationDto<object>> PostAssignApplication(IEnumerable<AssignApplication> objData);
        Task<ResponseItemForCreationDto<object>> ReassignApplication(IEnumerable<ReassignApplication> objData);
    }
}
