import Product from "../persistance/model/InventoryInterface";
import fetch from "node-fetch";

class PriceWebservice {

    static defaultLanguage: string = 'de-de';
    webserviceUrl: string;

    constructor(webserviceUrl: string) {
        this.webserviceUrl = webserviceUrl;
    }

    async getProductPrice(id: string, acceptLanguage: string): Promise<Product|Error> {
        if(acceptLanguage) {
            acceptLanguage = PriceWebservice.defaultLanguage;
        }
        return await fetch(`${this.webserviceUrl}/product/${id}`, {
            'method': 'get',
            'headers': {
                'Content-Type': 'application/json',
                'Accept-Language': acceptLanguage
            }
        }).then((product => {
            return product.json();
        })).catch((err) => {
            return {error: err.toString()}
        });
    }
}

export default PriceWebservice;