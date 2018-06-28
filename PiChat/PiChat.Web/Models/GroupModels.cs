using System.ComponentModel.DataAnnotations;

namespace PiChat.Web.Models
{
    public class CreateGroupModel
    {
        public string Name { get; set; }
        public bool IsPrivate { get; set; }
    }

    public class JoinGroupModel
    {
        public int GroupId { get; set; }
    }

    public class LeaveGroupModel
    {
        public int GroupId { get; set; }
    }

    public class RenameGroupModel
    {
        public int GroupId { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "The name can be 1000 character long.")]
        public string NewName { get; set; }
    }

    public class ChangeGroupDescriptionModel
    {
        public int GroupId { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "The description can be 1000 character long.")]
        public string NewDescription { get; set; }
    }
}