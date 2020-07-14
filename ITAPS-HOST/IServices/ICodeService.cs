using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ICodeService
    {
        Task<ResponseItem<object>> GetCodesTableAsync(string code);

        Task<ResponseItemForCreationDto<object>> PostCodesTableAsync(string code, SetupForCreationDto data);

        Task<ResponseItem<object>> SearchCodesTableAsync(string type, string term);

        Task<ResponseItem<object>> GetReliefsByDate(string type, string year);

        Task<ResponseItem<object>> GetReliefDetails(Guid id);

        Task<ResponseItem<object>> GetAllActivePeriods();

        Task<ResponseItemForCreationDto<object>> SvRelief(ReliefCreationDto data);

        Task<ResponseItem<object>> UpRelief(ReliefCreationDto data, Guid id);
    }
}
