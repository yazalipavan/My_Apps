import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import useProductApi from "../../services/useProductApi";
import { Product } from "../../types/types";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import useUserStore from "../../store/userStore";
import { Skeleton } from "../../components/loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const productApi = useProductApi();
  const { userStoreData } = useUserStore();

  useEffect(() => {
    productApi.actions.readAdminProducts({ id: userStoreData?._id });
  }, []);

  const { data, isLoading, isError, error, isSuccess } =
    productApi.states.adminProducts;
  // console.log(data, "data");
  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess && data) {
      const products = data?.products?.map((product: Product) => ({
        photo: <img src={`${import.meta.env.VITE_SERVER}/${product.photo}`} />,
        name: product.name,
        price: product.price,
        stock: product.stock,
        action: <Link to={`/admin/product/${product._id}`}>Manage</Link>,
      }));
      setRows(products || []);
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
