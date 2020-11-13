import * as express from 'express';
import {Request, Response, NextFunction} from 'express';

const inventoryRouter = express.Router();

inventoryRouter.get('/', (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({"time": new Date().toUTCString(), 'status': 'OK'});
});

inventoryRouter.get('/product/inventory/:id', (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({"time": new Date().toUTCString(), 'status': 'OK'});
});

export { inventoryRouter };