# Angular2 - ng2-Modules

Ebben a dokumentumban foglalkozunk azokkal az Angular 2
package-ekkel, amelyek problémásak voltak, és hogy hogyan
oldottuk meg ezeket a problémákat.

## 1. ng2-material-dropdown

Azért szedtük le, mert az Angular Material 2 alpha.6 verziója
még nem tartalmazott beépített drop-down listet.
Az ng2-material-dropdown package felel azért, hogy
létrehozzon egy ilyet az Angular 2 appunkban.

A cucc innen szedhetõ le: [https://github.com/Gbuomprisco/ng2-material-dropdown](https://github.com/Gbuomprisco/ng2-material-dropdown)

A lényeg, hogy 2016.08.12-én is még "Work in progress"
állapotban van, és nagyon bugos, és nem teljesen úgy mûködik,
mint ahogy egy normális drop-down listnek mûködnie kellene.

A demo alapján megcsináltuk a szükséges drop-down listet,
*ngForral, és amikor megnyomtuk az oldalon a gombot,
akkor a lista nem a gomb alatt közvetlenül, hanem az
oldalnak majdnem az alján nyílt meg, messze a gombtól.

Ehhez a menü konténerének a pozícióját kellett állítani.

```css
.ng2-dropdown-menu-container {
    position: absolute !important;
    top: 320px !important;
}
```
A fixed nem lett volna jó, mert a képernyõn ugyanott marad,
görgetés után is. A relative a legközelebbi pozicionált
elemhez képest helyezi el, azonban ez a menü nem a gombhoz
van a legközelebb, hanem a DOM alján van körülbelül az
eredetileg betöltött HTML-ben.

## 2. autocomplete

Egy olyan StackOverflow threadben, ahol az autocomplete
implementálása Angular 2 alatt volt a téma, kapásból
3 package-et is ajánlottak:
[https://www.npmjs.com/package/ng2-completer](https://www.npmjs.com/package/ng2-completer)

[https://www.npmjs.com/package/ng2-auto-complete](https://www.npmjs.com/package/ng2-auto-complete)

[https://www.npmjs.com/package/ng2-typeahead](https://www.npmjs.com/package/ng2-typeahead)

Végül egy negyedik megoldás váltotta be a reményeinket.

