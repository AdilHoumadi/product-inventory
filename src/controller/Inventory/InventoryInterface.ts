interface Inventory {
    id: string;
    name: string;
    quantity: number;
}

interface Product {
    price: number;
    currency: string
}

export type ProductInventory = Inventory | Product;