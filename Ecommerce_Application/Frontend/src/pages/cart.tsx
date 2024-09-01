import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "sdghd",
    photo:
      "https://th.bing.com/th?id=OSK.HEROeoAGeEOx58HAbfF3vrg8PefhUm7KHfKtXYkxcDcJRDg&w=472&h=280&c=1&rs=2&o=6&dpr=1.3&pid=SANGAM",
    name: "MacBook",
    price: 3000,
    quantity: 4,
    stock: 50,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const discount = 0;
const total = subtotal + tax + shippingCharges - discount;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  useEffect(() => {}, [couponCode]);
  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => <CartItem key={idx} cartItem={i} />)
        ) : (
          <h1>No Products Added</h1>
        )}
      </main>
      <aside>
        <p>SubTotal : ${subtotal}</p>
        <p>Shipping Charges : ${shippingCharges}</p>
        <p>Tax : ${tax}</p>
        <p>
          Discount : <em> -${discount}</em>
        </p>
        <p>Total :${total}</p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode && isValidCouponCode ? (
          <span className="green">
            ${discount} off using the <code>{couponCode}</code>
          </span>
        ) : (
          <span className="red">
            Invalid Coupon <VscError />
          </span>
        )}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
