import { useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import useAdminApi from "../../../services/useAdminApi";
import useUserStore from "../../../store/userStore";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/loader";
import { getLastMonth } from "../../../utils";

const { last12Months } = getLastMonth();

const Linecharts = () => {
  const { userStoreData } = useUserStore();
  const adminApi = useAdminApi();

  const { data, isLoading, isError, error } = adminApi.states.line;

  const line = data?.charts;

  useEffect(() => {
    adminApi.actions.readLine(userStoreData?._id || "");
  }, []);

  if (isError) toast.error(error.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <h1>Line Charts</h1>
            <section>
              <LineChart
                data={line?.users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={last12Months}
                backgroundColor="rgba(53, 162, 255, 0.5)"
              />
              <h2>Active Users</h2>
            </section>

            <section>
              <LineChart
                data={line?.products}
                backgroundColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={last12Months}
                label="Products"
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={line?.revenue}
                backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={last12Months}
              />
              <h2>Total Revenue </h2>
            </section>

            <section>
              <LineChart
                data={line?.discount}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={last12Months}
              />
              <h2>Discount Allotted </h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Linecharts;
