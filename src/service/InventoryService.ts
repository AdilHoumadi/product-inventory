import PriceWebservice from "../webservice/PriceWebservice";
import InventoryModel from "../persistance/model/InventoryModel";
import ProductInventory from "../persistance/model/InventoryInterface";
import ErrorProduct from "../config/ErrorInterface";

class InventoryService {

    private priceWebservice;

    constructor(priceWebservice: PriceWebservice) {
        this.priceWebservice = priceWebservice;
    }

    public async getProductInventory(id: string, language: string): Promise<ProductInventory|ErrorProduct> {
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
            return {error: 'An error occurred while fetching the data'} ;
        });
    }
}

export default InventoryService;