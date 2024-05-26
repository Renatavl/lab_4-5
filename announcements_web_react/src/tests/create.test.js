import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Create from "../pages/Create/Create";
import "@testing-library/jest-dom";
import Cookies from "js-cookie";

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(() => jest.fn()),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Create Component", () => {
  beforeEach(() => {
    Cookies.get.mockImplementation(() => "1"); // default no user_id
  });
  test("renders form correctly", () => {
    render(<Create />);

    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(screen.getByLabelText("Access")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Create Announcement")).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    render(<Create />);

    fireEvent.change(screen.getByLabelText("Subject"), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Test Content" },
    });
    fireEvent.change(screen.getByLabelText("Access"), {
      target: { value: "public" },
    });

    fireEvent.submit(screen.getByTestId("create-form"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8051/announcements/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: "1",
            subject: "Test Subject",
            title: "Test Title",
            content: "Test Content",
            access: "public",
          }),
        }
      );
    });
  });

  test("displays error message on API error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(<Create />);
    let response = {
      status: 400,
      body: { error: "error" },
    };
    fetch.mockRejectedValueOnce(response); // Corrected typo

    fireEvent.submit(screen.getByTestId("create-form"));

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8051/announcements/create",
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
