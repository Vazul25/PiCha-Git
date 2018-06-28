using System;
 

namespace PiChat.Bll.Exceptions
{
    [Serializable]
    public class PiChatGenericException : Exception
    {


        public PiChatGenericException(string message)
            : base(message)
        {
        }
    }
}
