using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Models.Configuration
{
    public class ITAPSConfig
    {
        public static ITAPSConfig Current;

        public ITAPSConfig()
        {
            Current = this;
        }

        public string SessionName { get; set; }
        // API Server Details
        public string TaxPayerAPIUrl { get; set; }
        // App ServerUrl Details
        public string AppServerUrl { get; set; }
        // IdentityServer Login Details
        public string IDSAuthority { get; set; }
        public string ClientSecret { get; set; }
        public string ClientId { get; set; }
        public bool RequireHttpsMetadata { get; set; }
        //after the online payment is done, this is the url you will be redirected to
        public string OnlinePaymentRedirect { get; set; }
        //ExpressPay request pay url
        public string ExpressPayRequestURL { get; set; }
        public string ExpressPayMerchantNumber { get; set; }
        public string ExpressPayAPIKey { get; set; }
        public string TaxAdminAPIUrl { get; set; }
        // Notification Url
        public string NotificationUrl { get; set; }
        public string ReportServerUrl { get; set; }
    }
}
