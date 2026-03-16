export class ImageUtils {

    static resizeImage(url: string | undefined, width: number): string | undefined {
        return url != null ? url.replace("/upload/", `/upload/w_${width}/`) : url;
    }
}