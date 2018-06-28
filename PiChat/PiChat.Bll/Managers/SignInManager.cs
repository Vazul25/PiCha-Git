using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using PiChat.Bll.Entitites;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PiChat.Bll.Managers
{
    /// <summary>
    /// Built in account manager
    /// </summary>
    public class SignInManager : SignInManager<User, string>
    {
        public SignInManager(UserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(User user)
        {
            return user.GenerateUserIdentityAsync((UserManager)UserManager, DefaultAuthenticationTypes.ApplicationCookie);
        }

        public static SignInManager Create(IdentityFactoryOptions<SignInManager> options, IOwinContext context)
        {
            return new SignInManager(context.GetUserManager<UserManager>(), context.Authentication);
        }
    }
}
