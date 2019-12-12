using System;

namespace ITAPS_HOST.Models.Codes
{
    public class CurrencyForCreationDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string HomeCurrency { get; set; }
        public string Symbol { get; set; }
        public string Notes { get; set; }
        public char Status { get; set; }
    }
}
