using System;

namespace ITAPS_HOST.Data
{
    public class AppTypeId : IAppTypeId
    {
        public Guid TaxExemptionId { get; set; }
    }

    public interface IAppTypeId
    {
        Guid TaxExemptionId { get; set; }
    }
}
