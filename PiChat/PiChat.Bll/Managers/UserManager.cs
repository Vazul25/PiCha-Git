using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using PiChat.Bll.EF;
using PiChat.Bll.Entitites;
using PiChat.Bll.Models;
using System;
using System.Linq;

namespace PiChat.Bll.Managers
{
    public class UserManager : UserManager<User>
    {
        public UserManager(IUserStore<User> store)
            : base(store)
        {
        }

        public static UserManager Create(IdentityFactoryOptions<UserManager> options, IOwinContext context)
        {
            var manager = new UserManager(new UserStore<User>(context.Get<PiChatDbContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<User>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };

            // Configure user lockout defaults
            manager.UserLockoutEnabledByDefault = true;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<User>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }

        /// <summary>
        /// Gets the profile data of the user
        /// </summary>
        /// <param name="userId">Specifies which users profile data do we want</param>
        /// <returns>Profile model containing the data for the view</returns>
        public ProfileModel GetUserProfile(string userId)
        {
            using (var ctx = new PiChatDbContext())
            {
                return ctx.Users.Where(u => u.Id == userId).Select(u => new ProfileModel { Email = u.Email, Name = u.Name }).First();
            }
        }

        /// <summary>
        /// Changes the name of the user
        /// </summary>
        /// <param name="userId">Specifies which users name we want to change</param>
        /// <param name="newName">Specifies the new name we want to change the old name to</param>
        public void ChangeName(string userId, string newName)
        {
            using (var ctx = new PiChatDbContext())
            {
                var user = ctx.Users.Where(u => u.Id == userId).Select(u => u).First();
                user.Name = newName;
                ctx.SaveChanges();
            }
        }
    }
}
