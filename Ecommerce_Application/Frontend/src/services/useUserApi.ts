import { useQuery, useMutation } from "@tanstack/react-query";
import { userEndpoints } from "./endpoints";
import { User } from "../types/types";
import { useRef } from "react";

function useUserApi() {
  const userIdRef = useRef<string>("");
  const getUserDetails = async () => {
    const response = await fetch(userEndpoints.getUser(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const getAllUsers = async () => {
    const response = await fetch(userEndpoints.allUsers(userIdRef.current), {
      method: "GET",
      headers: {},
    });
    return response.json();
  };

  const createUser = async (data: User) => {
    const response = await fetch(userEndpoints.createUser(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  const deleteUser = async (id: string) => {
    const response = await fetch(
      userEndpoints.deleteUser(id, userIdRef.current),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };

  const getUserApi = useQuery({
    queryKey: ["get-user-details"],
    queryFn: getUserDetails,
    enabled: false,
    retry: false,
  });

  const getAllUsersApi = useQuery({
    queryKey: ["get-all-user-details"],
    queryFn: getAllUsers,
    enabled: false,
    retry: false,
  });

  const createUserApi = useMutation({
    mutationKey: ["user-login"],
    mutationFn: createUser,
  });

  const deleteUserApi = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: deleteUser,
  });

  return {
    states: {
      userDetails: getUserApi,
      allUsers: getAllUsersApi,
    },
    actions: {
      readUser: (id: string) => {
        userIdRef.current = id;
        getUserApi.refetch();
      },
      readAllUsers: (id: string) => {
        userIdRef.current = id;
        getAllUsersApi.refetch();
      },
      createNow: (data: User, events) => {
        createUserApi.mutate(data, events);
      },
      deleteUser: (id: string, userId: string, events) => {
        userIdRef.current = userId;
        deleteUserApi.mutate(id, events);
      },
    },
  };
}

export default useUserApi;
