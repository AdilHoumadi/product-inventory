# Product-inventory

The project contains the following endpoints:

- `/inventory/product/:productId`
In order to get the inventory for a specific product we use this endpoint with the following `productId`

- `/inventory/consume`
To consume the inventory of each product, we use this endpoint by allowing the user to call with one or more products in one call

### Technical details:
The project uses the following technologies:
- Express.JS as framework to handle request/response using Node.JS
- Typescript to enhance javascript and enforce static typing
- MongoDB as storage to save the data (peristancer layer)
- Mongoose Lib to interact with MongoDB
- Mocha, chai and supertest for testing
- Docker to distribute build and package the application
- Docker-compose to orchestrate the 3 services (mongodb, price webservice and inventory app)

The project expose those services:
```
mongodb: 0.0.0.0:27017
inventory: http://0.0.0.0:8000
price webservice: http://0.0.0.0:3000
```

### Requirements
- docker 
- docker-compose

### Start the project:
```
./init/start.sh
```

### Run the fake demo data:
```
./init/demo.sh
^C to exist
```

### Run the tests:
```
./init/test.sh
```

### Test report:
```
> mocha test

  Get Inventory
    ✓ Cannot get price from price webservice - missing accept language
    ✓ Get product inventory
    ✓ Fail to get product inventory

  Consume Inventory
    ✓ Missing list of products to be consumed
    ✓ Incomplete list of products to be consumed - empty list of products
    ✓ Incomplete list of products to be consumed - missing id
    ✓ Incomplete list of products to be consumed - missing requested qty
    ✓ Consume the product
    ✓ Consume the product twice
    ✓ Try to consume a product which is out of stock
    ✓ Confirm and process the consumption of the product

  11 passing (63ms)
```



