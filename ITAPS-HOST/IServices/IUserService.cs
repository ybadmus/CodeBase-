using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IUserService
    {
        Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(string userId);

        Task<ResponseItem<object>> GetAllMenusByUserId(string userId);

        Task<ResponseItem<object>> GetOffTaxOfficerId(Guid taxofficeid);

        Task<ResponseItem<object>> GetUserDetailsId(Guid userId);

        Task<ResponseItemForCreationDto<object>> ChangePassword(ChangePasswordDto data);
    }
}
