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

    public class CompanyTaxRateDto
    {
        public Guid IdTR { get; set; }
        public string CodeTR { get; set; }
        public string SectorTR { get; set; }
        public string BusinessLocTR { get; set; }
        public double TaxRateTR { get; set; }
        public string DescriptionTR { get; set; }
        public bool GivenTaxHolidayTR { get; set; }
        public double TaxHolidayRateTR { get; set; }
        public int HolidayYearsTR { get; set; }
        public string NotesTR { get; set; }
        public string StatusTR { get; set; }
    }
}
