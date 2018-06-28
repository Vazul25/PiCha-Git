using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PiChat.Bll.Exceptions
{
    [Serializable]
    public class PiChatNotAuthorizedException : Exception
    {
        public PiChatNotAuthorizedException(string message="You do not have authority for this operation")
            : base(message)
        {
        }
    }
}
