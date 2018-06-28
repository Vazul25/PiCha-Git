# Angular2 - Directive

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
Az üres src="" tagre azért van szükség, 
mert egyenlőre nem találtam olyan new atributum funkciót
 az element refen ami hiba nélkül jól megoldaná ezt a feladatot.

 ## ImagePreview direktíva
 Egyszerü direktíva  amire egy file-t kötve, betölti az < img > element src atributumába a beolvasott képet
### Példa:
```html
<img class="myPreviewImage" src="" [myPreviewImage]="item._file" alt="" />
```
 ### Kód
 ```typescript
 import {Directive, provide} from '@angular/core';
import {ElementRef} from    '@angular/core';
import {OnInit} from    '@angular/core';

@Directive({
    selector: "[myPreviewImage]",
    inputs: ['file:myPreviewImage']
})
export class ImagePreview {
    file: File;
    constructor( private el: ElementRef) {}

    ngOnInit(): any {

        var reader: FileReader;
        reader = new FileReader();
        reader.onload = (event: any) => {
            this.el.nativeElement.attributes.src.nodeValue = event.target.result;
        }, false;
        reader.readAsDataURL(this.file);
    }
}
```
 ## Match direktíva
 Ez a validátorokat bövíti ki, egy mymatch direktívával, ami lehetővé teszi,
  hogy 2 FormControl értét össze rendeljük, ha nem egyezik meg a 2 akkor invalid lesz a form
 ### Példa:
 ```html
 <input type="password" name="passwordConfirm"  [formControl]="password" required minlength="6" maxlength="32" >
 
 <input type="password" name="passwordConfirm"  [formControl]="passwordConfirm" required minlength="6" maxlength="32" [mymatch]="password" >  
 <span  *ngIf="passwordConfirm.errors && passwordConfirm.errors.mymatch">Match error</span>                   
 ```
 ```typescript
 import {Directive, OnDestroy} from '@angular/core';
import {NG_VALIDATORS, FormControl} from '@angular/forms';
import {forwardRef} from '@angular/core';
import 'rxjs/Rx'; 
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector:  '[mymatch][formControl]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => Match), multi: true }
    ],
     inputs: ['toMatch:mymatch']
})
export class Match {
    toMatch: FormControl;
    isInitiated: boolean = false;
    toMatchChangedSubscription: Subscription;

    constructor() {}

    validate(c: FormControl) {
        if (!this.isInitiated) {
            this.toMatchChangedSubscription=this.toMatch.valueChanges.subscribe(() => { c.updateValueAndValidity(); });
            this.isInitiated = true;
        }
        return c.value === this.toMatch.value ? null : {
            mymatch: {
                valid: false
            }
        };
    }
    ngOnDestroy() {
        this.toMatchChangedSubscription.unsubscribe();
        
    }
}
```
### Problémák/Érdekességek:
#### Forward ref:
Arról van szó, hogy mi itt az NG_Validators akarjuk kibövíteni (multi:true jelzi)
egy a forrás fileban később létre hozott osztállyal, ezért rá még nem hivatkozhatunk,
ebben segít nekünk a forward ref ami jelzi hogy tudjuk mi hogy nincs ilyen osztály de majd lesz.
#### Errors undefined:
Figyelni kell arra, hogy ha egy hiba sincs a validáció alatt akkor a FormControll.errors undefined,
ezért ha saját hiba üzeneteket akarunk *ngIf el megjeleníteni, akkor a feltételbe bele kell rakni,
hogy létezik-e az errors és csak utána hivatkozhatunk a különböző validátor propertykre, különben futás időben exception-t kapunk
```html
 <span  *ngIf="passwordConfirm.errors && passwordConfirm.errors.mymatch">Match error</span>
 ```                   
 

### Hasznos linkek:
[Custom validator](http://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html) 2016.08.12

[Forward refrence](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html) 2016.08.12

[Hosszu leírás a formokról](http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/) 2016.08.12