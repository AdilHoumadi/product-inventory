import {Request, Response, NextFunction, Router} from 'express';
import {ProductInventory} from "./InventoryInterface";

class InventoryController {
    public path = '/inventory';
    public router = Router();

    private posts: ProductInventory[] = [
        {
            id: '123-456',
            name: 'stan smith ',
            quantity: 350,
            currency: '€',
            price: 39.81
        }
    ];

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(`${this.path}/product/:id`, this.getInventory);
        this.router.post(`${this.path}/consume`, this.consumeInventory);
        this.router.post(`${this.path}/confirm`, this.confirmConsumption);
    }

    private getInventory = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).send(this.posts);
    }

    private consumeInventory = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).send(this.posts);
    }

    private confirmConsumption = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).send(this.posts);
    }
}

export default InventoryController;