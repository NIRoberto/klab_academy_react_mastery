# React Router Guide: From Beginner to Advanced

## What is React Router?

React Router is like a GPS for your React app. It helps users navigate between different pages/screens without refreshing the entire page. Think of it as creating a multi-page website that feels like a single, smooth app.

## Why Use React Router?

- **Single Page Application (SPA)** - Fast navigation without page reloads
- **Better User Experience** - Smooth transitions between pages
- **SEO Friendly** - Each page can have its own URL
- **Browser History** - Back/forward buttons work properly
- **Deep Linking** - Users can bookmark and share specific pages

---

## Installation

```bash
npm install react-router-dom
npm install @types/react-router-dom  # For TypeScript
```

---

## Beginner Level

### 1. Basic Setup and First Routes

**Description:** This is where we set up the foundation of routing in our React app. Think of `BrowserRouter` as the main controller that manages all navigation, `Routes` as a container that holds all possible paths, and each `Route` as a specific destination in your app.

**What it does:** 
- `BrowserRouter` enables routing functionality for your entire app
- `Routes` groups all your route definitions together
- Each `Route` connects a URL path to a specific component
- When users visit a URL, React Router shows the matching component

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

### 2. Creating Basic Pages

**Description:** Pages are the individual screens users see when they navigate to different URLs. Each page is just a regular React component that gets displayed when its route matches the current URL.

**What it does:**
- Creates separate components for each page of your app
- Each component represents what users see at a specific URL
- Keeps your app organized by separating different sections into different files

```typescript
// pages/Home.tsx
const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <p>This is the home page of our app.</p>
    </div>
  );
};

export default Home;

// pages/About.tsx
const About: React.FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>Learn more about our company.</p>
    </div>
  );
};

export default About;

// pages/Contact.tsx
const Contact: React.FC = () => {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us.</p>
    </div>
  );
};

export default Contact;
```

### 3. Navigation with Link Component

**Description:** The `Link` component is like creating clickable buttons or menu items that take users to different pages. Unlike regular HTML `<a>` tags, `Link` doesn't refresh the page - it just changes what's displayed, making your app feel fast and smooth.

**What it does:**
- Creates clickable navigation elements
- Changes the URL without refreshing the page
- Provides a better user experience than traditional links
- Maintains the single-page application behavior

```typescript
// components/Navigation.tsx
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '20px' }}>
        Home
      </Link>
      <Link to="/about" style={{ marginRight: '20px' }}>
        About
      </Link>
      <Link to="/contact">
        Contact
      </Link>
    </nav>
  );
};

export default Navigation;
```

### 4. Adding Navigation to App

**Description:** This shows how to combine your navigation menu with your routes so users can actually move between pages. The navigation stays visible on all pages while the main content changes based on the current route.

**What it does:**
- Puts the navigation menu at the top of every page
- Creates a consistent layout across your entire app
- Shows how navigation and routes work together
- Provides a complete, functional multi-page app structure

```typescript
// App.tsx - Updated with Navigation
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
```

---

## Intermediate Level

### 1. URL Parameters

**Description:** URL parameters let you create dynamic routes that can show different content based on what's in the URL. Think of it like having a template page that changes its content based on an ID or name in the web address.

**What it does:**
- Creates flexible routes that work with different IDs or values
- Allows you to build pages like user profiles, product details, or blog posts
- Makes URLs shareable and bookmarkable for specific content
- Uses the `:parameterName` syntax to capture values from the URL

```typescript
// App.tsx - Add user profile route
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/user/:userId" element={<UserProfile />} />
  <Route path="/product/:productId" element={<ProductDetail />} />
</Routes>
```

```typescript
// pages/UserProfile.tsx
import { useParams } from 'react-router-dom';

interface UserParams {
  userId: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<UserParams>();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Viewing profile for user ID: {userId}</p>
    </div>
  );
};

export default UserProfile;
```

### 2. Query Parameters

**Description:** Query parameters are the part of the URL that comes after the `?` symbol, like `?search=pizza&category=food`. They're perfect for things like search filters, pagination, or any settings that users might want to share or bookmark.

**What it does:**
- Handles the `?key=value&another=value` part of URLs
- Perfect for search functionality, filters, and pagination
- Allows users to bookmark or share specific search results
- Provides easy ways to read and update these parameters

```typescript
// pages/SearchResults.tsx
import { useSearchParams } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = searchParams.get('page') || '1';

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, category, page: '1' });
  };

  return (
    <div>
      <h1>Search Results</h1>
      <p>Query: {query}</p>
      <p>Category: {category}</p>
      <p>Page: {page}</p>
      
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchResults;
```

### 3. Programmatic Navigation

**Description:** Sometimes you need to navigate users to a different page based on their actions (like after submitting a form or clicking a button), rather than just clicking a link. Programmatic navigation lets you control when and where users go in your code.

**What it does:**
- Redirects users after form submissions, logins, or other actions
- Allows you to navigate based on conditions or logic
- Provides methods to go back in browser history
- Enables navigation with additional data or state

```typescript
// pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login logic
    if (username && password) {
      // Redirect to dashboard after successful login
      navigate('/dashboard');
      
      // Or redirect with state
      navigate('/dashboard', { 
        state: { message: 'Login successful!' }
      });
    }
  };

  const goBack = () => {
    navigate(-1); // Go back one page in history
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <button type="button" onClick={goBack}>
          Go Back
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### 4. Nested Routes

**Description:** Nested routes let you create pages within pages, like having a dashboard with different sections (profile, settings, analytics) that each have their own URL but share the same layout. It's like having rooms within a house - they're all part of the same structure but serve different purposes.

**What it does:**
- Creates hierarchical page structures (parent pages with child pages)
- Shares common layouts between related pages
- Organizes complex applications with multiple sections
- Uses `Outlet` to show where child components should appear

```typescript
// App.tsx - Nested routes setup
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>
</Routes>
```

```typescript
// pages/Dashboard.tsx
import { Link, Outlet } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <nav style={{ width: '200px', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h3>Dashboard</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/dashboard/profile">Profile</Link></li>
          <li><Link to="/dashboard/settings">Settings</Link></li>
          <li><Link to="/dashboard/analytics">Analytics</Link></li>
        </ul>
      </nav>
      
      {/* Main content area */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* This renders the nested route components */}
      </main>
    </div>
  );
};

```typescript
// pages/Profile.tsx
const Profile: React.FC = () => {
  return (
    <div>
      <h2>User Profile</h2>
      <p>Manage your personal information and preferences.</p>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" defaultValue="John Doe" />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" defaultValue="john@example.com" />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;

// pages/Settings.tsx
const Settings: React.FC = () => {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configure your application preferences.</p>
      <div>
        <label>
          <input type="checkbox" defaultChecked />
          Enable notifications
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" />
          Dark mode
        </label>
      </div>
      <div>
        <label>Language:</label>
        <select>
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;

// pages/Analytics.tsx
const Analytics: React.FC = () => {
  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>View your application usage statistics.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>1,234</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Page Views</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>5,678</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Conversion Rate</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>3.2%</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
```

### 5. 404 Not Found Page

**Description:** When users try to visit a page that doesn't exist, you want to show them a helpful error page instead of a blank screen or browser error. The 404 page catches all unmatched routes and provides a user-friendly way to get back to your app.

**What it does:**
- Catches any URL that doesn't match your defined routes
- Shows a user-friendly error message instead of a blank page
- Provides navigation back to working parts of your app
- Uses the `*` path to match any unmatched routes

```typescript
// pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
};

export default NotFound;
```

```typescript
// App.tsx - Add catch-all route
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
</Routes>
```

---

## Advanced Level

### 1. Route Guards and Protected Routes

**Description:** Route guards are like security checkpoints for your app. They check if a user is allowed to access certain pages (like checking if they're logged in before showing a dashboard). If they don't have permission, the guard redirects them to a login page or shows an error.

**What it does:**
- Protects sensitive pages from unauthorized access
- Automatically redirects users to login if they're not authenticated
- Remembers where users were trying to go so they can be redirected after login
- Provides a security layer for your application

```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  isAuthenticated 
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

```typescript
// App.tsx - Using protected routes
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};
```

### 2. Route-based Code Splitting (Lazy Loading)

```typescript
// App.tsx - Lazy loading routes
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
```

### 3. Custom Hooks for Routing

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in (e.g., check localStorage, API call)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Validate token with API
          const userData = await validateToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { user, token } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(user);
        
        // Redirect to intended page or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};

// Utility function (would be implemented separately)
const validateToken = async (token: string): Promise<User> => {
  // Implementation would validate token with your API
  throw new Error('Not implemented');
};
```

### 4. Advanced Route Configuration

```typescript
// routes/routeConfig.ts
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const UserProfile = lazy(() => import('../pages/UserProfile'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.FC>;
  protected?: boolean;
  roles?: string[];
  title?: string;
  description?: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: Home,
    title: 'Home - My App',
    description: 'Welcome to our amazing app'
  },
  {
    path: '/about',
    element: About,
    title: 'About Us - My App',
    description: 'Learn more about our company'
  },
  {
    path: '/dashboard',
    element: Dashboard,
    protected: true,
    title: 'Dashboard - My App',
    description: 'User dashboard'
  },
  {
    path: '/user/:userId',
    element: UserProfile,
    protected: true,
    title: 'User Profile - My App'
  },
  {
    path: '/admin',
    element: AdminPanel,
    protected: true,
    roles: ['admin'],
    title: 'Admin Panel - My App',
    description: 'Administrative controls'
  }
];
```

### 5. Dynamic Route Generation

```typescript
// App.tsx - Dynamic route generation
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes/routeConfig';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          {routes.map((route) => {
            const Element = route.element;
            
            let element = <Element />;

            // Wrap with protection if needed
            if (route.protected) {
              element = (
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {element}
                </ProtectedRoute>
              );
            }

            // Wrap with role-based protection if needed
            if (route.roles) {
              element = (
                <RoleBasedRoute 
                  userRole={user?.role} 
                  allowedRoles={route.roles}
                >
                  {element}
                </RoleBasedRoute>
              );
            }

            return (
              <Route
                key={route.path}
                path={route.path}
                element={element}
              />
            );
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
```

### 6. SEO and Meta Tags with React Helmet

```bash
npm install react-helmet-async
npm install @types/react-helmet-async
```

```typescript
// components/SEOHead.tsx
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEOHead;
```

### 7. Route Transitions and Animations

```bash
npm install framer-motion
```

```typescript
// components/PageTransition.tsx
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: '-100vw'
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: '100vw'
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
```

## Best Practices

### 1. Route Organization
```typescript
// ✅ Good - Organized route structure
src/
  routes/
    index.ts          // Route configuration
    ProtectedRoute.tsx
    RoleBasedRoute.tsx
  pages/
    Home/
      index.tsx
      Home.test.tsx
    Dashboard/
      index.tsx
      components/
        Sidebar.tsx
```

### 2. Type Safety
```typescript
// ✅ Good - Typed route parameters
interface UserParams {
  userId: string;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<UserParams>();
  // TypeScript knows userId is string | undefined
};
```

### 3. Error Boundaries for Routes
```typescript
// components/RouteErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong with this page.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
```

## Common Patterns and Solutions

### 1. Breadcrumbs
```typescript
// components/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav>
      <Link to="/">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return isLast ? (
          <span key={name}> / {name}</span>
        ) : (
          <span key={name}>
            {' / '}
            <Link to={routeTo}>{name}</Link>
          </span>
        );
      })}
    </nav>
  );
};
```

### 2. Active Navigation Links
```typescript
// components/NavLink.tsx
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, exact = false }) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link 
      to={to}
      style={{
        color: isActive ? '#007bff' : '#333',
        fontWeight: isActive ? 'bold' : 'normal'
      }}
    >
      {children}
    </Link>
  );
};
```

This comprehensive guide covers React Router from basic setup to advanced patterns, all with TypeScript examples and best practices!