using System.ComponentModel.DataAnnotations;

namespace PiChat.Web.Models
{
    public class ChangeDescriptionModel
    {
        public int ImageId { get; set; }

        [Required]
        [StringLength(1000, ErrorMessage = "The description can be 1000 character long.")]
        public string NewDescription { get; set; }
    }
}