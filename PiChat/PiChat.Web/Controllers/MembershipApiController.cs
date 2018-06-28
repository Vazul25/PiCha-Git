using Microsoft.AspNet.Identity;
using PiChat.Bll.Managers;
using PiChat.Bll.Models;
 
using System.Collections.Generic;
 
using System.Web.Http;
using System.Web.Http.Description;

namespace PiChat.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Membership")]
    public class MembershipApiController : ApiController
    {
        /// <summary>
        /// Gets the membership requests which the current user can decide on.
        /// </summary>
        /// <returns>HttpActionResult containing a json list of the requests</returns>
        [HttpGet]
        [ResponseType(typeof(List<JoinMemberModel>))]
        [Route("GetRequests")]
        public IHttpActionResult Get()
        {

            return Ok(MembershipManager.GetMembershipRequests(User.Identity.GetUserId()));

        }

        /// <summary>
        /// Sets a membership record's role to member from pending
        /// </summary>
        /// <param name="membershipId"></param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpPost]
        [Route("AcceptRequest")]
        public IHttpActionResult AcceptRequest(int membershipId)
        {

            MembershipManager.AcceptMembershipRequests(membershipId, User.Identity.GetUserId());
            return Ok();

        }

        /// <summary>
        /// Deletes a membership entry from the table, where the role is pending
        /// </summary>
        /// <param name="membershipId">Specifies the membership entry in the table</param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>

        //Todo egybe vonni a még nem létező kick funkcionalitással
        [HttpPost]
        [Route("RejectRequest")]
        public IHttpActionResult RejectRequest(int membershipId)
        {

            MembershipManager.RejectMembershipRequests(membershipId, User.Identity.GetUserId());
            return Ok();

        }

        /// <summary>
        /// Sets a membership record's role to administrator  
        /// </summary>
        /// <param name="membershipId"></param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpPost]
        [Route("GrantAdmin")]
        public IHttpActionResult GrantAdmin(GroupMemberModel member)
        {

            MembershipManager.GrantAdminPrivilage(member.Email, member.GroupId, User.Identity.GetUserId());
            return Ok();

        }

    }
}