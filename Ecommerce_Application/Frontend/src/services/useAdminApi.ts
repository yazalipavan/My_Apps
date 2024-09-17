import { useQuery } from "@tanstack/react-query";
import { adminEndpoints } from "./endpoints";
import { useRef } from "react";

function useAdminApi() {
  const userIdRef = useRef<string>("");
  const getDashboardStats = async () => {
    const response = await fetch(
      adminEndpoints.dashboardStats(userIdRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const getPieChartData = async () => {
    const response = await fetch(adminEndpoints.pieChart(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getLineChartData = async () => {
    const response = await fetch(adminEndpoints.lineChart(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getBarChartData = async () => {
    const response = await fetch(adminEndpoints.barChart(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getDashboardApi = useQuery({
    queryKey: ["get-dashboard-stats"],
    queryFn: getDashboardStats,
    enabled: false,
    retry: false,
  });

  const getPieApi = useQuery({
    queryKey: ["get-pieChart-stats"],
    queryFn: getPieChartData,
    enabled: false,
    retry: false,
  });

  const getLineApi = useQuery({
    queryKey: ["get-lineChart-stats"],
    queryFn: getLineChartData,
    enabled: false,
    retry: false,
  });

  const getBarApi = useQuery({
    queryKey: ["get-barChart-stats"],
    queryFn: getBarChartData,
    enabled: false,
    retry: false,
  });

  return {
    states: {
      dashboard: getDashboardApi,
      pie: getPieApi,
      line: getLineApi,
      bar: getBarApi,
    },
    actions: {
      readDashboard: (id: string) => {
        userIdRef.current = id;
        getDashboardApi.refetch();
      },

      readPie: (id: string) => {
        userIdRef.current = id;
        getPieApi.refetch();
      },

      readLine: (id: string) => {
        userIdRef.current = id;
        getLineApi.refetch();
      },

      readBar: (id: string) => {
        userIdRef.current = id;
        getBarApi.refetch();
      },
    },
  };
}

export default useAdminApi;
