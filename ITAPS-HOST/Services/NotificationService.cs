using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class NotificationService: INotificationService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        public NotificationService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetNotificationsByTaxOffice(string taxOfficeId)
        {
            string apiEndpoint = $"Notifications/GetNotificationsByTaxOffice/{taxOfficeId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllNotificationsByTaxOffice(string taxOfficeId)
        {
            string apiEndpoint = $"Notifications/GetAllNotificationsByTaxOffice/{taxOfficeId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> UpdateNotificationStatus(string taxOfficeId)
        {
            string apiEndpoint = $"Notifications/UpdateNotificationStatus/{taxOfficeId}";
            return await _adminRequestClient.PutNoificationAsync(apiEndpoint);
        }
    }
}
