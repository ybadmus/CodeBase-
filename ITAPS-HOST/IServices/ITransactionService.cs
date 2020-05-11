using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.IServices
{
    public interface ITransactionService
    {
        Task<ResponseItem<object>> SearchTransactionAsync(SearchForTransactionDto searchObject, CancellationToken cancellationToken);
        Task<ResponseItem<object>> GetTransactionDetailsAsync(SearchForTransactionDetailDto searchObject, CancellationToken cancellationToken);
        Task<ResponseItem<object>> TaxCalculatorAsync(Double amount, string startdate, string enddate, CancellationToken cancellationToken);
        Task<ResponseItem<object>> GetCITDetailsById(Guid transactionId);
    }
}
