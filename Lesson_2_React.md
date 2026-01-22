# Lesson 2: React Styling, Images, Packages & Architecture

## Table of Contents

1. [Styling in React with Tailwind CSS](#styling-in-react-with-tailwind-css)
2. [Images in React](#images-in-react)
3. [Popular React Packages](#popular-react-packages)
4. [Routing with React Router](#routing-with-react-router)
5. [Scalable Code Structure](#scalable-code-structure)

---

## Styling in React with Tailwind CSS

### What is Tailwind CSS?

Tailwind CSS is a **utility-first** CSS framework that provides low-level utility classes to build custom designs directly in your markup. Instead of writing custom CSS, you compose small utility classes to create complex components.

**Key Benefits:**

- **Rapid Development**: Build UIs faster with pre-built classes
- **Consistent Design**: Built-in design system with spacing, colors, typography
- **Responsive by Default**: Mobile-first responsive design utilities
- **No CSS Conflicts**: Utility classes eliminate CSS specificity issues
- **Small Bundle Size**: Only includes CSS for classes you actually use

**Utility-First Approach:**

```jsx
// Traditional CSS approach
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

// Tailwind utility approach
<button className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium">
  Click me
</button>
```

### Basic Tailwind CSS Usage

**Simple Component Styling:**

```jsx
function Button({ children, variant = "primary" }) {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
}

// Usage
<div className="space-x-4">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="danger">Delete</Button>
  <Button variant="success">Approve</Button>
</div>;
```

### Responsive Design

```jsx
function ResponsiveCard() {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">JD</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">
              John Doe
            </h3>
            <p className="text-sm text-gray-500">Software Developer</p>
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          Passionate about creating amazing user experiences with modern web
          technologies.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            React
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Node.js
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            TypeScript
          </span>
        </div>
      </div>
    </div>
  );
}
```

**Responsive Breakpoints:**

- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)
- `xl:` - Extra large screens (1280px+)

### Dynamic Classes

```jsx
function StatusBadge({ status }) {
  const getStatusClasses = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return `${baseClasses} ${statusClasses[status]}`;
  };

  return (
    <span className={getStatusClasses(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

---

## Images in React

### Importing and Using Images

**Static Images:**

```jsx
// Import image
import heroImage from "../assets/hero.jpg";
import logo from "../assets/logo.png";

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <img src={logo} alt="Company Logo" className="h-10 w-auto" />
        <nav className="ml-auto">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-64 object-cover rounded-lg"
          />
        </nav>
      </div>
    </header>
  );
}
```

### Dynamic Images

```jsx
function UserAvatar({ user }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative">
      {!imageError ? (
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={`${user.name}'s avatar`}
          className="w-12 h-12 rounded-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
```

### Image Gallery Component

```jsx
function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.thumbnail}
            alt={image.alt}
            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedImage.full}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## State vs Props - Understanding Data Flow

### What are Props?

Props (properties) are how you pass data **from parent to child** components. Think of props like function parameters - they're inputs that make components reusable.

**Key Rules:**

- Props flow **downward** (parent → child)
- Props are **read-only** (cannot be changed by child)
- Props make components **reusable** with different data

```jsx
// Parent Component
function App() {
  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Developer",
    isOnline: true,
  };

  return (
    <div className="p-6">
      <UserCard
        name={user.name}
        email={user.email}
        role={user.role}
        isOnline={user.isOnline}
      />

      {/* Same component, different data */}
      <UserCard
        name="Bob Smith"
        email="bob@example.com"
        role="Designer"
        isOnline={false}
      />
    </div>
  );
}

// Child Component - Receives props
function UserCard({ name, email, role, isOnline }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-bold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
        <div
          className={`ml-auto w-3 h-3 rounded-full ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>
      <p className="text-gray-700">{email}</p>
    </div>
  );
}
```

### What is State?

State is **internal data** that a component manages and can change over time. When state changes, the component re-renders to show the new data.

**Key Rules:**

- State is **private** to the component
- State can **change** over time
- Changing state **triggers re-render**
- Use `useState` hook to manage state

```jsx
import { useState } from "react";

function ShoppingCart() {
  // State: data that can change
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product) => {
    const newItems = [...items, { ...product, id: Date.now() }];
    setItems(newItems);
    setTotal(total + product.price);
  };

  const removeItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    const removedItem = items.find((item) => item.id === id);
    setItems(newItems);
    setTotal(total - removedItem.price);
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
      >
        <span>🛒</span>
        <span>Cart ({items.length})</span>
        <span>${total.toFixed(2)}</span>
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-bold mb-3">Shopping Cart</h3>

          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="pt-2 border-t font-bold">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Buttons */}
      <div className="mt-4 space-x-2">
        <button
          onClick={() => addItem({ name: "T-Shirt", price: 19.99 })}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Add T-Shirt ($19.99)
        </button>
        <button
          onClick={() => addItem({ name: "Jeans", price: 49.99 })}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Add Jeans ($49.99)
        </button>
      </div>
    </div>
  );
}
```

### State vs Props - Key Differences

| Aspect                 | State                    | Props                       |
| ---------------------- | ------------------------ | --------------------------- |
| **Ownership**          | Owned by component       | Passed from parent          |
| **Mutability**         | Can be changed           | Read-only                   |
| **Purpose**            | Internal data management | Data passing                |
| **Triggers Re-render** | Yes, when changed        | Yes, when parent updates    |
| **Example**            | `useState(0)`            | `<Component name="John" />` |

### Combining State and Props

Real applications use both state and props together:

```jsx
// Parent with state
function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build an app", completed: true },
  ]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo} // Props: passing data down
          onToggle={toggleTodo} // Props: passing function down
        />
      ))}
    </div>
  );
}

// Child component receives props
function TodoItem({ todo, onToggle }) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg mb-2 ${
        todo.completed ? "bg-green-100" : "bg-gray-100"
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)} // Calls parent function
        className="mr-3"
      />
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-gray-500" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
    </div>
  );
}
```

### Best Practices

**1. Keep State Local**

- Only lift state up when multiple components need it
- Start with local state, move up as needed

**2. Props Naming**

- Use descriptive names: `userName` not `name`
- Use `onAction` for function props: `onSubmit`, `onClick`

**3. State Updates**

- Always use setter function: `setCount(count + 1)`
- For objects/arrays, create new copies: `setUser({...user, name: 'New Name'})`

**4. Component Responsibility**

- Parent manages state, children display data
- Children communicate up through function props
- Keep components focused on single responsibility

---

## Popular React Packages

### Essential Packages for React Projects

**1. React Router - Navigation**

```bash
npm install react-router-dom
```

**2. Axios - HTTP Requests**

```bash
npm install axios
```

**3. React Hook Form - Form Handling**

```bash
npm install react-hook-form
```

**4. React Query/TanStack Query - Data Fetching**

```bash
npm install @tanstack/react-query
```

**5. Zustand - State Management**

```bash
npm install zustand
```

**6. React Hot Toast - Notifications**

```bash
npm install react-hot-toast
```

**7. Date-fns - Date Utilities**

```bash
npm install date-fns
```

**8. Framer Motion - Animations**

```bash
npm install framer-motion
```

**9. React Icons - Icon Library**

```bash
npm install react-icons
```

**10. Lucide React - Modern Icons**

```bash
npm install lucide-react
```

**11. Heroicons - Tailwind UI Icons**

```bash
npm install @heroicons/react
```

**12. Tailwind CSS - Utility-First Styling**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```jsx
function Card() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Product Card</h2>
      <p className="text-gray-600 mb-4">Simple card with Tailwind CSS</p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
        Buy Now
      </button>
    </div>
  );
}
```

---

## Routing with React Router

### What is React Router?

React Router is the standard routing library for React applications. It enables navigation between different components/pages without refreshing the entire page (Single Page Application - SPA behavior).

**Key Benefits:**

- **Client-side routing**: Fast navigation without page reloads
- **URL synchronization**: Browser URL reflects current page
- **History management**: Back/forward buttons work correctly
- **Code splitting**: Load components only when needed

### Core Router Components Explained

**1. BrowserRouter**

- **Purpose**: Provides routing context to your entire app
- **Usage**: Wrap your entire app component
- **What it does**: Uses HTML5 history API for clean URLs

**2. Routes**

- **Purpose**: Container for all your route definitions
- **Usage**: Wrap all `<Route>` components
- **What it does**: Matches current URL to appropriate route

**3. Route**

- **Purpose**: Defines a single route mapping
- **Props**: `path` (URL pattern) and `element` (component to render)
- **What it does**: Renders component when URL matches path

**4. Link**

- **Purpose**: Navigation without page refresh
- **Usage**: Replace `<a>` tags for internal navigation
- **What it does**: Updates URL and renders new component

### Basic Setup with Explanations

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  return (
    // BrowserRouter: Enables routing for entire app
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar: Always visible on all pages */}
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          {/* Routes: Container for all route definitions */}
          <Routes>
            {/* Route: Maps URL path to component */}
            <Route path="/" element={<Home />} /> {/* Homepage */}
            <Route path="/about" element={<About />} /> {/* About page */}
            <Route path="/contact" element={<Contact />} /> {/* Contact page */}
            <Route path="*" element={<NotFound />} /> {/* 404 - Catch all */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
```

**How it works:**

1. **BrowserRouter** wraps the app and provides routing context
2. **Navbar** stays visible on all pages (outside Routes)
3. **Routes** looks at current URL and finds matching Route
4. **Route** renders the appropriate component based on URL
5. **Wildcard route** (`*`) catches unmatched URLs for 404 pages

### Navigation Component with Explanations

```jsx
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  // useLocation: Hook to get current URL information
  const location = useLocation();

  // Helper function to check if current path matches link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Link: Navigation without page refresh */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            MyApp
          </Link>

          <div className="flex space-x-4">
            {/* Conditional styling based on active route */}
            <Link
              to="/" // Target URL
              className={`px-3 py-2 rounded-md ${
                isActive("/")
                  ? "bg-blue-600 text-white" // Active styles
                  : "text-gray-700 hover:text-blue-600" // Inactive styles
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-md ${
                isActive("/about")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md ${
                isActive("/contact")
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Key Concepts:**

- **useLocation()**: Returns current location object with pathname, search, etc.
- **Link component**: Creates navigational links that update URL without refresh
- **Active state**: Visual feedback showing current page
- **Conditional styling**: Different styles for active vs inactive links

### React Router Hooks - Simple Explanations

#### 1. useParams() - Get URL Parameters

**What it does**: Extracts dynamic parts from the URL

```jsx
// URL: /users/123
// Route: <Route path="/users/:id" element={<UserDetail />} />

import { useParams } from "react-router-dom";

function UserDetail() {
  const params = useParams();
  console.log(params); // { id: "123" }

  // Or destructure directly
  const { id } = useParams();
  console.log(id); // "123"

  return <div>User ID: {id}</div>;
}
```

#### 2. useNavigate() - Go to Different Pages

**What it does**: Programmatically navigate to other pages (like clicking a link)

```jsx
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/"); // Go to homepage
  };

  const goToUsers = () => {
    navigate("/users"); // Go to users page
  };

  const goBack = () => {
    navigate(-1); // Go back one page (like browser back button)
  };

  return (
    <div>
      <button onClick={goToHome}>Go Home</button>
      <button onClick={goToUsers}>View Users</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}
```

#### 3. useLocation() - Know Where You Are

**What it does**: Tells you information about the current page/URL

```jsx
import { useLocation } from "react-router-dom";

function MyComponent() {
  const location = useLocation();

  console.log(location.pathname); // Current path: "/users/123"
  console.log(location.search); // Query string: "?tab=profile"
  console.log(location.hash); // Hash: "#section1"

  return (
    <div>
      <p>Current page: {location.pathname}</p>
      {location.pathname === "/users" && <p>You're on the users page!</p>}
    </div>
  );
}
```

### Hook Comparison - When to Use What

| Hook            | Purpose                | Example Use Case               |
| --------------- | ---------------------- | ------------------------------ |
| `useParams()`   | Get URL parameters     | Get user ID from `/users/:id`  |
| `useNavigate()` | Go to other pages      | Redirect after form submission |
| `useLocation()` | Know current page info | Highlight active menu item     |

---

## Scalable Code Structure

### Small to Medium Projects - Component-Based Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements (buttons, inputs, modals)
│   │   ├── Button.jsx   # Reusable button component with variants
│   │   ├── Input.jsx    # Form input component with validation
│   │   ├── Modal.jsx    # Modal/dialog component
│   │   └── index.js     # Exports all UI components for easy importing
│   ├── layout/          # Layout-related components
│   │   ├── Header.jsx   # Site header with navigation
│   │   ├── Footer.jsx   # Site footer with links
│   │   ├── Sidebar.jsx  # Sidebar navigation component
│   │   └── Layout.jsx   # Main layout wrapper component
│   └── forms/           # Form-specific components
│       ├── ContactForm.jsx  # Contact form with validation
│       └── LoginForm.jsx    # User login form
├── pages/               # Page-level components (one per route)
│   ├── Home.jsx         # Homepage component
│   ├── About.jsx        # About page component
│   ├── Contact.jsx      # Contact page component
│   └── NotFound.jsx     # 404 error page component
├── hooks/               # Custom React hooks for reusable logic
│   ├── useApi.js        # Hook for API calls with loading/error states
│   ├── useAuth.js       # Hook for authentication logic
│   └── useLocalStorage.js # Hook for localStorage operations
├── services/            # API calls and external service integrations
│   ├── api.js           # Axios configuration and base API setup
│   ├── auth.js          # Authentication-related API calls
│   └── storage.js       # Local/session storage utilities
├── utils/               # Pure utility functions and helpers
│   ├── helpers.js       # General helper functions
│   ├── constants.js     # App-wide constants and configuration
│   └── formatters.js    # Data formatting functions (dates, currency)
├── store/               # State management (Zustand, Redux, etc.)
│   ├── authStore.js     # Authentication state management
│   └── userStore.js     # User-related state management
├── assets/              # Static files and resources
│   ├── images/          # Image files (logos, backgrounds, etc.)
│   ├── icons/           # Icon files (SVG, PNG icons)
│   └── fonts/           # Custom font files
├── styles/              # Global CSS and styling
│   ├── globals.css      # Global styles and CSS reset
│   └── components.css   # Component-specific styles
├── App.jsx              # Main app component with routing
└── main.jsx             # App entry point and React DOM rendering
```

### Large Applications - Feature-Based Structure

```
src/
├── shared/              # Code shared across all features
│   ├── components/      # Reusable UI components used by multiple features
│   │   ├── ui/          # Basic UI building blocks
│   │   │   ├── Button/  # Button component with tests and variants
│   │   │   ├── Modal/   # Modal component with different types
│   │   │   └── index.js # Exports all shared UI components
│   │   ├── layout/      # Layout components for app structure
│   │   │   ├── Header/  # Main app header with navigation
│   │   │   ├── Footer/  # App footer with links and info
│   │   │   └── Sidebar/ # Collapsible sidebar navigation
│   │   └── forms/       # Shared form components and validation
│   ├── hooks/           # Custom hooks used across features
│   │   ├── useApi.js    # Generic API calling hook
│   │   ├── useAuth.js   # Authentication state and methods
│   │   └── useLocalStorage.js # Browser storage operations
│   ├── services/        # Shared API services and configurations
│   │   ├── api.js       # Base API configuration with interceptors
│   │   ├── auth.js      # Authentication API calls
│   │   └── storage.js   # Storage utilities and helpers
│   ├── utils/           # Utility functions used across features
│   │   ├── helpers.js   # General purpose helper functions
│   │   ├── constants.js # App-wide constants and enums
│   │   └── formatters.js # Data formatting and validation
│   └── store/           # Global application state
│       ├── authStore.js # User authentication state
│       └── appStore.js  # Global app settings and preferences
├── features/            # Feature-specific modules (business logic)
│   ├── authentication/ # User login, signup, password reset
│   │   ├── components/  # Auth-specific UI components
│   │   ├── pages/       # Auth pages (login, signup, forgot password)
│   │   ├── hooks/       # Auth-specific custom hooks
│   │   ├── services/    # Auth API calls and validation
│   │   ├── store/       # Auth state management
│   │   └── index.js     # Feature exports for clean imports
│   ├── dashboard/       # Main dashboard and analytics
│   │   ├── components/  # Dashboard widgets and charts
│   │   ├── pages/       # Dashboard main page and sub-pages
│   │   ├── hooks/       # Dashboard data fetching hooks
│   │   ├── services/    # Dashboard API calls
│   │   └── store/       # Dashboard state and data
│   ├── users/           # User management and profiles
│   │   ├── components/  # User list, cards, forms, profiles
│   │   ├── pages/       # User listing, detail, edit pages
│   │   ├── hooks/       # User data management hooks
│   │   ├── services/    # User CRUD operations
│   │   └── store/       # User state management
│   └── products/        # Product catalog and management
│       ├── components/  # Product cards, lists, filters
│       ├── pages/       # Product listing, detail, edit pages
│       ├── hooks/       # Product data and search hooks
│       ├── services/    # Product API operations
│       └── store/       # Product state and filters
├── assets/              # Static files and media
│   ├── images/          # Application images and graphics
│   ├── icons/           # Icon files and SVG assets
│   └── fonts/           # Custom typography files
├── styles/              # Global styling and themes
│   ├── globals.css      # Global styles, resets, and variables
│   └── components.css   # Shared component styles
├── App.jsx              # Root component with global providers
└── main.jsx             # Application entry point
```

### When to Use Each Structure

**Component-Based Structure (Small-Medium Projects):**

- **Team size**: 1-5 developers
- **Features**: 5-15 main features
- **Components**: < 50 components
- **Benefits**: Simple, easy to navigate, quick setup

**Feature-Based Structure (Large Projects):**

- **Team size**: 5+ developers
- **Features**: 15+ main features
- **Components**: 50+ components
- **Benefits**: Better separation, team ownership, scalable

### Key Principles for Both Structures

**1. Separation of Concerns**

- Keep components focused on UI rendering
- Move business logic to custom hooks
- Isolate API calls in service files
- Store reusable utilities separately

**2. Consistent Naming Conventions**

- Use PascalCase for components (UserCard.jsx)
- Use camelCase for hooks (useUserData.js)
- Use kebab-case for utility files (api-helpers.js)
- Be descriptive with folder and file names

**3. Import/Export Patterns**

- Use index.js files for clean imports
- Export components as named exports when possible
- Group related exports together
- Avoid deep import paths

**4. Scalability Considerations**

- Start with component-based, migrate to feature-based as needed
- Keep shared code in dedicated folders
- Use consistent folder structures within features
- Plan for code splitting and lazy loading