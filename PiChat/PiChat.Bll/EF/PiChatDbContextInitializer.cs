using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using PiChat.Bll.Entitites;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace PiChat.Bll.EF
{
    public class PiChatDbContextInitializer : DropCreateDatabaseIfModelChanges<PiChatDbContext>
    {
        protected override void Seed(PiChatDbContext context)
        {
            CreateTestUsers(context);
            CreateTestData(context);
        }

        private void CreateTestUsers(PiChatDbContext context)
        {
            var userManager = new UserManager<User>(new UserStore<User>(context));

            var testUser1 = new User()
            {
                UserName = "testuser1@pichat.hu",
                Email = "testuser1@pichat.hu",
                Name = "Test User 1"
            };

            var testUser2 = new User()
            {
                UserName = "testuser2@pichat.hu",
                Email = "testuser2@pichat.hu",
                Name = "Test User 2"
            };

            var testUser3 = new User()
            {
                UserName = "testuser3@pichat.hu",
                Email = "testuser3@pichat.hu",
                Name = "Test User 3"
            };
            for (int i = 4; i < 50; i++)
            {
                var testUseri = new User()
                {
                    UserName = String.Format("testuser{0}@pichat.hu", i),
                    Email = String.Format("testuser{0}@pichat.hu", i),
                    Name = String.Format("Test User {0}", i)
                };
                userManager.Create(testUseri);
            }

            userManager.Create(testUser1, "Password1");
            userManager.Create(testUser2, "Password1");
            userManager.Create(testUser3, "Password1");
        }

        private void CreateTestData(PiChatDbContext context)
        {
            var users = context.Users.ToList();
            var user1 = users.Single(o => o.UserName == "testuser1@pichat.hu");

            var group1 = new Group
            {
                OwnerId = user1.Id,
                Name = "Test Group 1",
                Description = "It's the Test Group 1, contains beautiful pics."
            };

            context.Groups.Add(group1);
            context.SaveChanges();


            foreach (var user in users)
            {
                var membershipi = new GroupMembership
                {
                    UserId = user.Id,
                    GroupId = group1.Id,
                    Role = user.Id == user1.Id ? Models.GroupMembershipRole.Owner : Models.GroupMembershipRole.Member
                };
                context.GroupMemberships.Add(membershipi);
            }
            //var membership1 = new GroupMembership
            //{
            //    UserId = user1.Id,
            //    GroupId = group1.Id,
            //    Role = Models.GroupMembershipRole.Owner
            //};

            //context.GroupMemberships.Add(membership1);
            context.SaveChanges();

            var image1 = new Image
            {
                OwnerId = user1.Id,
                GroupId = group1.Id,
                Path = "TestPicture1.jpg",
                UploadTime = DateTime.UtcNow,
                Description = "A bridge in twilight, in colorful lights"
            };

            var image2 = new Image
            {
                OwnerId = user1.Id,
                GroupId = group1.Id,
                Path = "TestPicture2.jpg",
                UploadTime = DateTime.UtcNow.AddMinutes(1),
                Description = "People at the beach in a big town, with a huge wheel"
            };

            var image3 = new Image
            {
                OwnerId = user1.Id,
                GroupId = group1.Id,
                Path = "TestPicture3.jpg",
                UploadTime = DateTime.UtcNow.AddMinutes(2),
                Description = "A road by a lake, with mountains"
            };

            var image4 = new Image
            {
                OwnerId = user1.Id,
                GroupId = group1.Id,
                Path = "TestPicture4.jpg",
                UploadTime = DateTime.UtcNow.AddMinutes(3),
                Description = "A beautiful place with hills"
            };

            group1.Images = new List<Image>() { image1, image2, image3, image4 };
            context.SaveChanges();
        }
    }
}
