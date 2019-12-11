using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ICodeService
    {
        Task<ResponseItem<object>> GetCodesTableAsync(string code, CancellationToken cancellationToken);

        Task<ResponseItemForCreationDto<object>> PostCodesTableAsync(string code, SetupForCreationDto data, CancellationToken cancellationToken);

        Task<ResponseItem<object>> SearchCodesTableAsync(string type, string term, CancellationToken cancellationToken);

        //Task<ResponseItem<object>> GetAllActivePeriods(CancellationToken cancellationToken);

    }
}
