import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.github.com/search/users", async () => {
    return HttpResponse.json({
      items: [
        { id: 1, login: "testuser1" },
        { id: 2, login: "testuser2" },
      ],
    });
  }),


  http.get(
    "https://api.github.com/users/:username/repos",
    async ({ params }) => {
      console.log("Mock API dipanggil untuk repositori:", params.username);

      const { username } = params as { username: string }; 
      return HttpResponse.json([
        {
          id: 101,
          name: `${username}-repo1`,
          stargazers_count: 5,
          description: "Test repo 1",
        },
        {
          id: 102,
          name: `${username}-repo2`,
          stargazers_count: 8,
          description: "Test repo 2",
        },
      ]);
    }
  ),
];
