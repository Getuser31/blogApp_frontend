# Blog App - Frontend

A modern **React** blog application built with **Vite**, featuring a full-featured admin dashboard, article management, user authentication, internationalization (i18n), and a responsive UI with **Tailwind CSS**.

> **Backend repository**: [blogApp (Laravel)](https://github.com/Getuser31/blogApp)

---

## Features

- **Article Management** — Create, edit, publish, draft, and delete articles
- **Rich Text Editor** — Trix editor with image insertion, resizing, and alignment
- **Image Upload** — Multi-file upload with preview and "Insert in text" capability
- **Category Management** — Create and manage article categories
- **User Authentication** — Login, registration, profile management, and JWT-based auth
- **Admin Dashboard** — Manage users, roles, articles, and categories
- **Role-Based Access** — Admin and user roles with protected routes
- **Comments** — Leave comments on articles (authenticated users)
- **Favorites** — Save and manage favorite articles
- **Search** — Search articles by title/content
- **Author Profiles** — View author details with paginated articles
- **Pagination** — Load more articles with cursor-based pagination
- **Internationalization (i18n)** — English and French support
- **Responsive Design** — Mobile-friendly layout with Tailwind CSS
- **Testing** — Comprehensive test suite (Jest + React Testing Library)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Apollo Client](https://www.apollographql.com/docs/react/) | GraphQL client |
| [GraphQL](https://graphql.org/) | API query language |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | Internationalization |
| [Trix](https://trix-editor.org/) | Rich text editor |
| [Jest](https://jestjs.io/) | Testing framework |
| [React Testing Library](https://testing-library.com/react) | Component testing |
| [ESLint](https://eslint.org/) | Code linting |

---

## Getting Started

### Prerequisites

- Node.js 18+ (or 20+)
- npm or yarn
- The blogApp backend running (see [blogApp](https://github.com/Getuser31/blogApp))

### Installation

```bash
# Clone the repository
git clone https://github.com/Getuser31/blogApp_frontend.git
cd blogApp_frontend

# Install dependencies
npm install

# Copy environment configuration (if exists)
# cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/graphql
```

Adjust the URL to match your backend GraphQL endpoint.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint source files |

---

## Internationalization (i18n)

This app supports **English** and **French** out of the box.

### How it works

i18n is powered by **i18next** and **react-i18next**. Translations are stored as JSON files in:

```
src/i18n/
├── i18n.js              # i18n configuration
└── locales/
    ├── en/
    │   └── translation.json   # English translations
    └── fr/
        └── translation.json   # French translations
```

### Usage in Components

All UI text in components uses the `useTranslation` hook:

```jsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('myNamespace.myKey')}</h1>;
};
```

### Pluralization

Plural forms are supported using i18next's plural syntax:

```json
{
  "commentsOnArticle": {
    "title_one": "Comment",
    "title_other": "Comments"
  }
}
```

```jsx
t('commentsOnArticle.title', { count: comments.length })
```

### Changing Language

The language toggle is available in the main navigation menu. It updates the language for the entire app immediately.

### Adding a New Language

1. Create a new locale folder: `src/i18n/locales/<lang>/`
2. Copy the English translation file as a starting point
3. Translate all values to the target language
4. Add the language to the `supportedLngs` array in `src/i18n/i18n.js`
5. Add the language option to the menu language switcher in `src/components/menu.jsx`

### Translation Namespaces

All translations are organized under a single namespace (`translation`). The JSON structure groups translations by component or feature:

- `menu` — Navigation menu
- `footer` — Footer section
- `login` — Login page
- `registration` — Registration page
- `userProfile` — User profile page
- `userArticles` — User's articles page
- `favoriteArticles` — Favorite articles page
- `article` — Single article view
- `articles` — Articles listing
- `editArticle` — Edit article page
- `addArticle` — Add article page
- `admin` — Admin dashboard
- `categories` — Category management
- `usersList` — User management table
- `adminUserProfile` — Admin user profile editor
- `commentForm` — Comment form
- `commentsOnArticle` — Comment section
- `authorProfile` — Author profile page
- `categoryDropdown` — Category selection dropdown
- `imageUpload` — Image upload component
- `category` — Category page
- `loading` — Loading state messages
- `error` — Error state messages

---

## GraphQL API

The frontend communicates with the backend via GraphQL.

### Queries

Located in `src/graphql/queries.js`:

| Query | Description |
|-------|-------------|
| `ME_QUERY` | Get current authenticated user |
| `GET_ARTICLES` | List articles (paginated, filterable by category) |
| `GET_ARTICLE` | Get a single article by ID |
| `GET_USERS` | List all users (admin) |
| `GET_ADMIN_USER_PROFILE` | Get user details for admin editing |
| `GET_CATEGORIES` | List all categories |
| `GET_ROLES` | List all user roles |
| `GET_AUTHOR_PROFILE` | Get author profile with paginated articles |
| `GET_FAVORITE_ARTICLES` | Get user's favorite articles |
| `GET_USER_ARTICLES` | Get articles by the current user |

### Mutations

Located in `src/graphql/mutations.js`:

| Mutation | Description |
|----------|-------------|
| `LOGIN_MUTATION` | User login |
| `REGISTER_MUTATION` | User registration |
| `UPDATE_PROFILE` | Update user profile (name, email) |
| `UPDATE_PASSWORD` | Change password |
| `ADD_ARTICLE` | Create a new article |
| `UPDATE_ARTICLE` | Update an existing article |
| `DELETE_ARTICLE` | Delete an article |
| `PublishArticle` | Toggle article publish status |
| `ADD_FAVORITE` | Add article to favorites |
| `REMOVE_FAVORITE` | Remove article from favorites |
| `ADD_COMMENT` | Add a comment to an article |
| `DELETE_COMMENT` | Delete a comment |
| `ADD_CATEGORY` | Create a new category |
| `DELETE_CATEGORY` | Delete a category |
| `UPLOAD_IMAGE` | Upload an image |
| `DELETE_IMAGE` | Delete an image |
| `UPDATE_USER_STATUS` | Toggle user enabled/disabled status |
| `UPDATE_USER_ROLE` | Change user role |

### Schema

The full GraphQL schema is available at `graphql/schema.graphql`.

---

## Project Structure

```
src/
├── api/
│   └── apolloClient.js       # Apollo Client configuration
├── assets/                   # Static assets (images, etc.)
├── components/
│   ├── Admin/
│   │   ├── admin.jsx         # Admin dashboard
│   │   ├── categories.jsx    # Category management
│   │   ├── Articles/
│   │   │   ├── addArticle.jsx
│   │   │   ├── CategoryDropdown.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── Users/
│   │       ├── adminUserProfile.jsx
│   │       └── usersList.jsx
│   ├── articles/
│   │   ├── article.jsx       # Single article view
│   │   ├── articles.jsx      # Articles listing
│   │   ├── editArticle.jsx    # Edit article
│   │   └── userArticles.jsx   # User's articles
│   ├── author/
│   │   └── authorProfile.jsx  # Author profile
│   ├── categories/
│   │   └── category.jsx       # Category page
│   ├── comments/
│   │   ├── commentForm.jsx
│   │   └── commentsOnArticle.jsx
│   ├── user/
│   │   ├── favoriteArticles.jsx
│   │   ├── login.jsx
│   │   ├── registration.jsx
│   │   └── userProfile.jsx
│   ├── footer.jsx
│   └── menu.jsx
├── graphql/
│   ├── queries.js            # GraphQL queries
│   └── mutations.js          # GraphQL mutations
├── i18n/
│   ├── i18n.js               # i18n configuration
│   └── locales/
│       ├── en/translation.json
│       └── fr/translation.json
├── test/                     # Test files
├── utils/
│   ├── auth.js               # Authentication utilities
│   ├── error.jsx             # Error display component
│   ├── formatDate.js         # Date formatting utility
│   └── loading.jsx           # Loading display component
├── AdminLayout.jsx
├── AdminProtectedRoute.jsx
├── AdminRoute.jsx
├── App.jsx
├── App.css
├── AuthContext.jsx           # Authentication context
├── ProtectedRoute.jsx
├── RootLayout.jsx
├── index.css
├── main.jsx
└── router.jsx
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Files

Tests are located in `src/test/` and use **Jest** with **React Testing Library**:

| Test File | What It Tests |
|-----------|---------------|
| `utils.test.js` | Utility functions (auth, formatDate, etc.) |
| `components.test.jsx` | Core UI components (menu, footer, etc.) |
| `AuthContext.test.jsx` | Authentication context provider |
| `Login.test.jsx` | Login page and form validation |
| `Registration.test.jsx` | Registration page and form validation |
| `Article.test.jsx` | Single article view |
| `Articles.test.jsx` | Articles listing with pagination |
| `GraphQL.test.js` | GraphQL query and mutation definitions |
| `Admin.test.jsx` | Admin dashboard and management pages |
| `Comments.test.jsx` | Comments display and form |
| `FavoriteArticles.test.jsx` | Favorite articles page |
| `CategoryDropdown.test.jsx` | Category dropdown component |
| `ImageUpload.test.jsx` | Image upload component |
| `i18n.test.jsx` | Internationalization translations and language switching |

### Test Setup

Test configuration is in `src/test/setup.js`. It includes:

- Vitest configuration with jsdom environment
- Mock for Apollo Client to simulate GraphQL queries/mutations
- Mock for `react-i18next` to avoid translation loading in tests
- Mock for React Router's `useParams`, `useNavigate`, etc.
- Cleanup after each test

---

## Routing

Routes are defined in `src/router.jsx`. The app uses React Router v6 with nested layouts.

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home (articles) | Public |
| `/articles` | Articles listing | Public |
| `/article/:id` | Single article | Public |
| `/category/:category` | Articles by category | Public |
| `/author/:author` | Author profile | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/profile` | User profile | Authenticated |
| `/your-articles` | User's articles | Authenticated |
| `/favorites` | Favorite articles | Authenticated |
| `/admin` | Admin dashboard | Admin |
| `/admin/addArticle` | Create article | Admin |
| `/article/:id/edit` | Edit article | Admin |
| `/admin/categories` | Manage categories | Admin |
| `/admin/listOfUsers` | User list | Admin |
| `/admin/user/:id` | Edit user | Admin |

---

## Authentication

Authentication uses JWT tokens stored in `localStorage`.

- **Login**: The backend returns a token and user data on successful login
- **Session Validation**: On app load, `AuthContext` validates the stored token against the `ME_QUERY`
- **Logout**: Clears the token and resets the Apollo Client cache
- **Protected Routes**: `ProtectedRoute` (authenticated users) and `AdminRoute`/`AdminProtectedRoute` (admin users)

### Auth Flow

1. User logs in → token + user data stored in `localStorage` and `AuthContext`
2. On page refresh → `AuthContext` reads token, validates via `ME_QUERY`
3. Protected routes redirect unauthenticated users to `/login`
4. Admin routes check for `ADMIN` role

---

## Deployment

The project includes a GitHub Actions workflow (`.github/workflows/frontend-deploy.yml`) for automated deployment.

### Build

```bash
npm run build
```

The production build is output to the `dist/` directory, ready to be served by any static file server.

---

## CI/CD

The GitHub Actions workflow:

- Triggers on pushes to the `main` branch
- Installs dependencies
- Lints code
- Runs tests
- Builds the application

---

## License

This project is open-source.
