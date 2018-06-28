Általános .NET review
==

> A kódban a *// REVIEW* stringre keresve találtok további észrevételeket.

- Az _OWIN_ Startup osztálya singletonként viselkedik (valójában nem, de összesen csak egy 
példány fog belõle létrejönni), de ezt semmi nem garantálja (nincs statikus accessor hozzá).
Az OWIN framework példányosítja app induláskor. Az _App_Start/AuthConfig.cs_ fájlban
statikus változóban van az _OAuthBearerOptions_ property, viszont ezt minden Startup példány
újra létrehozza egyszer. Mi ezzel a probléma (nem a konkrét esetben, hanem hogy statikus
változót állít egy példány)?
