using ITAPS_HOST.Models;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IMonoService
    {
        Task<ResponseItem<object>> GetAllActivePeriods();
    }
}
