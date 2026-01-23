# TypeScript with React Hooks Guide

## Why TypeScript with React Hooks?

TypeScript provides type safety, better IntelliSense, and catches errors at compile time when working with React Hooks. This guide shows you how to properly type your hooks for maximum benefit.

---

## 1. useState with TypeScript

### Basic Types

```typescript
import { useState } from 'react';

// String state
const [name, setName] = useState<string>(''); // Explicit typing
const [title, setTitle] = useState('React'); // Type inference

// Number state
const [count, setCount] = useState<number>(0);
const [age, setAge] = useState(25); // Inferred as number

// Boolean state
const [isVisible, setIsVisible] = useState<boolean>(false);
const [loading, setLoading] = useState(true); // Inferred as boolean

// Array state
const [items, setItems] = useState<string[]>([]);
const [numbers, setNumbers] = useState<number[]>([1, 2, 3]);
```

### Complex Object Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  tags: string[];
}

const UserComponent = () => {
  // Object state with interface
  const [user, setUser] = useState<User | null>(null);
  
  // Array of objects
  const [products, setProducts] = useState<Product[]>([]);
  
  // Complex nested state
  const [formData, setFormData] = useState<{
    personal: { name: string; age: number };
    preferences: { theme: 'light' | 'dark'; notifications: boolean };
  }>({
    personal: { name: '', age: 0 },
    preferences: { theme: 'light', notifications: true }
  });

  return <div>{user?.name}</div>;
};
```

### Union Types and Enums

```typescript
// Union types
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');

// Enum
enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto'
}
const [theme, setTheme] = useState<Theme>(Theme.Light);

// Generic state
const [data, setData] = useState<T | null>(null); // In generic component
```

---

## 2. useEffect with TypeScript

### Basic useEffect Typing

```typescript
import { useEffect, useState } from 'react';

const EffectComponent = () => {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Basic effect - no return type needed
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // Effect with cleanup - return type is inferred
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, []);

  // Async effect with proper error handling
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users: User[] = await response.json();
        setData(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchData();
  }, []);

  return <div>{data.length} users</div>;
};
```

### Typed Event Handlers in Effects

```typescript
const EventComponent = () => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    // Properly typed event handler
    const handleResize = (event: Event): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Keyboard event handler
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        console.log('Escape pressed');
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return <div>{windowSize.width} x {windowSize.height}</div>;
};
```

---

## 3. useContext with TypeScript

### Creating Typed Context

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

// Define context value type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component with proper typing
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with type safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
```

### Using Typed Context

```typescript
const LoginComponent = () => {
  const { user, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## 4. useReducer with TypeScript

### Typed Reducer Pattern

```typescript
import { useReducer } from 'react';

// State type
interface CounterState {
  count: number;
  step: number;
  history: number[];
}

// Action types
type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET' }
  | { type: 'SET_COUNT'; payload: number };

// Reducer function with proper typing
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, state.count + state.step]
      };
    
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history, state.count - state.step]
      };
    
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload
      };
    
    case 'SET_COUNT':
      return {
        ...state,
        count: action.payload,
        history: [...state.history, action.payload]
      };
    
    case 'RESET':
      return {
        count: 0,
        step: 1,
        history: [0]
      };
    
    default:
      // TypeScript ensures all cases are handled
      const exhaustiveCheck: never = action;
      return state;
  }
};

// Component using typed reducer
const CounterComponent = () => {
  const initialState: CounterState = {
    count: 0,
    step: 1,
    history: [0]
  };

  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        +{state.step}
      </button>
      
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        -{state.step}
      </button>
      
      <input
        type="number"
        value={state.step}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch({ type: 'SET_STEP', payload: parseInt(e.target.value) || 1 })
        }
      />
      
      <button onClick={() => dispatch({ type: 'RESET' })}>
        Reset
      </button>
      
      <div>
        History: {state.history.join(', ')}
      </div>
    </div>
  );
};
```

---

## 5. Custom Hooks with TypeScript

### Generic Custom Hooks

```typescript
// Generic fetch hook
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback((): void => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Usage with specific types
interface ApiUser {
  id: number;
  name: string;
  email: string;
}

const UserList = () => {
  const { data: users, loading, error, refetch } = useFetch<ApiUser[]>('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};
```

### Local Storage Hook with TypeScript

```typescript
type SetValue<T> = T | ((val: T) => T);

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: SetValue<T>): void => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Usage
const SettingsComponent = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [preferences, setPreferences] = useLocalStorage<{
    notifications: boolean;
    language: string;
  }>('preferences', {
    notifications: true,
    language: 'en'
  });

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};
```

---

## 6. Event Handlers with TypeScript

### Common Event Types

```typescript
const EventHandlersComponent = () => {
  const [value, setValue] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Form submitted with value:', value);
  };

  // Button click handler
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    console.log('Button clicked at:', e.clientX, e.clientY);
  };

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // Keyboard event handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  // Select change handler
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log('Selected:', e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      
      <input
        type="file"
        onChange={handleFileChange}
      />
      
      <select onChange={handleSelectChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      
      <button type="button" onClick={handleClick}>
        Click me
      </button>
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## 7. Advanced TypeScript Patterns

### Discriminated Unions for State

```typescript
// Loading states with discriminated unions
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

const useAsyncData = <T>(fetchFn: () => Promise<T>) => {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  const execute = useCallback(async (): Promise<void> => {
    setState({ status: 'loading' });
    
    try {
      const data = await fetchFn();
      setState({ status: 'success', data });
    } catch (error) {
      setState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [fetchFn]);

  return { state, execute };
};

// Usage
const DataComponent = () => {
  const { state, execute } = useAsyncData(() => 
    fetch('/api/data').then(res => res.json())
  );

  // TypeScript knows the exact shape based on status
  switch (state.status) {
    case 'idle':
      return <button onClick={execute}>Load Data</button>;
    
    case 'loading':
      return <div>Loading...</div>;
    
    case 'success':
      return <div>Data: {JSON.stringify(state.data)}</div>;
    
    case 'error':
      return <div>Error: {state.error}</div>;
  }
};
```

### Conditional Hook Types

```typescript
// Hook that returns different types based on parameters
function useData<T extends boolean>(
  immediate: T
): T extends true 
  ? { data: any; loading: boolean; error: string | null }
  : { execute: () => void; data: any; loading: boolean; error: string | null };

function useData<T extends boolean>(immediate: T) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch logic here
      setData({}); // Mock data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  if (immediate) {
    return { data, loading, error };
  }

  return { execute, data, loading, error };
}
```

## Key TypeScript Benefits for React Hooks

1. **Type Safety** - Catch errors at compile time
2. **IntelliSense** - Better autocomplete and suggestions  
3. **Refactoring** - Safe renaming and restructuring
4. **Documentation** - Types serve as inline documentation
5. **Team Collaboration** - Clear contracts between components
6. **Runtime Error Prevention** - Fewer bugs in production