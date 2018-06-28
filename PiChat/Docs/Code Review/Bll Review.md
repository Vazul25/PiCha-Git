Bll review
==

DB
--

- A DbContext-nek felesleges 2 konstruktort is csin�lni, ha �gyis csak az egyiket haszn�ljuk
mi, a m�sik tartalm�t �t lehet tenni, �s ha sz�ks�ges lesz az overload, akkor l�tre lehet
hozni.
**<br />Igaz, nem kell mindkett�. --P�ter**
- A GroupMembershipbe mi�rt nem j�, ha van mesters�ges kulcs (GroupMembershipId) mez�?
**<br />Adatb�zis nem kezeli kulcsk�nt ami miatt nincs rajta index �s tov�bbi gyors�t�st el�seg�t� adatb�zis �ltal gener�lt dolgok, de ha nem lenne akkor ki k�ne k�ldeni a userId-t ami nem annyira szerencs�s dolog elvileg --vazul**
- D�tumkezel�sn�l mi�rt nem j�, ha DateTime.Now-t haszn�lunk DB-be ment�skor?
**<br />T�n mert az server id� lesz �s nem local  --vazul <br />Annak a g�pnek az ideje lesz, amin a szerver fut. (Cser�lve Utc-re.) --P�ter**
- Az entity-kben figyelni kell a string property-ket. Ha nincs felette korl�toz� attrib�tum
(a User.Name ilyen), akkor NVARCHAR(max)-os lesz a mez�, �s ha abban keres�nk (sz�r�nk,
rendez�nk), akkor nagyon lass� lesz, mert nem tud hat�konyan keresni benne. A 
StringLength(max) vagy StringLength(min, max) attrib�tummal lehet intervallumra korl�tozni 
a hosszt, az sokat seg�thet.
<br />Ugyan�gy figyelni kell, hogy DB-ben a rekord maxim�lis m�rete szabv�nyosan 8kB lehet.
Az NVARCHAR(max)-os mez�k ellenben csak egy referenci�t adnak hozz�, teh�t nem n�velik 
drasztikusan (egy pointernyivel) a rekord m�ret�t, viszont plusz egy indirekci�t tesznek be.
Ha string m�retet adunk meg, mondjuk StringLength(2000)-t, akkor viszont a rekordban mag�ban
fog t�rol�dni, viszont ezzel vigy�zni kell, nehogy �tl�pje a rekord m�retkorl�tj�t.
**<br />V�gigvezetve --P�ter.**
- �n az attrib�tumos megold�st prefer�lom, �rveket v�rok a fluent mellett.
**<br />Csup�n megszok�s. -- P�ter**
- Hi�nyoznak az indexek azokr�l a mez�kr�l, amikben keres�nk, sz�r�nk, rendez�nk.
**<br />Hozz�adva. --P�ter**

Infrastrukt�ra
--

- A NuGet package-ekre �s referenci�kra fontos odafigyelni. 
A Bll hivatkozik a Newtonsoft.JSON 4.5-re. A Web hivatkozik a Newtonsoft.JSON 6-ra. (Am�gy 
van 8-as m�r). A Newtonsoft.JSON.dll-b�l csak egyet tudunk bet�lteni. Mi t�rt�nik, ha a Web 
hivatkozik a Bll-re?
**<br />�jabbat h�zza be �s megeshet, hogy visszafel� nem kompatibilis. (F�gg�s�gk�nt lett beh�zva szerintem, �s elker�lte a figyelm�nket.) -- P�ter**