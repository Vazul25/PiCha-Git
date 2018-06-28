# Angular2 - Translate

(forrás: [https://github.com/ocombe/ng2-translate](https://github.com/ocombe/ng2-translate))

### 1. Telepítés
1. Adjuk hozzá a _"ng2-translate": "^2.2.2"_ sort a _package.json_ fájlhoz és npm install / restore packages opciók valamelyikével telepítsük a csomagot
2. Kézzel a következő parancs végrehajtásával:
```sh
npm install ng2-translate --save
```

### 2. systemjs.config.js konfigurációs fájl módosítása
```javascript
var map = {
        ...
        'ng2-translate': 'node_modules/ng2-translate',
        ...
    };

var packages = {
        ...
        'ng2-translate': { defaultExtension: 'js' },
        ...
    };
```

### 3. Konfiguráció a bootstrap fájlban
```typescript
import { TRANSLATE_PROVIDERS, TranslateService, TranslateLoader, MissingTranslationHandler } from 'ng2-translate/ng2-translate';

...

bootstrap(App, [
    {
        provide: TranslateLoader,
        useFactory: (http: Http) => new CustomTranslateLoader(http),
        deps: [Http]
    },
    {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler
    },
    TranslateService
    ...
]);
```
<br/>

- Angular2 translate (2016.08.12.-n) csak statikus json szótár fájl betöltését támogatja. Ha másfajta betöltési módszerre van szükség, akkor saját TranslateLoader-t kell használni, ami a betöltést elvégzi.
Példa: szótár letöltése Http-n keresztül
```typescript
import { Http, Response } from '@angular/http';
import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Observable';

export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: Http) {
    }

    private extractData(res: Response) {
        let data = res.json();
        return (data || {});
    }

    getTranslation(lang: string): Observable<any> {
        return this.http.get("/api/Translation/GetTranslation?lang=" + lang).map(this.extractData);
    }
}
```
<br/>

- Lehetőség van egyedi hiányzó kulcs kezelő megadására is, ezt saját MissingTranslationHandler létrehozásával lehet megtenni.
Példa:
```typescript
import { MissingTranslationHandler } from 'ng2-translate/ng2-translate';

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(key: string) {
        return '#MissingTranslation#';
    }
}
```
<br/>

- A bootstrap-ban _TranslateService_-t kell használni és nem _TRANSLATE_PROVIDERS_-t, mert az utóbbi alapértelmezetten egy statikus fájlbetöltőt használ.
- A _TranslateService_ azért kell megadni, hogy Singleton-ként tudjuk használni az alkalmazásban. (Ezért a komponenseknél sem kell provide-ban megadni.)


### 4. Alapbeállítások
Az alkalmazás indulásakor meg kell adni, hogy milyen nyelvet akarunk használni. (Be lehet állítani alapértelmezett nyelvet is arra az esetre, ha a kiválasztott nyelvhez nem található fordítás.)

```typescript
export class App implements OnInit {
    constructor(private translateService: TranslateService, ...) {
        translateService.setDefaultLang('en');
        this.translateService.use('en');
    }

    ngOnInit() {
    }
}
```
<br />

- A .setDefaultLang('en') függvény állítja be az alapértelmezett nyelvet.
- A .use('en') függvény betölti a megadott nyelvet. Ha még nem történt betöltés, akkor az aktuális _TranslateLoader_-t használva betölti azt. (Az alkalmazás futása során egy nyelv csak egyetlen alkalommal kerül betöltésre.)

### 5. Használat
- HTML oldalon belül
```html
<p>{{ 'name' | translate }}</p>
```
<br />

- Kódban történő fordításra kétféle lehetőség adott
  - _.get('kulcs'): Observable_ -> akkor érdemes használni, amikor még nem biztos, hogy az adott pillanatban rendelkezésre áll a szótár (pl. még letöltés alatt áll). Ennél a függvénynél várakozik a szótár betöltődésére és csak utána próbálja a kulcshoz tartozó fodítást megkeresni.
  - _.instant('kulcs'): string_ -> akkor érdemes használni, ha már biztosan rendelkezésre áll a szótár. Nem vár betöltődésre, azonnal keres.
```typescript
translate.get('name').toPromise().then((translation: any) => { 
    console.log("Translate test: name -> ", translation); 
});

console.log("Translate test: name -> ", translate.instant('suc3'));
```