import multer from 'koa-multer';

const upload = multer({ dest: 'public/uploads/' });

export default (router) => {
  router.post('/upload', upload.single('file'), (ctx, next) => {
    const { filename, originalname } = ctx.req.file;
    ctx.body = { filename, originalname };
    return next();
  });
};
