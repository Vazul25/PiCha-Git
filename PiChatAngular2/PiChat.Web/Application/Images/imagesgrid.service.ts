import { Injectable } from '@angular/core';

@Injectable()
export class ImagesGridService {
    private imagesLoading: number = 0;

    constructor() {
    }

    increaseImagesLoadingCounter() {
        this.imagesLoading += 1;
    }

    decreaseImagesLoadingCounter() {
        this.imagesLoading -= 1;

        if (this.imagesLoading == 0) {
            this.formatGrid();
        }
    }

    formatGrid() {
        var scrollYPos = window.scrollY;
        setTimeout(() => {
            var itemWidth = $('.grid-sizer').width() - 10;
            $(".grid").pinto({
                itemWidth: itemWidth
            });

            window.scroll(0, scrollYPos);
        }, 100);
    }

    setImageSize(size: string) {
        switch (size) {
            case 'large':
                $('.grid-sizer').width("100%")
                break;
            case 'small':
                $('.grid-sizer').width("33.33%")
                break;
            default:
                $('.grid-sizer').width("50%")
        }

        this.formatGrid();
    }
}