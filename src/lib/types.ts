import fr from "../dictionaries/fr.json";

export type Dictionary = typeof fr;

export interface Product {
  id: string;
  title: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  image: string;
  gallery?: string[];
  description: string;
  options?: string[];
  specs: Record<string, string | string[]>;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}
