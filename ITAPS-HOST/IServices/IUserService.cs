using ITAPS_HOST.Models;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IUserService
    {
        Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(string userId);

        Task<ResponseItem<object>> GetAllMenusByUserId(string userId);
    }
}
