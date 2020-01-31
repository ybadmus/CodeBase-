using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionController : ControllerBase
    {
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost()]
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
        public async Task<ResponseItem<object>>  TaxCalculatorAsync(Double amount, string startdate, string enddate)
        {
            return await _transactionService.TaxCalculatorAsync(amount, startdate, enddate, _cancellationTokenSource.Token);
        }
    }
}