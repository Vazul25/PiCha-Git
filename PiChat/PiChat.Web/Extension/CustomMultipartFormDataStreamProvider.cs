using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace AspNetWebApi.Extensions
{
    public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public CustomMultipartFormDataStreamProvider(string rootPath) : base(rootPath)
        {
        }

        public CustomMultipartFormDataStreamProvider(string rootPath, int bufferSize) : base(rootPath, bufferSize)
        {
        }
        /// <summary>
        /// Returns with  the generated filename of the uploaded image 
        /// </summary>
        /// <param name="headers"></param>
        /// <returns></returns>
        public override string GetLocalFileName(HttpContentHeaders headers)
        {
            //Make the file name URL safe and then use it & is the only disallowed url character allowed in a windows filename
            var name = !string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName)
                        ? headers.ContentDisposition.FileName : "NoName";

            name = name.Trim('"');

            name = Path.GetFileNameWithoutExtension(name)+"_"+DateTime.UtcNow.ToString("yyyy-MM-dd-hh-mm-ss")+ "_" + Guid.NewGuid().ToString() + Path.GetExtension(name);
            // System.Diagnostics.Debug.WriteLine(name);
            return name.Replace("&", "and");

        }
    }
}