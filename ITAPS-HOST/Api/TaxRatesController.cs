﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using ITAPS_HOST.Models.Codes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITAPS_HOST.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaxRatesController : Controller
    {
        private readonly ITaxRateService _taxRateServices;
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();

        public TaxRatesController(ITaxRateService taxRateServices)
        {
            _taxRateServices = taxRateServices;
        }

        [HttpGet("SearchTaxRateAsync", Name = "SearchTaxRateAsync")]
        public async Task<ResponseItem<object>> SearchTaxRateAsync(string searchItem)
        {
            return await _taxRateServices.SearchTaxRateAsync(searchItem);
        }

        [HttpGet("GetAllGcir", Name = "GetAllGcir")]
        public async Task<ResponseItem<object>> GetAllGcir()
        {
            return await _taxRateServices.GetAllGcirAsync();
        }

        [HttpGet("GetAllGtaxAsync", Name = "GetAllGtaxAsync")]
        public async Task<ResponseItem<object>> GetAllGtaxAsync()
        {
            return await _taxRateServices.GetAllGtaxAsync();
        }

        [HttpGet("GetAllGtaxByYearAsync", Name = "GetAllGtaxByYearAsync")]
        public async Task<ResponseItem<object>> GetAllGtaxByYearAsync(string year)
        {
            return await _taxRateServices.GetAllGtaxByYearAsync(year);
        }

        [HttpGet("GetGcirById", Name = "GetGcirById")]
        public async Task<ResponseItem<object>> GetGcirById(Guid lngId)
        {
            return await _taxRateServices.GetGcirByIdAsync(lngId);
        }

        [HttpGet("GetAllGtaxByIdAsync", Name = "GetAllGtaxByIdAsync")]
        public async Task<ResponseItem<object>> GetAllGtaxByIdAsync(Guid lngId)
        {
            return await _taxRateServices.GetAllGtaxByIdAsync(lngId);
        }

        [HttpPost("PostGcir", Name = "PostGcir")]
        public async Task<ResponseItemForCreationDto<object>> PostGcir([FromBody]CompanyTaxRateDto data)
        {
            return await _taxRateServices.PostGcir(data);
        }

        [HttpPost("PostGtax", Name = "PostGtax")]
        public async Task<ResponseItemForCreationDto<object>> PostGtax([FromBody]PitTaxRateDto data)
        {
            return await _taxRateServices.PostGtax(data);
        }

    }
}