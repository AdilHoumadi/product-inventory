import {Request, Response, NextFunction, Router} from 'express';
import ProductInventory from "../../persistance/model/InventoryInterface";
import InventoryService from "../../service/InventoryService";

class InventoryController {
    public router = Router();
    public path: string = '/inventory';
    private inventoryService: InventoryService;

    private inventories: ProductInventory[] = [
        {
            id: '123-456',
            name: 'stan smith ',
            description: 'Best product ever!',
            quantity: 350,
            currency: '€',
            price: 39.81,
        }
    ];

    constructor(inventoryService: InventoryService) {
        this.initRoutes();
        this.inventoryService = inventoryService;
    }

    public initRoutes() {
        this.router.get(`${this.path}/product/:id`, this.getInventory);
        this.router.post(`${this.path}/consume`, this.consumeInventory);
        this.router.post(`${this.path}/confirm`, this.confirmConsumption);
    }

    private getInventory = async (req: Request, res: Response, _: NextFunction) => {
        const id = req.params.id;
        if(id) {
            const language = req.headers["accept-language"]?.toLowerCase();
            this.inventoryService.getProductInventory(id, language).then((data) => {
                if('error' in  data) {
                    res.status(404).send(data);
                } else {
                    res.status(200).send(data);
                }
            });
        } else {
            res.status(200).send({
                error: 'Please provide a valid ID'
            });
        }
    }

    private consumeInventory = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).send(this.inventories);
    }

    private confirmConsumption = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).send(this.inventories);
    }
}

export default InventoryController;