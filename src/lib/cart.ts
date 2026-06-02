export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export const parsePrice = (price: string) => {
  if (!price) return 0;
  const normalized = price.replace(/[^0-9,\.\-]/g, "").replace(/,/g, ".");
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const API_BASE = "/api/cart";

export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const res = await fetch(API_BASE, {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!res.ok) {
      // Fallback: read from cookie on server error
      const raw =
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("cart_items="))
          ?.substring("cart_items=".length) || "";
      return raw ? JSON.parse(decodeURIComponent(raw)) : [];
    }
    const json = await res.json();
    return Array.isArray(json.items) ? json.items : [];
  } catch (error) {
    console.warn("Impossible de récupérer le panier depuis le serveur", error);
    // Fallback: read from cookie on fetch error
    try {
      const raw =
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("cart_items="))
          ?.substring("cart_items=".length) || "";
      return raw ? JSON.parse(decodeURIComponent(raw)) : [];
    } catch {
      return [];
    }
  }
};

export const addCartItem = async (
  item: CartItem,
): Promise<CartItem[] | null> => {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item }),
    });
    if (!res.ok) {
      // Fallback: save to cookie on server error
      const raw =
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("cart_items="))
          ?.substring("cart_items=".length) || "";
      const items = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      const existingIndex = items.findIndex(
        (it: any) => it.productId === item.id || it.id === item.id,
      );
      if (existingIndex > -1) {
        items[existingIndex].quantity =
          (items[existingIndex].quantity || 0) + (item.quantity || 1);
      } else {
        items.push(item);
      }
      document.cookie = `cart_items=${encodeURIComponent(JSON.stringify(items))}; path=/; SameSite=Lax`;
      return items;
    }
    const json = await res.json();
    return Array.isArray(json.items) ? json.items : null;
  } catch (error) {
    console.warn("Erreur lors de l'ajout au panier", error);
    // Fallback: save to cookie on fetch error
    try {
      const raw =
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("cart_items="))
          ?.substring("cart_items=".length) || "";
      const items = raw ? JSON.parse(decodeURIComponent(raw)) : [];
      const existingIndex = items.findIndex(
        (it: any) => it.productId === item.id || it.id === item.id,
      );
      if (existingIndex > -1) {
        items[existingIndex].quantity =
          (items[existingIndex].quantity || 0) + (item.quantity || 1);
      } else {
        items.push(item);
      }
      document.cookie = `cart_items=${encodeURIComponent(JSON.stringify(items))}; path=/; SameSite=Lax`;
      return items;
    } catch {
      return null;
    }
  }
};

export const clearCart = async (): Promise<boolean> => {
  try {
    const res = await fetch(API_BASE, {
      method: "DELETE",
      credentials: "same-origin",
    });
    return res.ok;
  } catch (error) {
    console.warn("Erreur lors de la suppression du panier", error);
    return false;
  }
};

export const removeCartItem = async (
  itemId: string,
): Promise<CartItem[] | null> => {
  try {
    const res = await fetch(`${API_BASE}/${itemId}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.items) ? json.items : null;
  } catch (error) {
    console.warn("Erreur lors de la suppression de l'article", error);
    return null;
  }
};

export const logClientAction = async (
  actionType: string,
  details?: Record<string, unknown>,
): Promise<void> => {
  try {
    const cartToken =
      document.cookie
        .split("; ")
        .find((c) => c.startsWith("cart_token="))
        ?.substring("cart_token=".length) || "anonymous";

    await fetch("/api/actions", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartToken, actionType, details }),
    });
  } catch {
    // Silently ignore logging errors
  }
};
