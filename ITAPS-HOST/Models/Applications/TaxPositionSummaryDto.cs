using System;
using System.Collections.Generic;

namespace ITAPS_HOST.Models.Applications
{
    public class TaxPositionSummary
    {
       public string Status { get; set; }
        //public string AssessmentYear { get; set; }
        //public string ChargeableIncome { get; set; }
        //public string TaxCharged { get; set; }
        // public string TaxOutstanding { get; set; }
        // public string TaxPaid { get; set; }

        public Int64 AssessmentYear { get; set; }
        public double ChargeableIncome { get; set; }
        public double TaxCharged { get; set; }
        public double TaxOutstanding { get; set; }
        public double TaxPaid { get; set; }
    }

    public class TaxPositionSummaryDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; }
        public Int64 AssessmentYear { get; set; }
        public double ChargeableIncome { get; set; }
        public double TaxCharged { get; set; }
        public double TaxOutstanding { get; set; }
        public double TaxPaid { get; set; }
    }

    public class ArrayObjectSummary
    {
        public Guid TaxpayerId { get; set; }
        public IList<TaxPositionSummary> TaxPositions { get; set; }
        public bool PaidTaxLiabilities { get; set; }
        public bool PaidWithholdingTax { get; set; }
        public bool SubmittedTaxReturns { get; set; }
        public bool RegisteredWithGRA { get; set; }
    }

}
