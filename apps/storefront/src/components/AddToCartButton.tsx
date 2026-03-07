'use client';

import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/analytics';

interface AddToCartProductProps {
  productId: string;
  variantId: string;
  price: string;
  title: string;
  disabled?: boolean;
}

export function AddToCartProduct({ productId, variantId, price, title, disabled }: AddToCartProductProps) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({
          product_id: productId,
          variant_id: variantId,
          combo_id: null,
          quantity: 1,
          price,
          title,
        });
        trackAddToCart({ item_id: productId, item_name: title, price, quantity: 1 });
      }}
      className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add to cart
    </button>
  );
}

interface AddToCartComboProps {
  comboId: string;
  price: string;
  title: string;
  disabled?: boolean;
}

export function AddToCartCombo({ comboId, price, title, disabled }: AddToCartComboProps) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({
          product_id: null,
          variant_id: null,
          combo_id: comboId,
          quantity: 1,
          price,
          title,
        });
        trackAddToCart({ item_id: comboId, item_name: title, price, quantity: 1 });
      }}
      className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add combo to cart
    </button>
  );
}
