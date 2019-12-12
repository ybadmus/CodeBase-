using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ICodeService
    {
        Task<ResponseItem<object>> GetCodesTableAsync(string code);

        Task<ResponseItemForCreationDto<object>> PostCodesTableAsync(string code, SetupForCreationDto data);

        Task<ResponseItem<object>> SearchCodesTableAsync(string type, string term);

    }
}
