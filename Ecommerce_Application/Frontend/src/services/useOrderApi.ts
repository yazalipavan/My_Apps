import { useQuery, useMutation } from "@tanstack/react-query";
import { orderEndpoints, paymentEndpoints } from "./endpoints";
import { useRef } from "react";
import { NewOrderRequest } from "../types/api-types";

function useOrderApi() {
  const userIdRef = useRef<string>("");
  const couponRef = useRef<string>("");
  const orderIdRef = useRef<string>("");

  const createOrder = async (data: NewOrderRequest) => {
    const response = await fetch(orderEndpoints.newOrder(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const updateOrder = async (data: string) => {
    const response = await fetch(
      orderEndpoints.updateOrder(data, userIdRef.current),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };

  const deleteOrder = async (data: string) => {
    const response = await fetch(
      orderEndpoints.deleteOrder(data, userIdRef.current),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };

  const getMyOrders = async () => {
    const response = await fetch(orderEndpoints.myOrder(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getAllOrders = async () => {
    const response = await fetch(orderEndpoints.allOrders(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getSingleOrder = async () => {
    const response = await fetch(
      orderEndpoints.singleOrder(orderIdRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const getCouponDiscount = async () => {
    const response = await fetch(
      paymentEndpoints.couponDiscount(couponRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const myOrderApi = useQuery({
    queryKey: ["get-user-order"],
    queryFn: getMyOrders,
    enabled: false,
    retry: false,
  });
  const allOrdersApi = useQuery({
    queryKey: ["get-all=orders"],
    queryFn: getAllOrders,
    enabled: false,
    retry: false,
  });

  const singleOrderApi = useQuery({
    queryKey: ["get-order-details"],
    queryFn: getSingleOrder,
    enabled: false,
    retry: false,
  });

  const couponDiscountApi = useQuery({
    queryKey: ["get-coupon-discount"],
    queryFn: getCouponDiscount,
    enabled: false,
    retry: false,
  });

  const createOrderApi = useMutation({
    mutationKey: ["create-order"],
    mutationFn: createOrder,
  });
  const updateOrderApi = useMutation({
    mutationKey: ["update-order"],
    mutationFn: updateOrder,
  });

  const deleteOrderApi = useMutation({
    mutationKey: ["delete-order"],
    mutationFn: deleteOrder,
  });

  return {
    states: {
      couponDiscount: couponDiscountApi,
      myOrders: myOrderApi,
      order: singleOrderApi,
      allOrders: allOrdersApi,
    },
    actions: {
      myOrder: (userId: string | undefined) => {
        userIdRef.current = userId || "";
        myOrderApi.refetch();
      },
      allOrders: (userId: string | undefined) => {
        userIdRef.current = userId || "";
        allOrdersApi.refetch();
      },
      singleOrder: (orderId: string) => {
        orderIdRef.current = orderId;
        singleOrderApi.refetch();
      },
      newOrder: (data: NewOrderRequest, events) => {
        createOrderApi.mutate(data, events);
      },
      updateOrder: (productId: string, userId: string | undefined, events) => {
        userIdRef.current = userId || "";
        updateOrderApi.mutate(productId, events);
      },
      deleteOrder: (productId: string, userId: string | undefined, events) => {
        userIdRef.current = userId || "";
        deleteOrderApi.mutate(productId, events);
      },
      readCouponDiscount: (coupon: string) => {
        couponRef.current = coupon;
        couponDiscountApi.refetch();
      },
    },
  };
}

export default useOrderApi;
