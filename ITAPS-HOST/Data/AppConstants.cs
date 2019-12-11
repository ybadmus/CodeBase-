namespace ITAPS_HOST.Data
{
    public class AppConstants: IAppConstants
    {
        public string AppServerUrl { get; set; }
        public string Authority { get; set; }
        public string ApiUrl { get; set; }
        public string TaxpayerMonoAPI { get; set; }
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
        public bool RequireHttpsMetadata { get; set; }
    }

    public interface IAppConstants
    {
        string AppServerUrl { get; set; }
        string Authority { get; set; }
        string ApiUrl { get; set; }
        string TaxpayerMonoAPI { get; set; }
        string ClientSecret { get; set; }
        string ClientId { get; set; }
        bool RequireHttpsMetadata { get; set; }
    }
}
