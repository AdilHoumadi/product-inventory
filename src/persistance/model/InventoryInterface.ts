interface Inventory {
    id: string;
    name: string;
    description: string;
    quantity: number;
}

interface Product {
    price: number;
    currency: string
}

type ProductInventory = Inventory & Product;
export default ProductInventory;