using System;

namespace ITAPS_HOST.Models
{
    public class IDPSETTINGS : ISETTINGS
    {
        public string Authority { get; set; }
        public string ApiUrl { get; set; }
        public string TaxpayerMonoAPI { get; set; }
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
        public bool RequireHttpsMetadata { get; set; }
    }

    public interface ISETTINGS
    {
        string Authority { get; set; }
        string ApiUrl { get; set; }
        string ClientSecret { get; set; }
        string ClientId { get; set; }
        bool RequireHttpsMetadata { get; set; }
    }

    public class AppTypeId : IAppTypeId
    {
        public Guid TaxExemptionId { get; set; }
    }

    public interface IAppTypeId
    {
        Guid TaxExemptionId { get; set; }
    }
}
