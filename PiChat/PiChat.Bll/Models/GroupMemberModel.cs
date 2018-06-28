using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PiChat.Bll.Models
{
    public class GroupMemberModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public GroupMembershipRole Role { get; set; }
        public int GroupId { get; set; }
    }
}
