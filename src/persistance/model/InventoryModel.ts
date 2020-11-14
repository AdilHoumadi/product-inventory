import * as mongoose from 'mongoose';
import Inventory from './InventoryInterface';

const InventorySchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    quantity: Number,
});

const InventoryModel = mongoose.model<Inventory & mongoose.Document>('Inventory', InventorySchema);
export default InventoryModel;