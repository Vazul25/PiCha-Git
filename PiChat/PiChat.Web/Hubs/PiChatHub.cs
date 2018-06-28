using Microsoft.AspNet.SignalR;
using PiChat.Bll.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PiChat.Web.Hubs
{
    public interface IPiChatClient
    {
        void debugMessage(string message);

        void showNewImages(List<ImageDetailsModel> images);

        void showNewGroup(GroupModel group);

        void changeGroupDescription(int groupId, string newDescription);

        void changeGroupName(int groupId, string newName);

        void deleteGroup(int groupId);

        void changeImageDescription(int imageId, string newDescription);

        void deleteImage(int imageId);
    }

    /// <summary>
    /// Handles the signalerr connections
    /// </summary>
    public class PiChatHub : Hub<IPiChatClient>
    {
        public PiChatHub()
        {
        }

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }

        /// <summary>
        /// Join to a signalerr group
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        public void JoinToGroup(string groupId)
        {
            Groups.Add(Context.ConnectionId, groupId);
        }

        /// <summary>
        /// Join to multiple signalerr groups
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        public void JoinToGroups(List<string> groupsId)
        {
            groupsId.ForEach((groupId) =>
            {
                Groups.Add(Context.ConnectionId, groupId);
            });
        }

        /// <summary>
        /// Leave a signalerr group
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        public void LeaveGroup(string groupId)
        {
            Groups.Remove(Context.ConnectionId, groupId);
        }

        /// <summary>
        /// Sends a newly created group to every one else
        /// </summary>
        /// <param name="group">Specifies the newly created group</param>
        public void SendNewGroupToOthers(GroupModel group)
        {
            group.Role = GroupMembershipRole.NotMember;
            Clients.AllExcept(Context.ConnectionId).showNewGroup(group);
        }

        /// <summary>
        /// Sends a notification that the description of a group has been changed
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        /// <param name="newDescription">The new description to which we changed the old one</param>
        public static void SendChangeGroupDescriptionNotification(int groupId, string newDescription)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.All.changeGroupDescription(groupId, newDescription);
        }

        /// <summary>
        /// Sends a notification that the name of a group has been changed
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        /// <param name="newName">The new name to which we changed the old one</param>
        public static void SendRenameGroupNotification(int groupId, string newName)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.All.changeGroupName(groupId, newName);
        }

        /// <summary>
        /// Sends a notification to everyone that a group has been deleted
        /// </summary>
        /// <param name="groupId">Specifies the group</param>
        public static void SendDeleteGroupNotification(int groupId)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.All.deleteGroup(groupId);
        }

        /// <summary>
        /// Sends a notification to whom it may concern that new images has been uploaded to one of their groups 
        /// </summary>
        /// <param name="groupId">Specifies the group to which the new images has been uploaded to</param>
        /// <param name="images">Specifies the images which were uploaded </param>
        public static void SendGroupNewImagesNotification(int groupId, List<ImageDetailsModel> images)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.Group(groupId.ToString()).showNewImages(images);
        }

        /// <summary>
        /// Sends a notification to whom it may concern that the description of an image has been changed
        /// </summary>
        /// <param name="groupId">Specifies the group in which the image is</param>
        /// <param name="imageId">Specifies the image whose description was changed</param>
        /// <param name="newDescription">Specifies the new desription that we changed the old one to</param>
        public static void SendGroupChangeImageDescriptionNotification(int groupId, int imageId, string newDescription)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.Group(groupId.ToString()).changeImageDescription(imageId, newDescription);
        }

        /// <summary>
        /// Sends a notification to whom it may concern that an image has been deleted from one of their groups 
        /// </summary>
        /// <param name="groupId">Specifies the group in which the image is</param>
        /// <param name="imageId">Specifies the image which was deleted</param>
        public static void SendGroupDeleteImageNotification(int groupId, int imageId)
        {
            GlobalHost.ConnectionManager.GetHubContext<PiChatHub, IPiChatClient>().Clients.Group(groupId.ToString()).deleteImage(imageId);
        }
    }
}