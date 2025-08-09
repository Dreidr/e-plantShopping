// src/CartItem.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './slices/CartSlice';
import './CartItem.css';

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

// ✅ Parse price from either numeric `price` or string `cost` like "$12.00"
const unitPrice = (item) =>
  typeof item.price === 'number'
    ? item.price
    : parseFloat(item.cost?.substring(1)) || 0;

      // ✅ Item subtotal
const calculateTotalCost = (item) => unitPrice(item) * (item.qty ?? 0);

export default function CartItem({ onContinueShopping }) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);

   const handleContinueShopping = (e) => {
    e?.preventDefault?.();
    onContinueShopping?.(e);
  };

  const handleCheckoutShopping = (e) => {
  alert('Functionality to be added for future reference');
};

  const handleIncrement = (name) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;
    dispatch(updateQuantity({ name, qty: (current.qty ?? 0) + 1 }));
  };

  const handleDecrement = (name) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;

    const nextQty = (current.qty ?? 0) - 1;
    if (nextQty > 0) {
    dispatch(updateQuantity({ name, qty: nextQty }));
  } else {
    dispatch(removeItem({ name }));
    }
  };

  const handleRemove = (name) => {
  dispatch(removeItem({ name }));
  };

// ✅ Overall total
  const total = items.reduce((sum, it) => sum + calculateTotalCost(it), 0);

  if (!items.length) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <button className="get-started-button1 continue_shopping_btn" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {items.map((it) => {
        const price = unitPrice(it);
        const sub = price * (it.qty ?? 0);
        return (
          <div className="cart-item" key={it.name}>
            <img className="cart-item-image" src={it.image} alt={it.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{it.name}</div>
              <div className="cart-item-cost">Unit: {money(price)}</div>
              <div className="cart-item-quantity">
                <button className="cart-item-button" onClick={() => handleDecrement(it.name)}>−</button>
                <span className="cart-item-quantity-value">{it.qty}</span>
                <button className="cart-item-button" onClick={() => handleIncrement(it.name)}>+</button>
              </div>
              <div className="cart-item-total">Subtotal: {money(sub)}</div>
              <button
                className="cart-item-delete"
                onClick={() => handleRemove(it.name)}
              >
                Delete
              </button>

            </div>
          </div>
        );
      })}

      <div className="total_cart_amount">Total: {money(total)}</div>

      <button className="get-started-button1" onClick={handleCheckoutShopping}>
        Checkout
      </button>
       <button
        type="button"
        className="get-started-button1 continue_shopping_btn"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
}
