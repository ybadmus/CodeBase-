using System;

namespace ITAPS_HOST.Models.Codes
{
    public class TaxRateForCreationDto
    {
        public Guid IdTaxRate { get; set; }
        public string ParamsIdTaxRate { get; set; }
        public string PropertyTaxRate { get; set; }
        public string WhtCodeTaxRate { get; set; }
        public string TaxRateDescription { get; set; }
        public string TaxRateNotes { get; set; }
        public string TaxRateStatus { get; set; }
    }

    public class TaxRateForSavingDto
    {
        public Guid Id { get; set; }
        public string ParamsId { get; set; }
        public string TaxRate { get; set; }
        public string WhtCode { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; }
    }
}
