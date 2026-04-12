'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useT } from '@/context/SiteConfigContext';
import { trackAddToCart } from '@/lib/analytics';

interface AddToCartProductProps {
  productId: string;
  variantId: string;
  price: string;
  title: string;
  disabled?: boolean;
  className?: string;
}

const defaultProductBtn =
  'btn-primary disabled:opacity-50 disabled:cursor-not-allowed';

export function AddToCartProduct({
  productId,
  variantId,
  price,
  title,
  disabled,
  className,
}: AddToCartProductProps) {
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
      className={className ?? defaultProductBtn}
    >
      {t('product.addToCart')}
    </button>
  );
}

export function BuyNowProduct({
  productId,
  variantId,
  price,
  title,
  disabled,
  className,
}: AddToCartProductProps) {
  const t = useT();
  const router = useRouter();
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
        router.push('/checkout');
      }}
      className={className ?? defaultProductBtn}
    >
      {t('product.buyNow')}
    </button>
  );
}

interface AddToCartComboProps {
  comboId: string;
  price: string;
  title: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartCombo({ comboId, price, title, disabled, className }: AddToCartComboProps) {
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
      className={className ?? defaultProductBtn}
    >
      {t('product.addComboToCart')}
    </button>
  );
}
