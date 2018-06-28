using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PiChat.Bll.Exceptions
{
    [Serializable]
    public class PiChatEntityNotFoundException : Exception
    {
       

        public PiChatEntityNotFoundException(string message = "The requested entity could not be found.")
            : base(message)
        {
        }
    }
}
