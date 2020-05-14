using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost("SearchTransactionAsync", Name = "SearchTransactionAsync")]
        public async Task<ResponseItem<object>> SearchTransactionAsync([FromBody] SearchForTransactionDto searchObject)
        {
            return await _transactionService.SearchTransactionAsync(searchObject, _cancellationTokenSource.Token);
        }

        [HttpPost("TransactionDetails/")]
        public async Task<ResponseItem<object>> GetTransactionDetailsAsync([FromBody] SearchForTransactionDetailDto searchObject)
        {

            return await _transactionService.GetTransactionDetailsAsync(searchObject, _cancellationTokenSource.Token);
        }

        [HttpGet("TaxCalculatorAsync", Name = "TaxCalculatorAsync")]
        public async Task<ResponseItem<object>> TaxCalculatorAsync(Double amount, string startdate, string enddate)
        {
            return await _transactionService.TaxCalculatorAsync(amount, startdate, enddate, _cancellationTokenSource.Token);
        }

        [HttpGet("CITDetailsById", Name = "CITDetailsById")]
        public async Task<ResponseItem<object>> CITDetailsById(Guid trId)
        {
            return await _transactionService.GetCITDetailsById(trId);
        }

        [HttpGet("CITEstimatesDetailsById", Name = "CITEstimatesDetailsById")]
        public async Task<ResponseItem<object>> CITEstimatesDetailsById(Guid trId)
        {
            return await _transactionService.GETCITEstimatesDetailsById(trId);
        }

        [HttpGet("CITRevEstimatesDetailsById", Name = "CITRevEstimatesDetailsById")]
        public async Task<ResponseItem<object>> CITRevEstimatesDetailsById(Guid trId)
        {
            return await _transactionService.GETCITRevisedEstimatesDetailsById(trId);
        }
    }
}