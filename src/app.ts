import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {logger} from "./middleware/logger";
import {Settings as s, ConnStr} from "./config/settings";
import {MongoDb} from "./persistance/mongo";
import {Router} from "express";

class App {

    public app: express.Application;

    constructor(controllers) {
        this.app = express();

        this.initMiddlewares();
        this.initControllers(controllers);
    }

    private initMiddlewares() {
        console.info('Init middlewares');
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(logger);
    }

    private initControllers(controllers: Array<Router>[]) {
        controllers.forEach((r) => {
            this.app.use('/', r);
        });
    }

    public listen() {
        console.info('Start listening');
        const server = http.createServer(this.app);
        server.listen(s.appPort, s.appHost);
        server.on('listening', async () => {
            console.info(`Product inventory API is listening on port http://${s.appHost}:${s.appPort}`);
            try {
                await MongoDb.connect(ConnStr(
                    s.dbUser,
                    s.dbPass,
                    s.dbPort,
                    s.dbHost,
                    s.dbName
                ));
                console.info('Connected to MongoDb')
            } catch (err) {
                console.log(err);
            }
        });
    }
}

export default App;