# Angular2 - ng2-File-Upload
[Forrás Github](https://github.com/valor-software/ng2-file-upload)

## Leírás
Fileok feltöltését teszi lehetővé, és gyakorlatilag mindent megcsinál ami ehhez szükséges,
 ezáltal a controllerbe nagyon vékony maradhat.
 A bemenetet  < input type="file">-al (akár többet is kijelölve),
  vagy drag and drop használatával lehet megadni, ez egymás után füzi az elemeket.
Az elemeket egyesével és egyszerre is fel lehet tölteni az api segítségével,
<b> de az egyszerre feltöltés funkció is egyesével szekvenciálissan tölti fel a fileokat</b>. 
Sok funkciója támaszkodik a html5-re.

## Müködés:
Az ng2-upload egy adott uploader implementációra épül és ennek 
segítségével minden függvényt, kiirást és funkciót meg lehet hívni a html kódból.

##### Példakód az uploader konfigurálására:
```typescript
const URL = '/api/Image';
export class UploadImageComponent{ 
    public uploader: FileUploader;
    constructor(){
    //erre bindoljuk az [uploader] direktivát az inputon, meg a drag and droppal megjelölt diven
        public uploader = new FileUploader();
         this.uploader.setOptions({
                        //cél url megadása
                        url: (URL + "/Add/" + this.selectedGroupId),
                        //auth token megadására lehetőség
                        authToken: 'Bearer ' + sessionStorage.getItem("token"),
                        //megkötések hogy milyen fileokat fogad el, csak ezeket engedi feltölteni
                        filters: [{
                            fn: (item: File) => {
                                return item.size < 1024 * 1024 * 40 && (item.type.indexOf("image") != -1);
                            }
                        }]
                    })
     }
}
```

Az uploaderen belül található a *queue* ami tartalmazz a bemenetként átadott fileokból képzett **FiletItemeket**
ezek már rendelkeznek rengeteg property-vel amiknek segítségével könnyen lehet a frontendent személyre szabni. 
pl: isSuccess, isUploaded,isUploading, és peresze a filehoz tartozó alap propertyk mint név és méret.
**De** ezek a *fileitemek* érdekes módon **rendelkeznek** az eredeti ***FileUploader* referenciájával** , továbbá **külön** egy **URL** **property-vel**
ami **nem változik akkor se** ha közbe a set options függvénnyel **változott** az **uploader**, ez azt eredményezni hogy a **listán lévő elemek oda fognak feltöltődni**
**ahova a megadásukkor volt állítva az uploader url-je** (hacsak nem megyünk végig a *queue* és állítjuk át kézzel ezt a property-t), ami akár elemről elemre lehet eltérő is.
## Példa:
```html
<input type="file" ng2FileSelect [uploader]="uploader" multiple /><br />
<div ng2FileDrop
                 [ngClass]="{'nv-file-over': hasBaseDropZoneOver}"
                 (fileOver)="fileOverBase($event)"
                 [uploader]="uploader"
                 class="well my-drop-zone droparea ">

                <p class="droptext">drop here</p>
</div>
<div class="col-md-12" style="margin-bottom: 40px">
            <table class="table">
                <thead>
                    <tr>
                        <th width="25%">file név</th>
                        <th>file méret</th>
                        <th>progress bar</th>
                        <th>státusz</th>
                        <th>gombok</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let item of uploader.queue;let i =index">
                        <td><strong>{{item.file.name}}</strong></td>
                        <td nowrap>{{item.file.size/1024/1024|number:'.1-2'}} MB</td>
                        <td>
                            <div class="progress" style="margin-bottom: 0;">
                                <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                            </div>
                        </td>
                        <td class="text-center">
                            <span *ngIf="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span>
                            <span *ngIf="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span>
                            <span *ngIf="item.isError"><i class="glyphicon glyphicon-remove"></i></span>
                        </td>
                        <td nowrap>
                            <button type="button" class="btn btn-success btn-xs"
                                    (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                                <span class="glyphicon glyphicon-upload"></span> Feltöltés
                            </button>
                            <button type="button" class="btn btn-warning btn-xs"
                                    (click)="item.cancel()" [disabled]="!item.isUploading">
                                <span class="glyphicon glyphicon-ban-circle"></span> Megszakítás
                                </button>
                            <button type="button" class="btn btn-danger btn-xs"
                                    (click)="item.remove()">
                                <span class="glyphicon glyphicon-trash"></span> Kivétel a listából
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div>
                <div>
                    Queue progress
                    <div class="progress" style="">
                        <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
                    </div>
                </div>
                <button type="button" class="btn btn-success btn-s"
                        (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length || !groupSelected">
                    <span class="glyphicon glyphicon-upload"></span> Összes elem feltöltése
                </button>
                <button type="button" class="btn btn-warning btn-s"
                        (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
                    <span class="glyphicon glyphicon-ban-circle"></span> Összes feltöltés megszakítása
                </button>
                <button type="button" class="btn btn-danger btn-s"
                        (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
                    <span class="glyphicon glyphicon-trash"></span> Összes file kivétele
                </button>
            </div>

        </div>
```
