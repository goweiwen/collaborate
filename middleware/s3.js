import signS3 from 'koa-s3-sign-upload';
import { S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../credentials';

export default (app) => {
  app.use(signS3({
    bucket: S3_BUCKET,
    headers: { 'Access-Control-Allow-Origin': '*' },
    ACL: 'public-read',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    randomizeFilename: true,
  }));
};
