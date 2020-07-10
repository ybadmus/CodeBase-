using System;

namespace ITAPS_HOST.Models.Codes
{
    public class SetupDto
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
        public char cStatus { get; set; }
        public string createDate { get; set; }
        public string lastModifiedDate { get; set; }
    }

    public class SetupForCreationDto
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
        public char cStatus { get; set; }
    }

    public class ReliefCreationDto
    {
        public Guid ReliefId { get; set; }
        public string ReliefType { get; set; }
        public string Status { get; set; }
        public string RateMultiplier { get; set; }
        public string Notes { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public double ReliefValue { get; set; }
    }

    public class WhtPeriodsDto
    {
        public System.Guid Id { get; set; }
        public string Period { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string CloseDate { get; set; }
        public string PaymentDate { get; set; }
    }
}
