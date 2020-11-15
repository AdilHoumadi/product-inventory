import * as express from 'express';
import * as cors from 'cors';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {logger} from "./middleware/logger";
import {errorHandler, notFoundHandler} from "./middleware/error";
import {Settings as s, ConnStr} from "./config/Settings";
import {Mongoose} from "./persistance/mongoose";
import {Router} from "express";
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Product Inventory",
        description: "Product Inventory API",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    host: "http://localhost:3000",
    basePath: "/",
};
const options = {
    swaggerDefinition,
    explorer: true,
    apis: [
        "**/*.yaml",
    ]
};
const SwaggerSpec = swaggerJSDoc(options);

class App {

    public app: express.Application;

    constructor(controllers: Router[]) {
        this.app = express();

        this.initMiddlewares();
        this.initControllers(controllers);
        this.errorsMiddleware();
    }

    private initMiddlewares() {
        console.info('Init middlewares');
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(logger);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));
    }

    private errorsMiddleware() {
        this.app.use(errorHandler);
        this.app.use(notFoundHandler);
    }

    private initControllers(controllers: Router[]) {
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
                await Mongoose.connect(ConnStr(
                    s.dbUser,
                    s.dbPass,
                    s.dbPort,
                    s.dbHost,
                    s.dbName
                ));
            } catch (err) {
                console.log(err);
            }
        });
    }
}

export default App;