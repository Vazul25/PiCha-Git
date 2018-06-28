namespace PiChat.Bll.Models
{
    public class GroupModel
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string OwnerName { get; set; }

        public string Description { get; set; }

        public GroupMembershipRole Role { get; set; }

        public bool IsPrivate { get; set; }

        public int PicturesCount { get; set; }

        public int MembersCount { get; set; }
    }
}