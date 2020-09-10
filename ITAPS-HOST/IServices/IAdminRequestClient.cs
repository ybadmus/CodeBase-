using ITAPS_HOST.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface IAdminRequestClient
    {
        Task<ResponseItem<object>> GetRequestAsync(string endpoint);
        Task<ResponseItemForSingleObject<object>> GetRequestAsyncSingleObject(string endpoint);
        Task<ResponseItemForCreationDto<object>> PostRequestAsync(object objectForCreation, string apiEndpoint);
        Task<ResponseItem<object>> DeleteRequestAsync(string endpoint);
        Task<ResponseItem<object>> PutRequestAsync(object objectForCreation, string apiEndpoint);
        Task<ResponseItemForCreationDto<object>> PutRequestArrayAsync(IEnumerable<object> objectForCreation, string apiEndpoint);
        Task<ResponseItemBooleanResponse<object>> PutRequestBooleanResponseAsync(object objectForCreation, string apiEndpoint);
        Task<ResponseItem<object>> PutNoificationAsync(string apiEndpoint);
        Task<ResponseItemForCreationDto<object>> PostRequestArrayAsync(IEnumerable<object> objectForCreation, string apiEndpoint);
    }
}
