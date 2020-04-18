using System;

namespace ITAPS_HOST.Models.Applications
{
    public class UpdateTccDto
    {
        public int Status { get; set; }
        public string TaxpayerComment { get; set; }
        public string InternalComment { get; set; }
        public DateTime ExpiryDate { get; set; }
    }

    public class UpdateTccWithCertificateDto
    {
        public string TaxpayerComment { get; set; }
        public string InternalComment { get; set; }
        public string tccCerticate { get; set; }
    }

    public class UpdateTccWithCertificate
    {
        public string TaxpayerComment { get; set; }
        public string InternalComment { get; set; }
        public string tccCerticate { get; set; }
        public int Status { get; set; }
        public Guid ApplicationId { get; set; }
    }

    public class AssignApplication
    {
        public Guid ApplicationId { get; set; }
        public string Notes { get; set; }
        public string AssignerId { get; set; }
        public Guid PersonnelId { get; set; }
    }
}
