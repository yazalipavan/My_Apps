import { useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import useAdminApi from "../../../services/useAdminApi";
import useUserStore from "../../../store/userStore";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/loader";
import { getLastMonth } from "../../../utils";

const { last12Months, last6Months } = getLastMonth();

const Barcharts = () => {
  const { userStoreData } = useUserStore();
  const adminApi = useAdminApi();

  const { data, isLoading, isError, error } = adminApi.states.bar;

  const bar = data?.charts;

  useEffect(() => {
    adminApi.actions.readBar(userStoreData?._id || "");
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
            <h1>Bar Charts</h1>
            <section>
              <BarChart
                data_2={bar?.users}
                data_1={bar?.products}
                labels={last6Months}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={bar?.orders}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
