using System.Threading.Tasks;
using ITAPS_HOST.Models;

namespace ITAPS_HOST.IServices
{
    public interface IMainRequestClient
    {
        Task<ResponseItem<object>> GetRequestAsync(string endpoint);
        Task<ResponseItemForSingleObject<object>> GetRequestAsyncSingleObject(string endpoint);
        Task<ResponseItemForCreationDto<object>> PostRequestAsync(object objectForCreation, string apiEndpoint);
        Task<ResponseItem<object>> DeleteRequestAsync(string endpoint);
        Task<ResponseItem<object>> PutRequestAsync(object objectForCreation, string apiEndpoint);
    }
}
