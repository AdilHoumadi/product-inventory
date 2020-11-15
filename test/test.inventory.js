const supertest = require('supertest');
const api = supertest(`http://localhost:8000/`);
const expect = require('chai').expect;

testConsume = (data, status, done) => {
    api.post(`inventory/consume`)
        .expect('Content-Type', /json/)
        .set('accept-language', 'de-de')
        .send(data)
        .expect(status)
        .end(function (err, res) {
            if (err) {
                return console.log(err);
            }
            done(res);
        });
}

describe('Consume Inventory', () => {

    it('Missing list of products to be consumed', () => {
        const body = {"error": "Please a list of request with an array of products"};
        testConsume(null, 404, (res) => {
            expect(res.body).to.include(body);
        })
    });

    it('Incomplete list of products to be consumed - empty list of products', () => {
        const out = {
            error: 'Please a list of request with an array of products',
            details: []
        };
        testConsume({}, 404, (res) => {
            expect(res.body).to.deep.equal(out);
        })
    });

    it('Incomplete list of products to be consumed - missing id', () => {
        const out = {
            error: 'Please a list of request with an array of products',
            details: [{
                error: 'Request for provided product is not valid {"request":7}'
            }]
        };
        testConsume({"products": [{"request": 7}]}, 404, (res) => {
            expect(res.body).to.deep.equal(out);
        });
    });

    it('Incomplete list of products to be consumed - missing requested qty', () => {
        const out = {
            error: 'Please a list of request with an array of products',
            details: [{
                error: 'Request for provided product is not valid {"id":"123"}'
            }]
        };
        testConsume({"products": [{"id": '123'}]}, 404, (res) => {
            expect(res.body).to.deep.equal(out);
        });
    });

    it('Consume the product', () => {
        const out = {
            currency: '€',
            _id: '0e1c39b0-8a02-414f-9943-142b23f95f0d',
            name: 'Handmade Concrete Gloves',
            description: 'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
        };
        const req = {
            "products": [
                {
                    "id": "0e1c39b0-8a02-414f-9943-142b23f95f0d",
                    "request": 2
                }
            ]
        }
        testConsume(req, 200, (res) => {
            const fromAPI = res.body[0];
            expect(fromAPI).to.include(out);
            expect(fromAPI.price).to.be.greaterThan(0);
            expect(fromAPI.quantity).to.be.greaterThan(-1);
        });
    });

    it('Consume the product twice', () => {
        const req = {
            "products": [
                {
                    "id": "0e1c39b0-8a02-414f-9943-142b23f95f0d",
                    "request": 2
                }
            ]
        }
        testConsume(req, 200, (res1) => {
            const fromAPI1 = res1.body[0];
            let previousQty = fromAPI1.quantity;
            testConsume(req, 200, (res2) => {
                const fromAPI2 = res2.body[0];
                expect(fromAPI2.quantity).to.be.equal(previousQty - 2);
            })
        });
    });

    it('Try to consume a product which is out of stock', () => {
        const out = {
            'd4c796e5-17f1-4013-b6c1-1990e4a0ab3a': 'Product with id: d4c796e5-17f1-4013-b6c1-1990e4a0ab3a is out of stock. The available quantity is: 3 and the requested is: 4'
        }
        const req = {
            "products": [
                {
                    "id": "d4c796e5-17f1-4013-b6c1-1990e4a0ab3a",
                    "request": 4
                }
            ]
        }
        testConsume(req, 404, (res) => {
            const fromAPI = res.body.error[0];
            expect(fromAPI).to.include(out);
        });
    });

    it('Confirm and process the consumption of the product', () => {
        const out = {
            "_id": "d4c796e5-17f1-4013-b6c1-1990e4a0ab3a",
            "name": "Ergonomic Cotton Computer",
            "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
            "quantity": 0,
        }
        const req = {
            "confirm": true,
            "products": [
                {
                    "id": "d4c796e5-17f1-4013-b6c1-1990e4a0ab3a",
                    "request": 4
                }
            ]
        }
        testConsume(req, 200, (res) => {
            const fromAPI = res.body[0];
            expect(fromAPI).to.include(out);
        });
    });

});

