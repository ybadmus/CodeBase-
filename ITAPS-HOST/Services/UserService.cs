﻿using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using System;
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

        public async Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(string userId)
        {
            var apiEndpoint = $"Users/GetAllUserTaxOfficesByUserID/" + userId;
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllMenusByUserId(string userId)
        {
            var apiEndpoint = $"Users/GetAllMenusByUserId/" + userId;
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetOffTaxOfficerId(Guid taxofficeId)
        {
            var apiEndpoint = $"Users/GetManagersAndOfficersByTaxOfficeId/" + taxofficeId + "/OFFSUP";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetUserDetailsId(Guid userId)
        {
            var apiEndpoint = $"Users/GetUserDetailsById/" + userId;
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> ChangePassword(ChangePasswordDto data)
        {
            var apiEndpoint = $"Users/PostChangePassword";
            return await _adminRequestClient.PostRequestAsync(data, apiEndpoint);
        }
    }
}


