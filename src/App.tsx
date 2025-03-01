import React, { useState } from "react";
import axios from "axios";
import { useStore, User } from "./store/githubStore";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const App: React.FC = () => {
  const {
    username,
    users,
    repos,
    selectedUser,
    setUsername,
    setUsers,
    setRepos,
    setSelectedUser,
  } = useStore();
  const [openUser, setOpenUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const searchUsers = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${username}&per_page=5`
      );
      setUsers(response.data.items);
      setRepos([]);
      setOpenUser(null);
      setSelectedUser(null);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Error fetching users", error);
    }
    setLoading(false);
  };

  const fetchRepos = async (user: User, index: number) => {
    if (selectedUser === user.login) {
      setSelectedUser(null);
      setRepos([]);
      setOpenUser(null);
    } else {
      setRepoLoading(true);
      try {
        const response = await axios.get(
          `https://api.github.com/users/${user.login}/repos`
        );
        setSelectedUser(user.login);
        setRepos(response.data);
        setOpenUser(user.login);
        setSelectedIndex(index);
      } catch (error) {
        console.error("Error fetching repositories", error);
      }
      setRepoLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchUsers();
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1 < users.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      fetchRepos(users[selectedIndex], selectedIndex);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          GitHub Repositories Explorer
        </h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            onClick={searchUsers}
            className={`w-full text-white px-4 py-3 rounded-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {users.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-600">
              Showing users for "{username}"
            </h3>
            <div className="mt-2 space-y-2">
              {users.map((user, index) => (
                <div key={user.id}>
                  <div
                    onClick={() => fetchRepos(user, index)}
                    className={`flex justify-between items-center p-3 bg-gray-100 rounded-md shadow-sm cursor-pointer transition ${
                      selectedIndex === index
                        ? "bg-gray-300"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <span className="font-medium">{user.login}</span>
                    {openUser === user.login ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  {selectedUser === user.login && (
                    <div className="mt-2 max-h-60 overflow-auto space-y-2 border p-2 rounded-md bg-gray-50">
                      {repoLoading ? (
                        <p className="text-gray-500 text-sm text-center">
                          Loading repositories...
                        </p>
                      ) : repos.length > 0 ? (
                        repos.map((repo) => (
                          <div
                            key={repo.id}
                            className="p-3 bg-gray-200 rounded-md shadow-sm flex justify-between items-center"
                          >
                            <div>
                              <strong className="block text-lg">
                                {repo.name}
                              </strong>
                              <p className="text-sm text-gray-600">
                                {repo.description || "No description available"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-semibold">
                                {repo.stargazers_count}
                              </span>
                              <StarIcon className="w-5 h-5 text-yellow-500" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center">
                          No repositories found.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
