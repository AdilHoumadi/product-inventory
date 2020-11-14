import App from './app';
import InventoryController from "./controller/Inventory/InventoryController";
import HomeController from "./controller/Home/HomeController";

new App(
    [
        new HomeController().router,
        new InventoryController().router,
    ],
).listen();
