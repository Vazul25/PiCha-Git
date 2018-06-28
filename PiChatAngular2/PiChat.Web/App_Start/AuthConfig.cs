using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using PiChat.Bll.EF;
using PiChat.Bll.Entitites;
using PiChat.Bll.Managers;
using System;

namespace PiChat.Web
{
    public partial class Startup
    {
        public static string PublicClientId { get; private set; } = "self";

        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; } = new OAuthAuthorizationServerOptions
        {
            TokenEndpointPath = new PathString("/Token"),
            Provider = new OAuthProvider(PublicClientId),
            AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
            AllowInsecureHttp = true
        };
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; } = new OAuthBearerAuthenticationOptions();

        public void ConfigureAuth(IAppBuilder app)
        {
            app.CreatePerOwinContext(() => new PiChatDbContext());
            app.CreatePerOwinContext<UserManager>(UserManager.Create);
            app.CreatePerOwinContext<SignInManager>(SignInManager.Create);
            
            app.UseOAuthAuthorizationServer(OAuthOptions);
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);
        }
    }
}