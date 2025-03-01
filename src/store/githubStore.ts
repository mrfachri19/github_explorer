import { create } from "zustand";

export type User = {
  id: number;
  login: string;
};

export type Repo = {
  id: number;
  name: string;
  stargazers_count: number;
  description: string;
};

type Store = {
  username: string;
  users: User[];
  repos: Repo[];
  selectedUser: string | null;
  setUsername: (username: string) => void;
  setUsers: (users: User[]) => void;
  setRepos: (repos: Repo[]) => void;
  setSelectedUser: (user: string | null) => void;
};

export const useStore = create<Store>((set) => ({
  username: "",
  users: [],
  repos: [],
  selectedUser: null,
  setUsername: (username) => set({ username }),
  setUsers: (users) => set({ users }),
  setRepos: (repos) => set({ repos }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
