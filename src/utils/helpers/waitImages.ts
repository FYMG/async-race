export default function waitImages(images: HTMLImageElement[], onComplete: () => void) {
    let loaded = 0;
    images.forEach((image) => {
        image.onload = () => {
            loaded += 1;
            if (loaded === images.length) {
                onComplete();
            }
        };
    });
}
