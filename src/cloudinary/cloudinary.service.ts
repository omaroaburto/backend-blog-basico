import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }
  deleteImage(urlImage: string): void {
    v2.uploader.destroy(this.publicId(urlImage));
  }

  private publicId(url: string) {
    const nameArr = url.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');
    return public_id;
  }
  //TODO: implementar
  deleteMoreThanOne(urlImages: string[]): void {
    const public_ids = urlImages.map((url) => {
      return this.publicId(url);
    });
    v2.api.delete_resources(public_ids);
  }
}
