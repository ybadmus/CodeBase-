using System;

namespace ITAPS_HOST.Models.Codes
{
    public class TaxOfficeForCreationDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public Guid TaxOfficeTypeId { get; set; }
        public Guid RegionId { get; set; }
        public Char Status { get; set; }
    }
}
