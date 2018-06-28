�ltal�nos .NET review
==

> A k�dban a *// REVIEW* stringre keresve tal�ltok tov�bbi �szrev�teleket.

- A kev�s k�d az pozit�vum, de az olvashatatlan nem. �rdemes �gy n�zni a k�dot, hogy a flow 
akkor is �tl�that� legyen, ha kicsit hosszabb a k�d, olvas�s n�lk�l is. A mut�ci�s felt�teleket jellemz�en 
nem �rjuk egy sorba (_GroupManager.GetGroupMembers_ if �ga), mert kicsivel t�bb k�dban ez 
k�nnyen el tud b�jni.
- *.Equals* gyakorlatilag hal�lfejes hiba. :( DB-ben nullra nem sz�ll el, mem�ri�ban meg
igen. ORM-n�l nem szabad felt�telezni, hogy ez �gy m�k�dik (persze igen), a lehet� legt�bb
k�l�nbs�get a nyelvek k�z�tt megpr�b�lja elfedni. Teh�t SQL-ben ez valid volna, C#-ban persze
nem az. Ha van egy entit�s, amiben sz�r�nk �s sz�r�nk az al�bbi m�don, az nagyon durv�n 
elsz�ll, pl�ne ha nincs felette _[Required]_ attrib�tum.
```c#
// Nem sz�ll el:
MyMethod(string param) => ctx.Kutyak.Where(k => k.Vau.Equals(param)).ToList();
// Elsz�ll, ha l�tezik olyan kutya, aminek null a Vau-ja:
MyMethod(string param) => ctx.Kutyak.ToList().Where(k => k.Vau.Equals(param)).ToList();
// Nem sz�ll el:
MyMethod(string param) => ctx.Kutyak.Where(k => k.Vau == param).ToList();
// Mivel minden k�dban elsz�ll vagy false, sosem lehet true, ha MyString sima string:
MyString.Equals(null)
```
- Id�vel szerintem mindenki megszokja, csak n�h�nyszor le kell �rni:
```c#
// Ebb�l:
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
- Az object initializereket lehet�leg t�rdelj�k, hogyha 3 vagy t�bb neves�tett property van 
benn�k.
- Figyelj�nk a megfelel� adatszerkezetek kiv�laszt�s�ra. Pl. HashSet-ben, Dictionary-ben kulcs
alapj�n O(1) a keres�s �s a t�rl�s.