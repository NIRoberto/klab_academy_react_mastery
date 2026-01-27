# React Query (TanStack Query) Complete Guide

## Table of Contents
1. [What is React Query?](#what-is-react-query)
2. [Theory and Core Concepts](#theory-and-core-concepts)
3. [Installation and Setup](#installation-and-setup)
4. [Basic Syntax and Usage](#basic-syntax-and-usage)
5. [Advanced Features](#advanced-features)
6. [Integration with Context API](#integration-with-context-api)
7. [Reusable CRUD Hooks](#reusable-crud-hooks)
8. [Best Practices](#best-practices)

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

### Install React Query
```bash
npm install @tanstack/react-query
# or
yarn add @tanstack/react-query
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

## Basic Syntax and Usage

### 1. useQuery - Fetching Data

**What is useQuery?**
The `useQuery` hook is used to fetch data from an API. It automatically handles loading states, errors, caching, and re-fetching. Think of it as a smart replacement for `useEffect` + `useState` when dealing with API calls.

#### Basic Query Example

```tsx
import { useQuery } from '@tanstack/react-query';

// Step 1: Create an API function
// This is a regular async function that fetches data
const fetchUsers = async () => {
  const response = await fetch('/api/users');
  
  // Always check if the request was successful
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  // Return the JSON data
  return response.json();
};

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

#### Query with Parameters

**When to use:** When you need to fetch data based on dynamic values (like user ID, search terms, etc.)

```tsx
// Step 1: API function that accepts parameters
const fetchUser = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

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

// Step 1: Create a function that modifies data
const createUser = async (userData: { name: string; email: string }) => {
  const response = await fetch('/api/users', {
    method: 'POST',                                    // HTTP method for creating
    headers: { 'Content-Type': 'application/json' },  // Tell server we're sending JSON
    body: JSON.stringify(userData),                   // Convert data to JSON string
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();  // Return the created user
};

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
// Step 1: API function that accepts page parameter
const fetchUsers = async ({ pageParam = 1 }) => {
  // pageParam is automatically passed by React Query
  const response = await fetch(`/api/users?page=${pageParam}&limit=10`);
  return response.json();
  
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
const updateUser = async ({ id, ...userData }) => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
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

## Integration with Context API

### Creating a Query Context

```tsx
// context/QueryContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryContextType {
  queryClient: QueryClient;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

// Create query client with custom configuration
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <QueryContext.Provider value={{ queryClient }}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryContext.Provider>
    </QueryClientProvider>
  );
}

export function useQueryContext() {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
}
```

### API Context for Centralized Configuration

```tsx
// context/ApiContext.tsx
import { createContext, useContext, ReactNode } from 'react';

interface ApiConfig {
  baseURL: string;
  headers: Record<string, string>;
}

interface ApiContextType {
  config: ApiConfig;
  updateConfig: (newConfig: Partial<ApiConfig>) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Update headers when auth token changes
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setConfig(prev => ({
        ...prev,
        headers: {
          ...prev.headers,
          Authorization: `Bearer ${token}`,
        },
      }));
    }
  }, []);

  return (
    <ApiContext.Provider value={{ config, updateConfig }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
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