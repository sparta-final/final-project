import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3-transform';
import * as path from 'path';
import * as sharp from 'sharp';

// multer, s3, sharp, multer-s3-transform 를 사용하여 이미지 리사이징하는 함수
export const multerOptionsFactory = (): MulterOptions => {
  const s3 = new AWS.S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return {
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      shouldTransform: (_req, file, cb) => {
        cb(null, /^image/i.test(file.mimetype));
      },
      transforms: [
        {
          // gif 파일은 리사이징이 안되는 문제가 있어서, original 파일을 그대로 사용하도록 함
          id: 'original',
          key: (_req, file, done) => {
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, `${file.fieldname}/original/${basename}_${Date.now()}${ext}`);
          },
          transform: (_req, _file, done) => {
            done(null, sharp().resize(420, 420));
          },
        },
      ],
    }),
  };
};
