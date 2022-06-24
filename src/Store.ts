import React from 'react';
import create from 'zustand'
import { persist } from "zustand/middleware"

type State = {
    userToken: string;
    setUserToken: Function
}


// state store
const useStore = create<State>((set) => ({
    userToken: '',
    setUserToken: (token: string) => set({ userToken: token }),
}))



export default useStore;