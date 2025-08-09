// src/CartItem.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateQuantity } from './slices/CartSlice';
import './CartItem.css';

const money = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);

const unitPrice = (it) => {
  if (typeof it.price === 'number') return it.price;
  if (typeof it.cost === 'string') return Number(it.cost.replace(/[^0-9.]/g, '')) || 0;
  return 0;
};

export default function CartItem({ onContinueShopping }) {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);

  // Increase quantity
  const handleIncrement = (name) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;
    dispatch(updateQuantity({ name, qty: (current.qty ?? 0) + 1 }));
  };

  // Decrease quantity or remove if zero
  const handleDecrement = (name) => {
    const current = items.find((i) => i.name === name);
    if (!current) return;
    const nextQty = (current.qty ?? 0) - 1;
    if (nextQty <= 0) {
      dispatch(removeItem({ name }));
    } else {
      dispatch(updateQuantity({ name, qty: nextQty }));
    }
  };

  // Completely remove item
  const handleRemove = (name) => {
    dispatch(removeItem({ name }));
  };

  // Calculate subtotal for a single item
  const calculateTotalCost = (item) => {
    const price = unitPrice(item);
    return price * (item.qty ?? 0);
  };

  // Calculate total for all cart items
  const calculateTotalAmount = () => {
    return items.reduce((sum, it) => sum + calculateTotalCost(it), 0);
  };

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
      {items.map((it) => (
        <div className="cart-item" key={it.name}>
          <img className="cart-item-image" src={it.image} alt={it.name} />
          <div className="cart-item-details">
            <div className="cart-item-name">{it.name}</div>
            <div className="cart-item-cost">Unit: {money(unitPrice(it))}</div>
            <div className="cart-item-quantity">
              <button className="cart-item-button" onClick={() => handleDecrement(it.name)}>−</button>
              <span className="cart-item-quantity-value">{it.qty}</span>
              <button className="cart-item-button" onClick={() => handleIncrement(it.name)}>+</button>
            </div>
            <div className="cart-item-total">Subtotal: {money(calculateTotalCost(it))}</div>
            <button className="cart-item-delete" onClick={() => handleRemove(it.name)}>Delete</button>
          </div>
        </div>
      ))}

      <div className="total_cart_amount">Total: {money(calculateTotalAmount())}</div>

      <button className="get-started-button1" onClick={() => alert('Checkout coming soon!')}>
        Checkout
      </button>
      <button className="get-started-button1 continue_shopping_btn" onClick={onContinueShopping}>
        Continue Shopping
      </button>
    </div>
  );
}
