using PiChat.Bll.EF;
using PiChat.Bll.Entitites;
using PiChat.Bll.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using PiChat.Bll.Exceptions;

namespace PiChat.Bll.Managers
{
    /// <summary>
    /// Handles the database concering the images
    /// </summary>
    public class ImageManager
    {
        /// <summary>
        /// Returns the local path to the image given by imageId 
        /// </summary>
        /// <param name="imageId">Specifies the image</param>
        /// <param name="userId">Specifies the user who wants the information</param>
        /// <returns></returns>
        public static string GetImagePathByID(int imageId, string userId)
        {
            Image image;
            using (var ctx = new PiChatDbContext())
            {

                if ((image = ctx.Images.Find(imageId)) == null) throw new PiChatEntityNotFoundException();
                if (!ctx.GroupMemberships.Any(m => m.GroupId == image.GroupId && m.UserId == userId && m.Role > GroupMembershipRole.Pending)) throw new PiChatNotAuthorizedException();
            }
            return image.Path;
        }

        /// <summary>
        /// Returns with a list containing, the path of every image in the given group.  
        /// </summary>
        /// <param name="groupId"> Specifies the group</param>
        /// <returns></returns>
        public static IList<String> GetImagePathsByGroup(int groupId)
        {
            using (var ctx = new PiChatDbContext())
            {
                return ctx.Images.Include(i => i.Group).Where(i => i.GroupId == groupId).Select(i => i.Path).ToList();
            }
        }

        /// <summary>
        /// Gets the next couple  images starting from the given id if its not null, filtered by group if groupId is given.
        /// </summary>
        /// <param name="userId">Which users pictures</param>
        /// <param name="imageId">Start position (less than) from where will be the next 10 images taken, if null then the first ten will be taken </param>
        /// <param name="groupId">if given, then filter by group</param>
        /// <returns>List containing the infromation of the selected images</returns>
        public static List<ImageDetailsModel> GetNextImagesForUser(string userId, int? imageId = null, int? groupId = null, int take = 10)
        {
            using (var ctx = new PiChatDbContext())
            {

                var query = ctx.Images.Include(i => i.Owner)
                                      .Include(i => i.Group)
                                      .Include(i => i.Group.Members)
                    .Where(i => i.Group.Members.Any(gm => gm.UserId == userId && gm.Role >= GroupMembershipRole.Member));
                if (groupId != null) query = query.Where(i => i.GroupId == groupId);
                if (imageId != null)
                {
                    query = query.Where(i => i.Id < imageId);
                }

                return query.OrderByDescending(i => i.Id).Take(take).MapToList(i => new ImageDetailsModel
                {
                    ImageId = i.Id,
                    OwnerName = i.Owner.Name,
                    GroupName = i.Group.Name,
                    IsMine = i.Owner.Id == userId
                });
            }
        }

        /// <summary>
        /// Gets the image details belonging to the given imageIds 
        /// </summary>
        /// <param name="userId">The user who executes the query</param>
        /// <param name="imageIds">A list containing the imageIds for which we want to get the details</param>
        /// <returns>A list containing the image details for the given ids</returns>
        public static List<ImageDetailsModel> GetImagesForIds(string userId, List<int> imageIds)
        {
            using (var ctx = new PiChatDbContext())
            {
                return ctx.Images.Include(i => i.Owner).Include(i => i.Group).Where(i => imageIds.Contains(i.Id)).MapToList(i => new ImageDetailsModel
                {
                    ImageId = i.Id,
                    OwnerName = i.Owner.Name,
                    GroupName = i.Group.Name,
                    IsMine = i.Owner.Id == userId
                });
            }
        }

        /// <summary>
        /// Add a new image to the specified group, returns the new image's id
        /// </summary>
        /// <param name="userId">The user who executes the query</param>
        /// <param name="groupId">Specifies the group</param>
        /// <param name="imagePath">Specifies the imagePath</param>
        /// <param name="description">Specifies a description for the image</param>
        /// <param name="uploadTime">specifies the time when the upload happened</param>
        /// <returns>The id of the new image</returns>
        public static int AddImage(string userId, int groupId, string imagePath, DateTime uploadTime, string description = "")
        {
            using (var ctx = new PiChatDbContext())
            {
                var membership = ctx.GroupMemberships.Find(groupId, userId);
                if (membership.Role < GroupMembershipRole.Member)
                    throw new PiChatNotAuthorizedException();

                var image = new Image { GroupId = groupId, OwnerId = userId, Path = imagePath, UploadTime = uploadTime, Description = description };
                ctx.Images.Add(image);
                ctx.SaveChanges();

                return image.Id;
            }
        }

        /// <summary>
        /// Remove the specified image
        /// </summary>
        /// <param name="imageId">Specifies the image</param>
        /// <param name="userId">Specifies the user who executes the query</param>
        /// <returns></returns>
        public static ImageModel RemoveImage(int imageId, string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                //TODO Admin is és csoport tulaj is tudjon törölni 

                var image = ctx.Images.Find(imageId);
                if (image == null)
                    throw new PiChatEntityNotFoundException();

                if (ctx.GroupMemberships.Find(image.GroupId, userId).Role >= GroupMembershipRole.Administrator || image.OwnerId==userId)
                {
                    ctx.Images.Remove(image);
                    ctx.SaveChanges();
                }
                else
                {
                    throw new PiChatNotAuthorizedException();

                }

                return image.MapTo(i => new ImageModel
                {
                    ImageId = i.Id
                });
            }
        }

        /// <summary>
        /// Change description of the specified image
        /// </summary>
        /// <param name="imageId">Specifies the image</param>
        /// <param name="userId">Specifies the user who executes the query</param>
        /// <param name="NewDescription">Specifies the description which we want to change the current description</param>
        /// <returns></returns>
        public static ImageModel ChangeDescription(string userId, int imageId, string newDescription)
        {
            using (var ctx = new PiChatDbContext())
            {


                var image = ctx.Images.Find(imageId);
                if (image == null)
                    throw new PiChatEntityNotFoundException();

                if (ctx.GroupMemberships.Find(image.GroupId, userId).Role >= GroupMembershipRole.Administrator || image.OwnerId == userId)
                {
                    image.Description = newDescription;
                    ctx.SaveChanges();
                }

                return image.MapTo(i => new ImageModel
                {
                    ImageId = i.Id
                });

            }
        }
    }
}
