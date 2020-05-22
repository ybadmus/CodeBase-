namespace ITAPS_HOST.Data
{
    public class ReportConstants : IReportConstants
    {
        public string Domain { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DatasourceName { get; set; }
        public string DatasourceUser { get; set; }
        public string DatasourcePassword { get; set; }
        public string TCCReport { get; set; }
        public string ReportServer { get; set; }
        public string BoldBiKey { get; set; }
        public string PITAnnualReport { get; set; }
        public string PITReturnsReport { get; set; }
        public string PITTaxWithstandingReport { get; set; }
        public string PITWithTaxOverpaymentReport { get; set; }
        public string PITWithZeroTaxOutstandingReport { get; set; }
        public string CITReturnFinalReport { get; set; }
        public string CITReturnsReport { get; set; }
        public string CITTaxOutstandingReport { get; set; }
        public string CITTaxOverPaymentOutstandingReport { get; set; }
        public string CITZeroTaxOutstandingReport { get; set; }
        public string BoldReportingSite { get; set; }
        public string BoldReportingService { get; set; }
        public string BoldReportServerUser { get; set; }
        public string BoldReportServerPassword { get; set; }
    }

    public interface IReportConstants
    {
        string Domain { get; set; }
        string Username { get; set; }
        string Password { get; set; }
        string DatasourceName { get; set; }
        string DatasourceUser { get; set; }
        string DatasourcePassword { get; set; }
        string TCCReport { get; set; }
        string ReportServer { get; set; }
        string BoldBiKey { get; set; }
        string PITAnnualReport { get; set; }
        string PITReturnsReport { get; set; }
        string PITTaxWithstandingReport { get; set; }
        string PITWithTaxOverpaymentReport { get; set; }
        string PITWithZeroTaxOutstandingReport { get; set; }
        string CITReturnFinalReport { get; set; }
        string CITReturnsReport { get; set; }
        string CITTaxOutstandingReport { get; set; }
        string CITTaxOverPaymentOutstandingReport { get; set; }
        string CITZeroTaxOutstandingReport { get; set; }
        string BoldReportingSite { get; set; }
        string BoldReportingService { get; set; }
        string BoldReportServerUser { get; set; }
        string BoldReportServerPassword { get; set; }
    }

}
