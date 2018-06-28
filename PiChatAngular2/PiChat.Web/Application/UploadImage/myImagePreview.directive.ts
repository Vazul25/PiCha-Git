import {Directive, provide} from '@angular/core';
import {ElementRef} from    '@angular/core';
import {OnInit} from    '@angular/core';

@Directive({
    selector: "[myPreviewImage]",
    inputs: ['file:myPreviewImage']
})
export class ImagePreview {
    file: File;

    constructor(private el: ElementRef) {
    }

    ngOnInit(): any {
       
         
        var reader: FileReader;
        reader = new FileReader();
 
        reader.onload = (event: any) => {
            this.el.nativeElement.attributes.src.nodeValue = event.target.result;
        }, false;

        reader.readAsDataURL(this.file);
    }
}