using System;

namespace ITAPS_HOST.Models.Codes
{
    public class GwtrForCreationDto
    {
        public Guid GwtrId { get; set; }
        public string ResStatusId { get; set; }
        public string WithholdTaxStatus { get; set; }
        public string WhtStatus { get; set; }
        public string DescriptionsWht { get; set; }
    }

    public class GwtrForSavingDto
    {
        public Guid Id { get; set; }
        public Guid ResStatusId { get; set; }
        public Guid WithholdTaxStatus { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
    }
}
