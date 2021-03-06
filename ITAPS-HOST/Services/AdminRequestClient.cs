﻿using ITAPS_HOST.IServices;
using ITAPS_HOST.Models;
using Marvin.StreamExtensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace ITAPS_HOST.Services
{
    public class AdminRequestClient: IAdminRequestClient
    {
        private readonly CancellationTokenSource _cancellationTokenSource = new CancellationTokenSource();
        private readonly ITAPSAdmin _adminClient;

        public AdminRequestClient(ITAPSAdmin adminClient)
        {
            _adminClient = adminClient;
        }

        public async Task<ResponseItem<object>> GetRequestAsync(string endpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));

            using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
            {
                IEnumerable<object> apiResponse = Enumerable.Empty<object>();

                if (!response.IsSuccessStatusCode)
                {
                    return new ResponseItem<object>
                    {
                        Status = "Failure",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }

                var stream = await response.Content.ReadAsStreamAsync();
                apiResponse = stream.ReadAndDeserializeFromJson<IEnumerable<object>>();

                return new ResponseItem<object>
                {
                    Status = "Successful",
                    Caption = response.ReasonPhrase,
                    Body = apiResponse
                };
            }

        }

        public async Task<ResponseItemForSingleObject<object>> GetRequestAsyncSingleObject(string endpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));

            using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
            {
                object apiResponse = Enumerable.Empty<object>();

                if (!response.IsSuccessStatusCode)
                {
                    return new ResponseItemForSingleObject<object>
                    {
                        Status = "Failure",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }

                var stream = await response.Content.ReadAsStreamAsync();
                apiResponse = stream.ReadAndDeserializeFromJson<object>();

                return new ResponseItemForSingleObject<object>
                {
                    Status = "Successful",
                    Caption = response.ReasonPhrase,
                    Body = apiResponse
                };
            }
        }

        public async Task<ResponseItemForCreationDto<object>> PostRequestAsync(object objectForCreation, string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var serializedtaxOfficeForCreation = JsonConvert.SerializeObject(objectForCreation);

            using (var request = new HttpRequestMessage(HttpMethod.Post, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(serializedtaxOfficeForCreation);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    Object apiResponse = Enumerable.Empty<object>();

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItemForCreationDto<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<object>();

                    return new ResponseItemForCreationDto<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }

        public async Task<ResponseItemForCreationDto<object>> PutRequestArrayAsync(IEnumerable<object> objectForCreation, string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var serializedtaxOfficeForCreation = JsonConvert.SerializeObject(objectForCreation);

            using (var request = new HttpRequestMessage(HttpMethod.Put, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(serializedtaxOfficeForCreation);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    Object apiResponse = Enumerable.Empty<object>();

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItemForCreationDto<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<object>();

                    return new ResponseItemForCreationDto<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }

        public async Task<ResponseItemForCreationDto<object>> PostRequestArrayAsync(IEnumerable<object> objectForCreation, string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var serializedtaxOfficeForCreation = JsonConvert.SerializeObject(objectForCreation);

            using (var request = new HttpRequestMessage(HttpMethod.Post, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(serializedtaxOfficeForCreation);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    Object apiResponse = Enumerable.Empty<object>();

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItemForCreationDto<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<object>();

                    return new ResponseItemForCreationDto<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }

        public async Task<ResponseItem<object>> DeleteRequestAsync(string endpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var request = new HttpRequestMessage(HttpMethod.Delete, endpoint);
            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));

            using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
            {
                IEnumerable<object> apiResponse = Enumerable.Empty<object>();

                if (!response.IsSuccessStatusCode)
                {
                    return new ResponseItem<object>
                    {
                        Status = "Failure",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }

                var stream = await response.Content.ReadAsStreamAsync();
                apiResponse = stream.ReadAndDeserializeFromJson<IEnumerable<object>>();

                return new ResponseItem<object>
                {
                    Status = "Successful",
                    Caption = response.ReasonPhrase,
                    Body = apiResponse
                };
            }
        }
        
        public async Task<ResponseItem<object>> PutRequestAsync(object objectForCreation, string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var serializedtaxOfficeForCreation = JsonConvert.SerializeObject(objectForCreation);

            using (var request = new HttpRequestMessage(HttpMethod.Put, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(serializedtaxOfficeForCreation);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    IEnumerable<Object> apiResponse = Enumerable.Empty<object>();

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItem<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<IEnumerable<object>>();

                    return new ResponseItem<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }

        public async Task<ResponseItemBooleanResponse<object>> PutRequestBooleanResponseAsync(object objectForCreation, string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();
            var serializedtaxOfficeForCreation = JsonConvert.SerializeObject(objectForCreation);

            using (var request = new HttpRequestMessage(HttpMethod.Put, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content = new StringContent(serializedtaxOfficeForCreation);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    Boolean apiResponse = false;

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItemBooleanResponse<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<bool>();

                    return new ResponseItemBooleanResponse<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }

        public async Task<ResponseItem<object>> PutNoificationAsync(string apiEndpoint)
        {
            var client = await _adminClient.GetClientAsync();

            using (var request = new HttpRequestMessage(HttpMethod.Put, apiEndpoint))
            {
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, _cancellationTokenSource.Token))
                {
                    IEnumerable<Object> apiResponse = Enumerable.Empty<object>();

                    if (!response.IsSuccessStatusCode)
                        return new ResponseItem<object>
                        {
                            Status = "Failure",
                            Caption = response.ReasonPhrase,
                            Body = apiResponse
                        };

                    var responseData = await response.Content.ReadAsStreamAsync();
                    apiResponse = responseData.ReadAndDeserializeFromJson<IEnumerable<object>>();

                    return new ResponseItem<object>
                    {
                        Status = "Successful",
                        Caption = response.ReasonPhrase,
                        Body = apiResponse
                    };
                }
            }
        }
    }
}
