import PriceWebservice from "../webservice/PriceWebservice";
import InventoryModel from "../persistance/model/InventoryModel";
import ProductInventory from "../persistance/model/InventoryInterface";
import Product from "../persistance/model/InventoryInterface";
import RequestedQty from "../persistance/model/RequestInventoryInterface";
import ErrorProduct from "../config/ErrorInterface";
import * as mongoose from 'mongoose';

class InventoryService {

    private priceWebservice;

    constructor(priceWebservice: PriceWebservice) {
        this.priceWebservice = priceWebservice;
    }

    public async getProductInventory(id: string, language: string): Promise<ProductInventory | ErrorProduct<string>> {
        return Promise.all([
            await this.priceWebservice.getProductPrice(id, language),
            await InventoryModel.findById(id),
        ]).then(([price, inventory]) => {
            if (price && inventory) {
                const productInventory: ProductInventory = {
                    ...inventory.toObject(),
                    ...price
                }
                return productInventory;
            } else {
                return {error: 'Cannot find the product'};
            }
        }).catch(err => {
            console.error(err);
            return {error: 'An error occurred while fetching the data'};
        });
    }

    private async getRequestedProducts(ids: string[]): Promise<ProductInventory[]> {
        console.info('Get requested products')
        return InventoryModel.find(
            {_id: {$in: ids}},
            (err, listProducts) => {
                let products: ProductInventory[] = [];
                listProducts.forEach((p) => {
                    products.push(p.toObject())
                })
                return products;
            }
        );
    }

    private handleProductOutOfStock(request, products): ErrorProduct<string[]> {
        console.info('Handle product out of stock')
        const productsOutOfStock = [];
        request.forEach((r) => {
            products.forEach((p) => {
                if (p._id === r.id && p.quantity < r.request) {
                    productsOutOfStock.push({
                        [r.id]: `Product with id: ${r.id} is out of stock. The available quantity is: ${p.quantity} and the requested is: ${r.request}`
                    })
                }
            })
        });
        return {
            error: productsOutOfStock
        };
    }

    private async handleTransaction(r) {
        console.info('Handle transaction');
        const session = await mongoose.startSession();
        session.startTransaction();
        let product: Product = null;
        await InventoryModel.findById(r.id).then((row) => {
            product = row.toObject();
            if(product.quantity - r.request <= 0) {
                product.quantity = 0;
            } else {
                product.quantity = product.quantity - r.request;
            }
            InventoryModel.updateOne({_id: r.id}, product).then(() => {
                console.info(`Updated done: ${r.id}`);
            });
        });
        await session.commitTransaction();
        return product;
    }

    private async handleProductConsumption(
        confirm: boolean,
        request: RequestedQty[],
        errors: ErrorProduct<string[]>,
        language: string): Promise<ProductInventory[]|ErrorProduct<string[]> > {
        console.info('Handle product consumption')
        if(confirm === true || (errors.error && errors.error.length === 0)) {
            const results : ProductInventory[] = [];
            for (const r of request) {
                Promise.all([
                    await this.priceWebservice.getProductPrice(r.id, language),
                    await this.handleTransaction(r),
                ]).then(([price, inventory]) => {
                    if (price && inventory) {
                        const productInventory: ProductInventory = {
                            ...price,
                            ...inventory,
                        }
                        results.push(productInventory);
                    }
                }).catch(err => {
                    console.error(err);
                    return {error: 'An error occurred while fetching the data'};
                });
            }
            return results;
        } else {
            return errors;
        }
    }
    public async consumeProduct(request: RequestedQty[], confirm: boolean, language: string): Promise<ErrorProduct<string[]>|ProductInventory[]> {
        const ids = request.map(val => val.id);
        return await this
            .getRequestedProducts(ids)
            .then(errors => this.handleProductOutOfStock(request, errors))
            .then(errors => this.handleProductConsumption(confirm, request, errors, language));
    }
}

export default InventoryService;