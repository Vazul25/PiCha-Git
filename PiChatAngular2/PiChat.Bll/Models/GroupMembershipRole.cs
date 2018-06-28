using System;

namespace PiChat.Bll.Models
{
    // REVIEW: érdemes átgondolni, hogy használjunk-e flag-eket, mert nekem ez nagyon úgy tűnik, hogy halmozható szerepköröket jelez. 
    // A Pending viszont nem feltétlenül egy Role, hanem egy konkrét membership állapota. Tehát az nem ebben az enumban van, hanem mellette egy boolean érték.
    public enum GroupMembershipRole
    {
        NotMember = 1,
        Pending = 2,
        Member = 3,
        Administrator = 4,
        Owner = 5
    };
}
