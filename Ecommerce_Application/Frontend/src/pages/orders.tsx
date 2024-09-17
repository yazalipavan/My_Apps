import React, { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";
import useOrderApi from "../services/useOrderApi";
import toast from "react-hot-toast";
import { Order } from "../types/types";
import { Skeleton } from "../components/loader";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const { userStoreData } = useUserStore();
  const orderApi = useOrderApi();

  useEffect(() => {
    orderApi.actions.myOrder(userStoreData?._id);
  }, []);

  const { data, isLoading, isError, error, isSuccess } =
    orderApi.states.myOrders;

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess && data) {
      const orders = data?.orders?.map((order: Order) => ({
        _id: order?._id,
        amount: order?.total,
        discount: order?.discount,
        quantity: order?.orderItems.length,
        status: (
          <span
            className={
              order?.status === "Processing"
                ? "red"
                : order?.status === "Shipped"
                ? "green"
                : "purple"
            }
          >
            {order?.status}
          </span>
        ),
        action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>,
      }));
      setRows(orders || []);
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();
  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <Skeleton length={20} /> : Table}
    </div>
  );
};

export default Orders;
