import * as faker from 'faker';
import ProductModel from "../../src/persistance/model/InventoryModel";
import {Mongoose} from "../persistance/mongoose";
import {ConnStr, Settings as s} from "../config/Settings";

const totalProduct = 50;
faker.seed(1);
const db = Mongoose.connect(ConnStr(
    s.dbUser,
    s.dbPass,
    s.dbPort,
    s.dbHost,
    s.dbName
));
db.dropCollection('inventories');
for (let i = 0; i < totalProduct; i++) {
    const id = faker.random.uuid();
    const name = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    let quantity = faker.random.number(1000);
    if (i % 10 === 0) {
        quantity = 0;
    }
    const createInventory = new ProductModel({
        _id: id,
        name,
        description,
        quantity
    });
    console.log(createInventory);
    createInventory
        .save()
        .then((record) => {
            console.info('Inventory Saved:')
            console.log(record);
        });
}

