export interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface Transaction {
    id: number;
    total: number;
    cash: number;
    change: number;
    vat: number;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    user_name?: string;
    created_at: string;
  }
  export interface NewUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'manager' | 'cashier';
  }
  