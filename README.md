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
| `npm run get-token` | Fetches an auth token and saves it to `.env.local` for IDE GraphQL plugins. |

## 🧪 Tests

TODO: Implement automated tests.
Current project doesn't have a test suite configured yet.

## 📝 License

TODO: Add license information (e.g., MIT).
Check the project's legal requirements or ask the project owner.
