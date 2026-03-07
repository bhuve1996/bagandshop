'use client';

import { useCart } from '@/context/CartContext';
import { useT } from '@/context/SiteConfigContext';
import { trackAddToCart } from '@/lib/analytics';

interface AddToCartProductProps {
  productId: string;
  variantId: string;
  price: string;
  title: string;
  disabled?: boolean;
}

export function AddToCartProduct({ productId, variantId, price, title, disabled }: AddToCartProductProps) {
  const t = useT();
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
      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {t('product.addToCart')}
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
  const t = useT();
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
      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {t('product.addComboToCart')}
    </button>
  );
}
