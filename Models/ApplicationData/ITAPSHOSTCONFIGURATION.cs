
namespace ITAPS_HOST.Models
{
    public class ITAPSHOSTCONFIGURATION : IHOSTConfiguration
    {

        public static ITAPSHOSTCONFIGURATION Current { get; set; }

        public ITAPSHOSTCONFIGURATION ()
        {
            Current = this;
        }

        public string AppServerUrl { get; set; }

        public string TaxPayerAPIUrl { get; set; }
    }

    public interface IHOSTConfiguration
    {
        string AppServerUrl { get; set; }
        string TaxPayerAPIUrl { get; set; }
    }

  
}
