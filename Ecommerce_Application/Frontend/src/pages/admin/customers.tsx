import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import useUserStore from "../../store/userStore";
import useUserApi from "../../services/useUserApi";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/loader";
import { User } from "../../types/types";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { userStoreData } = useUserStore();
  const userApi = useUserApi();

  useEffect(() => {
    userApi.actions.readAllUsers(userStoreData?._id || "");
  }, []);
  const { data, isLoading, isError, error, isSuccess } =
    userApi.states.allUsers;

  const handleDelete = (id: string) => {
    userApi.actions.deleteUser(id, userStoreData?._id || "", {
      onSuccess: (response: Record<string, string>) => {
        if (response.success) {
          toast.success(response.message);
          userApi.actions.readAllUsers(userStoreData?._id || "");
        } else {
          toast.error(response.message);
        }
      },
      onError: (response: Record<string, string>) => {
        toast.error(response.message);
      },
    });
  };

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error(error.message);

  useEffect(() => {
    if (isSuccess && data) {
      const users = data?.users?.map((user: User) => ({
        avatar: (
          <img
            style={{
              borderRadius: "50%",
            }}
            src={user.photo}
            alt={user.name}
          />
        ),
        name: user.name,
        email: user.email,
        gender: user.gender,
        role: user.role,
        action: (
          <button onClick={() => handleDelete(user._id)}>
            <FaTrash />
          </button>
        ),
      }));
      setRows(users || []);
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
