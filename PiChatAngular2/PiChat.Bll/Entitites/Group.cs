using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PiChat.Bll.Entitites
{
    public class Group
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(1000)]
        [Index]
        public string Name { get; set; }
        
        [StringLength(1000)]
        [Index]
        public string Description { get; set; }

        public string OwnerId { get; set; }

        [ForeignKey("OwnerId")]
        public virtual User Owner { get; set; }

        public bool IsPrivate { get; set; }

        public ICollection<GroupMembership> Members { get; set; }

        public ICollection<Image> Images { get; set; }

    }
}
