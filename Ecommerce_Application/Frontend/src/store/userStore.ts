import { create } from "zustand";
import { User } from "../types/types";

interface userState {
  userStoreData: User | null;
  loading: boolean;
  userExist: (payload: User) => void;
  userNotExist: () => void;
}

const intialState = {
  userStoreData: null,
  loading: true,
};

export const useUserStore = create<userState>((set) => ({
  userStoreData: intialState.userStoreData,
  loading: intialState.loading,
  userExist: (payload: User) => {
    console.log(payload, "pay");
    set({
      userStoreData: payload,
      loading: false,
    });
  },
  userNotExist: () =>
    set({
      userStoreData: null,
      loading: false,
    }),
}));

export default useUserStore;
