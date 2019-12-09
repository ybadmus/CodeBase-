namespace ITAPS_HOST.Models
{
    public class SSRSConfiguration : ISSRSConfiguration
    {
        public string Domain { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DatasourceName { get; set; }
        public string DatasourceUser { get; set; }
        public string DatasourcePassword { get; set; }
        public string ReportPath { get; set; }
        public string ReportServer { get; set; }
    }

    public interface ISSRSConfiguration
    {
        string Domain { get; set; }
        string Username { get; set; }
        string Password { get; set; }
        string DatasourceName { get; set; }
        string DatasourceUser { get; set; }
        string DatasourcePassword { get; set; }
        string ReportPath { get; set; }
        string ReportServer { get; set; }

    }

}
