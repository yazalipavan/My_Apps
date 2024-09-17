import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import useUserStore from "../../store/userStore";
import useOrderApi from "../../services/useOrderApi";
import toast from "react-hot-toast";
import { Order } from "../../types/types";
import { Skeleton } from "../../components/loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
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
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const { userStoreData } = useUserStore();
  const orderApi = useOrderApi();

  useEffect(() => {
    orderApi.actions.allOrders(userStoreData?._id);
  }, []);
  const { data, isLoading, isError, error, isSuccess } =
    orderApi.states.allOrders;

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess && data) {
      const orders = data?.orders?.map((order: Order) => ({
        user: order?.user?.name,
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
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Transaction;
