using PiChat.Bll.EF;
using PiChat.Bll.Entitites;
using System.Data.Entity;
using PiChat.Bll.Models;
using System.Collections.Generic;
using System.Linq;
using System;
using PiChat.Bll.Exceptions;

namespace PiChat.Bll.Managers
{
    /// <summary>
    /// Handles the database concering the groups
    /// </summary>
    public class GroupManager
    {
        /// <summary>
        /// Get those groups where the user is at least a member 
        /// </summary>
        /// <param name="userId">Specifies which users groups we want to query</param>
        /// <returns>A list containing informations of the user's groups </returns>
        public static List<GroupModel> GetUserGroups(string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                
                #region before review
                // REVIEW: érdemesebb a LINQ-es chainelt kifejezéseket megtörni, egy sorban nem olvasható.
                // Mivel úgyis mindig a konkrét Groupból válogatunk a kapcsolatban, ezért érdemes azt előre leszelektálni, a QueryMutator a maradék nagyrészét megoldja.
                // A MapTo típusparamétereit nem kötelező kiírni, ha implicit típusosan ki tudja találni a fordító a típust. Az ugyanolyan nevű property-ket pedig automatikusan másolja.
                // Az Include-ok sem kellenek, minden a query-ből jön, tehát nem kell eager loadolnunk a DB-ből a kapcsolódó groupot és usert sem.
                // Nincs .Equals!!! Gyakorlatilag nincs olyan szcenárió, amikor használni kell (csak saját komparátor írásakor, azt meg szinte soha nem írunk).

                if (ctx.Users.Find(userId) == null) throw new PiChatEntityNotFoundException();
                return ctx.GroupMemberships.Where(gm => gm.UserId == userId && gm.Role >= GroupMembershipRole.Member)
                                           .Include(g => g.Group)
                                           .Include(g => g.User)
                                           .MapToList(g => new GroupModel
                {
                    Id = g.Group.Id,
                    Description = g.Group.Description,
                    Name = g.Group.Name,
                    OwnerName = g.Group.Owner.Name,
                    IsPrivate = g.Group.IsPrivate,
                    MembersCount = g.Group.Members.Where(gm => gm.Role >= GroupMembershipRole.Member).Count(),
                    PicturesCount = g.Group.Images.Count()
                });
                // Eredmény://REVIEW MEGJEGYZÉS --vazul: ez nem mappelte a Role-t...
                // --adri: próbáltam mappelni, de nem sikerült
                #endregion
                return ctx.GroupMemberships.Where(gm => gm.UserId == userId && gm.Role >= GroupMembershipRole.Member)
                    .Select(g => g.Group)
                    .MapToList(g => new GroupModel
                    {
                        OwnerName = g.Owner.Name,
                        MembersCount = g.Members.Where(gm => gm.Role >= GroupMembershipRole.Member).Count(),
                        PicturesCount = g.Images.Count(),
                        Role = g.Members.Single(gm => gm.UserId == userId).Role
                    });
            }
        }

        /// <summary>
        /// Gets the members of a given group
        /// </summary>
        /// <param name="groupId">Specifies which group's members do we want to query</param>
        /// <param name="userid"> filter a user out if given, handy when we dont want to include ourselves in the result</param>
        /// <returns>A list containing the members of the group</returns>
        public static List<GroupMemberModel> GetGroupMembers(int groupId, string userId = null)
        {
            using (var ctx = new PiChatDbContext())
            {
                #region REVIEW
                //var query = ctx.GroupMemberships.Where(m => m.GroupId == groupId && m.Role > GroupMembershipRole.Pending);
                // REVIEW: attól, hogy egy soros lett, attól még nem lett rövidebb a kód :)
                //if (userId != null) query = query.Where(m => m.UserId != userId);
                // Tipikusan DTO-k használatánál egyáltalán nem kell az .Include. Az Include betölti memóriába (letölti adatbázisból) a kért kapcsolódó entitást. De a mappelés
                // még DB-ben megtörténik, így teljesen feleslegesen kérjük, hogy a kapcsolódó entitást is töltse be (DB-ben úgyis ott van).
                // A var result = X; return result; feltételezem a debugolás eredménye. Kijátszható viszonylag könnyen, ha a hívóban nézzük meg az eredményt és nem kell hozzá kódot módosítani sem.
                //var result = query.Include(m => m.User).Select(s => new GroupMemberModel { Email = s.User.Email, Name = s.User.Name, Role = s.Role, GroupId = s.GroupId }).ToList();
                //return result;
                #endregion
                // Inkább így: 
                // solve --vazul pár entert beraktam a reviewban megfogalmazottak szerint + kivettem az includeot
                // --adri: MapToList-tel oldottam meg a mappelést
                var query = ctx.GroupMemberships.Where(m => m.GroupId == groupId && m.Role > GroupMembershipRole.Pending);
                // REVIEW: attól, hogy egy soros lett, attól még nem lett rövidebb a kód :)
                if (userId != null) query = query.Where(m => m.UserId != userId);
                //return query.Select(s => new GroupMemberModel
                //{
                //    Email = s.User.Email,
                //    Name = s.User.Name,
                //    Role = s.Role,
                //    GroupId = s.GroupId
                //}
                //).ToList();
                return query.MapToList(s => new GroupMemberModel
                {
                    Email = s.User.Email,
                    Name = s.User.Name
                });
            }
        }

        /// <summary>
        /// Returns true if the user is at least a member of the given group, else false
        /// </summary>
        /// <param name="userId">Specifies the user </param>
        /// <param name="groupId">Specifies the group in which we seek the user</param>
        /// <returns>A bool signaling if the user is the member of the group</returns>
        public static bool IsInGroup(string userId, int groupId)
        {
            using (var ctx = new PiChatDbContext())
            {
                #region REVIEW
                // REVIEW: a SingleOrDefault lekérdezi memóriába a teljes entitást. Nekünk csak egy bool érték kell.
                // A (valami) ? true : false visszaadja a (valami)-t, tehát felesleges még egy if-else burkolást köré tenni.
                //  return ctx.GroupMemberships.Where(m => userId == m.UserId && m.GroupId == groupId).Where(m => m.Role >= GroupMembershipRole.Member).SingleOrDefault() != null ? true : false;
                // Helyette:
                #endregion
                return ctx.GroupMemberships.Any(m => userId == m.UserId && m.GroupId == groupId && m.Role >= GroupMembershipRole.Member);

            }
        }

        /// <summary>
        /// Returns a number of groups specified by take, in which you are not a member, admin or owner, and where the description or groupname contains the filter string. 
        /// If group id is given, then the result  will start with the first group with lesser Id than the given 
        /// </summary>
        /// <param name="userId">Specifies the user, whose role must be pending or not in  the membership table</param>
        /// <param name="groupId">Specifies a ceiling from which we will take the first couple of groups, which has smaller id than the groupId </param>
        /// <param name="filter">Group name and description will be filtered by this parameter</param>
        /// <param name="take">Specifies how many groups we want to take</param>
        /// <returns>A list containing groups which qualifies by given parameters</returns>
        public static List<GroupModel> FilterGroups(string userId, int? groupId = null, string filter = null, int take = 25)
        {
            using (var ctx = new PiChatDbContext())
            {
                // REVIEW: ha megnézzük, hogy mikor kell .Include: akkor kell, ha a kapcsolódó entitáson memóriában szeretnénk dolgozni valamit. A query-nket úgyis szelektáljuk, és a memóriába lekérdezett részt eldobnánk.
                var groups = ctx.Groups.Include(g => g.Members)
                                       .Include(g => g.Owner)
                                       .Include(g => g.Images)
                    .Where(g => !g.Members.Any(gm => gm.UserId == userId) || (g.Members.FirstOrDefault(gm => gm.UserId == userId).Role == GroupMembershipRole.Pending));

                // REVIEW: ezt nem gondoltam át teljesen, de lehet, hogy jó :)
                groups = ctx.Groups
                    .Where(g => g.Members.All(m => m.UserId != userId || m.Role == GroupMembershipRole.Pending));

                if (filter != null)
                    groups = groups.Where(g => g.Name.Contains(filter) || g.Description.Contains(filter));

                if (groupId != null)
                    groups = groups.Where(g => g.Id < groupId);

                return groups.OrderByDescending(g => g.Id).Take(take).MapToList(g => new GroupModel
                {
                    OwnerName = g.Owner.Name,
                    Role = (g.Members.Any(gm => gm.UserId == userId)) ? GroupMembershipRole.Pending : GroupMembershipRole.NotMember,
                    MembersCount = g.Members.Where(gm => gm.Role >= GroupMembershipRole.Member).Count(),
                    PicturesCount = g.Images.Count()
                });
            }
        }

        /// <summary>
        /// Create a new group
        /// </summary>
        /// <param name="userId">Id of the user, who wants to create the group</param>
        /// <param name="groupName">The name of the new group which is created</param>
        /// <param name="isPrivate">Specifies if the group should be private or not</param>
        /// <returns>A groupModel of the new group</returns>
        public static GroupModel CreateGroup(string userId, string groupName, bool isPrivate)
        {
            using (var ctx = new PiChatDbContext())
            {
                var group = new Group { Name = groupName, OwnerId = userId, Description = "", IsPrivate = isPrivate };
                ctx.Groups.Add(group);
                var groupMembership = new GroupMembership { UserId = userId, Group = group, Role = GroupMembershipRole.Owner };
                ctx.GroupMemberships.Add(groupMembership);
                ctx.SaveChanges();

                return ctx.Groups.Include(g => g.Owner)
                                 .Include(g => g.Members)
                                 .Single(g => g.Id == group.Id)
                                 .MapTo(g => new GroupModel
                {
                    OwnerName = g.Owner.Name,
                    Role = GroupMembershipRole.Owner,
                    MembersCount = 1,
                    PicturesCount = 0
                });
            }
        }

        /// <summary>
        /// Add user to the specified group
        /// </summary>
        /// <param name="userId">Id of the user, who wants to enter the group</param>
        /// <param name="groupId">Id for the group that the user wants to enter to</param>
        /// <returns>none</returns>
        public static void JoinToGroup(string userId, int groupId)
        {
            using (var ctx = new PiChatDbContext())
            {
                GroupMembership membership;
                if  ((   membership = ctx.GroupMemberships.Where(c => (c.UserId == userId && c.GroupId == groupId)).SingleOrDefault()) != null)
                    throw new PiChatGenericException(String.Format("You have {0} role in the group already",membership.Role.ToString() ));

                #region Review
                // REVIEW: az üres try-catch mindig gyanús. Also, ismét, SingleOrDefault helyett nekünk összesen egy bool érték kell, erre Any() és All() valók.
                //bool isPrivate;
                //try
                //{
                //    isPrivate = ctx.Groups.Where(g => g.Id == groupId).Select(g => g.IsPrivate).SingleOrDefault();
                //}
                //catch
                //{
                //    return;
                //}
                // Helyette:
                //var isPrivate = ctx.Groups.Any(g => g.Id == groupId && g.IsPrivate);
                // REVIEW: A group vagy user nem létezését nem kezeljük.
                // Mivel nem csinálunk vele semmi többet, ezért a groupMembership változóra nincs szükség.
                #endregion
                // Review solve: --vazul
                if (!ctx.Users.Any(u=>u.Id==userId))
                    throw new PiChatEntityNotFoundException( );
                var group = ctx.Groups.Find(groupId);
                if (group == null)
                    throw new PiChatEntityNotFoundException();


                var groupMembership = new GroupMembership
                {
                    UserId = userId,
                    GroupId = groupId,
                    Role = group.IsPrivate ? GroupMembershipRole.Pending : GroupMembershipRole.Member
                };

                ctx.GroupMemberships.Add(groupMembership);
                ctx.SaveChanges();
            }
        }

        /// <summary>
        /// Remove user from the specified group
        /// </summary>
        /// <param name="userId">Id of the user, who wants to leave the group</param>
        /// <param name="groupId">Id of the group that the user wants to leave</param>
        /// <returns>none</returns>
        public static void LeaveGroup(string userId, int groupId)
        {
            using (var ctx = new PiChatDbContext())
            {
              
                // REVIEW: SingleOrDefault().Role jól elszáll, ha nem talál elemet.
                var groupMembership = ctx.GroupMemberships.Where(c => (c.UserId == userId && c.GroupId == groupId)).SingleOrDefault();
                // REVIEW: itt látszik jól, hogy a kontroll a returnnél átesik a hívóhoz, ezért jobb lenne a következő sorba törni.

                if (groupMembership == null) throw new PiChatEntityNotFoundException();
                if (groupMembership.Role == GroupMembershipRole.Owner || groupMembership.Role < GroupMembershipRole.Member)
                    throw new PiChatGenericException(String.Format("You cant unsubscribe from a group while your role is '{0}'",groupMembership.Role));

                ctx.GroupMemberships.Remove(groupMembership);
                ctx.SaveChanges();


                ////régi
                //if (ctx.GroupMemberships.Where(c => (c.UserId.Equals(userId) && c.GroupId == groupId)).SingleOrDefault() != null) return;
                //var groupMembership = new GroupMembership { UserId = userId, GroupId = groupId };
                //ctx.GroupMemberships.Attach(groupMembership);
                //ctx.GroupMemberships.Remove(groupMembership);
                //ctx.SaveChanges();
            }
        }

        /// <summary>
        /// Renames a group
        /// </summary>
        /// <param name="userId">Specifies the user who wants to rename the group</param>
        /// <param name="groupId">Specifies which group the user wants to rename</param>
        /// <param name="newName">Specifies which name do the user want to rename the group to</param>
        public static void RenameGroup(string userId, int groupId, string newName)
        {
            using (var ctx = new PiChatDbContext())
            {


                var membership = ctx.GroupMemberships.Include(gm=>gm.Group).Where(gm=>gm.GroupId==groupId&&gm.UserId== userId).SingleOrDefault();
                if (membership == null) throw new PiChatEntityNotFoundException();
                if (membership.Role < GroupMembershipRole.Administrator) throw new PiChatNotAuthorizedException();
                membership.Group.Name = newName;
                ctx.SaveChanges();

                var group = ctx.Groups.Single(g => g.Id == groupId);
                if (group.OwnerId == userId)
                {
                    group.Name = newName;
                    ctx.SaveChanges();
                }
            }
        }

        /// <summary>
        /// Changes the description of a group
        /// </summary>
        /// <param name="userId">Specifies the user who wants to change the description of the group</param>
        /// <param name="groupId">Specifies which group's description do the user wants to change</param>
        /// <param name="newDesc">Specifies which description do the user want to change the group's description to</param>
        public static void ChangeDescription(string userId, int groupId, string newDesc)
        {
            using (var ctx = new PiChatDbContext())
            {
               
                var membership = ctx.GroupMemberships.Where(m => m.UserId == userId && m.GroupId == groupId).Include(m => m.Group).SingleOrDefault();

                if (membership == null) throw new PiChatEntityNotFoundException();
                if (membership.Role < GroupMembershipRole.Administrator) throw new PiChatNotAuthorizedException();

                membership.Group.Description = newDesc;
                ctx.SaveChanges();


            }
        }

        /// <summary>
        /// Delete the group with the given id, WARNING : WILL CASCADE DELETE
        /// </summary>
        /// <param name="groupId">Specifies which group we want to delete</param>
        /// <param name="userId">Specifies the user who wants to execute the delete</param>
        public static void DeleteGroup(int groupId, string userId)
        {
            using (var ctx = new PiChatDbContext())
            {

                var group = ctx.Groups.Where(g => g.Id == groupId).SingleOrDefault();
                    
                     
                if (group == null) throw new PiChatEntityNotFoundException();
                if (group.OwnerId != userId) throw new PiChatNotAuthorizedException();
                ctx.Groups.Remove(group);
                ctx.SaveChanges();
              
            }
        }
    }
}
