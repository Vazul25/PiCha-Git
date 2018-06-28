using AspNetWebApi.Extensions;
using Microsoft.AspNet.Identity;
using PiChat.Bll.Managers;
using PiChat.Web.Hubs;
using PiChat.Web.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using MimeTypes;
using ExtensionMethods;
using PiChat.Bll.Models;
using System.Web.Http.Description;

namespace PiChat.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Image")]
    public class ImageApiController : ApiController
    {
        /// <summary>
        /// the folder where we save the images uploaded by the users 
        /// </summary>
        // Todo (in the future we could append a group name folder to the path)
        private readonly string workingFolder = HttpRuntime.AppDomainAppPath + @"\Images";

        /// <summary>
        /// Returns an image specified by the given id 
        /// </summary>
        /// <param name="imageId">Specifies the image which we want to get</param>
        /// <returns>
        /// A HttpResponseMessage that contains the image and its mimetype is set corresponding to the image's type
        /// </returns>
        [HttpGet]
        [Route("GetImage/{imageId}")]
        public HttpResponseMessage GetImageById(int imageId)
        {
            string imagePath;
            var response = new HttpResponseMessage();


            imagePath = ImageManager.GetImagePathByID(imageId, User.Identity.GetUserId());

            var path = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), imagePath);
            using (var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read))
            {
                //TODO An exception of type 'System.OutOfMemoryException' occurred in System.Drawing.dll but was not handled in user code
                //Additional information: Out of memory. 600 MB-nél kiakad , érdeklődni kell hogy jól van ez így vagy meg kéne csinálni jobban
                using (var img = Image.FromStream(fileStream))
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        path.MyGetImageFormat();
                        img.Save(ms, path.MyGetImageFormat());
                        response.Content = new ByteArrayContent(ms.ToArray());
                    }

                    var mimeType = MimeTypeMap.GetMimeType(Path.GetExtension(path));
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);

                    response.StatusCode = HttpStatusCode.OK;
                    response.Headers.CacheControl = new CacheControlHeaderValue()
                    {
                        Public = true,
                        MaxAge = new TimeSpan(360, 0, 0, 0)
                    };
                }
            }


            return response;
        }

        /// <summary>
        /// Returns the first ten image details for the user in descending order by id (which is also by upload time)
        /// </summary>
        /// <returns> A httpActionResult containing the json list of ImageDetailsModel</returns>
        [HttpGet]
        [ResponseType(typeof(List<ImageDetailsModel>))]
        [Route("GetNextTenImages/")]
        public IHttpActionResult GetNextTenImagesFromId()
        {
            var user = User.Identity.GetUserId();
            return Ok(ImageManager.GetNextImagesForUser(User.Identity.GetUserId()));
        }

        /// <summary>
        /// Gets the first 10 images that has smaller  id than the given ( this will be in descending order by uploadtime )
        /// </summary>
        /// <param name="imageId">Id from where to start the selection of 10 images, every returned imgage has smaller id than this</param>
        /// <returns>A httpActionResult containing the json list of ImageDetailsModel</returns>
        [HttpGet]
        [ResponseType(typeof(List<ImageDetailsModel>))]
        [Route("GetNextTenImages/{imageId}")]
        public IHttpActionResult GetNextTenImagesFromId(int imageId)
        {
            var user = User.Identity.GetUserId();
            return Ok(ImageManager.GetNextImagesForUser(User.Identity.GetUserId(), imageId));
        }

        /// <summary>
        /// Returns the first ten image details of a given group  in descending order by id (which is also by upload time)
        /// </summary>
        /// <param name="groupId">Specifies the group whose images we want to get</param>
        /// <returns>A httpActionResult containing the json list of ImageDetailsModel</returns>
        [HttpGet]
        [ResponseType(typeof(List<ImageDetailsModel>))]
        [Route("GetNextTenImagesOfGroup/{groupId}")]
        public IHttpActionResult GetNextTenImagesOfGroup(int groupId)
        {
            var user = User.Identity.GetUserId();
            return Ok(ImageManager.GetNextImagesForUser(User.Identity.GetUserId(), null, groupId));
        }

        /// <summary>
        /// Returns the next ten image details hich has smaller imageid than the imageId param,
        /// of a group specified by groupId,  in descending order by imageId (which is also by upload time)
        /// </summary>
        /// <param name="groupId">Specifies the group whose images we want to get</param>
        /// <param name="imageId">Id from where to start the selection of 10 images, every returned imgage has smaller id than this</param>
        /// <returns>A httpActionResult containing the json list of ImageDetailsModel</returns>
        [HttpGet]
        [ResponseType(typeof(List<ImageDetailsModel>))]
        [Route("GetNextTenImagesOfGroup/{groupId}/{imageId}")]
        public IHttpActionResult GetNextTenImagesOfGroup(int groupId, int imageId)
        {
            var user = User.Identity.GetUserId();
            return Ok(ImageManager.GetNextImagesForUser(User.Identity.GetUserId(), imageId, groupId));
        }

        /// <summary>
        /// Uploads a photo to a group specified by groupId, async
        /// </summary>
        /// <param name="groupID">Specifies the group</param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpPost]
        [Route("Add/{groupID}")]
        public async Task<IHttpActionResult> Add(int groupID)
        {
            if (!Request.Content.IsMimeMultipartContent("form-data"))
            {
                return BadRequest("Unsupported media type");
            }


            var provider = new CustomMultipartFormDataStreamProvider(workingFolder);

            await Request.Content.ReadAsMultipartAsync(provider);

            var photos =
              provider.FileData
                .Select(file => new FileInfo(file.LocalFileName))
                .Select(fileInfo => fileInfo.Name).ToList();

            var ownerId = User.Identity.GetUserId();

            var imageIds = new List<int>();
            foreach (var path in photos)
            {
                imageIds.Add(ImageManager.AddImage(ownerId, groupID, path, DateTime.UtcNow));
            }

            var imageDetails = ImageManager.GetImagesForIds(User.Identity.GetUserId(), imageIds);
            PiChatHub.SendGroupNewImagesNotification(groupID, imageDetails);

            return Ok(new { Message = "Photos uploaded ok" });
        }



        /// <summary>
        /// Changes the  desription of a given image
        /// </summary>
        /// <param name="m">model of the target image</param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpPost]
        [Route("ChangeDescription")]
        public IHttpActionResult ChangeDescription(ChangeDescriptionModel m)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var image = ImageManager.ChangeDescription(User.Identity.GetUserId(), m.ImageId, m.NewDescription);
            PiChatHub.SendGroupChangeImageDescriptionNotification(image.GroupId, image.ImageId, image.Description);
            return Ok();
        }

        /// <summary>
        /// Deletes given image
        /// </summary>
        /// <param name="ID">ID of the given image</param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpDelete]
        [Route("DeleteImage/{ID}")]
        public IHttpActionResult DeleteImage(int ID)
        {
            string path = null;


            path = ImageManager.GetImagePathByID(ID, User.Identity.GetUserId());

            string workingFolder = HttpRuntime.AppDomainAppPath + @"\Images";

            var image = ImageManager.RemoveImage(ID, User.Identity.GetUserId());
            File.Delete(Path.Combine(workingFolder, path));
            PiChatHub.SendGroupDeleteImageNotification(image.GroupId, image.ImageId);


            return Ok();
        }
    }
}