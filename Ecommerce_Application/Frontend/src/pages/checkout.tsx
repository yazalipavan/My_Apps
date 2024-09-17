import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useUserStore from "../store/userStore";
import useOrderApi from "../services/useOrderApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const [Processing, setProcessing] = useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const orderApi = useOrderApi();

  const {
    cartItems,
    shippingInfo,
    subtotal,
    total,
    tax,
    discount,
    shippingCharges,
    resetCart,
  } = useCartStore();
  const { userStoreData } = useUserStore();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const orderData = {
      orderItems: cartItems,
      shippingInfo,
      subTotal: subtotal,
      total,
      tax,
      discount,
      shippingCharges,
      user: userStoreData?._id || "",
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });
    if (error) {
      setProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
      await orderApi.actions.newOrder(orderData, {
        onSuccess: (response: Record<string, string>) => {
          if (response.success) {
            resetCart();
            toast.success(response.message);
            navigate("/orders");
          } else {
            toast.error(response.message);
          }
        },
        onError: (response: Record<string, string>) => {
          toast.error(response.message);
        },
      });
      console.log("Order Placed");
      navigate("/orders");
    }
    setProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={Processing}>
          {Processing ? "Processing" : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
