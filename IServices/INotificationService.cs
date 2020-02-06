using ITAPS_HOST.Models;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface INotificationService
    {
        Task<ResponseItem<object>> GetNotificationsByTaxOffice(string taxOfficeId);

        Task<ResponseItem<object>> GetAllNotificationsByTaxOffice(string taxOfficeId);

        Task<ResponseItem<object>> UpdateNotificationStatus(string taxOfficeId);
    }
}
