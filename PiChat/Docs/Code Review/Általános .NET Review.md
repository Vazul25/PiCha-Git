Általános .NET review
==

> A kódban a *// REVIEW* stringre keresve találtok további észrevételeket.

- A kevés kód az pozitívum, de az olvashatatlan nem. Érdemes úgy nézni a kódot, hogy a flow 
akkor is átlátható legyen, ha kicsit hosszabb a kód, olvasás nélkül is. A mutációs feltételeket jellemzõen 
nem írjuk egy sorba (_GroupManager.GetGroupMembers_ if ága), mert kicsivel több kódban ez 
könnyen el tud bújni.
- *.Equals* gyakorlatilag halálfejes hiba. :( DB-ben nullra nem száll el, memóriában meg
igen. ORM-nél nem szabad feltételezni, hogy ez így mûködik (persze igen), a lehetõ legtöbb
különbséget a nyelvek között megpróbálja elfedni. Tehát SQL-ben ez valid volna, C#-ban persze
nem az. Ha van egy entitás, amiben szûrünk és szûrünk az alábbi módon, az nagyon durván 
elszáll, pláne ha nincs felette _[Required]_ attribútum.
```c#
// Nem száll el:
MyMethod(string param) => ctx.Kutyak.Where(k => k.Vau.Equals(param)).ToList();
// Elszáll, ha létezik olyan kutya, aminek null a Vau-ja:
MyMethod(string param) => ctx.Kutyak.ToList().Where(k => k.Vau.Equals(param)).ToList();
// Nem száll el:
MyMethod(string param) => ctx.Kutyak.Where(k => k.Vau == param).ToList();
// Mivel minden kódban elszáll vagy false, sosem lehet true, ha MyString sima string:
MyString.Equals(null)
```
- Idõvel szerintem mindenki megszokja, csak néhányszor le kell írni:
```c#
// Ebbõl:
bool MyMethod(string param)
{
    if (param == "valami")
        return true;
    else
        return false;
}
// Ez:
bool MyAwesomeMethod(string param) => param == "valami";
```
- .FirstOrDefault(...).Valami -> Exception.
- Az object initializereket lehetõleg tördeljük, hogyha 3 vagy több nevesített property van 
bennük.
- Figyeljünk a megfelelõ adatszerkezetek kiválasztására. Pl. HashSet-ben, Dictionary-ben kulcs
alapján O(1) a keresés és a törlés.