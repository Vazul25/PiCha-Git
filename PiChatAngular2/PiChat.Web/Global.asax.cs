using PiChat.Bll.EF;
using System.Web.Mvc;

namespace PiChat.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            using (var ctx = new PiChatDbContext())
            {
                ctx.Database.Initialize(true);
            }
        }
    }
}
