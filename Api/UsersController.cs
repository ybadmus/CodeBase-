using System;
using ITAPS_HOST.IServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ITAPS_HOST.Models;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetAllUserTaxOfficesByUserID", Name = "GetAllUserTaxOfficesByUserID")]
        public async Task<ResponseItem<object>> GetAllUserTaxOfficesByUserID(Guid userId)
        {
            return await _userService.GetAllUserTaxOfficesByUserID(userId);
        }
    }
}