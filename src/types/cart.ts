export interface CartItemDTO {
  id?: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartDTO {
  token?: string;
  items: CartItemDTO[];
}

export interface ClientActionDTO {
  cartToken: string;
  actionType: string;
  details: Record<string, any>;
  ipAddress: string;
}
