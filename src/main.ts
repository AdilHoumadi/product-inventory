import App from './app';
import InventoryController from "./controller/Inventory/InventoryController";
import HomeController from "./controller/Home/HomeController";
import PriceWebservice from "./webservice/PriceWebservice";
import {Settings} from "./config/Settings";
import InventoryService from "./service/InventoryService";

const priceWebservice = new PriceWebservice(Settings.wsHost);
const inventoryService = new InventoryService(priceWebservice);

new App(
    [
        new HomeController().router,
        new InventoryController(inventoryService).router,
    ],
).listen();
