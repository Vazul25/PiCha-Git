namespace PiChat.Bll.EF
{
    using Entitites;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;

    public class PiChatDbContext : IdentityDbContext<User>
    {
        public PiChatDbContext()
            : base("PiChatDbContext")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;

#if DEBUG
            Database.Log = s => System.Diagnostics.Debug.WriteLine(s);
            Database.SetInitializer(new PiChatDbContextInitializer());
#endif
        }

        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<GroupMembership> GroupMemberships { get; set; }
        public virtual DbSet<Image> Images { get; set; }
    }
}