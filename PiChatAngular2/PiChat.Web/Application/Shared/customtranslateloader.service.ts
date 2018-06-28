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