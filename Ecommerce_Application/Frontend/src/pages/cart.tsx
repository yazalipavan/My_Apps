import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import CartItemComponent from "../components/cart-item";
import { CartItem } from "../types/types";
import useOrderApi from "../services/useOrderApi";

const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeCartItem,
    subtotal,
    tax,
    total,
    shippingCharges,
    discount,
    calculatePrice,
    applyDiscount,
  } = useCartStore();

  const orderApi = useOrderApi();
  const couponData = orderApi.states.couponDiscount;

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    if (couponData?.data?.success) {
      console.log(couponData?.data?.discount);
      applyDiscount(couponData?.data?.discount);
      setIsValidCouponCode(true);
    } else {
      applyDiscount(0);
      setIsValidCouponCode(false);
    }
  }, [couponData.data]);

  useEffect(() => {
    if (couponCode) orderApi.actions.readCouponDiscount(couponCode);
  }, [couponCode]);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity < cartItem.stock)
      addToCart({ ...cartItem, quantity: cartItem.quantity + 1 });
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity > 1) {
      addToCart({ ...cartItem, quantity: cartItem.quantity - 1 });
    }
  };

  const removeHandler = (id: string) => {
    removeCartItem(id);
  };

  useEffect(() => {
    calculatePrice();
  }, [cartItems, discount]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemComponent
              key={idx}
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
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
          couponCode && (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          )
        )}
        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
