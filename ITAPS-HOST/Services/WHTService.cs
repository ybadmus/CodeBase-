using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class WHTService: IWTHService
    {
        private readonly IAdminRequestClient _adminRequestClient;
        public WHTService(IAdminRequestClient adminRequestClient)
        {
            _adminRequestClient = adminRequestClient;
        }
        public async Task<ResponseItem<object>> SearchWithholdingByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter, string whttype)
        {
            string apiEndpoint = string.Empty;

            if (whttype == "whttax")
            {

                if (tin == null && szFilter == null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHTaxByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate;
                if (tin == null && szFilter != null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHTaxByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter;
                if (tin != null && szFilter == null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHTaxByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?tin=" + tin;
                if (tin != null && szFilter != null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHTaxByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?tin=" + tin + "&szFilter=" + szFilter;
            }

            if (whttype == "whtvat")
            {
                if (tin == null && szFilter == null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHVatByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate;
                if (tin == null && szFilter != null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHVatByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter;
                if (tin != null && szFilter == null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHVatByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?tin=" + tin;
                if (tin != null && szFilter != null)
                    apiEndpoint = $"WithholdingTax/SearchAllWHVatByTaxOffice/" + taxOfficeId + "/" + periodId + "/" + startDate + "/" + endDate + "?tin=" + tin + "&szFilter=" + szFilter;
            }

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchMonthlyWithholdingReturnsByOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {
            string apiEndpoint = string.Empty;

            //All Nulls
            if (tin == null && szFilter == null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate;

            //One Null <3
            if (tin != null && szFilter == null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?tin=" + tin;

            if (tin == null && szFilter != null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter;

            if (tin == null && szFilter == null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?periodId=" + periodId;

            //Two Nulls <3
            if (tin != null && szFilter != null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter + "&tin=" + tin;

            if (tin == null && szFilter != null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter + "&periodId=" + periodId;

            if (tin != null && szFilter == null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?tin=" + tin + "&periodId=" + periodId;

            //Not Nulls <3
            if (tin != null && szFilter != null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHTaxReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + tin + "&periodId=" + periodId + "&tin=" + tin;

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> SearchAllWHVatReturnsByTaxOffice(string taxOfficeId, string periodId, string startDate, string endDate, string tin, string szFilter)
        {
            string apiEndpoint = string.Empty;

            //All Nulls
            if (tin == null && szFilter == null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate;

            //One Null <3
            if (tin != null && szFilter == null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?tin=" + tin;

            if (tin == null && szFilter != null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter;

            if (tin == null && szFilter == null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?periodId=" + periodId;

            //Two Nulls <3
            if (tin != null && szFilter != null && periodId == null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter + "&tin=" + tin;

            if (tin == null && szFilter != null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + szFilter + "&periodId=" + periodId;

            if (tin != null && szFilter == null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?tin=" + tin + "&periodId=" + periodId;

            //Not Nulls <3
            if (tin != null && szFilter != null && periodId != null)
                apiEndpoint = $"WithholdingTax/SearchAllWHVatReturnsByTaxOffice/" + taxOfficeId + "/" + startDate + "/" + endDate + "?szFilter=" + tin + "&periodId=" + periodId + "&tin=" + tin;

            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllGwtrAsync()
        {
            string apiEndpoint = "WithholdingTax/GetAllGwtrAsync";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetAllTaxRatesAsync()
        {
            string apiEndpoint = "WithholdingTax/GetAllTaxRatesAsync";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGWTTByGwrtAsync(Guid periodId, string tin)
        {
            string apiEndpoint = $"WithholdingTax/GetGWTTByGwrtAsync/{periodId}/{tin}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGWVTByGwvrAsync(Guid periodId, string tin)
        {
            string apiEndpoint = $"WithholdingTax/GetGWVTByGwvrAsync/{periodId}/{tin}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostGWTR(GwtrForCreationDto data)
        {
            string apiEndpoint = $"WithholdingTax/PostGWTR";


            var gwtrForCreationDto = new GwtrForSavingDto
            {
                Id = data.GwtrId,
                ResStatusId = Guid.Parse(data.ResStatusId),
                WithholdTaxStatus = Guid.Parse(data.WithholdTaxStatus),
                Status = data.WhtStatus,
                Description = data.DescriptionsWht
            };

            var serializedGwtrForCreationDto = JsonConvert.SerializeObject(gwtrForCreationDto);
            return await _adminRequestClient.PostRequestAsync(serializedGwtrForCreationDto, apiEndpoint);
        }

        public async Task<ResponseItemForCreationDto<object>> PostWTR1(TaxRateForCreationDto data)
        {
            string apiEndpoint = $"WithholdingTax/PostWTR1";

            var gwtrForCreationDto = new TaxRateForSavingDto
            {
                Id = data.IdTaxRate,
                ParamsId = data.ParamsIdTaxRate,
                TaxRate = data.PropertyTaxRate,
                WhtCode = data.WhtCodeTaxRate,
                Description = data.TaxRateDescription,
                Notes = data.TaxRateNotes,
                Status = data.TaxRateStatus

            };

            var serializedGwtrForCreationDto = JsonConvert.SerializeObject(gwtrForCreationDto);
            return await _adminRequestClient.PostRequestAsync(serializedGwtrForCreationDto, apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGWTTByInvoiceNumberAsync(string invoiceNumber)
        {
            string apiEndpoint = $"WithholdingTax/GetGWTTByInvoiceNumber/{invoiceNumber}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }

        public async Task<ResponseItem<object>> GetGWVTByInvoiceNumberAsync(string invoiceNumber)
        {
            string apiEndpoint = $"WithholdingTax/GetGWVTByInvoiceNumber/{invoiceNumber}";
            return await _adminRequestClient.GetRequestAsync(apiEndpoint);
        }
    }
}
