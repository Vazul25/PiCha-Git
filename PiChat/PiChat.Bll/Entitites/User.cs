using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PiChat.Bll.Entitites
{
    public class User : IdentityUser
    {
        [Required]
        [StringLength(1000)]
        public string Name { get; set; }

        public ICollection<Image> UploadedImages { get; set; }

        public ICollection<Group> OwnedGroups { get; set; }

        public ICollection<GroupMembership> Groups { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager, string authenticationType)
        {
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            return userIdentity;
        }
    }
}
