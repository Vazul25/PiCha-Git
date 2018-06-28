Bll review
==

DB
--

- A DbContext-nek felesleges 2 konstruktort is csinálni, ha úgyis csak az egyiket használjuk
mi, a másik tartalmát át lehet tenni, és ha szükséges lesz az overload, akkor létre lehet
hozni.
**<br />Igaz, nem kell mindkettõ. --Péter**
- A GroupMembershipbe miért nem jó, ha van mesterséges kulcs (GroupMembershipId) mezõ?
**<br />Adatbázis nem kezeli kulcsként ami miatt nincs rajta index és további gyorsítást elõsegítõ adatbázis által generált dolgok, de ha nem lenne akkor ki kéne küldeni a userId-t ami nem annyira szerencsés dolog elvileg --vazul**
- Dátumkezelésnél miért nem jó, ha DateTime.Now-t használunk DB-be mentéskor?
**<br />Tán mert az server idõ lesz és nem local  --vazul <br />Annak a gépnek az ideje lesz, amin a szerver fut. (Cserélve Utc-re.) --Péter**
- Az entity-kben figyelni kell a string property-ket. Ha nincs felette korlátozó attribútum
(a User.Name ilyen), akkor NVARCHAR(max)-os lesz a mezõ, és ha abban keresünk (szûrünk,
rendezünk), akkor nagyon lassú lesz, mert nem tud hatékonyan keresni benne. A 
StringLength(max) vagy StringLength(min, max) attribútummal lehet intervallumra korlátozni 
a hosszt, az sokat segíthet.
<br />Ugyanígy figyelni kell, hogy DB-ben a rekord maximális mérete szabványosan 8kB lehet.
Az NVARCHAR(max)-os mezõk ellenben csak egy referenciát adnak hozzá, tehát nem növelik 
drasztikusan (egy pointernyivel) a rekord méretét, viszont plusz egy indirekciót tesznek be.
Ha string méretet adunk meg, mondjuk StringLength(2000)-t, akkor viszont a rekordban magában
fog tárolódni, viszont ezzel vigyázni kell, nehogy átlépje a rekord méretkorlátját.
**<br />Végigvezetve --Péter.**
- Én az attribútumos megoldást preferálom, érveket várok a fluent mellett.
**<br />Csupán megszokás. -- Péter**
- Hiányoznak az indexek azokról a mezõkrõl, amikben keresünk, szûrünk, rendezünk.
**<br />Hozzáadva. --Péter**

Infrastruktúra
--

- A NuGet package-ekre és referenciákra fontos odafigyelni. 
A Bll hivatkozik a Newtonsoft.JSON 4.5-re. A Web hivatkozik a Newtonsoft.JSON 6-ra. (Amúgy 
van 8-as már). A Newtonsoft.JSON.dll-bõl csak egyet tudunk betölteni. Mi történik, ha a Web 
hivatkozik a Bll-re?
**<br />Újabbat húzza be és megeshet, hogy visszafelé nem kompatibilis. (Függéségként lett behúzva szerintem, és elkerülte a figyelmünket.) -- Péter**