namespace ITAPS_HOST.Models.Codes
{
    public class TaxHolidayForCreationDto
    {
        public string Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public char Status { get; set; }
    }
}
