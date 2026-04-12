/**
 * Default copy for the entire site (storefront + any shared UI).
 * Keys are flat (e.g. site.name, nav.cart). API/content can override per key.
 * DRY: single source of defaults; API merges DB values on top.
 */
export const DEFAULT_SITE_COPY: Record<string, string> = {
  // Site identity
  'site.name': 'Bag and Shop',
  'site.tagline': 'Storefront',
  'site.metaDescription': 'Storefront',

  // Nav
  'nav.collections': 'Collections',
  'nav.combos': 'Combos',
  'nav.cart': 'Cart',
  'nav.account': 'Account',
  'nav.logout': 'Logout',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.trackOrder': 'Track order',

  // Track order (guest lookup)
  'trackOrder.title': 'Track your order',
  'trackOrder.description':
    'Enter your order number and the email you used at checkout to see status and details.',
  'trackOrder.orderNumber': 'Order number',
  'trackOrder.email': 'Email',
  'trackOrder.submit': 'View order',
  'trackOrder.missingFields': 'Please enter both order number and email.',

  // Cart
  'cart.title': 'Cart',
  'cart.empty': 'Your cart is empty.',
  'cart.continueShopping': 'Continue shopping',
  'cart.checkout': 'Checkout',
  'cart.remove': 'Remove',
  'cart.total': 'Total',

  // Auth
  'auth.loginTitle': 'Log in',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.loginSubmit': 'Log in',
  'auth.loggingIn': 'Logging in...',
  'auth.loginFailed': 'Login failed',
  'auth.noAccount': "Don't have an account?",
  'auth.registerTitle': 'Register',
  'auth.createAccount': 'Create account',
  'auth.name': 'Name',
  'auth.nameOptional': 'Name (optional)',
  'auth.registerSubmit': 'Register',
  'auth.registering': 'Creating account...',
  'auth.registerFailed': 'Registration failed',
  'auth.hasAccount': 'Already have an account?',

  // Product / PDP
  'product.addToCart': 'Add to cart',
  'product.buyNow': 'Buy now',
  'product.orderToday': 'Order today — ships within 1–2 business days.',
  'product.addComboToCart': 'Add combo to cart',
  'product.variants': 'Variants',
  'product.inStock': 'in stock',
  'product.outOfStock': 'out of stock',
  'product.faq': 'FAQ',

  // Collections / listing
  'collections.title': 'Collections',
  'collections.empty': 'No collections yet.',
  'combos.title': 'Combos',
  'combos.empty': 'No combos available.',

  // Account
  'account.title': 'My account',
  'account.orders': 'Orders',
  'account.orderHistory': 'Order history',
  'account.loadingOrders': 'Loading orders...',
  'account.noOrders': 'No orders yet.',
  'account.loading': 'Loading...',

  // Checkout
  'checkout.title': 'Checkout',
  'checkout.placeOrder': 'Place order',
  'checkout.placingOrder': 'Placing order...',
  'checkout.failed': 'Checkout failed',
  'checkout.apply': 'Apply',

  // Order tracking
  'order.status': 'Status',
  'order.fulfillment': 'Fulfillment',

  // Errors / empty states
  'notFound.title': 'Page not found',
  'notFound.message': "We couldn't find the page you're looking for.",
  'notFound.backHome': 'Back to home',

  // Section defaults (can be overridden by section settings)
  'section.ctaShop': 'Shop now',
  'section.ctaLearnMore': 'Learn more',
  'section.imagePlaceholder': 'Image',
};

