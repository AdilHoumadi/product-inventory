const supertest = require('supertest');
const api = supertest(`http://localhost:8000/`);
const expect = require('chai').expect;



describe('Get Inventory', () => {


    // incomplete request
    it('Cannot get price from price webservice - missing accept language', () => {
        const productId = '6fbe024f-2316-4265-a6e8-d65a837e308a';
        const text = { error: 'Cannot fetch product price' }
        api.get(`inventory/product/${productId}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return console.log(err);
                expect(res.body).to.include(text);
            });
    });

    it('Get product inventory', () => {
        const productId = '6fbe024f-2316-4265-a6e8-d65a837e308a';
        const text = {
            "_id": "6fbe024f-2316-4265-a6e8-d65a837e308a",
            "name": "Unbranded Cotton Table",
            "description": "The Football Is Good For Training And Recreational Purposes",
            "quantity": 0,
            "currency": "€",
        };
        api.get(`inventory/product/${productId}`)
            .set('accept-language', 'de-de')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return console.log(err);
                expect(res.body).to.include(text);
            });
    });

    it('Fail to get product inventory', () => {
        const productId = 'FAKE_ID';
        const error = {error: 'Cannot find the product'}
        api.get(`inventory/product/${productId}`)
            .set('accept-language', 'de-de')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return console.log(err);
                expect(res.body).to.include(error);
            });
    });
});

