# GitHub Repositories & Contributions

## Objective
Build a **single-page application** using your selected JS technologies that fetches and displays a GitHub user's repositories and contributions in the last year. Your code should be version-controlled and stored in a **GitHub repository**.

## Requirements

### 1. Fetch GitHub Repositories
- Use the **GitHub v4 GraphQL API** to retrieve repositories for a given user.
    - [GraphQL Overview](https://graphql.org/)
    - [GitHub GraphQL API v4](https://developer.github.com/v4/)
    - [GitHub GraphQL Explorer](https://developer.github.com/v4/explorer/)

### 2. User Input & Query Persistence
- Add an **input field** for the GitHub username.
- Persist the username as a **query parameter** in the URL (e.g., `http://localhost:3000?user=mitchellh`).
- Allow users to **execute the search manually via a button** or **trigger it automatically** when the input changes.

### 3. Repository List
Each repository entry should display the following details:
- **Name**
- **Short description**
- **Fork status** (Is it a fork?)
- **Last commit date**
- **Issue count**
- **Pull request count**
- The repository name or table row should be an **external link** to the GitHub repository.

### 4. Pagination
- Implement **pagination** to navigate through the repository list.
- Ensure a good **user experience** (e.g., disable the "Next" button when there are no more pages).
    - [GraphQL Pagination Guide](https://relay.dev/graphql/connections.htm)

### 5. Handling Empty & Error States
- Display a **placeholder** when:
    - The input field is empty.
    - No repositories are found for the user.
- Show a **clear error message** if the entered GitHub username does not exist.

### 6. User Contributions
Extend your application with an **interactive contribution chart**:
- Display a bar chart where:
    - The X-axis represents each week from the last year.
    - The Y-axis represents the **total number of contributions** (commits, issues, pull requests, reviews) for that week.
    - Each bar initially shows the total contributions for its week in a single color.
- On hover (or click) over a bar, dynamically break down the hovered bar into **stacked segments** based on **contribution type** (Commits, Issues, Pull Requests, Pull Request Reviews)
    -  Each segment should have a different color.
    - Other bars should remain solid (total contributions only).
    - When the user stops hovering, the bar should return to a single solid color (total contributions).
    - Fetch the breakdown data **dynamically** when needed. Do not preload all breakdowns in advance.
- Hints:
    - Contributions can be grouped weekly by processing GitHub’s `contributionCalendar` daily data.
    - To fetch detailed contribution types for a week, use the `contributionsCollection` query with a specific from and to date range.

### 7. Documentation
- Provide a **README.md** with instructions on how to:
    - Install dependencies
    - Run the application locally

### 8. Bonus: Improve UX & Styling
- Enhance the **user experience** with better UI/UX.
- Improve **styling** for better readability.
- Feel free to **add extra functionalities** that make the app more useful!

⚠️ **Security Reminder:** Never commit your **GitHub token** to version control!  
