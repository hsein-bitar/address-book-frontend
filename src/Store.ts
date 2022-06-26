import create, { StateCreator } from 'zustand'
import { persist, PersistOptions } from "zustand/middleware"


// types for typescript to stop complaining :)
type State = {
    userToken: string;
    setUserToken: Function
}

type MyPersist = (
    config: StateCreator<State>,
    options: PersistOptions<State>
) => StateCreator<State>


// state store
const useStore = create<State>(
    (persist as unknown as MyPersist)(
        (set, get) => ({
            userToken: '',
            setUserToken: (token: string) => set((state) => ({ userToken: token })),
        }),
        { name: 'addressbook' }
    )
)

export default useStore;

