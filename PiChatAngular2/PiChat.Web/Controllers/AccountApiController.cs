using PiChat.Bll.Managers;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Threading.Tasks;
using PiChat.Web.Models;
using PiChat.Bll.Entitites;
using PiChat.Bll.Models;

namespace PiChat.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountApiController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private UserManager _userManager;

        public AccountApiController()
        {
        }

        public AccountApiController(UserManager userManager, ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public UserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<UserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User() { UserName = model.Email, Email = model.Email, Name = model.Name };

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        /// <summary>
        /// Gets the profile data of the actual user
        /// </summary>
        /// <returns>HttpActionResult containing the profile data parsed into a ProfileModel</returns>
        [HttpGet]
        [Route("GetUserData")]
        public IHttpActionResult GetUserData()
        {
            ProfileModel result;

            result = UserManager.GetUserProfile(User.Identity.GetUserId());


            return Ok(result);
        }

        /// <summary>
        /// Changes the password of the current user
        /// </summary>
        /// <param name="model">A ChangePasswordModel containing the new, news confirmation and the old password</param>
        /// <returns>HttpActionResult containing a http status code</returns>
        [HttpPost]
        [Route("ChangePassword")]
        public IHttpActionResult ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = UserManager.ChangePassword(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
                return BadRequest(GetErrors(result));

            return Ok();
        }

        /// <summary>
        /// Changes the name of the current user
        /// </summary>
        /// <param name="model">A ViewModel containing the new name</param>
        /// <returns>HttpActionResult containing a http status code</returns>
        [HttpPost]
        [Route("ChangeName")]
        public IHttpActionResult ChangeName(ChangeNameModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            UserManager.ChangeName(User.Identity.GetUserId(), model.NewName);



            return Ok();
       } 

        #region Helpers
        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private string GetErrors(IdentityResult result)
        {
            string errors = "";
            foreach (var error in result.Errors)
            {
                errors += error;
            }

            return errors;
        }
        #endregion
    }
}
