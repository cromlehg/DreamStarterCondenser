import koa_router from 'koa-router';
import fs from 'fs';
import path from 'path';

export default function usePublicApi(app) {
    const router = koa_router();
    app.use(router.routes());

    router.get('/upload/:imagename', function*() {
        const imagename = this.params.imagename;
        const imagepath = path.resolve(__dirname, '../../../upload');
        const image = fs.readFileSync(`${imagepath}/${imagename}`);
        this.body = image;
        this.status = 200;
    });
}
