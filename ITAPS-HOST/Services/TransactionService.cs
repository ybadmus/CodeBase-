using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Applications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly IAdminRequestClient _adminRequestClient;

        public TransactionService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }

        public async Task<ResponseItem<object>> SearchTransactionAsync(SearchForTransactionDto searchObject, CancellationToken cancellationToken)
        {
            var objectForSearch = new SearchForTransactionDto
            {
                TaxType = searchObject.TaxType,
                Tin = searchObject.Tin,
                TransactionType = searchObject.TransactionType,
                TaxOfficeId = searchObject.TaxOfficeId,
                StartDate = searchObject.StartDate,
                EndDate = searchObject.EndDate,
                AssessmentYear = searchObject.AssessmentYear
            };

            var apiEndpoint = "";
            if (objectForSearch.Tin == "" || objectForSearch.Tin == null)
            {
                apiEndpoint = $"Transactions/SearchTransactionsByTypeAsync?" +
                $"taxtype={objectForSearch.TaxType}&transactiontype={objectForSearch.TransactionType}&taxofficeid={objectForSearch.TaxOfficeId}" +
                $"&startdate={objectForSearch.StartDate}&enddate={objectForSearch.EndDate}&year={objectForSearch.AssessmentYear}";
            }
            else
            {
                apiEndpoint = $"Transactions/SearchTransactionsByTypeAsync?tin={objectForSearch.Tin}" +
                $"&taxtype={objectForSearch.TaxType}&transactiontype={objectForSearch.TransactionType}&taxofficeid={objectForSearch.TaxOfficeId}" +
                $"&startdate={objectForSearch.StartDate}&enddate={objectForSearch.EndDate}&year={objectForSearch.AssessmentYear}";
            }

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetTransactionDetailsAsync(SearchForTransactionDetailDto searchObject, CancellationToken cancellationToken)
        {
            var objectForSearch = new SearchForTransactionDetailDto
            {
                TransactionType = searchObject.TransactionType,
                TaxType = searchObject.TaxType,
                TransactionId = searchObject.TransactionId
            };

            var apiEndpoint = $"Transactions/GetPTransactionDetailsByIdAndTypeAsync/{objectForSearch.TransactionId}" +
                $"?taxType={objectForSearch.TaxType}&transactionType={objectForSearch.TransactionType}";

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> TaxCalculatorAsync(Double amount, string startdate, string enddate, string tin, String taxCodeId)
        {

            if (taxCodeId == String.Empty || taxCodeId == null)
            {

                var apiEndpoint = $"Transactions/GetTaxChargedByTin/{tin}/{amount}/{startdate}/{enddate}";

                return await _adminRequestClient.GetRequestAsync(apiEndpoint);

            }
            else
            {

                var apiEndpoint = $"Transactions/GetTaxChargedByTin/{tin}/{amount}/{startdate}/{enddate}?uniTaxCodeId={taxCodeId}";

                return await _adminRequestClient.GetRequestAsync(apiEndpoint);

            }

        }

        public async Task<ResponseItem<object>> GetCITDetailsById(Guid transactionId)
        {

            var apiEndpoint = $"CompanyIncomeTax/GetCompanyIncomeTaxDetailsById/{transactionId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GETCITEstimatesDetailsById(Guid transactionId)
        {

            var apiEndpoint = $"CompanyIncomeTax/GetEstimateCompanyIncomeTaxDetailsById/{transactionId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GETCITRevisedEstimatesDetailsById(Guid transactionId)
        {
            var apiEndpoint = $"CompanyIncomeTax/GetRevisedEstimateCompanyIncomeTaxDetailsById/{transactionId}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
