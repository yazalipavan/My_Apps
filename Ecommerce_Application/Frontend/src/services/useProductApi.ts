import { useQuery, useMutation } from "@tanstack/react-query";
import { productEndpoints } from "./endpoints";
import { useRef } from "react";

function useProductApi() {
  const userIdRef = useRef<Record<string, string | undefined>>({});
  const searchRef = useRef<Record<string, string> | undefined>({});
  const productIdRef = useRef<string>("");

  const getLatestProducts = async () => {
    const response = await fetch(productEndpoints.getLatestProducts(), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getAllProducts = async () => {
    const response = await fetch(
      productEndpoints.getAllProducts(searchRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const getAdminProducts = async () => {
    const response = await fetch(
      productEndpoints.getAdminProducts(userIdRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const getAllCategories = async () => {
    const response = await fetch(productEndpoints.getAllCategories(), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getSingleProduct = async () => {
    const response = await fetch(
      productEndpoints.getSingleProduct(productIdRef.current),
      {
        method: "GET",
        headers: {},
      }
    );
    return response.json();
  };

  const createProduct = async (data: FormData) => {
    const response = await fetch(
      productEndpoints.createProduct(userIdRef.current),
      {
        method: "POST",
        body: data,
      }
    );
    console.log(response, "dsh");
    return response.json();
  };

  const updateProduct = async (data: FormData) => {
    const response = await fetch(
      productEndpoints.updateProduct(userIdRef.current, productIdRef.current),
      {
        method: "PUT",
        body: data,
      }
    );
    return response.json();
  };

  const deleteProduct = async (productId: string) => {
    const response = await fetch(
      productEndpoints.deleteProduct(userIdRef.current, productId),
      {
        method: "DELETE",
      }
    );
    return response.json();
  };

  const getLatestProductsApi = useQuery({
    queryKey: ["get-latest-products"],
    queryFn: getLatestProducts,
    enabled: false,
    retry: false,
  });
  const getAllProductsApi = useQuery({
    queryKey: ["get-all-products"],
    queryFn: getAllProducts,
    enabled: false,
    retry: false,
  });

  const getAdminProductsApi = useQuery({
    queryKey: ["get-admin-products"],
    queryFn: getAdminProducts,
    enabled: false,
    retry: false,
  });

  const getSingleProductApi = useQuery({
    queryKey: ["get-admin-products"],
    queryFn: getSingleProduct,
    enabled: false,
    retry: false,
  });

  const getAllCategoriesApi = useQuery({
    queryKey: ["get-product-categories"],
    queryFn: getAllCategories,
    enabled: false,
    retry: false,
  });

  const createProductApi = useMutation({
    mutationKey: ["new-product"],
    mutationFn: createProduct,
  });

  const updateProductApi = useMutation({
    mutationKey: ["update-product"],
    mutationFn: updateProduct,
  });

  const deleteProductApi = useMutation({
    mutationKey: ["update-product"],
    mutationFn: deleteProduct,
  });

  return {
    states: {
      latestProducts: getLatestProductsApi,
      allProducts: getAllProductsApi,
      adminProducts: getAdminProductsApi,
      allCategories: getAllCategoriesApi,
      singleProduct: getSingleProductApi,
    },
    actions: {
      readLatestProducts: () => {
        getLatestProductsApi.refetch();
      },
      readAllProducts: (data: Record<string, string> | undefined) => {
        searchRef.current = data;
        getAllProductsApi.refetch();
      },
      readAdminProducts: (id: Record<string, string | undefined>) => {
        userIdRef.current = id;
        getAdminProductsApi.refetch();
      },
      readAllCategories: () => {
        getAllCategoriesApi.refetch();
      },
      readSingleProduct: (productId: string) => {
        productIdRef.current = productId;
        getSingleProductApi.refetch();
      },
      createProduct: (
        id: Record<string, string | undefined>,
        data: FormData,
        events
      ) => {
        userIdRef.current = id;
        createProductApi.mutate(data, events);
      },
      updateProduct: (
        id: Record<string, string | undefined>,
        data: FormData,
        productId: string,
        events
      ) => {
        userIdRef.current = id;
        productIdRef.current = productId;
        updateProductApi.mutate(data, events);
      },
      deleteProduct: (
        id: Record<string, string | undefined>,
        productId: string,
        events
      ) => {
        userIdRef.current = id;
        // productIdRef.current = productId;
        deleteProductApi.mutate(productId, events);
      },
    },
  };
}

export default useProductApi;
