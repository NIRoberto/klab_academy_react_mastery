# React Query (TanStack Query) Complete Guide

## Table of Contents
1. [What is React Query?](#what-is-react-query)
2. [Theory and Core Concepts](#theory-and-core-concepts)
3. [Installation and Setup](#installation-and-setup)
4. [Basic Syntax and Usage](#basic-syntax-and-usage)
5. [Advanced Features](#advanced-features)
6. [Reusable CRUD Hooks](#reusable-crud-hooks)
7. [Best Practices](#best-practices)

## What is React Query?

React Query (now TanStack Query) is a powerful data-fetching library for React applications that provides:

- **Server State Management**: Handles server data separately from client state
- **Caching**: Intelligent caching with automatic background updates
- **Synchronization**: Keeps data fresh across components and browser tabs
- **Performance**: Reduces unnecessary network requests
- **Developer Experience**: Built-in loading, error, and success states

### Problems React Query Solves:
- Manual cache management
- Duplicate API requests
- Complex loading and error states
- Stale data synchronization
- Background refetching
- Optimistic updates

## Theory and Core Concepts

### 1. Server State vs Client State

**Client State:**
- Form inputs, UI state, theme preferences
- Synchronous and owned by the client
- Easy to manage with useState/useReducer

**Server State:**
- Data from APIs, databases
- Asynchronous and owned by the server
- Can become stale, needs synchronization

### 2. Query Keys

Query keys uniquely identify queries and are used for:
- Caching
- Refetching
- Invalidation
- Sharing data between components

```tsx
// Simple key
['todos']

// Key with parameters
['todos', { status: 'completed' }]

// Hierarchical keys
['users', userId, 'posts']
```

### 3. Query States

Every query has these states:
- **isLoading**: First time loading
- **isFetching**: Any time fetching (including background)
- **isError**: Query failed
- **isSuccess**: Query succeeded
- **isIdle**: Query is disabled

### 4. Stale Time vs Cache Time

**Stale Time**: How long data is considered fresh
```tsx
staleTime: 5 * 60 * 1000 // 5 minutes
```

**Cache Time**: How long unused data stays in cache
```tsx
cacheTime: 10 * 60 * 1000 // 10 minutes
```

## Installation and Setup

### Install React Query and Axios
```bash
npm install @tanstack/react-query axios
# or
yarn add @tanstack/react-query axios
```

### Basic Setup
```tsx
// main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### What is Axios?

**Axios** is a popular HTTP client library for JavaScript that makes API requests easier and more powerful than the native `fetch()` API.

**Why use Axios over fetch()?**
- **Automatic JSON parsing**: No need to call `.json()` on responses
- **Request/Response interceptors**: Global handling of auth tokens and errors
- **Request timeout**: Built-in timeout configuration
- **Better error handling**: Cleaner error objects and status code handling
- **Request cancellation**: Easy to cancel requests
- **Wide browser support**: Works in older browsers

### Axios Global Configuration

**Why configure Axios globally?**
Configuring Axios globally allows you to set default settings like base URL, headers, interceptors, and timeouts that will be applied to all requests throughout your application.

#### Step 1: Basic Axios Instance

**What this does:** Creates a basic HTTP client that all your API calls will use.
**Why it's useful:** Instead of writing the full URL every time, you just write the endpoint.

**For Create React App (CRA):**
```tsx
// services/api.ts
import axios from 'axios';

// Create a basic Axios instance for CRA
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

**For Vite:**
```tsx
// services/api.ts
import axios from 'axios';

// Create a basic Axios instance for Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

**Environment Variables Setup:**

**For Create React App (.env file):**
```bash
# .env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_TIMEOUT=10000
```

**For Vite (.env file):**
```bash
# .env
VITE_API_URL=http://localhost:3001/api
VITE_TIMEOUT=10000
```

**Simple explanation:**
- **CRA**: Uses `process.env.REACT_APP_*` for environment variables
- **Vite**: Uses `import.meta.env.VITE_*` for environment variables
- `baseURL`: The beginning part of all your API URLs
- `timeout`: How long to wait before giving up on a request (10 seconds)
- `headers`: Tell the server we're sending JSON data

**Before:** `fetch('http://localhost:3001/api/users')`
**After:** `api.get('/users')` ✨

#### Step 2: Authentication Setup

**What this does:** Automatically adds your login token to every request so you don't have to remember.
**Why it's useful:** Once a user logs in, all API calls will include their authentication automatically.

```tsx
// constants/auth.ts
export const AUTH_TOKEN_KEY = 'authToken';

// services/auth.ts
import api from './api';
import { AUTH_TOKEN_KEY } from '../constants/auth';

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Simple explanation:**
- **AUTH_TOKEN_KEY**: Common constant to avoid typos and make token key reusable
- **Request interceptor**: Runs before every API call and adds the user's token
- **Response interceptor**: Checks if the server says "you're not logged in" (401 error)
- **Auto-redirect**: If token is invalid, automatically sends user to login page

**What happens:**
1. User logs in → token saved to localStorage with AUTH_TOKEN_KEY
2. User makes API call → token automatically added
3. Server rejects token → user automatically redirected to login

**Usage in other files:**
```tsx
// Login component
import { AUTH_TOKEN_KEY } from '../constants/auth';

// Save token after login
localStorage.setItem(AUTH_TOKEN_KEY, token);

// Check if user is logged in
const isLoggedIn = !!localStorage.getItem(AUTH_TOKEN_KEY);
```

#### Step 3: Authorization & Error Handling

**What this does:** Handles different types of errors that can happen when talking to your server.
**Why it's useful:** Instead of handling errors in every component, handle them once globally.

```tsx
// services/errorHandler.ts
import api from './api';

// Add response interceptor for authorization and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Access denied');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);
```

**Simple explanation:**
- **403 error**: "You don't have permission" (like trying to delete someone else's post)
- **500+ errors**: "Server is broken" (database down, server crash, etc.)
- **Global handling**: All errors are caught and handled in one place

**Error codes explained:**
- `401`: "Who are you?" (not logged in)
- `403`: "I know who you are, but you can't do that" (no permission)
- `404`: "That thing doesn't exist" (page/data not found)
- `500`: "Something broke on our end" (server error)

#### Step 4: API Service Functions with TypeScript

**What this does:** Creates reusable functions for talking to your server with proper type safety.
**Why it's useful:** Instead of writing API calls everywhere, write them once and reuse them.

```tsx
// types/api.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// services/userService.ts
import api from './api';
import type { User, ApiResponse, PaginatedResponse } from '../types/api';

interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export const userService = {
  // GET all users with proper typing
  getUsers: async (params?: UserFilters): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  // GET single user
  getUser: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // POST create user
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  // PUT update user
  updateUser: async (id: string, userData: Partial<Omit<User, 'id'>>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  // DELETE user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Protected endpoints - require authentication
  // GET current user profile (protected)
  getCurrentUserProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  // GET admin dashboard data (protected - admin only)
  getAdminDashboard: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/dashboard');
    return response.data.data;
  },

  // PUT change password (protected)
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put('/users/change-password', passwordData);
  },
};
```

**Simple explanation:**
- **Interfaces**: Like blueprints that describe what your data looks like
- **Generic types**: `<T>` means "this can work with any type of data"
- **Omit**: "Take this type but remove these fields" (for creating new items)
- **Partial**: "All fields are optional" (for updating existing items)

**TypeScript benefits:**
- **Autocomplete**: Your editor knows what fields exist
- **Error catching**: Typos are caught before running code
- **Documentation**: Types serve as built-in documentation

**Usage example:**
```tsx
// TypeScript knows this returns a User object
const user = await userService.getUser('123');
console.log(user.name); // ✅ TypeScript knows 'name' exists
console.log(user.age);  // ❌ TypeScript error: 'age' doesn't exist
```

**Protected Endpoints Example:**
```tsx
// These endpoints require authentication (token automatically added by interceptor)

// Get current user's profile
const currentUser = await userService.getCurrentUserProfile();

// Admin-only endpoint (will return 403 if user is not admin)
try {
  const dashboardData = await userService.getAdminDashboard();
  console.log('Admin dashboard:', dashboardData);
} catch (error) {
  if (error.response?.status === 403) {
    console.log('Access denied: Admin privileges required');
  }
}

// Change password (requires current password)
await userService.changePassword({
  currentPassword: 'oldPassword123',
  newPassword: 'newPassword456'
});
```

**How Protected Endpoints Work:**
1. **Automatic Authentication**: Token is automatically added by the request interceptor
2. **No Manual Headers**: You don't need to manually add Authorization headers
3. **Error Handling**: 401/403 errors are handled globally
4. **Role-Based Access**: Server checks user permissions and returns appropriate errors

**What the server receives in headers:**
```bash
# When you call: userService.getCurrentUserProfile()
# The server receives these headers:

GET /users/me HTTP/1.1
Host: localhost:3001
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# The token is automatically added by the interceptor:
# config.headers.Authorization = `Bearer ${token}`;
```

**Token Storage: localStorage vs Cookies**

**Option 1: localStorage (Common but Less Secure)**
```tsx
// After login - save token to localStorage
const { user, token } = await authService.login({ email, password });
localStorage.setItem(AUTH_TOKEN_KEY, token);

// Interceptor reads from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout - remove from localStorage
const handleLogout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = '/login';
};
```

**Option 2: HTTP-Only Cookies (More Secure - RECOMMENDED)**
```tsx
// services/api.ts - Cookie-based authentication
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  withCredentials: true, // Important: sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// No need for request interceptor - cookies sent automatically
// Server sets cookie on login:
// Set-Cookie: authToken=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Strict

// Login service (cookie-based)
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    // Server sets HTTP-only cookie automatically
    const response = await api.post<ApiResponse<AuthUser>>('/auth/login', credentials);
    return response.data.data; // Only return user, not token
  },

  logout: async (): Promise<void> => {
    // Server clears the cookie
    await api.post('/auth/logout');
  },
};
```

**Why Cookies are More Secure:**

| Feature | localStorage | HTTP-Only Cookies |
|---------|-------------|-------------------|
| **XSS Protection** | ❌ Accessible to JavaScript | ✅ Not accessible to JavaScript |
| **CSRF Protection** | ✅ Not sent automatically | ⚠️ Needs CSRF tokens |
| **Automatic Sending** | ❌ Manual header required | ✅ Sent automatically |
| **Storage Location** | 📱 Client-side | 🔒 Client-side (secure) |
| **Expiration** | ❌ Manual management | ✅ Server-controlled |

**Security Comparison:**

```tsx
// ❌ localStorage - Vulnerable to XSS attacks
// Malicious script can access:
console.log(localStorage.getItem('authToken')); // Gets your token!

// ✅ HTTP-Only Cookies - Protected from XSS
// Malicious script CANNOT access:
console.log(document.cookie); // Won't show HTTP-only cookies
```

**Why HTTP-Only Cookies are Important:**

1. **XSS Protection**: Even if malicious JavaScript runs on your site, it can't steal the authentication cookie
2. **Automatic Management**: Browser handles sending cookies automatically
3. **Server Control**: Server can set expiration, security flags, and domain restrictions
4. **Industry Standard**: Used by major platforms (Google, Facebook, etc.)

**Cookie Security Flags:**
```bash
# Server sets secure cookie (backend code)
Set-Cookie: authToken=abc123; 
  HttpOnly;        # Prevents JavaScript access
  Secure;          # Only sent over HTTPS
  SameSite=Strict; # Prevents CSRF attacks
  Max-Age=86400;   # Expires in 24 hours
  Path=/;          # Available for entire site
```

**Implementation Choice:**
```tsx
// For learning/development: localStorage is easier
const token = localStorage.getItem(AUTH_TOKEN_KEY);

// For production: HTTP-only cookies are more secure
const api = axios.create({ withCredentials: true });
```

#### Step 5: Complete API Services Examples

**What this does:** Shows you complete, real-world examples for different types of data (users, products, categories, auth).
**Why it's useful:** Copy-paste ready code that you can use in actual projects.

```tsx
// types/api.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// services/authService.ts
import api from './api';
import type { AuthUser, LoginCredentials, RegisterData, ApiResponse } from '../types/api';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> => {
    const response = await api.post<ApiResponse<{ user: AuthUser; token: string }>>('/auth/login', credentials);
    return response.data.data;
  },

  // Register
  register: async (userData: RegisterData): Promise<{ user: AuthUser; token: string }> => {
    const response = await api.post<ApiResponse<{ user: AuthUser; token: string }>>('/auth/register', userData);
    return response.data.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get<ApiResponse<AuthUser>>('/auth/me');
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data;
  },
};

// services/categoryService.ts
import api from './api';
import type { Category, ApiResponse, PaginatedResponse } from '../types/api';

interface CategoryFilters {
  search?: string;
  parentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const categoryService = {
  // GET all categories
  getCategories: async (params?: CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const response = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return response.data;
  },

  // GET single category
  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  // POST create category
  createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data.data;
  },

  // PUT update category
  updateCategory: async (id: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return response.data.data;
  },

  // DELETE category
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// services/productService.ts
import api from './api';
import type { Product, ApiResponse, PaginatedResponse } from '../types/api';

interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const productService = {
  // GET all products
  getProducts: async (params?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  // GET single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // GET products by category
  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/categories/${categoryId}/products`);
    return response.data.data;
  },

  // POST create product
  createProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data.data;
  },

  // PUT update product
  updateProduct: async (id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data.data;
  },

  // DELETE product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Upload product images
  uploadImages: async (id: string, files: File[]): Promise<Product> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await api.post<ApiResponse<Product>>(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};
```

**Simple explanation:**

**Auth Service** - Handle user login/logout:
- `login()`: User signs in with email/password
- `register()`: Create new user account
- `getCurrentUser()`: Get info about logged-in user
- `logout()`: Sign user out
- `refreshToken()`: Get new token when old one expires

**Category Service** - Organize products into groups:
- `getCategories()`: List all categories (with search/filter)
- `getCategory()`: Get one specific category
- `createCategory()`: Add new category
- `updateCategory()`: Edit existing category
- `deleteCategory()`: Remove category

**Product Service** - Manage your products:
- `getProducts()`: List products (with search, price filter, etc.)
- `getProduct()`: Get one specific product
- `getProductsByCategory()`: Products in a specific category
- `createProduct()`: Add new product
- `updateProduct()`: Edit existing product
- `deleteProduct()`: Remove product
- `uploadImages()`: Add photos to product

**Real-world usage:**
```tsx
// Login a user
const { user, token } = await authService.login({ email: 'john@example.com', password: '123456' });

// Get products under $50
const cheapProducts = await productService.getProducts({ maxPrice: 50 });

// Create a new category
const newCategory = await categoryService.createCategory({
  name: 'Electronics',
  slug: 'electronics',
  isActive: true
});
```

## Basic Syntax and Usage

### 1. useQuery - Fetching Data

**What is useQuery?**
The `useQuery` hook is used to fetch data from an API. It automatically handles loading states, errors, caching, and re-fetching. Think of it as a smart replacement for `useEffect` + `useState` when dealing with API calls.

#### Basic Query Example

```tsx
import { useQuery } from '@tanstack/react-query';
import api from '../services/api'; // Import our configured Axios instance

// Step 1: Create an API function using our configured Axios instance
// This is a regular async function that fetches data
const fetchUsers = async () => {
  // Using our configured api instance (includes baseURL, auth headers, etc.)
  const response = await api.get('/users');
  
  // Axios automatically parses JSON, so we just return response.data
  return response.data;
};

// Alternative: Use the service function we created
// import { userService } from '../services/userService';
// const fetchUsers = () => userService.getUsers();

// Step 2: Use the query in your component
function UsersList() {
  const {
    data: users,        // The actual data from the API (renamed from 'data' to 'users')
    isLoading,          // True when fetching for the first time
    isError,            // True if an error occurred
    error,              // The actual error object
    isSuccess           // True when data was fetched successfully
  } = useQuery({
    queryKey: ['users'],    // Unique identifier for this query (used for caching)
    queryFn: fetchUsers,    // The function that fetches the data
  });

  // Step 3: Handle different states
  
  // Show loading spinner while fetching
  if (isLoading) return <div>Loading...</div>;
  
  // Show error message if something went wrong
  if (isError) return <div>Error: {error.message}</div>;

  // Show the data when everything is successful
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Key Points:**
- **queryKey**: Like a unique ID for your query. React Query uses this for caching
- **queryFn**: The function that actually fetches your data
- **Automatic re-fetching**: React Query will automatically refetch when the component mounts, window refocuses, etc.
- **Caching**: If you use the same queryKey elsewhere, React Query will return cached data instantly
- **Axios benefits**: Automatic JSON parsing, built-in error handling, and cleaner syntax

#### Query with Parameters

**When to use:** When you need to fetch data based on dynamic values (like user ID, search terms, etc.)

```tsx
import api from '../services/api'; // Import our configured Axios instance
// Or use the service function:
// import { userService } from '../services/userService';

// Step 1: API function that accepts parameters
const fetchUser = async (userId: string) => {
  // Using our configured api instance
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Alternative using service function:
// const fetchUser = (userId: string) => userService.getUser(userId);

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['users', userId],        // Include the parameter in the key
    queryFn: () => fetchUser(userId),   // Pass the parameter to your function
    enabled: !!userId,                  // Only run the query if userId exists
  });

  if (isLoading) return <div>Loading user...</div>;
  if (isError) return <div>User not found</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

**Key Points:**
- **Dynamic queryKey**: Include parameters in the key so different users get cached separately
- **enabled**: Prevents the query from running until conditions are met
- **Arrow function**: Use `() => fetchUser(userId)` to pass parameters to your fetch function

### 2. useMutation - Modifying Data

**What is useMutation?**
The `useMutation` hook is used for operations that change data on the server (POST, PUT, DELETE). Unlike `useQuery`, mutations don't run automatically - you trigger them manually.

#### Basic Mutation Example

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api'; // Import our configured Axios instance
// Or use the service function:
// import { userService } from '../services/userService';

// Step 1: Create a function that modifies data using our configured Axios instance
const createUser = async (userData: { name: string; email: string }) => {
  // Using our configured api instance (includes auth headers, baseURL, etc.)
  const response = await api.post('/users', userData);
  
  // Axios automatically parses the response JSON
  return response.data;  // Return the created user
};

// Alternative using service function:
// const createUser = (userData: { name: string; email: string }) => 
//   userService.createUser(userData);

function CreateUserForm() {
  // Get access to the query client (for cache management)
  const queryClient = useQueryClient();
  
  // Step 2: Set up the mutation
  const mutation = useMutation({
    mutationFn: createUser,           // The function that creates the user
    
    // Step 3: Handle success
    onSuccess: () => {
      // Invalidate the users list so it refetches with the new user
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    
    // Step 4: Handle errors
    onError: (error) => {
      console.error('Error creating user:', error);
    },
  });

  // Step 5: Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Trigger the mutation with the form data
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      
      {/* Step 6: Show different button states */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      
      {/* Step 7: Show error messages */}
      {mutation.isError && (
        <div style={{ color: 'red' }}>
          Error: {mutation.error?.message}
        </div>
      )}
      
      {/* Step 8: Show success messages */}
      {mutation.isSuccess && (
        <div style={{ color: 'green' }}>
          User created successfully!
        </div>
      )}
    </form>
  );
}
```

**Key Points:**
- **mutationFn**: The function that performs the server operation
- **mutation.mutate()**: Call this to trigger the mutation
- **isPending**: True while the mutation is running (use for loading states)
- **onSuccess**: Runs when mutation succeeds (perfect for updating cache)
- **invalidateQueries**: Tells React Query to refetch related data

**Common Mutation States:**
- `mutation.isPending` - Currently running
- `mutation.isError` - Failed
- `mutation.isSuccess` - Completed successfully
- `mutation.error` - The error object (if failed)
- `mutation.data` - The returned data (if successful)

### 3. useInfiniteQuery - Pagination

**What is useInfiniteQuery?**
This hook is perfect for "Load More" buttons or infinite scrolling. It manages multiple pages of data and provides functions to fetch the next page.

```tsx
import api from '../services/api'; // Import our configured Axios instance

// Step 1: API function that accepts page parameter using our configured Axios instance
const fetchUsers = async ({ pageParam = 1 }) => {
  // pageParam is automatically passed by React Query
  const response = await api.get(`/users?page=${pageParam}&limit=10`);
  
  // Axios automatically parses JSON, return the data
  return response.data;
  
  // Expected API response format:
  // {
  //   users: [...],     // Array of users for this page
  //   hasMore: true,    // Whether there are more pages
  //   currentPage: 1,   // Current page number
  //   totalPages: 5     // Total number of pages
  // }
};

function InfiniteUsersList() {
  const {
    data,                    // Contains all pages of data
    fetchNextPage,           // Function to load the next page
    hasNextPage,            // Boolean: are there more pages?
    isFetchingNextPage,     // Boolean: currently loading next page?
    isLoading,              // Boolean: loading the first page?
  } = useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: fetchUsers,
    
    // Step 2: Tell React Query how to get the next page
    getNextPageParam: (lastPage, pages) => {
      // Return the next page number, or undefined if no more pages
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  // Show loading for the first page
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Step 3: Render all pages */}
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.users.map(user => (
            <div key={user.id} style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      ))}
      
      {/* Step 4: Load More button */}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        style={{
          padding: '10px 20px',
          backgroundColor: hasNextPage ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: hasNextPage ? 'pointer' : 'not-allowed'
        }}
      >
        {isFetchingNextPage
          ? 'Loading more...'        // Currently loading
          : hasNextPage
          ? 'Load More'              // More pages available
          : 'Nothing more to load'}  // No more pages
      </button>
    </div>
  );
}
```

**Key Points:**
- **data.pages**: Array containing all loaded pages
- **getNextPageParam**: Function that determines the next page number
- **fetchNextPage()**: Call this to load the next page
- **hasNextPage**: Automatically calculated based on `getNextPageParam`
- **isFetchingNextPage**: Different from `isLoading` (which is only for the first page)

**Data Structure:**
```tsx
// data.pages looks like this:
[
  { users: [user1, user2, user3], hasMore: true },   // Page 1
  { users: [user4, user5, user6], hasMore: true },   // Page 2
  { users: [user7, user8], hasMore: false },         // Page 3 (last page)
]
```

**Real-world Usage Tips:**
1. **Infinite Scroll**: Use `useInfiniteQuery` with intersection observer
2. **Load More Button**: Use the example above
3. **Search with Pagination**: Include search terms in the queryKey
4. **Reset on Filter Change**: Use `refetch()` when filters change

## Advanced Features

### 1. Optimistic Updates

```tsx
import axios from 'axios';

const updateUser = async ({ id, ...userData }) => {
  const response = await axios.put(`/api/users/${id}`, userData);
  return response.data;
};

function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users', newUser.id] });
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['users', newUser.id]);
      
      // Optimistically update
      queryClient.setQueryData(['users', newUser.id], newUser);
      
      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      queryClient.setQueryData(['users', newUser.id], context?.previousUser);
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}
```

### 2. Dependent Queries

```tsx
function UserPosts({ userId }: { userId: string }) {
  // First query - get user
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query - get user's posts (depends on user)
  const { data: posts } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user, // Only run if user exists
  });

  return (
    <div>
      <h1>{user?.name}'s Posts</h1>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Reusable CRUD Hooks

### 1. Generic API Service

```tsx
// services/api.ts
import { useApi } from '../context/ApiContext';

export class ApiService {
  constructor(private config: { baseURL: string; headers: Record<string, string> }) {}

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: this.config.headers,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Hook to get API service instance
export function useApiService() {
  const { config } = useApi();
  return new ApiService(config);
}
```

### 2. Generic CRUD Hooks

```tsx
// hooks/useCrud.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiService } from '../services/api';

interface CrudOptions<T> {
  resource: string; // e.g., 'users', 'posts'
  queryKey?: string[];
}

export function useCrud<T extends { id: string | number }>(options: CrudOptions<T>) {
  const { resource, queryKey = [resource] } = options;
  const api = useApiService();
  const queryClient = useQueryClient();

  // GET ALL - List items
  const useList = (params?: Record<string, any>) => {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    
    return useQuery({
      queryKey: [...queryKey, 'list', params],
      queryFn: () => api.get<T[]>(`/${resource}${searchParams}`),
    });
  };

  // GET ONE - Get single item
  const useGet = (id: string | number) => {
    return useQuery({
      queryKey: [...queryKey, 'detail', id],
      queryFn: () => api.get<T>(`/${resource}/${id}`),
      enabled: !!id,
    });
  };

  // CREATE - Add new item
  const useCreate = () => {
    return useMutation({
      mutationFn: (data: Omit<T, 'id'>) => api.post<T>(`/${resource}`, data),
      onSuccess: (newItem) => {
        // Add to list cache
        queryClient.setQueryData<T[]>([...queryKey, 'list'], (old) => {
          return old ? [...old, newItem] : [newItem];
        });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: [...queryKey, 'list'] });
      },
    });
  };

  // UPDATE - Modify existing item
  const useUpdate = () => {
    return useMutation({
      mutationFn: ({ id, ...data }: Partial<T> & { id: string | number }) =>
        api.put<T>(`/${resource}/${id}`, data),
      onSuccess: (updatedItem) => {
        // Update item in cache
        queryClient.setQueryData([...queryKey, 'detail', updatedItem.id], updatedItem);
        
        // Update item in list cache
        queryClient.setQueryData<T[]>([...queryKey, 'list'], (old) => {
          return old?.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          );
        });
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: [...queryKey] });
      },
    });
  };

  // DELETE - Remove item
  const useDelete = () => {
    return useMutation({
      mutationFn: (id: string | number) => api.delete(`/${resource}/${id}`),
      onSuccess: (_, deletedId) => {
        // Remove from list cache
        queryClient.setQueryData<T[]>([...queryKey, 'list'], (old) => {
          return old?.filter(item => item.id !== deletedId);
        });
        
        // Remove detail cache
        queryClient.removeQueries({ queryKey: [...queryKey, 'detail', deletedId] });
        
        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: [...queryKey, 'list'] });
      },
    });
  };

  return {
    useList,
    useGet,
    useCreate,
    useUpdate,
    useDelete,
  };
}
```

### 3. Specific Resource Hooks

```tsx
// hooks/useUsers.ts
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export function useUsers() {
  const crud = useCrud<User>({ 
    resource: 'users',
    queryKey: ['users'] 
  });

  // Enhanced list with search
  const useUsersList = (search?: string, role?: string) => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (role) params.role = role;
    
    return crud.useList(params);
  };

  // Get user profile
  const useUserProfile = (userId: string) => {
    return crud.useGet(userId);
  };

  // Create user with validation
  const useCreateUser = () => {
    const mutation = crud.useCreate();
    
    return {
      ...mutation,
      mutate: (userData: Omit<User, 'id' | 'createdAt'>) => {
        // Add client-side validation
        if (!userData.email.includes('@')) {
          throw new Error('Invalid email format');
        }
        
        mutation.mutate({
          ...userData,
          createdAt: new Date().toISOString(),
        });
      },
    };
  };

  // Update user
  const useUpdateUser = () => {
    return crud.useUpdate();
  };

  // Delete user with confirmation
  const useDeleteUser = () => {
    const mutation = crud.useDelete();
    
    return {
      ...mutation,
      mutateWithConfirm: (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
          mutation.mutate(userId);
        }
      },
    };
  };

  return {
    useUsersList,
    useUserProfile,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
  };
}

// hooks/usePosts.ts
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  published: boolean;
}

export function usePosts() {
  const crud = useCrud<Post>({ 
    resource: 'posts',
    queryKey: ['posts'] 
  });

  // Get posts by author
  const usePostsByAuthor = (authorId: string) => {
    return crud.useList({ authorId });
  };

  // Get published posts only
  const usePublishedPosts = () => {
    return crud.useList({ published: 'true' });
  };

  // Publish/unpublish post
  const useTogglePublish = () => {
    const updateMutation = crud.useUpdate();
    
    return useMutation({
      mutationFn: ({ id, published }: { id: string; published: boolean }) =>
        updateMutation.mutateAsync({ id, published }),
    });
  };

  return {
    usePostsList: crud.useList,
    usePost: crud.useGet,
    useCreatePost: crud.useCreate,
    useUpdatePost: crud.useUpdate,
    useDeletePost: crud.useDelete,
    usePostsByAuthor,
    usePublishedPosts,
    useTogglePublish,
  };
}
```

### 4. Usage Examples

```tsx
// components/UsersList.tsx
import { useUsers } from '../hooks/useUsers';

function UsersList() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');
  
  const { data: users, isLoading, error } = useUsers().useUsersList(search, role);
  const createUser = useUsers().useCreateUser();
  const deleteUser = useUsers().useDeleteUser();

  const handleCreateUser = (userData: any) => {
    createUser.mutate(userData, {
      onSuccess: () => {
        alert('User created successfully!');
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="users-list">
        {users?.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="role">{user.role}</span>
            <button 
              onClick={() => deleteUser.mutateWithConfirm(user.id, user.name)}
              disabled={deleteUser.isPending}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <CreateUserForm onSubmit={handleCreateUser} isLoading={createUser.isPending} />
    </div>
  );
}

// components/UserProfile.tsx
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUsers().useUserProfile(userId);
  const { data: posts } = usePosts().usePostsByAuthor(userId);
  const updateUser = useUsers().useUpdateUser();

  const handleUpdateUser = (updates: Partial<User>) => {
    updateUser.mutate({ id: userId, ...updates });
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      
      <h2>Posts ({posts?.length || 0})</h2>
      {posts?.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.published ? 'Published' : 'Draft'}</p>
        </div>
      ))}
      
      <button onClick={() => handleUpdateUser({ name: 'Updated Name' })}>
        Update Profile
      </button>
    </div>
  );
}
```

## Best Practices

### 1. Query Key Management
```tsx
// utils/queryKeys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
};
```

### 2. Error Handling
```tsx
// hooks/useErrorHandler.ts
export function useErrorHandler() {
  const { addNotification } = useNotification();
  
  return (error: Error) => {
    console.error('API Error:', error);
    
    addNotification({
      type: 'error',
      title: 'Error',
      message: error.message || 'Something went wrong',
    });
  };
}

// Usage in components
const { data, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  onError: useErrorHandler(),
});
```

### 3. Loading States
```tsx
// hooks/useGlobalLoading.ts
export function useGlobalLoading() {
  const { isFetching } = useIsFetching();
  const { isPending } = useIsMutating();
  
  return isFetching > 0 || isPending > 0;
}

// components/GlobalLoader.tsx
function GlobalLoader() {
  const isLoading = useGlobalLoading();
  
  if (!isLoading) return null;
  
  return (
    <div className="global-loader">
      <div className="spinner" />
    </div>
  );
}
```

### 4. Offline Support
```tsx
// Setup offline support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
  },
});
```

This comprehensive guide covers React Query from basic concepts to advanced patterns with Context API integration and reusable CRUD hooks. The examples show practical implementations you can use in real applications.