using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAllUserTaxOfficesByUserID", Name = "GetAllUserTaxOfficesByUserID")]
        public async Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID()
        {
            string userId = "";

            foreach (var claim in User.Claims)
            {
                if (claim.Type == "sub")
                {
                    userId = claim.Value;
                }
            }

            return await _userService.GetAllUserTaxOfficesByUserID(userId);
        }

        [HttpGet("GetAllMenusByUserId", Name = "GetAllMenusByUserId")]
        public async Task<ResponseItem<object>> GetAllMenusByUserId()
        {
            string userId = "";

            foreach (var claim in User.Claims)
            {
                if (claim.Type == "sub")
                {
                    userId = claim.Value;
                }
            }

            return await _userService.GetAllMenusByUserId(userId);
        }

        [HttpGet("GetOffTaxOfficerId", Name = "GetOffTaxOfficerId")]
        public async Task<ResponseItem<object>> GetOffTaxOfficerId(Guid taxofficeId)
        {
            return await _userService.GetOffTaxOfficerId(taxofficeId);
        }

    }
}