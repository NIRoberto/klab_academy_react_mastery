# Common React Errors - Quick Fix Guide

## 1. "Cannot read property of undefined"

### ❌ Error
```typescript
const user = null;
return <div>{user.name}</div>; // Error: Cannot read property 'name' of null
```

### ✅ Fix
```typescript
const user = null;
return <div>{user?.name}</div>; // Safe with optional chaining
// OR
return <div>{user && user.name}</div>; // Conditional rendering
```

---

## 2. "Each child in a list should have a unique key prop"

### ❌ Error
```typescript
const items = ['apple', 'banana', 'orange'];
return (
  <ul>
    {items.map(item => <li>{item}</li>)} {/* Missing key */}
  </ul>
);
```

### ✅ Fix
```typescript
const items = ['apple', 'banana', 'orange'];
return (
  <ul>
    {items.map((item, index) => <li key={index}>{item}</li>)}
  </ul>
);
```

---

## 3. "Cannot update a component while rendering a different component"

### ❌ Error
```typescript
const BadComponent = () => {
  const [count, setCount] = useState(0);
  
  setCount(1); // Called during render - causes infinite loop
  
  return <div>{count}</div>;
};
```

### ✅ Fix
```typescript
const GoodComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(1); // Called after render
  }, []);
  
  return <div>{count}</div>;
};
```

---

## 4. "Hook called outside of function component"

### ❌ Error
```typescript
// Outside component
const [count, setCount] = useState(0); // Error!

function MyComponent() {
  return <div>{count}</div>;
}
```

### ✅ Fix
```typescript
function MyComponent() {
  const [count, setCount] = useState(0); // Inside component
  return <div>{count}</div>;
}
```

---

## 5. "Objects are not valid as a React child"

### ❌ Error
```typescript
const user = { name: 'John', age: 30 };
return <div>{user}</div>; // Error: Can't render object directly
```

### ✅ Fix
```typescript
const user = { name: 'John', age: 30 };
return <div>{user.name}</div>; // Render specific property
// OR
return <div>{JSON.stringify(user)}</div>; // Convert to string
```

---

## 6. "Cannot assign to read only property"

### ❌ Error
```typescript
const [items, setItems] = useState([1, 2, 3]);

const addItem = () => {
  items.push(4); // Error: Mutating state directly
  setItems(items);
};
```

### ✅ Fix
```typescript
const [items, setItems] = useState([1, 2, 3]);

const addItem = () => {
  setItems([...items, 4]); // Create new array
};
```

---

## 7. "useEffect has missing dependency"

### ❌ Error
```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count); // Using count but not in dependencies
}, []); // Missing count in dependency array
```

### ✅ Fix
```typescript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(count);
}, [count]); // Include count in dependencies
```

---

## 8. "Cannot read properties of null (reading 'addEventListener')"

### ❌ Error
```typescript
useEffect(() => {
  const element = document.getElementById('myElement');
  element.addEventListener('click', handleClick); // element might be null
}, []);
```

### ✅ Fix
```typescript
useEffect(() => {
  const element = document.getElementById('myElement');
  if (element) { // Check if element exists
    element.addEventListener('click', handleClick);
  }
}, []);
```

---

## 9. "Maximum update depth exceeded"

### ❌ Error
```typescript
const [count, setCount] = useState(0);

return (
  <button onClick={setCount(count + 1)}> {/* Called immediately */}
    Count: {count}
  </button>
);
```

### ✅ Fix
```typescript
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}> {/* Wrapped in function */}
    Count: {count}
  </button>
);
```

---

## 10. "Cannot update during an existing state transition"

### ❌ Error
```typescript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  setCount(count + 2); // Both use same count value
};
```

### ✅ Fix
```typescript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(prev => prev + 1); // Use function form
  setCount(prev => prev + 2); // Gets updated value
};
```

---

## Quick Debug Tips

### 1. Use Console.log Strategically
```typescript
const MyComponent = ({ data }) => {
  console.log('Component rendered with:', data); // Debug props
  
  const [state, setState] = useState(null);
  console.log('Current state:', state); // Debug state
  
  return <div>{data?.name}</div>;
};
```

### 2. Check Network Tab
- Open browser DevTools → Network tab
- Look for failed API calls (red entries)
- Check response status and error messages

### 3. Use React Developer Tools
- Install React DevTools browser extension
- Inspect component props and state
- Track component re-renders

### 4. TypeScript Error Messages
```typescript
// Read TypeScript errors carefully
interface User {
  name: string;
  age: number;
}

const user: User = { name: 'John' }; // Error: Missing 'age' property
```

### 5. ESLint Warnings
```typescript
// Pay attention to ESLint warnings
useEffect(() => {
  fetchData(userId); // ESLint warns about missing dependency
}, []); // Should be [userId]
```

## Error Prevention Checklist

- ✅ Always use optional chaining (`?.`) for object properties
- ✅ Add `key` prop to list items
- ✅ Put state updates inside `useEffect` or event handlers
- ✅ Only call hooks inside function components
- ✅ Use immutable updates for state (spread operator)
- ✅ Include all dependencies in `useEffect` arrays
- ✅ Check for null/undefined before using DOM elements
- ✅ Wrap event handlers in functions
- ✅ Use function form for state updates when needed
- ✅ Install and use TypeScript + ESLint for early error detection