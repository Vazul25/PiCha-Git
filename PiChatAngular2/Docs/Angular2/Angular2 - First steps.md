# Angular2 - First steps (with ASP.NET MVC 4.5.2)

### 1. npm konfugurációs fájl hozzáadása: package.json
A projekt során az Angular 2 RC.4 verzióját használtuk,
a szakmai gyakorlat idején ez volt a legfrissebb
verzió, de azóta kijött az RC.5 is.

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
    "zone.js": "^0.6.12"
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

Ezt a négy fájlt másoltuk át a /Scripts/Angular2 mappába,
amelyek az Angular 2 működéséért felelnek.

### 4. TypeScript konfiguráció módosítása: .csproj fájl módosítása
Ez állítja be a TypeScript fordító tulajdonságait.

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
Ez a fájl felel azért, hogy bizonyos típusokat felismerjen
a fordító és az intellisense, pl. Promise, Map, stb.

Lehetőségek:
1. Nuget Package-ként: es6-shim.TypeScript.DefinitelyTyped
2. Kézi hozzáadás

### 6. Root komponens és az azt specifikáló TypeScript fájl hozzáadása
##### main.ts

Ez a fájl felel a fő komponens megadásáért és betöltéséért,
magyarul, az alkalmazás elindításáért. Azokat a modulokat is
betölthetjük vele, amelyeket alkalmazás szinten szeretnénk
használni, pl. egyes service-ek.

```typescript
import {bootstrap} from '@angular/platform-browser-dynamic'
import {App} from './app'

bootstrap(App);
```

##### app.ts

Ez a root komponens, amelynek alkomponensei is lehetnek.
A komponensek tartalmazzák egy oldal logikáját
(AngularJS-ben ez volt a Controller), mutatnak a 
html template-re, amely hozzájuk tartozik, és ahova az
adatokat bindolhatjuk.

```typescript
import {Component} from '@angular/core';

@Component({
    selector: 'pichat-app',
    template: '<h2>PiChat Web with Angular 2</h2>',
})

export class App { }
```

### 7. SystemJS konfugurációs fájl hozzáadása: systemjs.config.js
Ez a fájl felel a használt csomagok megtalálásáért és betöltéséért,
valamint megmondja, hogy az egyes csomagoknak mik a fő fájljai.
Enélkül egy modult sem ismer fel az alkalmazás.

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
Itt linkeljük be az app stílusfájljait, ill. a szükséges
JavaScript fájlokat, köztük azokat, amelyeket a 3. és a 7.
pont alatt hoztunk létre. Itt importáljuk a bootstrap fájlt
is, amely az appot indítja. A pichat-app tagbe ágyazzuk be az
alkalmazást, itt fog működni. Ez alatt komponensek egész sora
is be tud töltődni a html tagek faszerkezetéből adódóan.

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
1. A megfelelő package-név bevétele a package.json-ba
2. npm install vagy Restore packages
3. A package direktíváit és service-eit importálni kell minden olyan komponensben, ahol használni szeretnéd
4. Be kell venni a direktívákat a directives tömbbe. Ezt a komponensek minden egyes szintjén megteheted.
5. Be kell venni a service-eket a providers tömbbe. Singleton service esetén ezt a bootstrap fájlban kell egyszer megtenni.
6. A service-ek használatához a komponensek konstruktorában is példányosítani kell őket (elég a paraméterlistába bevenni őket).
7. A systemjs.config.js fájlban meg kell adni a package helyét, ill. a fő fájlját, különben az app nem tudja a csomagot betölteni.

Források:

[Angular 2 hivatalos oldala](https://angular.io/)

[Guide az Angular 2 és az MVC együttes használatához (német nyelvű)](https://squadwuschel.wordpress.com/2016/04/01/angular-2-hello-world-mit-visual-studio-2015-update-2-asp-net-4-und-typescript/)