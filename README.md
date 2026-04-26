# BlogApp Frontend

A modern, responsive React-based frontend for a blogging application. This project uses Vite for building, Apollo Client for GraphQL data fetching, and Tailwind CSS for styling.

## 🚀 Overview

BlogApp Frontend provides a user-friendly interface for reading and managing blog articles. It includes features for both regular users (reading, commenting) and administrators (managing articles, categories, and users).

### Key Features
- **Article Management**: Create, edit, and delete articles with a rich-text editor (React Quill).
- **Category System**: Browse articles by category.
- **Image Uploads**: Support for uploading images to articles.
- **Authentication**: Secure login and registration.
- **Admin Dashboard**: Specialized views for managing the blog's content and users.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Editor**: [React Quill New](https://github.com/gtgalone/react-quill-new)

## 📁 Project Structure

```text
src/
├── api/             # Apollo Client configuration
├── assets/          # Static assets (images, etc.)
├── components/      # React components (Admin, Articles, User, etc.)
├── graphql/         # GraphQL queries and mutations
├── utils/           # Helper functions and common components (Auth, Loading, Error)
├── App.jsx          # Main App component
├── router.jsx       # Routing configuration
└── main.jsx         # Application entry point
scripts/             # Utility scripts (e.g., auth token fetching)
public/              # Public assets
```

## ⚙️ Setup & Installation

### Requirements
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
VITE_GRAPHQL_ENDPOINT=your_graphql_api_endpoint
VITE_TEST_USER_EMAIL=admin@example.com
VITE_TEST_USER_PASSWORD=your_password
```

## 🚀 Running the App

### Development Mode
Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the built application locally:
```bash
npm run preview
```

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the app for production (output in `dist/`). |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run preview` | Previews the production build locally. |
| `npm run test` | Runs the test suite once (CI mode). |
| `npm run test:watch` | Runs tests in watch mode for active development. |
| `npm run get-token` | Fetches an auth token and saves it to `.env.local` for IDE GraphQL plugins. |

## 🧪 Tests

The project uses [Vitest](https://vitest.dev/) as the test runner with [Testing Library](https://testing-library.com/) for React component tests. The test suite covers utilities, components, GraphQL operations, authentication, and user interactions.

### Test Configuration

- **Runner**: Vitest 4
- **Environment**: jsdom (browser-like environment for component tests)
- **Setup file**: `src/test/setup.js` — configures mocks for `localStorage`, `DOMParser`, `URL.createObjectURL`, and `matchMedia`
- **CSS**: Enabled in test environment

### Running Tests

```bash
# Run all tests once (CI mode)
npm run test

# Run tests in watch mode (auto-re-runs on changes)
npm run test:watch
```

### Test Files

All test files are located in `src/test/`:

| File | What it tests |
| :--- | :--- |
| `utils.test.js` | `isAuthenticated` auth utility and `formatDate` date formatting |
| `components.test.jsx` | `ErrorComponent`, `LoadingComponent`, and `ProtectedRoute` |
| `AuthContext.test.jsx` | Auth context provider — login, logout, token validation, and user state |
| `Login.test.jsx` | Login form rendering, input updates, and error display |
| `Registration.test.jsx` | Registration form rendering, password validation, and mutation calls |
| `Comments.test.jsx` | Comment display (`CommentsOnArticle`) and form submission (`CommentForm`) |
| `Articles.test.jsx` | Article list rendering, loading/error states, pagination, and navigation |
| `FavoriteArticles.test.jsx` | Favorites list, loading/error/empty states, and article linking |
| `CategoryDropdown.test.jsx` | Multi-select dropdown with category selection/deselection |
| `ImageUpload.test.jsx` | File upload, image previews, and insert-into-editor functionality |
| `Admin.test.jsx` | Admin dashboard navigation to sub-pages |
| `GraphQL.test.js` | Validity of all GraphQL query and mutation definitions (schema contract tests) |

### What's Covered

- **Utility functions**: Authentication checks, date formatting
- **UI components**: Error/loading states, protected routing
- **Authentication flow**: Login form, registration with validation, token management
- **Content management**: Article listing with pagination, commenting, favorites
- **Admin functionality**: Dashboard navigation, article management UI (image uploads, category selection)
- **GraphQL contracts**: Ensures all queries and mutations match expected structure

## 🚀 CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/frontend-deploy.yml`) that runs on pushes to the `main` branch:

1. SSH into the production server
2. Pull the latest code from the repository
3. Install dependencies (`npm install`)
4. **Run the test suite** (`npm test`)
5. Build the production bundle (`npm run build`)

The CI pipeline ensures that only code that passes all tests is deployed to production.

## 📝 License

TODO: Add license information (e.g., MIT).
Check the project's legal requirements or ask the project owner.
