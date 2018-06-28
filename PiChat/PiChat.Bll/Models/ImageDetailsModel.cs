using System;

namespace PiChat.Bll.Models
{
    public class ImageDetailsModel
    {
        public int ImageId { get; set; }

        public string Description { get; set; }

        public DateTime UploadTime { get; set; }

        public string OwnerName { get; set; }

        public string GroupName { get; set; }

        public bool IsMine { get; set; }
    }
}