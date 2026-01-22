# React Hooks Guide

## What are React Hooks?

React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and allow you to "hook into" React features without writing class components.

## Rules of Hooks

1. Only call Hooks at the top level of your React function
2. Only call Hooks from React function components or custom Hooks
3. Hook names must start with "use"

---

## 1. useState Hook

### Description
The `useState` Hook allows you to add state to functional components. It returns an array with the current state value and a function to update it.

### Definition
`useState` manages local component state and triggers re-renders when state changes.

### Syntax
```typescript
const [state, setState] = useState(initialValue);
```

### Four Small Examples

#### Example 1: Simple Counter
```typescript
const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};
```

#### Example 2: Toggle Boolean
```typescript
const Toggle = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
      {isVisible && <p>Now you see me!</p>}
    </div>
  );
};
```

#### Example 3: Form Input
```typescript
const NameForm = () => {
  const [name, setName] = useState('');
  return (
    <div>
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
};
```

#### Example 4: Array State
```typescript
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    setTodos([...todos, input]);
    setInput('');
  };
  
  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  );
};
```

---

## 2. useEffect Hook

### Description
The `useEffect` Hook lets you perform side effects in functional components. It serves the same purpose as `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` combined.

### Definition
`useEffect` runs after every render and can be used for data fetching, subscriptions, or manually changing the DOM.

### Syntax
```typescript
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]); // Dependencies array (optional)
```

### Four Small Examples

#### Example 1: Data Fetching
```typescript
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);
  
  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
};
```

#### Example 2: Document Title
```typescript
const PageTitle = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return <h1>{title}</h1>;
};
```

#### Example 3: Timer/Interval
```typescript
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <p>Timer: {seconds}s</p>;
};
```

#### Example 4: Event Listener
```typescript
const WindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return <p>Size: {size.width} x {size.height}</p>;
};
```

---

## 3. useContext Hook

### Description
The `useContext` Hook allows you to consume context values without wrapping components in Context.Consumer.

### Definition
`useContext` accepts a context object and returns the current context value for that context.

### Syntax
```typescript
const value = useContext(MyContext);
```

### Four Small Examples

#### Example 1: Theme Context
```typescript
const ThemeContext = createContext('light');

const ThemedButton = () => {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      Themed Button
    </button>
  );
};
```

#### Example 2: User Context
```typescript
const UserContext = createContext(null);

const UserProfile = () => {
  const user = useContext(UserContext);
  return user ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>;
};
```

#### Example 3: Language Context
```typescript
const LanguageContext = createContext('en');

const Greeting = () => {
  const lang = useContext(LanguageContext);
  const greetings = { en: 'Hello', es: 'Hola', fr: 'Bonjour' };
  return <h1>{greetings[lang]}</h1>;
};
```

#### Example 4: Settings Context
```typescript
const SettingsContext = createContext({ notifications: true });

const NotificationBell = () => {
  const { notifications } = useContext(SettingsContext);
  return notifications ? <span>🔔</span> : <span>🔕</span>;
};
```

---

## 4. useReducer Hook

### Description
The `useReducer` Hook is an alternative to `useState` for managing complex state logic. It's similar to Redux reducers.

### Definition
`useReducer` accepts a reducer function and initial state, returning the current state and a dispatch function.

### Syntax
```typescript
const [state, dispatch] = useReducer(reducer, initialState);
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
The `useMemo` Hook memoizes expensive calculations and only recalculates when dependencies change.

### Definition
`useMemo` returns a memoized value that only changes when one of the dependencies has changed.

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
The `useCallback` Hook memoizes functions and only creates a new function when dependencies change. Useful for preventing unnecessary re-renders.

### Definition
`useCallback` returns a memoized callback function that only changes when one of the dependencies has changed.

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
The `useRef` Hook creates a mutable ref object that persists across renders. Commonly used for accessing DOM elements or storing mutable values.

### Definition
`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument.

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
Custom Hooks are JavaScript functions that start with "use" and can call other Hooks. They allow you to extract component logic into reusable functions.

### Definition
Custom Hooks let you share stateful logic between components without changing the component hierarchy.

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

## Hook Best Practices

1. **Always use Hooks at the top level** - Never inside loops, conditions, or nested functions
2. **Use ESLint plugin** - Install `eslint-plugin-react-hooks` for Hook rules enforcement
3. **Optimize with useMemo and useCallback** - But don't overuse them; measure performance first
4. **Create custom Hooks** - Extract reusable stateful logic into custom Hooks
5. **Use TypeScript** - Add proper typing for better development experience
6. **Clean up effects** - Always clean up subscriptions, timers, and event listeners
7. **Dependency arrays** - Be careful with dependency arrays in useEffect, useMemo, and useCallback

## Common Pitfalls

1. **Missing dependencies** - Always include all values from component scope used inside the effect
2. **Infinite loops** - Be careful with object/array dependencies that are recreated on every render
3. **Stale closures** - When using callbacks in effects, ensure they have access to latest values
4. **Overusing useMemo/useCallback** - These have their own overhead; use only when necessary