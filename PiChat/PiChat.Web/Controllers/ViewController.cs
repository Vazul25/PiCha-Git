using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PiChat.Web.Controllers
{
    /// <summary>
    /// Handles the returning of partial views
    /// </summary>
    [Authorize]
    public class ViewController : Controller
    {
        [AllowAnonymous]
        public ActionResult Login()
        {
            return PartialView();
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return PartialView();
        }

        [AllowAnonymous]
        public ActionResult LanguageSelect()
        {
            return PartialView();
        }

        public ActionResult Home()
        {
            return PartialView();
        }

        public ActionResult Images()
        {
            return PartialView();
        }

        public ActionResult Groups()
        {
            return PartialView();
        }

        public ActionResult UploadImages()
        {
            return PartialView();
        }

        public ActionResult Profile()
        {
            return PartialView();
        }

        public ActionResult ImageChangeDescriptionDialog()
        {
            return PartialView();
        }

        public ActionResult GroupChangeDescriptionDialog()
        {
            return PartialView();
        }

        public ActionResult GroupChangeNameDialog()
        {
            return PartialView();
        }

        public ActionResult GroupCreateDialog()
        {
            return PartialView();
        }

        public ActionResult ProfileChangeNameDialog()
        {
            return PartialView();
        }

        public ActionResult ProfileChangePasswordDialog()
        {
            return PartialView();
        }
        public ActionResult GroupMemberList()
        {
            return PartialView();
        }
    }
}