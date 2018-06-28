using PiChat.Bll.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PiChat.Bll.Entitites
{
    public class GroupMembership
    {
        [Key, Column(Order = 1)]
        public int GroupId { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }

        [Key, Column(Order = 2)]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Index(IsUnique = true)]
        public int GroupMembershipId { get; set; }

        public GroupMembershipRole Role { get; set; }
    }
}
