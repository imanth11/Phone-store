export type ProductCategory = "phone" | "headphone" | "charger" | string;

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  Dis: number;
  isDis: boolean;
  range: ProductCategory;
  des: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
}

export interface OrderSummary {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  };
  userId?: string;
  cartitems: CartItem[];
  amount: number;
  status: "pending_payment" | "paid" | "failed" | "cancelled";
  paymentAuthority?: string;
  paymentRefId?: string;
  createdAt: string;
}
