import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import useUserStore from "../../../store/userStore";
import useAdminApi from "../../../services/useAdminApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/loader";

const PieCharts = () => {
  const { userStoreData } = useUserStore();
  const adminApi = useAdminApi();

  const { data, isLoading, isError, error } = adminApi.states.pie;

  const pie = data?.charts;

  useEffect(() => {
    adminApi.actions.readPie(userStoreData?._id || "");
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
            <h1>Pie & Doughnut Charts</h1>
            <section>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    pie?.orderFullfillmentInfo?.processingOrder,
                    pie?.orderFullfillmentInfo?.shippedOrder,
                    pie?.orderFullfillmentInfo?.deliveredOrder,
                  ]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={pie?.productCategories.map(
                    (i: Record<string, number>) => Object.keys(i)[0]
                  )}
                  data={pie?.productCategories.map(
                    (i: Record<string, number>) => Object.values(i)[0]
                  )}
                  backgroundColor={pie?.productCategories.map(
                    (i: Record<string, number>) =>
                      `hsl(${Object.values(i)[0] * 10}, ${
                        Object.values(i)[0]
                      }%, 50%)`
                  )}
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[
                    pie?.stockAvailability?.inStock,
                    pie?.stockAvailability?.outOfStock,
                  ]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2> Stock Availability</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    pie?.revenueDistribution?.marketingCost,
                    pie?.revenueDistribution?.discount,
                    pie?.revenueDistribution?.burnt,
                    pie?.revenueDistribution?.productionCost,
                    pie?.revenueDistribution?.netMargin,
                  ]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            <section>
              <div>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[
                    pie?.usersAgeGroup?.teen,
                    pie?.usersAgeGroup?.adult,
                    pie?.usersAgeGroup?.old,
                  ]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[
                    pie?.adminCustomer?.admin,
                    pie?.adminCustomer?.customer,
                  ]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
