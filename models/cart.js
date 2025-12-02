/***********************************
 * Require Statements
 ************************************/
const supabase = require('../database/connect');

const cartModel = {};

/*
 * CartStatus {
 *   PENDING = 'PENDING',
 *   COMPLETED = 'COMPLETED',
 *   CANCELLED = 'CANCELLED',
 * }
 *
 * Cart = {
 *   cartId: number;
 *   createdDate: Date;
 *   updatedAt: Date;
 *   userId: number;
 *   cartStatus: CartStatus;
 *   companyId: number;
 *   notes: string;
 * }
 *
 * cartItem = {
 *   cartId: number;
 *   productId: number;
 *   quantity: number;
 *   companyId: number;
 * }
 */

/***********************************
 * Cart CRUD Operations
 ************************************/

/**
 * Get cart by userId - returns active cart (PENDING status)
 */
cartModel.getCartByUserId = async userId => {
  const { data, error } = await supabase
    .from('cart')
    .select('*')
    .eq('userId', userId)
    .eq('cartStatus', 'PENDING')
    .order('dateCreated', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data.length > 0 ? data[0] : null;
};

/**
 * Get all cart items with product names for a cart
 */
cartModel.getCartItems = async cartId => {
  const { data, error } = await supabase
    .from('cartItem')
    .select(
      `
      cartId,
      productId,
      quantity,
      companyId,
      product (
        productId,
        name,
        price,
        productImage ( productId, imageURL )
      )
    `
    )
    .eq('cartId', cartId);

  if (error) throw error;
  return data;
};

/**
 * Create a new cart
 */
cartModel.createCart = async cartData => {
  const { data, error } = await supabase
    .from('cart')
    .insert([
      {
        userId: cartData.userId,
        companyId: cartData.companyId,
        cartStatus: cartData.cartStatus || 'PENDING',
        notes: cartData.notes || null,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Update cart information
 */
cartModel.updateCart = async (cartId, updateData) => {
  const { data, error } = await supabase
    .from('cart')
    .update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    })
    .eq('cartId', cartId)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Delete cart (and cascade delete cart items)
 */
cartModel.deleteCart = async cartId => {
  const { data, error } = await supabase
    .from('cart')
    .delete()
    .eq('cartId', cartId);

  if (error) throw error;
  return data;
};

/**
 * Update cart status
 */
cartModel.updateCartStatus = async (cartId, status) => {
  const { data, error } = await supabase
    .from('cart')
    .update({
      cartStatus: status,
      updatedAt: new Date().toISOString(),
    })
    .eq('cartId', cartId)
    .select();

  if (error) throw error;
  return data[0];
};

/***********************************
 * Cart Item CRUD Operations
 ************************************/

/**
 * Add item to cart
 */
cartModel.addCartItem = async itemData => {
  // Check if item already exists in cart
  const { data: existing, error: checkError } = await supabase
    .from('cartItem')
    .select('*')
    .eq('cartId', itemData.cartId)
    .eq('productId', itemData.productId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is fine
    throw checkError;
  }

  // If item exists, update quantity instead
  if (existing) {
    return await cartModel.updateCartItemQuantity(
      itemData.cartId,
      itemData.productId,
      existing.quantity + itemData.quantity
    );
  }

  // Insert new cart item
  const { data, error } = await supabase
    .from('cartItem')
    .insert([
      {
        cartId: itemData.cartId,
        productId: itemData.productId,
        quantity: itemData.quantity,
        companyId: itemData.companyId,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Update cart item quantity
 */
cartModel.updateCartItemQuantity = async (cartId, productId, quantity) => {
  if (quantity <= 0) {
    // If quantity is 0 or less, delete the item
    return await cartModel.removeCartItem(cartId, productId);
  }

  const { data, error } = await supabase
    .from('cartItem')
    .update({ quantity: quantity })
    .eq('cartId', cartId)
    .eq('productId', productId)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Remove item from cart
 */
cartModel.removeCartItem = async (cartId, productId) => {
  const { data, error } = await supabase
    .from('cartItem')
    .delete()
    .eq('cartId', cartId)
    .eq('productId', productId);

  if (error) throw error;
  return data;
};

/**
 * Clear all items from cart
 */
cartModel.clearCart = async cartId => {
  const { data, error } = await supabase
    .from('cartItem')
    .delete()
    .eq('cartId', cartId);

  if (error) throw error;
  return data;
};

/**
 * Get cart item count
 */
cartModel.getCartItemCount = async cartId => {
  const { data, error } = await supabase
    .from('cartItem')
    .select('quantity')
    .eq('cartId', cartId);

  if (error) throw error;

  const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
  return totalItems;
};

module.exports = cartModel;
