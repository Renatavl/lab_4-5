import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import List from "../pages/List/List";

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "1"), // Mock user_id as 1
}));

// Mock fetch
global.fetch = jest.fn();

describe("List Component", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      json: async () => ({
        data: JSON.stringify([
          {
            pk: 1,
            fields: {
              subject: "Subject 1",
              title: "Title 1",
              content: "Content 1",
              access: "Access 1",
              create_date: "2024-05-24",
            },
          },
          {
            pk: 2,
            fields: {
              subject: "Subject 2",
              title: "Title 2",
              content: "Content 2",
              access: "Access 2",
              create_date: "2024-05-25",
            },
          },
        ]),
      }),
    });
  });

  test("list is not null when userId is 1", async () => {
    render(<List />);

    // Wait for the list to be loaded
    await waitFor(() => {
      expect(screen.queryAllByTestId("list-item")).toHaveLength(2);
    });

    const listItems = screen.getAllByTestId("list-item");

    // Check if list is not null
    expect(listItems).not.toBeNull();
  });

  test("clicking delete button removes item", async () => {
    render(<List />);

    // Wait for the list to be loaded
    await waitFor(() => {
      expect(screen.queryAllByTestId("list-item")).toHaveLength(2);
    });

    fetch.mockResolvedValue({
      json: async () => ({
        data: JSON.stringify([
          {
            pk: 1,
            fields: {
              subject: "Subject 1",
              title: "Title 1",
              content: "Content 1",
              access: "Access 1",
              create_date: "2024-05-24",
            },
          },
        ]),
      }),
    });
    const listItems = screen.getAllByTestId("list-item");
    const deleteButton = listItems[0].querySelector("button");
    fetch.mockResolvedValueOnce({});

    // Simulate click on delete button
    fireEvent.click(deleteButton);

    // Wait for the list to be updated
    await waitFor(() => {
      expect(screen.queryAllByTestId("list-item")).toHaveLength(1);
    });
  });
});
