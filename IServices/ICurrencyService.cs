using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ICurrencyService
    {
        Task<ResponseItem<object>> GetCurrencyByIdAsync(Guid id);

        Task<ResponseItemForCreationDto<object>> PostCurrencyAsync(CurrencyForCreationDto data);

        Task<ResponseItem<object>> SearchCurrencyAsync(string term);
    }
}
