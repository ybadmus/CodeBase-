using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class UserService: IUserService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        public UserService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(Guid userId)
        {
            var apiEndpoint = $"Users/GetAllUserTaxOfficesByUserID/" + userId;
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
