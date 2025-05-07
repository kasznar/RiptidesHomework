import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ContributionsAndRepositoriesScreen } from "./ContributionsAndRepositoriesScreen";
import { MockedProvider } from "@apollo/client/testing";
import { GET_USER_CONTRIBUTIONS } from "./ContributionsAndRepositoriesScreen";
import { URLParams } from "../../shared/URLParams.ts";

vi.mock("../../shared/URLParams.ts", () => ({
  URLParams: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("./RepositoryList.tsx", () => ({
  RepositoryList: () => (
    <div data-testid="repository-list">Repository List Mock</div>
  ),
}));

vi.mock("./Contributions.tsx", () => ({
  Contributions: ({ username }: { username: string }) => (
    <div data-testid="contributions" data-username={username}>
      Contributions Mock
    </div>
  ),
}));

// Mock the useDebounce hook to return immediately for testing
vi.mock("../../shared/useDebounce.ts", () => ({
  useDebounce: vi.fn((val) => val),
}));

const createMocks = (mockData: unknown) => [
  {
    request: {
      query: GET_USER_CONTRIBUTIONS,
      variables: { login: "testuser" },
    },
    result: {
      data: mockData,
    },
  },
];

const createErrorMock = () => [
  {
    request: {
      query: GET_USER_CONTRIBUTIONS,
      variables: { login: "testuser" },
    },
    error: new Error("An error occurred"),
  },
];

const userNotFoundMock = [
  {
    request: {
      query: GET_USER_CONTRIBUTIONS,
      variables: { login: "testuser" },
    },
    result: {
      data: {
        user: null,
      },
    },
  },
];

const successMockData = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: [
          {
            contributionDays: [
              { date: "2023-01-01", contributionCount: 3 },
              { date: "2023-01-02", contributionCount: 5 },
            ],
          },
        ],
      },
    },
  },
};

describe("ContributionsAndRepositoriesScreen", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show search prompt when no user is provided", () => {
    vi.mocked(URLParams.get).mockReturnValue(null);

    render(
      <MockedProvider mocks={[]}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    expect(screen.getByText("Search for a user")).toBeInTheDocument();
    expect(URLParams.get).toHaveBeenCalledWith("user");
  });

  it("should show loading state when fetching data", () => {
    vi.mocked(URLParams.get).mockReturnValue("testuser");

    render(
      <MockedProvider mocks={createMocks(successMockData)} addTypename={false}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show user not found message when user does not exist", async () => {
    vi.mocked(URLParams.get).mockReturnValue("testuser");

    render(
      <MockedProvider mocks={userNotFoundMock} addTypename={false}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("No user with this username"),
      ).toBeInTheDocument();
    });
  });

  it("should show error message when query fails", async () => {
    vi.mocked(URLParams.get).mockReturnValue("testuser");

    render(
      <MockedProvider mocks={createErrorMock()} addTypename={false}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    // Wait for the query to complete
    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("should render contributions and repository list when data is loaded successfully", async () => {
    vi.mocked(URLParams.get).mockReturnValue("testuser");

    render(
      <MockedProvider mocks={createMocks(successMockData)} addTypename={false}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("contributions")).toBeInTheDocument();
      expect(screen.getByTestId("repository-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("contributions")).toHaveAttribute(
      "data-username",
      "testuser",
    );
  });

  it("should update the URL when user input changes", async () => {
    vi.mocked(URLParams.get).mockReturnValue(null);

    render(
      <MockedProvider mocks={[]}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    const input = screen.getByPlaceholderText("Enter username");
    fireEvent.change(input, { target: { value: "newuser" } });

    expect(URLParams.set).toHaveBeenCalledWith("user", "newuser");
  });

  it("should clear the URL param when input is cleared", async () => {
    vi.mocked(URLParams.get).mockReturnValue("testuser");

    render(
      <MockedProvider mocks={[]}>
        <ContributionsAndRepositoriesScreen />
      </MockedProvider>,
    );

    const input = screen.getByPlaceholderText("Enter username");
    fireEvent.change(input, { target: { value: "" } });

    expect(URLParams.delete).toHaveBeenCalledWith("user");
  });
});
