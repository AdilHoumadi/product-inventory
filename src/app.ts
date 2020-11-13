import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {logger} from "./middleware/logger";
import {inventoryRouter} from "./controller/InventoryController";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(logger);
app.use(inventoryRouter);

export { app };