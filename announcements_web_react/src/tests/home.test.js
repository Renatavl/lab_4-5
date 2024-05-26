import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";
import Cookies from "js-cookie";

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

describe("App Component", () => {
  test("renders home page by default", () => {
    render(<App />);

    expect(screen.getByText("Announcements Web")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  test("renders SignIn page when clicking on Log In link", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Log In"));

    expect(screen.getByText("User name")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  test("renders SignUp page when clicking on Register link", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Register"));
    expect(window.location.pathname).toBe("/register");
  });

  test("renders Local List and Create links when user is logged in", () => {
    Cookies.get.mockImplementation(() => ({ user_id: "12345" })); // mock user_id as logged in

    render(<App />);

    expect(screen.getByText("Local List")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  test("log out action works correctly", async () => {
    Cookies.get.mockImplementation(() => "1"); // mock user_id as logged in

    render(<App />);

    fireEvent.click(screen.getByText("Actions"));
    await new Promise((resolve) => setTimeout(resolve, 500));
    fireEvent.click(screen.getByText("Logout"));

    expect(Cookies.remove).toHaveBeenCalledWith("user_id");
    expect(window.location.pathname).toBe("/register");
  });
});
