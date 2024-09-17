import { createEndPoint } from "./utils";

const server = import.meta.env.VITE_SERVER;

const baseUrl = `${server}/api/v1`;

export const userEndpoints = {
  getUser: (id: string) => {
    const userUrl = `${baseUrl}/user/${id}`;
    const userEndpoint = createEndPoint(userUrl, {});
    return userEndpoint;
  },
  createUser: () => {
    return `${baseUrl}/user/new`;
  },
  allUsers: (id: string) => {
    return `${baseUrl}/user/all?id=${id}`;
  },
  deleteUser: (id: string, loginId: string) => {
    return `${baseUrl}/user/${id}?id=${loginId}`;
  },
};

export const productEndpoints = {
  getLatestProducts: () => {
    return `${baseUrl}/product/latest`;
  },
  getAllProducts: (filter: Record<string, string> | undefined) => {
    const allProductUrl = `${baseUrl}/product/all`;
    const allProductEndpoint = createEndPoint(allProductUrl, filter);
    return allProductEndpoint;
  },
  getAdminProducts: (id: Record<string, string | undefined>) => {
    const adminProductUrl = `${baseUrl}/product/admin-products`;
    const adminProductEndpoint = createEndPoint(adminProductUrl, id);
    return adminProductEndpoint;
  },
  getAllCategories: () => {
    return `${baseUrl}/product/categories`;
  },
  createProduct: (id: Record<string, string | undefined>) => {
    return `${baseUrl}/product/new?id=${id.id}`;
  },
  updateProduct: (
    id: Record<string, string | undefined>,
    productId: string
  ) => {
    return `${baseUrl}/product/${productId}?id=${id.id}`;
  },
  getSingleProduct: (productId: string) => {
    return `${baseUrl}/product/${productId}`;
  },
  deleteProduct: (
    id: Record<string, string | undefined>,
    productId: string
  ) => {
    return `${baseUrl}/product/${productId}?id=${id.id}`;
  },
};

export const orderEndpoints = {
  newOrder: () => {
    return `${baseUrl}/order/new`;
  },
  myOrder: (id: string) => {
    return `${baseUrl}/order/my?id=${id}`;
  },
  allOrders: (id: string) => {
    return `${baseUrl}/order/all?id=${id}`;
  },
  singleOrder: (id: string) => {
    return `${baseUrl}/order/${id}`;
  },
  updateOrder: (orderId: string, userId: string) => {
    return `${baseUrl}/order/${orderId}?id=${userId}`;
  },
  deleteOrder: (orderId: string, userId: string) => {
    return `${baseUrl}/order/${orderId}?id=${userId}`;
  },
};

export const paymentEndpoints = {
  couponDiscount: (coupon: string) => {
    return `${baseUrl}/payment/discount?coupon=${coupon}`;
  },
};

export const adminEndpoints = {
  dashboardStats: (userId: string) => {
    return `${baseUrl}/dashboard/stats?id=${userId}`;
  },
  pieChart: (userId: string) => {
    return `${baseUrl}/dashboard/pie?id=${userId}`;
  },
  lineChart: (userId: string) => {
    return `${baseUrl}/dashboard/line?id=${userId}`;
  },
  barChart: (userId: string) => {
    return `${baseUrl}/dashboard/bar?id=${userId}`;
  },
};
