import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("GitHub Repositories Explorer", () => {
  test("Show input and Search button", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
});
