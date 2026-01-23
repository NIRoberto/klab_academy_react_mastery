# React Hooks Guide with TypeScript

## What are React Hooks?

React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and allow you to "hook into" React features without writing class components.

**Important: All examples in this guide use TypeScript for type safety and better development experience.**

## Rules of Hooks

1. Only call Hooks at the top level of your React function
2. Only call Hooks from React function components or custom Hooks
3. Hook names must start with "use"
4. **Always use TypeScript for proper typing and error prevention**

---

## 1. useState Hook

### Description
The `useState` Hook lets you add memory to your components. It's like giving your component a notebook where it can remember things and update them when needed.

### Definition
`useState` helps your component remember a value (like a number, text, or list) and gives you a way to change that value. When you change it, React automatically updates what the user sees.

### Syntax
```typescript
const [state, setState] = useState<StateType>(initialValue);
```

### TypeScript Types for useState
```typescript
// Basic types
const [name, setName] = useState<string>(''); // Explicit typing
const [count, setCount] = useState<number>(0);
const [isVisible, setIsVisible] = useState<boolean>(false);

// Array types
const [items, setItems] = useState<string[]>([]);
const [numbers, setNumbers] = useState<number[]>([1, 2, 3]);

// Object types with interfaces
interface User {
  id: number;
  name: string;
  email: string;
}
const [user, setUser] = useState<User | null>(null);

// Union types
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
```

### Four Small Examples

#### Example 1: Simple Counter
```typescript
const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  
  const handleIncrement = (): void => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
};
```

#### Example 2: Toggle Boolean
```typescript
const Toggle: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const handleToggle = (): void => {
    setIsVisible(!isVisible);
  };
  
  return (
    <div>
      <button onClick={handleToggle}>Toggle</button>
      {isVisible && <p>Now you see me!</p>}
    </div>
  );
};
```

#### Example 3: Form Input with Interface
```typescript
interface FormData {
  name: string;
  email: string;
}

const NameForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div>
      <input 
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter your name"
      />
      <input 
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Enter your email"
      />
      <p>Hello, {formData.name}! Email: {formData.email}</p>
    </div>
  );
};
```

#### Example 4: Array State with Interface
```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  
  const addTodo = (): void => {
    if (input.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: input,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };
  
  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div>
      <input 
        value={input} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
        placeholder="Add a todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li 
            key={todo.id} 
            onClick={() => toggleTodo(todo.id)}
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 2. useEffect Hook

### Description
The `useEffect` Hook lets you perform side effects in functional components. Side effects are operations that interact with the outside world or affect something beyond the component's render output.

### Definition
`useEffect` is like a helper that runs code after your component shows up on the screen. It's perfect for things like fetching data from the internet, setting up timers, or listening for user actions like clicking or scrolling.

### Syntax
```typescript
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]); // Dependencies array (optional)
```

### TypeScript Types for useEffect
```typescript
// Basic effect with no return type needed
useEffect((): void => {
  console.log('Component mounted');
}, []);

// Effect with cleanup - return type is inferred
useEffect((): (() => void) | void => {
  const timer = setInterval(() => {
    console.log('Timer tick');
  }, 1000);
  
  return (): void => clearInterval(timer);
}, []);

// Async effect with proper typing
useEffect((): void => {
  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/data');
      const data: ApiResponse = await response.json();
      setData(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  fetchData();
}, []);
```

### Four Small Examples

#### Example 1: Data Fetching with TypeScript
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect((): void => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData: User[] = await response.json();
        setUsers(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
};
```

#### Example 2: Document Title with Props
```typescript
interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useEffect((): void => {
    document.title = title;
  }, [title]);
  
  return <h1>{title}</h1>;
};
```

#### Example 3: Timer with Cleanup
```typescript
const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  
  useEffect((): (() => void) => {
    const interval: NodeJS.Timeout = setInterval((): void => {
      setSeconds(s => s + 1);
    }, 1000);
    
    return (): void => clearInterval(interval);
  }, []);
  
  return <p>Timer: {seconds}s</p>;
};
```

#### Example 4: Event Listener with TypeScript
```typescript
interface WindowSize {
  width: number;
  height: number;
}

const WindowSizeTracker: React.FC = () => {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });
  
  useEffect((): (() => void) => {
    const updateSize = (): void => {
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    window.addEventListener('resize', updateSize);
    updateSize(); // Set initial size
    
    return (): void => window.removeEventListener('resize', updateSize);
  }, []);
  
  return <p>Window Size: {size.width} x {size.height}</p>;
};
```

---

## 3. useContext Hook

### Description
The `useContext` Hook allows you to share data between components without passing props down through every level. Think of it as a way to create "global" data that any component can access.

### Definition
`useContext` lets you read data from a React Context. Context is like a container that holds data you want to share across multiple components.

### When to Use Context
- When you need to share the same data in many components (like user info, theme, language)
- When passing props through many levels becomes tedious
- **Note: Start with props first, use Context only when you really need it**

### Simple Beginner Pattern
```typescript
// Step 1: Create a context
const MyContext = createContext<string>('default value');

// Step 2: Provide the context value
const App = () => {
  return (
    <MyContext.Provider value="Hello from Context!">
      <ChildComponent />
    </MyContext.Provider>
  );
};

// Step 3: Use the context in any child component
const ChildComponent = () => {
  const message = useContext(MyContext);
  return <p>{message}</p>; // Shows: "Hello from Context!"
};
```

### Four Small Examples

#### Example 1: Theme Context with TypeScript
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value: ThemeContextType = { theme, toggleTheme };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const ThemedButton: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  
  return (
    <button 
      onClick={toggleTheme}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      Current theme: {theme}
    </button>
  );
};
```

#### Example 2: User Context with Interface
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProfile: React.FC = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('UserProfile must be used within UserProvider');
  }
  
  const { user } = context;
  
  return user ? (
    <p>Welcome, {user.name}! ({user.email})</p>
  ) : (
    <p>Please log in</p>
  );
};
```

#### Example 3: Language Context with Enum
```typescript
enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr'
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const Greeting: React.FC = () => {
  const context = useContext(LanguageContext);
  
  if (!context) return null;
  
  const { language } = context;
  const greetings: Record<Language, string> = {
    [Language.EN]: 'Hello',
    [Language.ES]: 'Hola',
    [Language.FR]: 'Bonjour'
  };
  
  return <h1>{greetings[language]}</h1>;
};
```

#### Example 4: Settings Context with Complex State
```typescript
interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  fontSize: number;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const NotificationToggle: React.FC = () => {
  const context = useContext(SettingsContext);
  
  if (!context) return null;
  
  const { settings, updateSetting } = context;
  
  return (
    <label>
      <input
        type="checkbox"
        checked={settings.notifications}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          updateSetting('notifications', e.target.checked)
        }
      />
      Enable Notifications
    </label>
  );
};
```

---

## 4. useReducer Hook

### Description
The `useReducer` Hook is like useState's bigger brother for managing complex data. Instead of directly changing values, you send "messages" (called actions) that describe what you want to change.

### Definition
`useReducer` is useful when you have complicated data that needs to be updated in many different ways. Think of it like a smart assistant that knows exactly how to handle different types of requests to update your data.

### Syntax
```typescript
const [state, dispatch] = useReducer<StateType, ActionType>(reducer, initialState);
```

### TypeScript Reducer Pattern
```typescript
// Define state interface
interface State {
  // state properties
}

// Define action types with discriminated unions
type Action = 
  | { type: 'ACTION_ONE'; payload?: any }
  | { type: 'ACTION_TWO'; payload: any }
  | { type: 'ACTION_THREE' };

// Typed reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ACTION_ONE':
      return { ...state, /* updates */ };
    default:
      return state;
  }
};
```

### Four Small Examples

#### Example 1: Simple Counter
```typescript
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

const counterReducer = (state: number, action: Action) => {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return 0;
    default: return state;
  }
};

const Counter = () => {
  const [count, dispatch] = useReducer(counterReducer, 0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
};
```

#### Example 2: Todo List
```typescript
type Todo = { id: number; text: string; done: boolean };
type TodoAction = 
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'delete'; id: number };

const todoReducer = (todos: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'add':
      return [...todos, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return todos.map(todo => 
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'delete':
      return todos.filter(todo => todo.id !== action.id);
    default:
      return todos;
  }
};
```

#### Example 3: Form State
```typescript
type FormState = { name: string; email: string; errors: string[] };
type FormAction = 
  | { type: 'setName'; value: string }
  | { type: 'setEmail'; value: string }
  | { type: 'setErrors'; errors: string[] };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'setName': return { ...state, name: action.value };
    case 'setEmail': return { ...state, email: action.value };
    case 'setErrors': return { ...state, errors: action.errors };
    default: return state;
  }
};
```

#### Example 4: Shopping Cart
```typescript
type CartItem = { id: number; name: string; price: number; quantity: number };
type CartAction = 
  | { type: 'add'; item: Omit<CartItem, 'quantity'> }
  | { type: 'remove'; id: number }
  | { type: 'updateQuantity'; id: number; quantity: number };

const cartReducer = (items: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'add':
      const existing = items.find(item => item.id === action.item.id);
      if (existing) {
        return items.map(item => 
          item.id === action.item.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...items, { ...action.item, quantity: 1 }];
    case 'remove':
      return items.filter(item => item.id !== action.id);
    case 'updateQuantity':
      return items.map(item => 
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    default:
      return items;
  }
};
```

---

## 5. useMemo Hook

### Description
The `useMemo` Hook helps your app run faster by remembering the results of expensive calculations. It's like having a smart cache that only recalculates when necessary.

### Definition
`useMemo` saves the result of a calculation and only does the calculation again if the inputs change. This prevents your app from doing the same heavy work over and over.

### Syntax
```typescript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### Usage Example
```typescript
import { useState, useMemo } from 'react';

const ExpensiveComponent = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<number[]>([]);

  // Expensive calculation - only runs when items change
  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value...');
    return items.reduce((sum, item) => sum + item * item, 0);
  }, [items]);

  // This will NOT trigger expensive calculation
  const handleCountChange = () => {
    setCount(count + 1);
  };

  // This WILL trigger expensive calculation
  const addItem = () => {
    setItems([...items, Math.floor(Math.random() * 100)]);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      
      <button onClick={handleCountChange}>Increment Count</button>
      <button onClick={addItem}>Add Random Item</button>
      
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 6. useCallback Hook

### Description
The `useCallback` Hook is like useMemo but for functions. It helps prevent unnecessary re-rendering of child components by keeping the same function reference.

### Definition
`useCallback` remembers a function and only creates a new version when its dependencies change. This is helpful when passing functions to child components that are optimized with React.memo.

### Syntax
```typescript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Usage Example
```typescript
import { useState, useCallback, memo } from 'react';

// Child component that only re-renders when props change
const ChildComponent = memo(({ onClick, name }: { 
  onClick: () => void; 
  name: string; 
}) => {
  console.log(`Rendering ${name}`);
  return <button onClick={onClick}>Click {name}</button>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Without useCallback - creates new function on every render
  const handleClick1 = () => {
    console.log('Button 1 clicked');
  };

  // With useCallback - only creates new function when count changes
  const handleClick2 = useCallback(() => {
    console.log('Button 2 clicked, count:', count);
  }, [count]);

  // With useCallback - never changes (empty dependency array)
  const handleClick3 = useCallback(() => {
    console.log('Button 3 clicked');
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type to trigger re-render"
      />
      
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
      
      {/* These will re-render differently based on useCallback usage */}
      <ChildComponent onClick={handleClick1} name="Button 1 (no memo)" />
      <ChildComponent onClick={handleClick2} name="Button 2 (memo with count)" />
      <ChildComponent onClick={handleClick3} name="Button 3 (memo stable)" />
    </div>
  );
};
```

---

## 7. useRef Hook

### Description
The `useRef` Hook creates a special container that can hold a value that persists between renders. It's like a box that keeps its contents even when your component updates.

### Definition
`useRef` is commonly used to directly access DOM elements (like focusing an input) or to store values that don't trigger re-renders when they change. Think of it as a way to "remember" something without causing the component to update.

### Syntax
```typescript
const refContainer = useRef(initialValue);
```

### Usage Example
```typescript
import { useRef, useEffect, useState } from 'react';

const RefExample = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Track render count without causing re-renders
  useEffect(() => {
    countRef.current += 1;
  });

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const showRenderCount = () => {
    alert(`Component has rendered ${countRef.current} times`);
  };

  return (
    <div>
      <input 
        ref={inputRef}
        type="text" 
        placeholder="This input will be focused on mount"
      />
      
      <button onClick={focusInput}>Focus Input</button>
      <button onClick={showRenderCount}>Show Render Count</button>
      <button onClick={() => setRenderCount(renderCount + 1)}>
        Force Re-render ({renderCount})
      </button>
    </div>
  );
};
```

---

## 8. Custom Hooks

### Description
Custom Hooks are your own special functions that use other React Hooks inside them. They're like creating your own tools by combining existing tools.

### Definition
Custom Hooks let you take common patterns and logic from your components and turn them into reusable functions. It's like creating a recipe that you can use in multiple components instead of writing the same code over and over.

### Syntax
```typescript
const useSomething = (params) => {
  // Hook logic using other hooks
  return [value, setValue];
};
```

### Usage Example
```typescript
import { useState, useEffect } from 'react';

// Custom hook for local storage
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Custom hook for API data fetching
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Using custom hooks
const UserSettings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [username, setUsername] = useLocalStorage('username', '');
  const { data: userProfile, loading, error } = useApi(`/api/users/${username}`);

  return (
    <div>
      <h2>User Settings</h2>
      
      <div>
        <label>
          Theme: 
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      
      <div>
        <label>
          Username: 
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      
      {loading && <p>Loading user profile...</p>}
      {error && <p>Error: {error}</p>}
      {userProfile && <p>Welcome, {userProfile.name}!</p>}
    </div>
  );
};
```

---

## Hook Best Practices with Examples

### 1. Always Call Hooks at the Top Level

#### ❌ Bad Practice - Conditional Hooks
```typescript
const BadComponent = ({ condition }: { condition: boolean }) => {
  const [count, setCount] = useState(0);
  
  // DON'T DO THIS - Hook inside condition
  if (condition) {
    const [name, setName] = useState(''); // ❌ Breaks hook rules
  }
  
  // DON'T DO THIS - Hook inside loop
  for (let i = 0; i < 3; i++) {
    const [value, setValue] = useState(i); // ❌ Breaks hook rules
  }
  
  return <div>Count: {count}</div>;
};
```

#### ✅ Good Practice - Hooks at Top Level
```typescript
const GoodComponent = ({ condition }: { condition: boolean }) => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(''); // ✅ Always called
  const [values, setValues] = useState([0, 1, 2]); // ✅ Use array for multiple values
  
  return (
    <div>
      <p>Count: {count}</p>
      {condition && <p>Name: {name}</p>}
      {values.map((value, i) => <span key={i}>{value}</span>)}
    </div>
  );
};
```

### 2. useEffect Dependencies

#### ❌ Bad Practice - Missing Dependencies
```typescript
const BadEffectComponent = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // ❌ Missing userId in dependencies
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Will only run once, ignoring userId changes
  
  // ❌ Missing user in dependencies
  useEffect(() => {
    if (user) {
      fetchUserPosts(user.id).then(setPosts);
    }
  }, []); // Won't update when user changes
  
  return <div>{user?.name}</div>;
};
```

#### ✅ Good Practice - Correct Dependencies
```typescript
const GoodEffectComponent = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // ✅ Include userId in dependencies
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Runs when userId changes
  
  // ✅ Include user in dependencies
  useEffect(() => {
    if (user) {
      fetchUserPosts(user.id).then(setPosts);
    }
  }, [user]); // Runs when user changes
  
  return <div>{user?.name}</div>;
};
```

### 3. State Updates

#### ❌ Bad Practice - Direct State Mutation
```typescript
const BadStateComponent = () => {
  const [items, setItems] = useState([{ id: 1, name: 'Item 1' }]);
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const addItem = () => {
    // ❌ Mutating state directly
    items.push({ id: 2, name: 'Item 2' });
    setItems(items); // Won't trigger re-render
  };
  
  const updateUser = () => {
    // ❌ Mutating object directly
    user.age = 31;
    setUser(user); // Won't trigger re-render
  };
  
  return <div>{items.length} items</div>;
};
```

#### ✅ Good Practice - Immutable Updates
```typescript
const GoodStateComponent = () => {
  const [items, setItems] = useState([{ id: 1, name: 'Item 1' }]);
  const [user, setUser] = useState({ name: 'John', age: 30 });
  
  const addItem = () => {
    // ✅ Create new array
    setItems([...items, { id: 2, name: 'Item 2' }]);
  };
  
  const updateUser = () => {
    // ✅ Create new object
    setUser({ ...user, age: 31 });
  };
  
  return <div>{items.length} items</div>;
};
```

### 4. useCallback and useMemo Usage

#### ❌ Bad Practice - Overusing Memoization
```typescript
const BadMemoComponent = ({ items }: { items: string[] }) => {
  // ❌ Unnecessary memoization for simple values
  const count = useMemo(() => items.length, [items]);
  
  // ❌ Memoizing every function
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // No dependencies needed, but adds overhead
  
  // ❌ Memoizing cheap calculations
  const doubled = useMemo(() => count * 2, [count]);
  
  return <div onClick={handleClick}>{doubled}</div>;
};
```

#### ✅ Good Practice - Strategic Memoization
```typescript
const GoodMemoComponent = ({ items, onItemClick }: { 
  items: string[]; 
  onItemClick: (item: string) => void; 
}) => {
  // ✅ Simple calculation, no memoization needed
  const count = items.length;
  
  // ✅ Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      // Expensive operation
      return acc + item.split('').reverse().join('');
    }, '');
  }, [items]);
  
  // ✅ Memoize when passing to child components
  const handleItemClick = useCallback((item: string) => {
    onItemClick(item);
  }, [onItemClick]);
  
  return (
    <div>
      {items.map(item => (
        <ExpensiveChildComponent 
          key={item} 
          item={item} 
          onClick={handleItemClick} 
        />
      ))}
    </div>
  );
};
```

### 5. Custom Hooks

#### ❌ Bad Practice - Not Extracting Reusable Logic
```typescript
const BadComponent1 = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return <div>{loading ? 'Loading...' : data?.length}</div>;
};

const BadComponent2 = () => {
  // ❌ Duplicating the same logic
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return <div>{loading ? 'Loading...' : data?.length}</div>;
};
```

#### ✅ Good Practice - Custom Hook for Reusable Logic
```typescript
// ✅ Extract common logic into custom hook
const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
};

const GoodComponent1 = () => {
  const { data, loading, error } = useFetch('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data?.length} users</div>;
};

const GoodComponent2 = () => {
  const { data, loading, error } = useFetch('/api/posts');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data?.length} posts</div>;
};
```

### 6. Effect Cleanup

#### ❌ Bad Practice - No Cleanup
```typescript
const BadCleanupComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // ❌ No cleanup for interval
    setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  }, []);
  
  useEffect(() => {
    // ❌ No cleanup for event listener
    const handleResize = () => console.log('resized');
    window.addEventListener('resize', handleResize);
  }, []);
  
  return <div>Count: {count}</div>;
};
```

#### ✅ Good Practice - Proper Cleanup
```typescript
const GoodCleanupComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // ✅ Cleanup interval
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // ✅ Cleanup event listener
    const handleResize = () => console.log('resized');
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>Count: {count}</div>;
};
```

### 7. State Structure

#### ❌ Bad Practice - Over-separated State
```typescript
const BadStateStructure = () => {
  // ❌ Too many separate states for related data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);
  
  // Complex logic to keep all states in sync
  const updateFirstName = (name: string) => {
    setFirstName(name);
    validateForm(name, lastName, email, age);
  };
  
  return <form>...</form>;
};
```

#### ✅ Good Practice - Grouped Related State
```typescript
const GoodStateStructure = () => {
  // ✅ Group related state together
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 0
  });
  
  const [formState, setFormState] = useState({
    isValid: false,
    errors: []
  });
  
  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    validateForm(newData);
  };
  
  return <form>...</form>;
};
```

## TypeScript Benefits Summary

### Why Use TypeScript with React Hooks?

1. **Type Safety** - Catch errors at compile time, not runtime
2. **IntelliSense** - Better autocomplete and code suggestions
3. **Refactoring** - Safe renaming and code restructuring
4. **Documentation** - Types serve as inline documentation
5. **Team Collaboration** - Clear contracts between components
6. **Error Prevention** - Prevent common mistakes like wrong prop types

### Essential TypeScript Patterns for Hooks

```typescript
// 1. Interface for component props
interface ComponentProps {
  title: string;
  count?: number; // Optional prop
  onUpdate: (value: string) => void; // Function prop
}

// 2. Generic custom hooks
const useApi = <T>(url: string): { data: T | null; loading: boolean } => {
  // Implementation
};

// 3. Event handler typing
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  // Implementation
};

// 4. State with union types
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');

// 5. Context with proper typing
interface ContextType {
  value: string;
  setValue: (value: string) => void;
}
const MyContext = createContext<ContextType | undefined>(undefined);
```