import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Order, OrderItem } from "../../../types/types";
import useUserStore from "../../../store/userStore";
import useOrderApi from "../../../services/useOrderApi";
import { Skeleton } from "../../../components/loader";
import toast from "react-hot-toast";

const orderDefaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const TransactionManagement = () => {
  const { userStoreData } = useUserStore();
  const orderApi = useOrderApi();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    orderApi.actions.singleOrder(params.id!);
  }, []);
  const { data, isLoading, isError } = orderApi.states.order;

  const {
    shippingInfo: { address, city, country, state, pinCode },
    orderItems,
    user: { name },
    tax,
    discount,
    total,
    status,
    subtotal,
    shippingCharges,
  } = data?.order || orderDefaultData;

  const updateHandler = (): void => {
    orderApi.actions.updateOrder(params.id!, userStoreData?._id, {
      onSuccess: (response: Record<string, string>) => {
        if (response.success) {
          toast.success(response.message);
          navigate("/admin/transaction");
        } else {
          toast.error(response.message);
        }
      },
      onError: (response: Record<string, string>) => {
        toast.error(response.message);
      },
    });
  };

  const deleteHandler = (): void => {
    orderApi.actions.deleteOrder(params.id!, userStoreData?._id, {
      onSuccess: (response: Record<string, string>) => {
        if (response.success) {
          toast.success(response.message);
          navigate("/admin/transaction");
        } else {
          toast.error(response.message);
        }
      },
      onError: (response: Record<string, string>) => {
        toast.error(response.message);
      },
    });
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i: OrderItem) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${import.meta.env.VITE_SERVER}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
