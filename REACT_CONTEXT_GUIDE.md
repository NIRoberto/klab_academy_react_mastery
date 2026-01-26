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

### 1. Simple Theme Context (Beginner Level)

#### Basic Theme Switching:
```tsx
// context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Simple Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
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
// components/ThemeToggle.tsx
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

// App.tsx
function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <main>Your app content</main>
      </div>
    </ThemeProvider>
  );
}
```

### 2. User Preferences Context (Intermediate Level)

#### Managing Multiple User Settings:
```tsx
// context/UserPreferencesContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
  language: 'en' | 'fr' | 'es';
  currency: 'USD' | 'EUR' | 'GBP';
  notifications: boolean;
  theme: 'light' | 'dark';
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  currency: 'USD',
  notifications: true,
  theme: 'light'
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      updatePreference,
      resetPreferences
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
```

#### Usage:
```tsx
// components/SettingsPanel.tsx
import { useUserPreferences } from '../context/UserPreferencesContext';

function SettingsPanel() {
  const { preferences, updatePreference } = useUserPreferences();
  
  return (
    <div className="settings">
      <h2>Settings</h2>
      
      <div>
        <label>Language:</label>
        <select 
          value={preferences.language}
          onChange={(e) => updatePreference('language', e.target.value as any)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
      </div>
      
      <div>
        <label>Currency:</label>
        <select 
          value={preferences.currency}
          onChange={(e) => updatePreference('currency', e.target.value as any)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      
      <div>
        <label>
          <input 
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) => updatePreference('notifications', e.target.checked)}
          />
          Enable notifications
        </label>
      </div>
    </div>
  );
}
```

### 3. Shopping Cart Context (Advanced Level)

#### Complex State Management with Performance Optimization:
```tsx
// context/CartContext.tsx
import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Memoized calculations for performance
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;
    
    return { subtotal, itemCount, tax, shipping, total };
  }, [items]);

  // Memoized helper functions
  const getItemQuantity = useCallback((id: string) => {
    return items.find(item => item.id === id)?.quantity || 0;
  }, [items]);

  const isInCart = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Memoize the entire context value
  const contextValue = useMemo(() => ({
    items,
    ...calculations,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart
  }), [items, calculations, addItem, removeItem, updateQuantity, clearCart, getItemQuantity, isInCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

#### Advanced Usage:
```tsx
// components/CartSummary.tsx
import { useCart } from '../context/CartContext';

function CartSummary() {
  const { subtotal, tax, shipping, total, itemCount } = useCart();
  
  return (
    <div className="cart-summary">
      <h3>Order Summary ({itemCount} items)</h3>
      <div className="summary-line">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-line">
        <span>Tax:</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="summary-line">
        <span>Shipping:</span>
        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="summary-line total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {subtotal < 50 && (
        <p className="free-shipping-notice">
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </p>
      )}
    </div>
  );
}

// components/ProductCard.tsx
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();
  
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      
      {!inCart ? (
        <button onClick={() => addItem(product)}>
          Add to Cart
        </button>
      ) : (
        <div className="quantity-controls">
          <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
          <span>{quantity}</span>
          <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
        </div>
      )}
    </div>
  );
}
```

### 4. Authentication Context (Expert Level)

#### Complex Authentication with Session Management, Role-based Access, and Error Handling:
```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'moderator';
  avatar?: string;
  permissions: string[];
  lastLogin: Date;
}

interface AuthError {
  code: string;
  message: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token management utilities
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly REMEMBER_ME_KEY = 'rememberMe';

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string, rememberMe: boolean = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        refreshToken().catch(console.error);
      }, 14 * 60 * 1000); // Refresh every 14 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  const initializeAuth = async () => {
    const token = TokenManager.getAccessToken();
    if (token) {
      try {
        await validateAndSetUser(token);
      } catch (error) {
        console.error('Token validation failed:', error);
        TokenManager.clearTokens();
      }
    }
    setIsLoading(false);
  };

  const validateAndSetUser = async (token: string) => {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
    } else {
      throw new Error('Invalid token');
    }
  };

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        TokenManager.setTokens(data.accessToken, data.refreshToken, rememberMe);
        setUser(data.user);
        
        // Track login analytics
        trackEvent('user_login', { userId: data.user.id, method: 'email' });
      } else {
        setError({ code: data.code || 'LOGIN_FAILED', message: data.message });
      }
    } catch (err) {
      setError({ code: 'NETWORK_ERROR', message: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        TokenManager.setTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
        
        // Track registration analytics
        trackEvent('user_register', { userId: data.user.id });
      } else {
        setError({ code: data.code || 'REGISTER_FAILED', message: data.message });
      }
    } catch (err) {
      setError({ code: 'NETWORK_ERROR', message: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const token = TokenManager.getAccessToken();
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setError(null);
      setIsLoading(false);
      
      // Track logout analytics
      trackEvent('user_logout');
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      TokenManager.setTokens(data.accessToken, data.refreshToken, rememberMe);
    } else {
      throw new Error('Token refresh failed');
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = TokenManager.getAccessToken();
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        const data = await response.json();
        setError({ code: data.code || 'UPDATE_FAILED', message: data.message });
      }
    } catch (err) {
      setError({ code: 'NETWORK_ERROR', message: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = useCallback((permission: string) => {
    return user?.permissions.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    hasPermission,
    hasRole,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    clearError
  }), [user, isLoading, error, hasPermission, hasRole, login, register, logout, refreshToken, updateProfile, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
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

// Helper function for analytics (implement based on your analytics service)
function trackEvent(event: string, properties?: Record<string, any>) {
  // Implementation depends on your analytics service (Google Analytics, Mixpanel, etc.)
  console.log('Analytics event:', event, properties);
}
```

#### Advanced Usage with Protected Routes:
```tsx
// components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

function ProtectedRoute({ children, requiredRole, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// components/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the context
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        required
      />
      
      <label>
        <input
          type="checkbox"
          checked={formData.rememberMe}
          onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
        />
        Remember me
      </label>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
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