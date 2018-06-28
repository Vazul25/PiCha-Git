using PiChat.Bll.EF;
using PiChat.Bll.Models;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using PiChat.Bll.Exceptions;

namespace PiChat.Bll.Managers
{
    /// <summary>
    /// Handles the database concering the memberships
    /// </summary>
    public class MembershipManager
    {
        /// <summary>
        /// Returns with a list containing the membership requests which can be judged by the user
        /// </summary>
        /// <param name="userId">Specifies the user who executes the query</param>
        /// <returns> </returns>
        public static List<JoinMemberModel> GetMembershipRequests(string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                //todo make it better

                //gets the groups admined by the user
                var adminedGroups =
                    ctx.GroupMemberships
                    .Where(g => g.UserId == userId)
                    .Where(g => g.Role == GroupMembershipRole.Owner || g.Role == GroupMembershipRole.Administrator)
                    .Select(g => g.GroupId);

                //ctx.GroupMemberships.Include(g=>g.Group).Where(g => adminedGroups.Contains(g.GroupId)).Select(g => new JoinMemberModel {GroupMembershipId=g.GroupMembershipId,GroupName=g. }).ToList();
                // REVIEW: ha admin vagyok, akkor nem vagyok Pending állapotban is. És nem kell a contains.
                // ctx.GroupMemberships.Where(g => g.UserId == userId && g.Role == GroupMembershipRole.Owner || g.Role == GroupMembershipRole.Administrator).Select(...)

                return ctx.GroupMemberships
                    .Where(gm => adminedGroups.Contains(gm.GroupId))
                    .Include(gm => gm.Group)
                    .Include(gm => gm.User)
                    .Where(u => u.Role == GroupMembershipRole.Pending)
                    .MapToList(g => new JoinMemberModel {
                        GroupName = g.Group.Name,
                        JoinerName = g.User.Name,
                        OwnerName = g.Group.Owner.Name
                    });
            }
        }

        /// <summary>
        /// Deletes an entry from the membership table given by a membershipId  where the role is pending 
        /// </summary>
        /// <param name="membershipId">Specifies the entry in the membership table</param>
        /// <param name="userId">Specifies the user who executes the query</param>
        /// <returns> </returns>
        public static void RejectMembershipRequests(int membershipId, string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                // REVIEW: Select(x => x) ?
                //solved --vazul eltávolítottam a fölös selectet

                var membership = ctx.GroupMemberships
                    .Where(gm => gm.GroupMembershipId == membershipId && gm.Role == GroupMembershipRole.Pending).FirstOrDefault();

                if (membership == null)
                    throw new PiChatEntityNotFoundException();

                var admin = ctx.GroupMemberships.Find(membership.GroupId, userId);

                if (admin == null)
                    throw new PiChatEntityNotFoundException();

                if (admin.Role < GroupMembershipRole.Administrator)
                    throw new PiChatNotAuthorizedException();

                ctx.GroupMemberships.Remove(membership);
                ctx.SaveChanges();
            }
        }

        /// <summary>
        /// Changes a membership role from pending to member 
        /// </summary>
        /// <param name="membershipId">Specifies the entry in the membership table</param>
        /// <param name="userId">Specifies the user who executes the query</param>
        /// <returns> </returns>
        public static void AcceptMembershipRequests(int membershipId, string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
               var membership = ctx.GroupMemberships
                    .Where(gm => gm.GroupMembershipId == membershipId && gm.Role == GroupMembershipRole.Pending).FirstOrDefault();

                if (membership == null)
                    throw new PiChatEntityNotFoundException();

                var admin = ctx.GroupMemberships.Find(membership.GroupId, userId);

                if (admin == null)
                    throw new PiChatEntityNotFoundException();

                if (admin.Role < GroupMembershipRole.Administrator)
                    throw new PiChatNotAuthorizedException();

                membership.Role = GroupMembershipRole.Member;
                ctx.SaveChanges();
            }
        }

        /// <summary>
        /// Changes a membership role from pending to member 
        /// </summary>
        /// <param name="membersEmail">Specifies the member by his email address</param>
        /// <param name="groupId">Specifies which group's member do we want to promote to be one of the group's administrators</param>
        /// <param name="userId">Specifies the user who executes the query</param>
        public static void GrantAdminPrivilage(string membersEmail, int groupId, string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                var ownerMembership= ctx.GroupMemberships.Find(groupId, userId);
                //TODO return custom exception not normal return
                if (ownerMembership == null)
                    throw new PiChatEntityNotFoundException();
                if(ownerMembership.Role!=GroupMembershipRole.Owner)
                    throw new PiChatNotAuthorizedException();

                var membership = ctx.GroupMemberships.Include(m => m.User).Where(m => m.User.Email == membersEmail).Where(m => m.GroupId == groupId).SingleOrDefault();
                if (membership ==null)
                    throw new PiChatEntityNotFoundException();
                membership.Role = GroupMembershipRole.Administrator;
                ctx.SaveChanges();
            }
        }
    }
}
