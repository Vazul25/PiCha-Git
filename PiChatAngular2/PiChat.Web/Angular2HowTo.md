# Angular2 to ASP.NET MVC 4.5.2

## Angular 2

### 1. npm konfugurációs fájl hozzáadása: package.json
```json
{
  "dependencies": {
    "@angular/common": "2.0.0-rc.4",
    "@angular/compiler": "2.0.0-rc.4",
    "@angular/core": "2.0.0-rc.4",
    "@angular/forms": "0.2.0",
    "@angular/http": "2.0.0-rc.4",
    "@angular/platform-browser": "2.0.0-rc.4",
    "@angular/platform-browser-dynamic": "2.0.0-rc.4",
    "@angular/router": "3.0.0-beta.1",
    "@angular/router-deprecated": "2.0.0-rc.2",
    "@angular/upgrade": "2.0.0-rc.4",
    "systemjs": "0.19.27",
    "core-js": "^2.4.0",
    "reflect-metadata": "^0.1.3",
    "rxjs": "5.0.0-beta.6",
    "zone.js": "^0.6.12",
    "gulp": "^3.9.1" 
  },
  "devDependencies": {
    "typings":"^1.0.4"
  }
}
```

### 2. csomagok helyreállítása
Lehetőségek:
1. package.json jobb klikk -> Restore Packages
2. command line -> package.json mappájában: npm install

### 3. Angular 2 számára szükséges JavaScript fájlok másolása és hozzáadása a projekthez
1. node_modules/core-js/client/shim.min.js
2. node_modules/zone.js/dist/zone.js
3. node_modules/reflect-metadata/Reflect.js
4. node_modules/systemjs/dist/system.src.js

### 4. TypeScript konfiguráció módosítása: .csproj fájl módosítása
```xml
<TypeScriptTarget>ES5</TypeScriptTarget>
<TypeScriptJSXEmit>None</TypeScriptJSXEmit>
<TypeScriptCompileOnSaveEnabled>True</TypeScriptCompileOnSaveEnabled>
<TypeScriptNoImplicitAny>False</TypeScriptNoImplicitAny>
<TypeScriptModuleKind>CommonJS</TypeScriptModuleKind>
<TypeScriptRemoveComments>False</TypeScriptRemoveComments>
<TypeScriptOutFile />
<TypeScriptOutDir />
<TypeScriptGeneratesDeclarations>False</TypeScriptGeneratesDeclarations>
<TypeScriptNoEmitOnError>True</TypeScriptNoEmitOnError>
<TypeScriptSourceMap>True</TypeScriptSourceMap>
<TypeScriptMapRoot />
<TypeScriptSourceRoot />
<TypeScriptExperimentalDecorators>True</TypeScriptExperimentalDecorators>
<TypeScriptEmitDecoratorMetadata>True</TypeScriptEmitDecoratorMetadata>
```

### 5. Típusdefiníciós fájl hozzáadása: es6-shim.d.ts
Lehetőségek:
1. Nuget Package-ként: es6-shim.TypeScript.DefinitelyTyped
2. Kézi hozzáadás

### 6. Root komponens és az azt specifikáló TypeScript fájl hozzáadása
1. main.ts
```typescript
import {bootstrap} from '@angular/platform-browser-dynamic'
import {App} from './app'

bootstrap(App);
```

2. app.ts
```typescript
import {Component} from '@angular/core';

@Component({
    selector: 'pichat-app',
    template: '<h2>PiChat Web with Angular 2</h2>',
})

export class App { }
```

### 7. SystemJS konfugurációs fájl hozzáadása: systemjs.config.js
```javascript
(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'ApplicationScripts': 'Application',
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        //Loading our App
        'ApplicationScripts': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
    };

    var ngPackageNames = [
      'common',
      'compiler',
      'core',
      'forms',
      'http',
      'platform-browser',
      'platform-browser-dynamic',
      'router',
      'router-deprecated',
      'upgrade',
    ];

    // Individual files (~300 requests):
    function packIndex(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
    }
    // Bundled (~40 requests):
    function packUmd(pkgName) {
        packages['@angular/' + pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
    }

    // Most environments should use UMD; some (Karma) need the individual index files
    var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
    // Add package entries for angular packages
    ngPackageNames.forEach(setPackageConfig);

    System.config({
        map: map,
        packages: packages
    });
})(this);

```

Szükséges módosítások:
1. Alkalmazáshoz elkészített saját script fájlok könyvtára: _map_ -> 'ApplicationScripts': '**_<könyvtár>_**'
2. A root komponenst specifikáló (_bootstrap()_ függyvényt tartalmazó) fájl megadása: _packages_ -> 'ApplicationScripts': { main: '**_<fájlnév>_**.js', defaultExtension: 'js' }

### 8. _Layout.cshtml fájl módosítása, scriptek beszúrása
```html
<html>
<head>
    <title>PiChat Web</title>

    <script src="~/Scripts/Angular2/shim.min.js"></script>
    <!-- 1. Load libraries -->
    <script src="~/Scripts/Angular2/zone.min.js"></script>
    <script src="~/Scripts/Angular2/Reflect.js"></script>
    <script src="~/Scripts/Angular2/system.src.js"></script>
    <script src="~/Scripts/Angular2/systemjs.config.js"></script>
    <script>
        System.import('Application/main').catch(console.error.bind(console));
    </script>
    
</head>
<body>
    <pichat-app>Loading...</pichat-app>
</body>
</html>
```

Szükséges módosítások:
1. A root komponenst specifikáló (_bootstrap()_ függyvényt tartalmazó) fájl megadása: System.import('Application/**_<fájlnév>_**')

### 9. További modulok használata
1. A megfelelő package-név bevétele a packages.json-ba
2. npm install vagy Restore packages
3. A package direktíváit és service-eit importálni kell minden olyan komponensben, ahol használni szeretnéd
4. Be kell venni a direktívákat a directives tömbbe. Ezt a komponensek minden egyes szintjén megteheted.
5. Be kell venni a service-eket a providers tömbbe. Ezt célszerű egyszer, a komponensek legfelső szintjén megtenni.
6. A systemjs.config.js fájlban meg kell adni a package helyét, ill. a fő fájlját, különben az app nem tudja a csomagot betölteni.

____
## Angular Material 2

### 1. A szükséges csomagok hozzáadása

Az alábbi csomagokkal egészítjük ki a "dependencies" property-t:

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
A csomagok listáját, illetve segítséget hozzájuk itt találsz: https://www.npmjs.com/%7Eangular2-material

### 2. SystemJS kiegészítése

A map változó felsorolásai közé be kell venni az Angular Material 2-t is,
hogy megtalálhassa a SystemJS ezt is, és betöltse, ha szükség van rá.
A végeredmény így fog kinézni a systemjs.config.js fájlban:

```javascript
var map = {
        'ApplicationScripts': 'Application', // 'dist',
        '@angular': 'node_modules/@angular',
        'rxjs': 'node_modules/rxjs',
        '@angular2-material': 'node_modules/@angular2-material'
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

Abban a komponensben, ahol használni szeretnéd a modulokat, importáld be őket a következő módon:

```typescript
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
```

A @Component dekorátor directives tulajdonságában is fel kell sorolni őket, hogy felismerje őket a fordító:

```typescript
directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES]
```
Ezután már csak használni kell a package-eket:
az adott komponenshez tartozó template-ben.

A direktíva példányok a directives tömbben nem öröklődnek
a komponensek között routinggal sem, csak azon a szinten
példányosítjuk őket a directives-ban, ahol tényleg használjuk őket.

Itt találsz segítséget a modulokhoz: https://www.npmjs.com/%7Eangular2-material

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

Abban a komponensbe, ahol használni szeretnéd az ikonokat,
a hozzájuk tartozó direktívákat kell beimportálni, a következő módon:

```typescript
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
    ...
    directives: [MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MdIcon],
    providers: [MdIconRegistry] 
```

Természetesen az is kell hozzá, hogy az icon csomagot felsorold
a Material csomagok között is a systemjs.config.js fájlban,
ahogy azt a 2. pontban már megtettük.
____
## Egyéb



### 1. [hidden] probléma
[hidden] nem működött nekünk
**<br />Megoldás:** 
1. css fájlhoz hozzáadni a következőt (nem ajánlott)
```css
[hidden] {
    display: none !important;
}
```
2. *ngIf használata [hidden] helyett (ajánlott)

### 2. Implicit any probléma
- _ng2-dropdown-menu.d.ts_ fájlban a következők módosítása szükséges (./node_modules/ng2-material-dropdown/src/typings mappán belül)
```typescript
    updatePosition(position: any): void;
    handleKeypress($event: Event): void;
```
____
## Http src direktíva
Ezt a direktívát képek biztonságos lekéréséhez használjuk, 
nem tesz mást mint a property bindingal átadott címre indítt egy http kérést,
a végeredményt egy blob-ba rakja, majd az src-tag értékét feltölti a blob url-jével

### Példa:
```html
<img [myHttpSrc]="'api/Image/GetImage/'+image.imageId" class="myimg" style="margin: auto;" src="" />
```
### Kód
```typescript
import {Directive, provide} from '@angular/core';
import {ElementRef} from    '@angular/core';
import {OnInit} from    '@angular/core';
import {BrowserXhr} from  "@angular/http";
import {CustomBrowserXhr} from "./CustomBrowserXhr"
import {HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, RequestOptions, Headers } from '@angular/http';
@Directive({
    selector: "[myHttpSrc]",
    providers: [HTTP_PROVIDERS, provide(BrowserXhr, { useClass: CustomBrowserXhr })],
    inputs: ['objectURL:myHttpSrc'] //alias hogy lehessen használni [myHttpSrc]="blabla" ként
})
export class HttpSrcDirective {
    objectURL: string;
   
    constructor(private http: Http, private el: ElementRef) {}
   
    ngOnInit(): any {
        let headers = new Headers();
        var options = new RequestOptions();
        options.headers = headers;
        headers.append("Authorization", 'Bearer ' + sessionStorage.getItem("token"));
        this.http.get(this.objectURL, options).toPromise()
            .then(resp => {
                var body = resp._body;
                var blob = new Blob([new Uint8Array(resp._body)], { type: resp.headers.get('Content-Type') });
                this.objectURL = URL.createObjectURL(blob);
                this.el.nativeElement.attributes.src.nodeValue = this.objectURL;
               
            }, (err) => {
                //console.log("hiba");
            })
    }


}



```
### 1. body privát probléma
- .node_modules\@angular\http\src\static_response.d.ts fájlban a következők módosítása szükséges  
```typescript
    public _body :any;
```

A probléma alapja, hogy az arraybuffer és a blob függvények egyike sincs implementálva ezért hozzá kell 
férnünk a bodyhoz ugyanis sokszor fordítási hibát, és müködésképtelenséget eredményez ha csak a text() et használjuk.
### 2. Nem lehet még állítani a response type-ot a headerben  
Jelenleg az angulár nem támogatja a headerben való response type megadását ezért meg kell kicsit hackelni a rendszert a működéshez.
Létre kell hozni egy customBrowserXhr osztályt amit a BrowserXhr ből származtatunk, és abban be tudjuk állítani a vissza érkezett üzenet response type-ját. 
Erre azért van szükség hogy a new Uint8Array() müködjön.
```typescript
import { Injectable } from '@angular/core';
import {BrowserXhr} from '@angular/http';  

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
    constructor() { 
        super();
    }
    build(): any {
        let xhr = super.build();
        xhr.responseType = 'arraybuffer';
        return <any>(xhr);
    }
}
```
### 3. Új http provider kell
 Ahhoz hogy felül tudjuk definiálni az eredeti http provider által használt browserXhr osztályt,
  muszály új példányt létrehozni , ezt az alábbi módon kell:
 ```typescript
import {BrowserXhr} from  "@angular/http";
import {CustomBrowserXhr} from "./CustomBrowserXhr"
import {HTTP_PROVIDERS} from '@angular/http';
@Directive({
...
providers: [HTTP_PROVIDERS, provide(BrowserXhr, { useClass: CustomBrowserXhr })]
})
 ```
Ha a HTTP_Providers injektálását elmúlasztjuk akkor nem fogunk hibát kapni, de nem történik meg a BrowserXhr felül definiálása,
 hanem az eredetit fogjuk tovább használni.
 
### 4. Binding problémák
Angular 2 ben expression-ökkel bindolhatunk direktívákra, így a "api/controller/action/{{Id}}" hívás futás idejü hibát fog dobni ami a string interpolációra panaszkodik,
 ezt úgy lehet megkerülni, hogy stringként füzzük össze a kérést
```html
<img [myHttpSrc]="'api/Image/GetImage/'+image.imageId">
 ```

### 5.Nincs még node atributom létrehozására szofisztikált módszer
Az üres src="" tagre azért van szükség, mert egyenlőre nem találtam olyan new atributum funkciót az element refen ami hiba nélkül jól megoldaná ezt a feladatot.