import {Request, Response, NextFunction, Router} from 'express';

class HomeController {
    public path = '/';
    public router = Router();

    constructor() {
        this.initRoutes();
    }

    public initRoutes() {
        this.router.get(this.path, this.home);
    }

    private home = (req: Request, res: Response, _: NextFunction) => {
        res.status(200).json({"time": new Date().toUTCString(), 'status': 'OK'});
    }
}

export default HomeController;