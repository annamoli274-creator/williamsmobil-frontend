/**
 * Types pour les commandes PayPal
 */

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
}

export interface PaymentMethod {
  type: "paypal" | "manual" | "bank_transfer";
}

export interface CreateOrderRequest {
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  lang?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CaptureOrderRequest {
  paypalOrderId: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  paypalOrderId?: string;
  approvalUrl?: string;
  amount?: number;
  status?: string;
  error?: string;
}
