
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("GetAllUnreadNotifications", Name = "GetAllUnreadNotifications")]
        public async Task<ResponseItem<object>> GetAllUnreadNotifications(string taxOfficeId)
        {
            return await _notificationService.GetNotificationsByTaxOffice(taxOfficeId);
        }

        [HttpGet("GetAllNotifications", Name = "GetAllNotifications")]
        public async Task<ResponseItem<object>> GetAllNotifications(string taxOfficeId)
        {
            return await _notificationService.GetAllNotificationsByTaxOffice(taxOfficeId);
        }

        [HttpPut("UpdateNotificationStatus", Name = "UpdateNotificationStatus")]
        public async Task<ResponseItem<object>> UpdateNotificationStatus(string taxOfficeId)
        {
            return await _notificationService.UpdateNotificationStatus(taxOfficeId);
        }
    }
}