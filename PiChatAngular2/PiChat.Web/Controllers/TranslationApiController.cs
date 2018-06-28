using PiChat.Bll.Managers;
using System.Web.Http;
using System.Web.Http.Description;

namespace PiChat.Web.Controllers
{
    [RoutePrefix("api/Translation")]
    public class TranslationApiController : ApiController
    {
        /// <summary>
        /// Gets the language resource from the server
        /// </summary>
        /// <param name="lang">Specifies which language resource we wont to get</param>
        /// <returns>A httpActionResult which contains the language resource</returns>
        [HttpGet]
        [ResponseType(typeof(System.Collections.Generic.Dictionary<string, string>))]
        [Route("GetTranslation")]
        public IHttpActionResult GetTranslation([FromUri] string lang)
        {
            var translation = ResourceManager.GetTranslationResource(lang);
            return Ok(translation);
        }
    }
}
