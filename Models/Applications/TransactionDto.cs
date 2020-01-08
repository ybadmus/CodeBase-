using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Models.Applications
{
    public class TransactionResultDto
    {
        public Guid Id { get; set; }
        public string Tin { get; set; }
        public string EntityName { get; set; }
        public string SubmissionDate { get; set; }
    }

    public class SearchForTransactionDto
    {
        public string AssessmentYear { get; set; }
        public string TransactionType { get; set; }
        public string TaxType { get; set; }
        public string TaxOfficeId { get; set; }
        public string Tin { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }

    public class SearchForTransactionDetailDto
    {
        public Guid TransactionId { get; set; }
        public string TaxType { get; set; }
        public string TransactionType { get; set; }
    }

}
