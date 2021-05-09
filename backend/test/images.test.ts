import request from 'supertest';
import app from '../src/app';

let uploadedImages: string[] = [];

describe('GET /images', () => {
    it('should return 200 OK', () => {
        return request(app).get('/images')
            .expect(200);
    });
});

describe('POST /images with no body', () => {
    it('should return 400 or 500', () => {
        return request(app).post('/images').expect(res => res.status in [400, 500]);
    });
});

beforeAll(async (done) => {
    request(app)
        .post('/images')
        .set('Content-Type', 'multipart/form-data')
        .field('data', JSON.stringify([
            {
                password: 'hellohello',
                public: true
            },
            {
                password: 'hellohello',
                public: false
            }
        ]))
        .attach('images', './test/cat.jpg')
        .attach('images', './test/factory-farm.jpg')
        .expect(201)
        .then(res => {
            uploadedImages = res.body.map((obj: any) => obj.uri);
        });
    done();
});

describe('DELETE /images', () => {
    it('should return 200 OK', () => {
        return request(app).delete('/images')
            .send({
                images: uploadedImages,
                password: 'hellohello'
            })
            .expect(200)
            .then(res => {
                expect(res.body.deletedCount === uploadedImages.length);
            });
    });
});

describe('DELETE /images/all', () => {
    it('should return 200 OK', () => {
        return request(app).delete('/images/all')
            .send({
                password: 'hellohello'
            })
            .expect(200);
    });
});
