using ITAPS_HOST.Models;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IUserService
    {
        Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(Guid userId);
    }
}
