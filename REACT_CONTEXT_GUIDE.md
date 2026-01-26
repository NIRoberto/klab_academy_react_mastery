# React Context API Guide for E-commerce Applications

## Table of Contents
1. [What is React Context?](#what-is-react-context)
2. [Why Use Context?](#why-use-context)
3. [Context vs Props Drilling](#context-vs-props-drilling)
4. [E-commerce Context Examples](#e-commerce-context-examples)
5. [Implementation Patterns](#implementation-patterns)
6. [Best Practices](#best-practices)
7. [Common Pitfalls](#common-pitfalls)

## What is React Context?

React Context is a built-in feature that allows you to share data across multiple components without passing props down through every level of the component tree. It creates a "global" state that can be accessed by any component within the Context Provider.

### Key Concepts:
- **Context**: The container that holds the shared data
- **Provider**: Component that supplies the context value to its children
- **Consumer**: Component that uses the context value (via useContext hook)

## Why Use Context?

### Problems Context Solves:
1. **Props Drilling**: Passing data through multiple component levels
2. **Global State Management**: Sharing state across distant components
3. **Component Coupling**: Reducing dependencies between components

### When to Use Context:
- User authentication state
- Shopping cart data
- Theme preferences
- Language/localization
- Global UI state (modals, notifications)

## Context vs Props Drilling

### Without Context (Props Drilling):
```tsx
// ❌ Props drilling - passing data through multiple levels
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  return <div>{user?.name}</div>;
}
```

### With Context:
```tsx
// ✅ Context - direct access to data
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}

function UserProfile() {
  const { user } = useContext(UserContext);
  return <div>{user?.name}</div>;
}
```

## Simple Context Examples (Non E-commerce)

### 1. Counter Context (Beginner Level)

#### Basic State Sharing:
```tsx
// context/CounterContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface CounterContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/Counter.tsx
import { useCounter } from '../context/CounterContext';

function Counter() {
  const { count, increment, decrement, reset } = useCounter();
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// components/CounterDisplay.tsx
function CounterDisplay() {
  const { count } = useCounter();
  
  return (
    <div>
      <p>Current count is: {count}</p>
      <p>Count is {count % 2 === 0 ? 'even' : 'odd'}</p>
    </div>
  );
}

// App.tsx
function App() {
  return (
    <CounterProvider>
      <div>
        <Counter />
        <CounterDisplay />
      </div>
    </CounterProvider>
  );
}
```

### 2. Theme Context (Beginner Level)

#### Simple Theme Switching:
```tsx
// context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/Header.tsx
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}

// components/Content.tsx
function Content() {
  const { theme } = useTheme();
  
  return (
    <main>
      <p>Current theme: {theme}</p>
      <p>This content adapts to the theme!</p>
    </main>
  );
}
```

### 3. Todo List Context (Intermediate Level)

#### Managing a List of Items:
```tsx
// context/TodoContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompleted: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  return (
    <TodoContext.Provider value={{
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted
    }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/TodoForm.tsx
import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

function TodoForm() {
  const [text, setText] = useState('');
  const { addTodo } = useTodos();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

// components/TodoList.tsx
function TodoList() {
  const { todos, toggleTodo, deleteTodo, clearCompleted } = useTodos();
  
  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  );
}
```

### 4. Language Context (Intermediate Level)

#### Internationalization (i18n) Example:
```tsx
// context/LanguageContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'es';

interface Translations {
  welcome: string;
  goodbye: string;
  hello: string;
  changeLanguage: string;
}

const translations: Record<Language, Translations> = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
    hello: 'Hello',
    changeLanguage: 'Change Language'
  },
  fr: {
    welcome: 'Bienvenue',
    goodbye: 'Au revoir',
    hello: 'Bonjour',
    changeLanguage: 'Changer de langue'
  },
  es: {
    welcome: 'Bienvenido',
    goodbye: 'Adiós',
    hello: 'Hola',
    changeLanguage: 'Cambiar idioma'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof Translations) => {
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/LanguageSelector.tsx
import { useLanguage } from '../context/LanguageContext';

function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <label>{t('changeLanguage')}: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}

// components/Greeting.tsx
function Greeting({ name }: { name: string }) {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('hello')}, {name}!</p>
    </div>
  );
}
```

### 5. Modal Context (Advanced Level)

#### Global Modal Management:
```tsx
// context/ModalContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalData {
  id: string;
  title: string;
  content: ReactNode;
  onClose?: () => void;
}

interface ModalContextType {
  modals: ModalData[];
  openModal: (modal: Omit<ModalData, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalData[]>([]);

  const openModal = (modalData: Omit<ModalData, 'id'>) => {
    const id = Date.now().toString();
    const modal: ModalData = { ...modalData, id };
    setModals(prev => [...prev, modal]);
    return id;
  };

  const closeModal = (id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter(m => m.id !== id);
    });
  };

  const closeAllModals = () => {
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  };

  return (
    <ModalContext.Provider value={{
      modals,
      openModal,
      closeModal,
      closeAllModals
    }}>
      {children}
      {/* Render modals */}
      {modals.map(modal => (
        <div key={modal.id} className="modal-overlay" onClick={() => closeModal(modal.id)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal.title}</h2>
              <button onClick={() => closeModal(modal.id)}>×</button>
            </div>
            <div className="modal-body">
              {modal.content}
            </div>
          </div>
        </div>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/ModalTriggers.tsx
import { useModal } from '../context/ModalContext';

function ModalTriggers() {
  const { openModal, closeAllModals } = useModal();
  
  const openConfirmModal = () => {
    openModal({
      title: 'Confirm Action',
      content: (
        <div>
          <p>Are you sure you want to proceed?</p>
          <button onClick={() => console.log('Confirmed')}>Yes</button>
          <button>No</button>
        </div>
      )
    });
  };
  
  const openInfoModal = () => {
    openModal({
      title: 'Information',
      content: <p>This is some important information!</p>
    });
  };
  
  return (
    <div>
      <button onClick={openConfirmModal}>Open Confirm Modal</button>
      <button onClick={openInfoModal}>Open Info Modal</button>
      <button onClick={closeAllModals}>Close All Modals</button>
    </div>
  );
}
```
```

### 3. Theme Context

```tsx
// context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 4. Notification Context

```tsx
// context/NotificationContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
```

## Implementation Patterns

### 1. Simple useState Pattern (Recommended for most cases)
```tsx
// Simple state management with useState
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const value = useMemo(() => ({ items, addItem }), [items]);
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
```

### 2. Multiple Providers Pattern
```tsx
// App.tsx - Wrapping multiple providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### 3. Compound Provider Pattern
```tsx
// providers/AppProviders.tsx
import { ReactNode } from 'react';

const providers = [
  ThemeProvider,
  AuthProvider,
  NotificationProvider,
  CartProvider
];

export function AppProviders({ children }: { children: ReactNode }) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}

// Usage in App.tsx
function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}
```

### 4. When to Use useState vs useReducer

**Use useState when:**
- Simple state updates
- Independent state variables
- Straightforward logic
- Small to medium complexity

**Use useReducer when:**
- Complex state logic with multiple sub-values
- State transitions depend on previous state
- Multiple actions that update state
- Need predictable state updates

## Best Practices

### 1. Create Custom Hooks
```tsx
// ✅ Always provide custom hooks for context consumption
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

### 2. Split Contexts by Concern
```tsx
// ✅ Separate contexts for different concerns
const UserContext = createContext(); // User data
const CartContext = createContext(); // Shopping cart
const ThemeContext = createContext(); // UI theme

// ❌ Don't put everything in one context
const AppContext = createContext(); // Too broad
```

### 3. Optimize Performance
```tsx
// ✅ Memoize context values to prevent unnecessary re-renders
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const value = useMemo(() => ({
    ...state,
    addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
  }), [state]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
```

### 4. Type Safety with TypeScript
```tsx
// ✅ Always type your contexts
interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
```

## Common Pitfalls

### 1. Overusing Context
```tsx
// ❌ Don't use context for everything
const ButtonColorContext = createContext(); // Too granular

// ✅ Use props for simple, local state
function Button({ color, onClick, children }) {
  return (
    <button style={{ backgroundColor: color }} onClick={onClick}>
      {children}
    </button>
  );
}
```

### 2. Not Memoizing Context Values
```tsx
// ❌ Creates new object on every render
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  return (
    <CartContext.Provider value={{ items, setItems }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ Memoize the value
function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const value = useMemo(() => ({ items, setItems }), [items]);
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
```

### 3. Forgetting Error Boundaries
```tsx
// ✅ Wrap providers with error boundaries
function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <App />
      </CartProvider>
    </ErrorBoundary>
  );
}
```

## Conclusion

React Context is a powerful tool for managing global state in e-commerce applications. It's particularly useful for:

- **Shopping Cart**: Managing items, quantities, and totals
- **Authentication**: User login state and permissions
- **Theme**: UI appearance preferences
- **Notifications**: Global messaging system

Remember to:
- Use context for truly global state
- Create custom hooks for better DX
- Memoize context values for performance
- Split contexts by concern
- Always include TypeScript types

Context makes your React applications more maintainable and reduces props drilling, leading to cleaner, more scalable code.