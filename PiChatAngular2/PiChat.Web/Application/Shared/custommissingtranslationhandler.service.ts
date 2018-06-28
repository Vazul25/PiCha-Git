import { MissingTranslationHandler } from 'ng2-translate/ng2-translate';

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(key: string) {
        return '#MissingTranslation#';
    }
}