namespace ITAPS_HOST.Data
{
    public class ReportConstants : IReportConstants
    {
        public string Domain { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DatasourceName { get; set; }
        public string DatasourceUser { get; set; }
        public string DatasourcePassword { get; set; }
        public string ReportPath { get; set; }
        public string ReportServer { get; set; }
        public string BoldBiKey { get; set; }
    }

    public interface IReportConstants
    {
        string Domain { get; set; }
        string Username { get; set; }
        string Password { get; set; }
        string DatasourceName { get; set; }
        string DatasourceUser { get; set; }
        string DatasourcePassword { get; set; }
        string ReportPath { get; set; }
        string ReportServer { get; set; }
        string BoldBiKey { get; set; }
    }

}
