# Angular Material 2

### 1. A szükséges csomagok hozzáadása

A projekt során az Angular Material 2 alpha-6 verzióját használtuk.
Először például az alábbi csomagokkal egészítjük ki a "dependencies" property-t a package.json-ban:

```json
    "@angular2-material/button": "^2.0.0-alpha.6",
    "@angular2-material/card": "^2.0.0-alpha.6",
    "@angular2-material/checkbox": "^2.0.0-alpha.6",
    "@angular2-material/core": "^2.0.0-alpha.6",
    "@angular2-material/grid-list": "^2.0.0-alpha.6",
    "@angular2-material/icon": "^2.0.0-alpha.6",
    "@angular2-material/input": "^2.0.0-alpha.6",
    "@angular2-material/tabs": "^2.0.0-alpha.6",
    "@angular2-material/toolbar": "^2.0.0-alpha.6",
```

A core kötelező, a többi rá épül. A többi csomag közül azonban szabadon választhatod ki azt, ami neked kell.
A csomagok listáját, illetve segítséget hozzájuk itt találsz: [Material 2](https://www.npmjs.com/%7Eangular2-material)

### 2. SystemJS kiegészítése

A map változó felsorolásai közé be kell venni az Angular Material 2-t is,
hogy megtalálhassa a SystemJS ezt is, és betöltse, ha szükség van rá.
Ez így fog kinézni a systemjs.config.js fájlban:

```javascript
var map = {
        ...,
        '@angular2-material': 'node_modules/@angular2-material',
        ...
    };
```

Ezeket az új modulokat fel is kell dolgozni valahogy. Össze kell szedni őket,
majd megmondani, hogy mik a fő fájlaik. A systemjs.config.js-ben
az ngPackageNames változóba tesszük a csomagok neveit:

```javascript
const materialPkgs = [
      'core',
      'button',
      'card',
      'checkbox',
      'grid-list',
      'icon',
      'input',
      'tabs',
      'toolbar'
    ]
```

A System.config kifejezés előtt pedig a fő fájlokat állítjuk be nekik:

```javascript
materialPkgs.forEach((pkg) => {
    packages[`@angular2-material/${pkg}`] = { main: `${pkg}.js` };
})
```

### 3. A direktívák importálása

A core-t sehol sem kell importálni.
Azokban a komponensekben, ahol használni szeretnéd
a többi modult, importáld be őket a következő módon:

```typescript
...,
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
...
```

A @Component dekorátor directives tulajdonságában is fel kell sorolni őket, hogy felismerje őket a fordító:

```typescript
directives: [..., MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, ...]
```
Ezután már csak használni kell a package-eket:
az adott komponenshez tartozó template-ben.

Itt találsz segítséget a modulokhoz: [Material 2](https://www.npmjs.com/%7Eangular2-material)

### 4. Ikonok

A _Layout.cshtml-ben/BoundleConfig-ban be kell linkelni az ikonokat tartalmazó css fájlt:
```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

A main.ts-ben a HTTP_PROVIDERS-t is be kell include-olni:

```typescript
import { HTTP_PROVIDERS } from '@angular/http';
...
bootstrap(MyAppComponent, [
    HTTP_PROVIDERS
]); 
```

Abba a komponensbe, ahol használni szeretnéd az ikonokat,
a hozzájuk tartozó direktívákat kell importálni, a következő módon:

```typescript
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
    ...
    directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MdIcon],
    providers: [MdIconRegistry] 
```

Természetesen az is kell hozzá, hogy az icon csomagot felsorold
a Material csomagok között is a systemjs.config.js fájlban,
ahogy azt a 2. pontban már megtettük.

### 5. Formok

Az Angular 2 fejlesztői új form modulokat fejlesztettek,
és ezt kell használni az Angular Material 2-höz is,
különben nem működnek az inputok.

Ehhez telepíteni kell a @angular/forms csomag
0.2.0. verzióját.

```json
"@angular/forms": "0.2.0",
```

A main.ts-ben le kell kapcsolni a régi form direktívákat,
majd bekapcsolni az újakat a következőképpen:

```typescript
import {disableDeprecatedForms, provideForms} from '@angular/forms'; 

bootstrap(MyAppComponent, [
  disableDeprecatedForms(),
  provideForms()
]);
```

Az összes formmal kapcsolatos modult az új
@angular/forms csomagból kell importálni, mert
az @angular/common csomagból való importálásuk
hibát fog okozni.

Az RC.5 kiadásakor azt írták az Angular 2 fejlesztői
a weboldalukon, hogy a következő RC-ből törölni fogják
az összes deprecated modult, így a későbbiekben
ezeket a lépéseket nem kell majd megtenni.

Forrás: [Material2 GitHub](https://github.com/angular/material2/blob/a4c9f1d78d0149c04232891f0dbf5feb332f155c/GETTING_STARTED.md) (2016.08.12.)