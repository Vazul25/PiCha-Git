# Angular2 - ng2-Modules

Ebben a dokumentumban foglalkozunk azokkal az Angular 2
package-ekkel, amelyek probl�m�sak voltak, �s hogy hogyan
oldottuk meg ezeket a probl�m�kat.

## 1. ng2-material-dropdown

Az�rt szedt�k le, mert az Angular Material 2 alpha.6 verzi�ja
m�g nem tartalmazott be�p�tett drop-down listet.
Az ng2-material-dropdown package felel az�rt, hogy
l�trehozzon egy ilyet az Angular 2 appunkban.

A cucc innen szedhet� le: [https://github.com/Gbuomprisco/ng2-material-dropdown](https://github.com/Gbuomprisco/ng2-material-dropdown)

A l�nyeg, hogy 2016.08.12-�n is m�g "Work in progress"
�llapotban van, �s nagyon bugos, �s nem teljesen �gy m�k�dik,
mint ahogy egy norm�lis drop-down listnek m�k�dnie kellene.

A demo alapj�n megcsin�ltuk a sz�ks�ges drop-down listet,
*ngForral, �s amikor megnyomtuk az oldalon a gombot,
akkor a lista nem a gomb alatt k�zvetlen�l, hanem az
oldalnak majdnem az alj�n ny�lt meg, messze a gombt�l.

Ehhez a men� kont�ner�nek a poz�ci�j�t kellett �ll�tani.

```css
.ng2-dropdown-menu-container {
    position: absolute !important;
    top: 320px !important;
}
```
A fixed nem lett volna j�, mert a k�perny�n ugyanott marad,
g�rget�s ut�n is. A relative a legk�zelebbi pozicion�lt
elemhez k�pest helyezi el, azonban ez a men� nem a gombhoz
van a legk�zelebb, hanem a DOM alj�n van k�r�lbel�l az
eredetileg bet�lt�tt HTML-ben.

## 2. autocomplete

Egy olyan StackOverflow threadben, ahol az autocomplete
implement�l�sa Angular 2 alatt volt a t�ma, kap�sb�l
3 package-et is aj�nlottak:
[https://www.npmjs.com/package/ng2-completer](https://www.npmjs.com/package/ng2-completer)

[https://www.npmjs.com/package/ng2-auto-complete](https://www.npmjs.com/package/ng2-auto-complete)

[https://www.npmjs.com/package/ng2-typeahead](https://www.npmjs.com/package/ng2-typeahead)

V�g�l egy negyedik megold�s v�ltotta be a rem�nyeinket.

