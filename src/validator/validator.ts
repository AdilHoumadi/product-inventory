import RequestedQty from "../persistance/model/RequestInventoryInterface";
import ProductErrors from "../config/ErrorInterface";

export default class Validator {
    constructor() {}

    static validateProductList(products: RequestedQty[]) {
        const errors: ProductErrors<string>[] = [];
        if(products) {
            products.forEach(val => {
                if(!('id' in val) || !('request' in val)) {
                    errors.push({error: `Request for provided product is not valid ${JSON.stringify(val)}`});
                }
            });
        }
        return errors;
    }
}