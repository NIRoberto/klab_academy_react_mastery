# Complete React Fundamentals Guide for Beginners

## Table of Contents
1. [Setup with Tailwind CSS](#setup-with-tailwind-css)
2. [Prerequisites: ES6 Fundamentals](#prerequisites-es6-fundamentals)
3. [Understanding React](#understanding-react)
4. [React Core Concepts](#react-core-concepts)
5. [Working with the DOM](#working-with-the-dom)
6. [Practical Exercises with Styling](#practical-exercises-with-styling)
7. [Best Practices](#best-practices)

---

## Setup with Tailwind CSS

### Installing Tailwind CSS in Vite + React

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add Tailwind directives to `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Sample Output:** Your app now has access to Tailwind's utility classes for rapid styling.

---

## Prerequisites: ES6 Fundamentals

### Why ES6 Matters for React
Modern React development relies heavily on ES6+ features. Understanding these concepts is crucial because React components use them extensively.

### 1. Arrow Functions - The Modern Way

**Theory:** Arrow functions provide a shorter syntax and lexically bind `this`, making them perfect for React event handlers and functional programming patterns.

**Key Differences:**
- Shorter syntax
- No `this` binding (inherits from enclosing scope)
- Cannot be used as constructors
- Implicit return for single expressions

```javascript
// Traditional function - has its own 'this'
function traditionalFunction(name) {
  return "Hello " + name;
}

// Arrow function - inherits 'this' from parent scope
const arrowFunction = (name) => "Hello " + name;

// Multiple parameters
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = x => x * x;

// Multiple lines require explicit return
const complexFunction = (x, y) => {
  const result = x + y;
  return result * 2;
};
```

**When to Use in React:**
- Event handlers
- Array methods (map, filter, reduce)
- Callback functions

### 2. Template Literals - String Interpolation

**Theory:** Template literals use backticks (`) and allow embedded expressions with `${}` syntax, making string concatenation cleaner and more readable.

```javascript
const name = "John";
const age = 25;
const isStudent = true;

// Old concatenation method
const oldMessage = "My name is " + name + " and I am " + age + " years old";

// Template literal with interpolation
const newMessage = `My name is ${name} and I am ${age} years old`;

// Multi-line strings
const multiLine = `
  Hello ${name},
  You are ${age} years old.
  Student status: ${isStudent ? 'Yes' : 'No'}
`;

// Expression evaluation
const calculation = `The sum of 5 + 3 is ${5 + 3}`;
```

**React Usage:**
- Dynamic class names
- Conditional text rendering
- API endpoint construction

### 3. Destructuring - Extract Values Efficiently

**Theory:** Destructuring allows unpacking values from arrays or properties from objects into distinct variables, reducing code verbosity.

```javascript
// Array Destructuring
const colors = ["red", "green", "blue", "yellow"];
const [primary, secondary, tertiary] = colors;
// primary = "red", secondary = "green", tertiary = "blue"

// Skip elements
const [first, , third] = colors;
// first = "red", third = "blue"

// Default values
const [a, b, c, d, e = "default"] = colors;
// e = "default" since colors[4] is undefined

// Object Destructuring
const person = { 
  name: "Alice", 
  age: 30, 
  city: "New York",
  country: "USA"
};

const { name, age } = person;
// name = "Alice", age = 30

// Rename variables
const { name: fullName, age: years } = person;
// fullName = "Alice", years = 30

// Nested destructuring
const user = {
  id: 1,
  profile: {
    firstName: "John",
    lastName: "Doe"
  }
};

const { profile: { firstName, lastName } } = user;
```

**React Applications:**
- Props destructuring in components
- State destructuring with hooks
- Event object destructuring

### 4. Spread Operator - Copy and Merge

**Theory:** The spread operator (`...`) expands iterables (arrays, objects) into individual elements, enabling immutable updates crucial for React state management.

```javascript
// Array Spreading
const fruits = ["apple", "banana"];
const vegetables = ["carrot", "broccoli"];

// Combine arrays
const food = [...fruits, ...vegetables];
// ["apple", "banana", "carrot", "broccoli"]

// Add elements
const moreFruits = [...fruits, "orange", "grape"];

// Copy array (shallow copy)
const fruitsCopy = [...fruits];

// Object Spreading
const basicInfo = { name: "John", age: 25 };
const contactInfo = { email: "john@email.com", phone: "123-456-7890" };

// Merge objects
const completeInfo = { ...basicInfo, ...contactInfo };

// Override properties
const updatedInfo = { ...basicInfo, age: 26 };

// Add new properties
const extendedInfo = { ...basicInfo, city: "New York" };
```

**React State Updates:**
```javascript
// Updating array state
setItems([...items, newItem]);

// Updating object state
setUser({ ...user, name: "New Name" });
```

### 5. Modules - Code Organization

**Theory:** ES6 modules allow you to split code into separate files and import/export functionality, promoting code reusability and maintainability.

```javascript
// math.js - Named exports
export const PI = 3.14159;
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

// utils.js - Default export
const formatDate = (date) => {
  return date.toLocaleDateString();
};
export default formatDate;

// Mixed exports
export const helper1 = () => {};
export const helper2 = () => {};
export default function mainFunction() {}

// Importing
import formatDate from './utils.js';           // Default import
import { PI, add } from './math.js';           // Named imports
import { multiply as mult } from './math.js';   // Renamed import
import formatDate, { helper1 } from './utils.js'; // Mixed import
import * as MathUtils from './math.js';        // Namespace import
```

### 6. Variable Declarations - Scope and Mutability

**Theory:** `let` and `const` provide block scope and better error prevention compared to `var`.

```javascript
// const - Cannot be reassigned
const name = "John";
// name = "Jane"; // Error!

// But objects/arrays can be mutated
const person = { name: "John" };
person.name = "Jane"; // OK - mutating property
person.age = 25;      // OK - adding property

// let - Can be reassigned, block scoped
let age = 25;
age = 26; // OK

// Block scope demonstration
if (true) {
  let blockScoped = "inside";
  const alsoBlockScoped = "inside";
  var functionScoped = "inside";
}
// console.log(blockScoped); // Error!
// console.log(alsoBlockScoped); // Error!
console.log(functionScoped); // "inside" - accessible!
```

---

## Understanding React

### What is React?

React is a **declarative**, **component-based** JavaScript library for building user interfaces. Let's break down these key concepts:

**Declarative Programming:**
- You describe **what** the UI should look like
- React figures out **how** to update the DOM
- Contrast with imperative programming where you specify step-by-step instructions

```javascript
// Imperative (traditional DOM manipulation)
const button = document.createElement('button');
button.textContent = 'Click me';
button.addEventListener('click', () => {
  button.textContent = 'Clicked!';
});
document.body.appendChild(button);

// Declarative (React)
function Button() {
  const [clicked, setClicked] = useState(false);
  return (
    <button onClick={() => setClicked(true)}>
      {clicked ? 'Clicked!' : 'Click me'}
    </button>
  );
}
```

**Component-Based Architecture:**
- UI is broken down into reusable components
- Each component manages its own state
- Components can be composed to build complex UIs

### The Virtual DOM Concept

**Theory:** React uses a Virtual DOM - a JavaScript representation of the actual DOM. This enables:

1. **Performance:** React can batch updates and minimize DOM manipulations
2. **Predictability:** Changes are calculated before applying to real DOM
3. **Developer Experience:** You write code as if re-rendering everything, React optimizes

**How it Works:**
1. State changes trigger re-render
2. React creates new Virtual DOM tree
3. Compares (diffs) with previous Virtual DOM
4. Updates only changed parts in real DOM

---

## React Core Concepts

### 1. JSX - JavaScript XML

**Theory:** JSX is a syntax extension that allows writing HTML-like code in JavaScript. It's transpiled to `React.createElement()` calls.

**Why JSX?**
- More readable than `createElement` calls
- Familiar HTML-like syntax
- Type checking and better error messages
- Supports JavaScript expressions

```jsx
// JSX gets transpiled to:
const element = <h1 className="greeting">Hello, World!</h1>;

// Becomes:
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, World!'
);

// JavaScript expressions in JSX
const name = "Alice";
const element = <h1>Hello, {name}!</h1>;

// Attributes
const element = <img src={user.avatarUrl} alt={user.name} />;

// Conditional rendering
const element = (
  <div>
    {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>}
  </div>
);
```

**JSX Rules:**
- Must return single parent element (or Fragment)
- Use `className` instead of `class`
- Use `htmlFor` instead of `for`
- Self-closing tags must end with `/>`
- JavaScript expressions go in `{}`

### 2. Components - Building Blocks

**Theory:** Components are independent, reusable pieces of UI. They accept inputs (props) and return JSX describing what should appear on screen.

**Function Components (Modern Approach):**
```jsx
// Basic component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Component with props
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Arrow function component
const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

**Component Composition:**
```jsx
function App() {
  return (
    <div>
      <Header />
      <Main>
        <Sidebar />
        <Content />
      </Main>
      <Footer />
    </div>
  );
}
```

### 3. Props - Data Flow

**Theory:** Props (properties) are how data flows from parent to child components. They are read-only and enable component reusability.

**Key Principles:**
- Props flow down (unidirectional data flow)
- Props are immutable within the component
- Use destructuring for cleaner code

```jsx
// Parent component
function App() {
  const user = {
    name: "Alice",
    email: "alice@example.com",
    isAdmin: true
  };

  return (
    <div>
      <UserProfile 
        name={user.name}
        email={user.email}
        isAdmin={user.isAdmin}
      />
      {/* Or spread the object */}
      <UserProfile {...user} />
    </div>
  );
}

// Child component with Tailwind CSS
function UserProfile({ name, email, isAdmin = false }) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${
      isAdmin ? 'bg-purple-100 border-purple-300' : 'bg-gray-100 border-gray-300'
    } border-2`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
      <p className="text-gray-600 mb-3">{email}</p>
      {isAdmin && (
        <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Admin
        </span>
      )}
    </div>
  );
}
```

**Sample Output:**
```
┌─────────────────────────────────────┐
│  Alice                              │
│  alice@example.com                  │
│  [Admin]                            │
└─────────────────────────────────────┘
```
*Purple-tinted card with rounded corners and shadow for admin users*
```

**Props Validation (with TypeScript):**
```typescript
interface UserProfileProps {
  name: string;
  email: string;
  isAdmin?: boolean; // Optional prop
}

function UserProfile({ name, email, isAdmin = false }: UserProfileProps) {
  // Component implementation
}
```

### 4. State - Managing Dynamic Data

**Theory:** State represents data that can change over time. When state changes, React re-renders the component to reflect the new state.

**useState Hook:**
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Counter App</h2>
      <div className="text-6xl font-bold text-blue-600 mb-8">{count}</div>
      <div className="flex gap-3">
        <button 
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          -
        </button>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

**Sample Output:**
```
┌─────────────────────────────────────┐
│           Counter App              │
│                                   │
│              42                   │
│                                   │
│    [ - ]  [Reset]  [ + ]          │
└─────────────────────────────────────┘
```
*Clean card layout with large number display and colored action buttons*
```
```
**Complex State Objects:**
```jsx
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input 
          value={user.name}
          onChange={(e) => updateUser('name', e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input 
          type="email"
          value={user.email}
          onChange={(e) => updateUser('email', e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
        <input 
          type="number"
          value={user.age}
          onChange={(e) => updateUser('age', parseInt(e.target.value))}
          placeholder="Enter your age"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Submit
      </button>
    </form>
  );
}
```

**Sample Output:**
```
┌─────────────────────────────────────┐
│        User Information           │
│                                   │
│ Name                              │
│ [John Doe____________]            │
│                                   │
│ Email                             │
│ [john@example.com____]            │
│                                   │
│ Age                               │
│ [25__________________]            │
│                                   │
│        [Submit]                   │
└─────────────────────────────────────┘
```
*Professional form with labels, styled inputs, and focus states*
```

### 5. Event Handling - User Interactions

**Theory:** React uses SyntheticEvents - a wrapper around native DOM events that provides consistent behavior across browsers.

```jsx
function EventExamples() {
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default behavior
    console.log('Button clicked!', event.target);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    console.log(`${name}: ${type === 'checkbox' ? checked : value}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="username"
        onChange={handleInputChange}
        placeholder="Username"
      />
      <input 
        name="subscribe"
        type="checkbox"
        onChange={handleInputChange}
      />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

### 6. Conditional Rendering - Dynamic UI

**Theory:** Show different content based on application state or props using JavaScript conditional operators.

```jsx
function ConditionalExamples({ user, isLoading, error }) {
  // Early return pattern
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Ternary operator */}
      {user ? (
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Welcome, {user.name}!
        </h1>
      ) : (
        <h1 className="text-2xl font-bold text-gray-600 mb-4">
          Please log in
        </h1>
      )}

      {/* Logical AND operator */}
      {user && user.isAdmin && (
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mb-4">
          Admin Panel
        </button>
      )}

      {/* Multiple conditions */}
      {user && (
        <div className="border-t pt-4">
          <p className="text-gray-700 mb-2">Email: {user.email}</p>
          {user.verified ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          ) : (
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
              Verify Email
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

**Sample Output (Logged in user):**
```
┌─────────────────────────────────────┐
│    Welcome, Alice!               │
│                                   │
│    [Admin Panel]                  │
│                                   │
│ ─────────────────────────────────── │
│ Email: alice@example.com          │
│ ✓ Verified                       │
└─────────────────────────────────────┘
```
*Dynamic UI with loading spinner, error states, and conditional content*
```

### 7. Lists and Keys - Rendering Collections

**Theory:** When rendering lists, React needs keys to efficiently update the DOM when the list changes. Keys help React identify which items have changed, been added, or removed.

```jsx
function TodoList({ todos }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Todo List</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id}  // Unique, stable identifier
            todo={todo}
          />
        ))}
      </ul>
    </div>
  );
}

function TodoItem({ todo }) {
  return (
    <li className={`flex items-center justify-between p-3 rounded-lg border ${
      todo.completed 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-gray-50 border-gray-200 text-gray-800'
    }`}>
      <span className={`flex-1 ${
        todo.completed ? 'line-through' : ''
      }`}>
        {todo.text}
      </span>
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800 text-sm">
          Toggle
        </button>
        <button className="text-red-600 hover:text-red-800 text-sm">
          Delete
        </button>
      </div>
    </li>
  );
}
```

**Sample Output:**
```
┌─────────────────────────────────────┐
│           Todo List               │
│                                   │
│ • Learn React    [Toggle][Delete] │
│ ✓ Build an app  [Toggle][Delete] │
│ • Deploy app    [Toggle][Delete] │
└─────────────────────────────────────┘
```
*List with different colors for completed/pending items and action buttons*

// Key guidelines:
// ✅ Use unique, stable IDs
const items = data.map(item => <Item key={item.id} data={item} />);

// ❌ Avoid array indices (can cause issues with reordering)
const items = data.map((item, index) => <Item key={index} data={item} />);

// ❌ Avoid random values (causes unnecessary re-renders)
const items = data.map(item => <Item key={Math.random()} data={item} />);
```

---

## Working with the DOM

### useEffect Hook - Side Effects

**Theory:** useEffect handles side effects in functional components - operations that affect something outside the component scope.

**Common Use Cases:**
- Data fetching
- Setting up subscriptions
- Manually changing DOM
- Cleanup operations

```jsx
import { useState, useEffect } from 'react';

function EffectExamples() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // Effect runs after every render
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  // Effect runs only once (on mount)
  useEffect(() => {
    fetchData().then(setData);
  }, []); // Empty dependency array

  // Effect runs when count changes
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]); // Dependency array with count

  // Effect with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>Count: {count}</div>;
}
```

### useRef Hook - Direct DOM Access

**Theory:** useRef provides a way to access DOM elements directly or store mutable values that persist across renders without causing re-renders.

```jsx
import { useRef, useEffect } from 'react';

function RefExamples() {
  const inputRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    // Focus input on mount
    inputRef.current.focus();
  }, []);

  const handleClick = () => {
    // Access DOM element
    inputRef.current.select();
    
    // Mutable value (doesn't cause re-render)
    countRef.current += 1;
    console.log('Clicked', countRef.current, 'times');
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus & Select</button>
    </div>
  );
}
```

---

## Practical Exercises with Styling

### Exercise 1: Enhanced Counter App
Create a counter with increment, decrement, and reset functionality using Tailwind CSS.

```jsx
function CounterApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Counter</h1>
        <div className="text-8xl font-bold text-blue-600 mb-8">{count}</div>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setCount(count - 1)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Decrease
          </button>
          <button 
            onClick={() => setCount(0)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Reset
          </button>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Sample Output:**
```
┌──────────────────────────────────────────────────┐
│                   Counter                      │
│                                              │
│                     42                       │
│                                              │
│  [Decrease]    [Reset]    [Increase]         │
└──────────────────────────────────────────────────┘
```
*Gradient background with centered card, large number display, and animated buttons*

### Exercise 2: Complete Todo App
Build a todo list with add, toggle, and delete features.

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Todo App</h1>
        
        {/* Add Todo Form */}
        <div className="flex gap-2 mb-6">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                todo.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span
                className={`flex-1 ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-gray-600">
          <p>{todos.filter(todo => !todo.completed).length} of {todos.length} tasks remaining</p>
        </div>
      </div>
    </div>
  );
}
```

**Sample Output:**
```
┌──────────────────────────────────────────────────┐
│                 Todo App                     │
│                                              │
│ [Add a new todo...________] [Add]            │
│                                              │
│ ✓ Learn React basics        [Delete]       │
│ □ Build todo app            [Delete]       │
│ □ Deploy to production      [Delete]       │
│                                              │
│           2 of 3 tasks remaining             │
└──────────────────────────────────────────────────┘
```
*Complete todo app with input field, checkboxes, delete buttons, and task counter*

### Exercise 3: Contact Form with Validation
Create a contact form with validation and submission feedback.

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitted(false);
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">✓ Message Sent!</h2>
        <p>Thank you for your message. We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Your message..."
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Send Message
      </button>
    </form>
  );
}
```

**Sample Output (with validation errors):**
```
┌──────────────────────────────────────────────────┐
│              Contact Us                     │
│                                              │
│ Name                                         │
│ [________________] (red border)              │
│ ⚠ Name is required                         │
│                                              │
│ Email                                        │
│ [invalid-email___] (red border)             │
│ ⚠ Email is invalid                        │
│                                              │
│ Message                                      │
│ [________________]                           │
│ [________________]                           │
│                                              │
│           [Send Message]                     │
└──────────────────────────────────────────────────┘
```
*Form with validation errors shown in red, success state, and proper styling*

---

## Best Practices

### 1. Component Design
- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic into custom hooks

### 2. State Management
- Keep state as local as possible
- Use multiple useState calls for unrelated state
- Consider useReducer for complex state logic

### 3. Performance
- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Avoid creating objects/functions in render

### 4. Code Organization
- One component per file
- Use consistent naming conventions
- Group related components in folders

### Exercise 4: Data Fetching with Loading States
Build a component that fetches and displays user data from an API.

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error('User not found');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-gray-600">@{user.username}</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <span className="font-medium w-20">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="font-medium w-20">Phone:</span>
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="font-medium w-20">Website:</span>
          <span className="text-blue-600">{user.website}</span>
        </div>
        <div className="flex items-start text-gray-700">
          <span className="font-medium w-20">Address:</span>
          <span>
            {user.address.street}, {user.address.city}<br/>
            {user.address.zipcode}
          </span>
        </div>
      </div>
    </div>
  );
}
```

**Sample Output (Loading State):**
```
┌──────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░                      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░              │
└──────────────────────────────────────────────────┘
```
*Skeleton loading animation with pulsing gray bars*

**Sample Output (Loaded Data):**
```
┌──────────────────────────────────────────────────┐
│                   (J)                      │
│              John Doe                     │
│              @johndoe                     │
│                                              │
│ Email:   john@example.com                   │
│ Phone:   555-123-4567                       │
│ Website: johndoe.com                        │
│ Address: 123 Main St, Anytown              │
│          12345                               │
└──────────────────────────────────────────────────┘
```
*User profile card with avatar, contact information, and clean layout*

---

## Best Practices

### 1. Component Design with Tailwind
- Use consistent spacing with Tailwind's spacing scale (`p-4`, `m-6`, etc.)
- Create reusable component classes with `@apply` directive
- Use semantic color names (`bg-blue-600` instead of `bg-blue-500`)

```jsx
// Good: Consistent, semantic styling
function Button({ variant = 'primary', children, ...props }) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2. State Management
- Keep state as local as possible
- Use multiple useState calls for unrelated state
- Consider useReducer for complex state logic

```jsx
// Good: Separate concerns
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Each state serves a specific purpose
}
```

### 3. Performance with Styling
- Use Tailwind's purge feature to remove unused CSS
- Avoid inline styles for static values
- Use CSS variables for dynamic values

```jsx
// Good: Static classes
<div className="bg-blue-500 text-white p-4 rounded-lg">

// Good: Dynamic with CSS variables
<div 
  className="p-4 rounded-lg"
  style={{ backgroundColor: `hsl(${hue}, 70%, 50%)` }}
>
```

### 4. Code Organization
- One component per file
- Use consistent naming conventions
- Group related components in folders
- Create a design system with Tailwind components

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── forms/
│   │   └── ContactForm.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Footer.jsx
```

### 5. Accessibility with Tailwind
- Use semantic HTML elements
- Add proper ARIA labels
- Ensure color contrast meets WCAG guidelines
- Use Tailwind's focus utilities

```jsx
function AccessibleButton({ children, ...props }) {
  return (
    <button 
      className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 hover:bg-blue-700 transition-colors"
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## Common Tailwind CSS Classes Reference

### Layout
- `flex`, `grid`, `block`, `inline-block`
- `justify-center`, `items-center`, `text-center`
- `w-full`, `h-screen`, `max-w-md`, `mx-auto`

### Spacing
- `p-4` (padding), `m-6` (margin), `space-y-4` (vertical spacing)
- `px-3` (horizontal padding), `py-2` (vertical padding)

### Colors
- `bg-blue-500`, `text-white`, `border-gray-300`
- `hover:bg-blue-600`, `focus:ring-blue-500`

### Typography
- `text-xl`, `font-bold`, `font-medium`
- `leading-tight`, `tracking-wide`

### Effects
- `shadow-lg`, `rounded-lg`, `border`
- `transition-colors`, `hover:scale-105`

---

## Next Steps

1. **Practice Projects**: Build the exercises in this guide
2. **Advanced Concepts**: Learn React Router, Context API, Custom Hooks
3. **State Management**: Explore Redux or Zustand for complex apps
4. **Testing**: Learn React Testing Library and Jest
5. **Performance**: Study React.memo, useMemo, useCallback
6. **Build Tools**: Master Vite configuration and deployment

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

