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

## E-commerce Context Examples

### 1. Shopping Cart Context

#### Context Definition:
```tsx
// context/CartContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer for cart actions
function cartReducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      }
      
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return calculateTotals({ ...state, items: newItems });
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: filteredItems });
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
}

function calculateTotals(state: CartState): CartState {
  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, itemCount };
}

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

#### Usage in Components:
```tsx
// components/ProductCard.tsx
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addItem, items } = useCart();
  
  const isInCart = items.some(item => item.id === product.id);
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button 
        onClick={() => addItem(product)}
        disabled={isInCart}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}

// components/Cart.tsx
import { useCart } from '../context/CartContext';

function Cart() {
  const { items, total, removeItem, updateQuantity } = useCart();
  
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <span>${(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <div className="total">Total: ${total.toFixed(2)}</div>
    </div>
  );
}
```

### 2. Authentication Context

```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token and get user data
      validateToken(token).then(userData => {
        setUser(userData);
      }).catch(() => {
        localStorage.removeItem('authToken');
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
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

### 1. Multiple Providers Pattern
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

### 2. Compound Provider Pattern
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

### 3. Context with Reducer Pattern
```tsx
// For complex state logic
function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const actions = useMemo(() => ({
    addItem: (product) => dispatch({ type: 'ADD_ITEM', payload: product }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) => dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id, quantity } 
    }),
  }), []);

  return { state, actions };
}
```

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