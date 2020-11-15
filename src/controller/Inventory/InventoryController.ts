import {Request, Response, NextFunction, Router} from 'express';
import RequestedQty from "../../persistance/model/RequestInventoryInterface";
import InventoryService from "../../service/InventoryService";
import Validator from "../../validator/validator";

class InventoryController {
    public router = Router();
    public path: string = '/inventory';
    private inventoryService: InventoryService;

    constructor(inventoryService: InventoryService) {
        this.initRoutes();
        this.inventoryService = inventoryService;
    }

    public initRoutes() {
        this.router.get(`${this.path}/product/:id`, this.getInventory);
        this.router.post(`${this.path}/consume`, this.consumeInventory);
    }

    static getAcceptLanguage(req: Request) {
        return req.headers["accept-language"] ? req.headers["accept-language"].toLowerCase() : '';
    }

    private getInventory = async (req: Request, res: Response, _: NextFunction) => {
        const id = req.params.id;
        if (id) {
            const language = InventoryController.getAcceptLanguage(req);
            this.inventoryService.getProductInventory(id, language).then((data) => {
                if (data && 'error' in data) {
                    res.status(404).send(data);
                } else {
                    res.status(200).send(data);
                }
            });
        } else {
            res.status(404).send({
                error: 'Please provide a valid ID'
            });
        }
    }

    private consumeInventory = (req: Request, res: Response, _: NextFunction) => {
        const products = req.body.products as RequestedQty[];
        const confirm = req.body.confirm as boolean;
        const errors = Validator.validateProductList(products);

        if (errors.length === 0 && products && products.length) {
            const language = InventoryController.getAcceptLanguage(req);
            this.inventoryService.consumeProduct(products, confirm, language).then((data) => {
                if (data && 'error' in data) {
                    res.status(404).send(data);
                } else {
                    res.status(200).send(data);
                }
            });
        } else {
            res.status(404).send({
                error: 'Please a list of request with an array of products',
                details: errors
            });
        }
    }
}

export default InventoryController;