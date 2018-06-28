using Microsoft.AspNet.Identity;
using PiChat.Bll.Managers;
using PiChat.Bll.Models;
using PiChat.Web.Hubs;
using PiChat.Web.Models;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace PiChat.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Group")]
    public class GroupApiController : ApiController
    {
        /// <summary>
        /// Gets the groups of the current user
        /// </summary>
        /// <returns>A httpActionResult containing the json list of groupModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupModel>))]
        [Route("GetMyGroups")]
        public List<GroupModel> GetMyGroups()
        {
            return GroupManager.GetUserGroups(User.Identity.GetUserId());
        }

        //TODO ask if execluding should be a parameter instead
        /// <summary>
        /// Api call that returns the members of the given group, execluding the caller from the result
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>A httpActionResult containing the json list of GroupMemberModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupMemberModel>))]
        [Route("GetGroupMembers/{groupId}")]
        public IHttpActionResult GetGroupMembers(int groupId)
        {
            if (!GroupManager.IsInGroup(User.Identity.GetUserId(), groupId))
                return Unauthorized();


            return Ok(GroupManager.GetGroupMembers(groupId, User.Identity.GetUserId()));
        }

        /// <summary>
        /// Returns the first 25 groups in which the user is at least has member role 
        /// </summary>
        /// <returns>A httpActionResult containing the json list of GroupModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupModel>))]
        [Route("GetGroups")]
        public IHttpActionResult GetGroups()
        {
            return Ok(GroupManager.FilterGroups(User.Identity.GetUserId()));
        }

        /// <summary>
        /// Returns the next 25 groups starting from the given groupId
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns>A httpActionResult containing the json list of GroupModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupModel>))]
        [Route("GetMoreGroupsFromId/{groupId}")]
        public IHttpActionResult GetMoreGroupsFromId(int groupId)
        {
            var user = User.Identity.GetUserId();
            var result = GroupManager.FilterGroups(User.Identity.GetUserId(), groupId);
            return Ok(result);
        }

        /// <summary>
        /// Returns the first 25 groups which name's or description's contains the filter and in which the user is has at least  member role  
        /// </summary>
        /// <param name="filter">The groups description's or name's must contain this filter</param>
        /// <returns>A httpActionResult containing the json list of GroupModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupModel>))]
        [Route("GetFilteredGroups/{filter}")]
        public IHttpActionResult GetFilteredGroups(string filter)
        {
            var user = User.Identity.GetUserId();
            var result = GroupManager.FilterGroups(user, null, filter);
            return Ok(result);
        }

        /// <summary>
        /// / Returns the next 25 groups  starting from the given groupId which name's or description's contains the filter and in which the user is has at least  member role  
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="filter"></param>
        /// <returns>A httpActionResult containing the json list of GroupModels</returns>
        [HttpGet]
        [ResponseType(typeof(List<GroupModel>))]
        [Route("GetMoreFilteredGroupsFromId/{filter}/{groupId}")]
        public IHttpActionResult GetMoreFilteredGroupsFromId(string filter, int groupId)
        {
            var user = User.Identity.GetUserId();
            var result = GroupManager.FilterGroups(user, groupId, filter);
            return Ok(result);
        }

        /// <summary>
        /// Creates a new group
        /// </summary>
        /// <param name="m"> The group model which contains the group's name and wether the group is private or not</param>
        /// <returns>A httpActionResult containing the new groups GroupModels</returns>
        [HttpPost]
        [ResponseType(typeof(GroupModel))]
        [Route("CreateGroup")]
        public IHttpActionResult CreateGroup(CreateGroupModel m)
        {
            var group = GroupManager.CreateGroup(User.Identity.GetUserId(), m.Name, m.IsPrivate);
            return Ok(group);
        }

        /// <summary>
        /// Tries to join into a group, if the group is private, membership will be set to pending else it will be set to member.
        /// </summary>
        /// <param name="m">A view model which contains the groupId</param>
        /// <returns>A httpActionResult containing the httpStatusCode</returns>
        [HttpPost]
        [Route("JoinGroup")]
        public IHttpActionResult JoinGroup(JoinGroupModel m)
        {
            GroupManager.JoinToGroup(User.Identity.GetUserId(), m.GroupId);
            return Ok();
        }

        /// <summary>
        /// Deletes a membership specified by the current user id and the given groupId
        /// </summary>
        /// <param name="m">A view model which contains the groupId</param>
        /// <returns>A httpActionResult containing the httpStatusCode</returns>
        [HttpPost]
        [Route("LeaveGroup")]
        public IHttpActionResult LeaveGroup(LeaveGroupModel m)
        {
            GroupManager.LeaveGroup(User.Identity.GetUserId(), m.GroupId);
            return Ok();
        }

        /// <summary>
        /// Renames a group 
        /// </summary>
        /// <param name="m">A view model that contains the groups id and its new name</param>
        /// <returns>A httpActionResult containing the httpStatusCode</returns>
        [HttpPost]
        [Route("RenameGroup")]
        public IHttpActionResult RenameGroup(RenameGroupModel m)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GroupManager.RenameGroup(User.Identity.GetUserId(), m.GroupId, m.NewName);
            PiChatHub.SendRenameGroupNotification(m.GroupId, m.NewName);
            return Ok();
        }

        /// <summary>
        /// Changes the description of a group 
        /// </summary>
        /// <param name="m">A view model that contains the groups id and its new description</param>
        /// <returns>A httpActionResult which contains the httpStatusCode</returns>
        [HttpPost]
        [Route("ChangeDescription")]
        public IHttpActionResult ChangeDescription(ChangeGroupDescriptionModel m)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            GroupManager.ChangeDescription(User.Identity.GetUserId(), m.GroupId, m.NewDescription);
            PiChatHub.SendChangeGroupDescriptionNotification(m.GroupId, m.NewDescription);
            return Ok();
        }

        /// <summary>
        /// Deletes the specified group
        /// </summary>
        /// <param name="id">The Groups id</param>
        /// <returns>A httpActionResult containing the json list of GroupModels</returns>
        [HttpDelete]
        [Route("DeleteGroup/{id}")]
        public IHttpActionResult DeleteGroup(int id)
        {
            var paths = ImageManager.GetImagePathsByGroup(id);
            string workingFolder = HttpRuntime.AppDomainAppPath + @"\Images";

            GroupManager.DeleteGroup(id, User.Identity.GetUserId());
            foreach (var path in paths)
            {
                File.Delete(Path.Combine(workingFolder, path));
            }

            PiChatHub.SendDeleteGroupNotification(id);
            return Ok();
        }
    }
}