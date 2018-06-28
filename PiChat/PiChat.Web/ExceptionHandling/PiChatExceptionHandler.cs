using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using PiChat.Bll.Exceptions;

namespace PiChat.Web.ExceptionHandling
{
    public class PiChatExceptionHandler : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Result = new PiChatCustomErrorResult(context.Exception, context.Request);
        }
    }

    public class PiChatCustomErrorResult : IHttpActionResult
    {
        private Exception exception;
        private HttpRequestMessage request;

        public PiChatCustomErrorResult(Exception exception, HttpRequestMessage request)
        {
            this.exception = exception;
            this.request = request;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(Execute());
        }

        private HttpResponseMessage Execute()
        {
            HttpResponseMessage response;
            if (exception is PiChatEntityNotFoundException)
            {
                response = this.request.CreateErrorResponse(HttpStatusCode.NotFound, exception.Message);
            }
            else if (exception is PiChatNotAuthorizedException)
            {
                response = this.request.CreateErrorResponse(HttpStatusCode.Unauthorized, exception.Message);
            }
            else if (exception is PiChatGenericException)
            {
                response = this.request.CreateErrorResponse(HttpStatusCode.BadRequest, exception.Message);
            }
            else
            {
                response = this.request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

            return response;
        }
    }
}