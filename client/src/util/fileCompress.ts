import imageCompression, { Options } from "browser-image-compression";

const units = ["bytes", "KiB", "MiB", "GiB", "TiB"]

const niceBytes = (x: any) => {
    let l = 0;
    let n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
        n /= 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

export const imageSize = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const promise = new Promise<({ width: number, height: number })>((resolve, reject) => {
        reader.onload = (e) => {
            const image: any = new Image();
            image.src = e.target?.result;
            image.onload = () => {
                const height = image.height;
                const width = image.width

                resolve({ width, height });
            }
            image.onerror = reject;
        }
    })
    return promise;
}
export const ImageCompressor = {
    uploadImage: async (file: any, onCompress: any) => {
        const compressImage = async (file: any) => {
            const imageDimensions = await imageSize(file);
            // console.log("imageDimensions", { dimension: imageDimensions, size: niceBytes(file.size) });

            const options: Options = {
                maxSizeMB: .4,
                maxWidthOrHeight:
                    imageDimensions.width > 700 ? 700 : imageDimensions.width,
                useWebWorker: true,
            };

            const compressedImage = await imageCompression(file, options);
            const compressedimageDimensions = await imageSize(compressedImage);
            // console.log("compressedimageDimensions", { dimension: compressedimageDimensions, size: niceBytes(compressedImage.size) });
            return compressedImage;
        };
        const image = await compressImage(file);
        onCompress(image);
        return image;
    }
}
