# How React Hooks Work Under the Hood

## The Fiber Architecture Foundation

React Hooks are built on top of React's Fiber architecture, which is React's reconciliation engine. Understanding Fiber is crucial to understanding how Hooks work.

### Fiber Node Structure
```javascript
// Simplified Fiber node structure
const FiberNode = {
  type: 'div', // Component type
  props: { children: [] }, // Component props
  stateNode: null, // DOM node or component instance
  memoizedState: null, // Hook state chain
  updateQueue: null, // Update queue for state changes
  effectTag: 0, // Side effect flags
  nextEffect: null, // Linked list of effects
  // ... other properties
};
```

## Hook State Storage - The Hook Chain

React stores Hook state in a **linked list** attached to the Fiber node. Each Hook call creates a node in this chain.

### Hook Object Structure
```javascript
// Internal Hook object structure
const Hook = {
  memoizedState: null, // Current state value
  baseState: null, // Base state for updates
  baseQueue: null, // Base update queue
  queue: null, // Update queue
  next: null // Pointer to next Hook in chain
};
```

### How the Hook Chain Works
```javascript
// Simplified representation of how React tracks hooks
let currentFiber = null;
let currentHook = null;
let workInProgressHook = null;

// When component renders, React walks through the hook chain
function renderComponent(fiber) {
  currentFiber = fiber;
  currentHook = fiber.memoizedState; // Start of hook chain
  workInProgressHook = null;
  
  // Component function executes, calling hooks in order
  const result = fiber.type(fiber.props);
  
  return result;
}
```

## useState Implementation Deep Dive

### Internal useState Structure
```javascript
// Simplified useState implementation
function useState(initialState) {
  // Get or create hook object
  const hook = updateWorkInProgressHook();
  
  if (hook.memoizedState === null) {
    // First render - initialize state
    hook.memoizedState = typeof initialState === 'function' 
      ? initialState() 
      : initialState;
    hook.baseState = hook.memoizedState;
    hook.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: hook.memoizedState
    };
  }
  
  // Create dispatch function bound to this hook
  const dispatch = dispatchAction.bind(null, currentFiber, hook.queue);
  hook.queue.dispatch = dispatch;
  
  return [hook.memoizedState, dispatch];
}

// Basic state reducer for useState
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```

### State Update Process
```javascript
// When setState is called
function dispatchAction(fiber, queue, action) {
  // Create update object
  const update = {
    action,
    next: null,
    priority: getCurrentPriority()
  };
  
  // Add to update queue
  const pending = queue.pending;
  if (pending === null) {
    update.next = update; // Circular list
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  queue.pending = update;
  
  // Schedule re-render
  scheduleUpdateOnFiber(fiber);
}

// During re-render, process updates
function processUpdateQueue(hook, queue) {
  let newState = hook.baseState;
  let update = queue.pending;
  
  if (update !== null) {
    // Process all updates in queue
    do {
      const action = update.action;
      newState = queue.lastRenderedReducer(newState, action);
      update = update.next;
    } while (update !== queue.pending);
    
    hook.memoizedState = newState;
    queue.pending = null;
  }
  
  return newState;
}
```

## useEffect Implementation Deep Dive

### Effect Hook Structure
```javascript
const EffectHook = {
  memoizedState: {
    tag: 0, // Effect type flags
    create: null, // Effect function
    destroy: null, // Cleanup function
    deps: null, // Dependencies array
    next: null // Next effect in list
  },
  // ... other hook properties
};
```

### Effect Processing Phases
```javascript
// Simplified useEffect implementation
function useEffect(create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  let destroy = undefined;
  
  if (hook.memoizedState !== null) {
    const prevEffect = hook.memoizedState;
    destroy = prevEffect.destroy;
    
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // Dependencies haven't changed, skip effect
        pushEffect(NoHookEffect, create, destroy, nextDeps);
        return;
      }
    }
  }
  
  // Dependencies changed or first render
  currentFiber.effectTag |= UpdateEffect;
  
  hook.memoizedState = pushEffect(
    HookHasEffect | hookEffectTag,
    create,
    destroy,
    nextDeps
  );
}

// Dependency comparison
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return false;
  
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

### Effect Execution Timeline
```javascript
// Effect execution phases
const EffectPhases = {
  // 1. Render phase - effects are collected
  RENDER: 'render',
  
  // 2. Commit phase - effects are executed
  COMMIT: 'commit',
  
  // 3. Cleanup phase - cleanup functions run
  CLEANUP: 'cleanup'
};

// Effect execution during commit phase
function commitHookEffectList(tag, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    
    do {
      if ((effect.tag & tag) === tag) {
        // Execute cleanup first
        const destroy = effect.destroy;
        effect.destroy = undefined;
        if (destroy !== undefined) {
          destroy();
        }
        
        // Then execute effect
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

## useContext Implementation

### Context Value Resolution
```javascript
// Simplified useContext implementation
function useContext(context) {
  const value = readContext(context);
  return value;
}

function readContext(context) {
  const currentFiber = getCurrentFiber();
  
  // Walk up the fiber tree to find context provider
  let fiber = currentFiber.return;
  while (fiber !== null) {
    if (fiber.type === context.Provider) {
      return fiber.memoizedProps.value;
    }
    fiber = fiber.return;
  }
  
  // No provider found, return default value
  return context._defaultValue;
}
```

## useReducer Implementation

### Reducer Hook Structure
```javascript
function useReducer(reducer, initialArg, init) {
  const hook = updateWorkInProgressHook();
  
  if (hook.memoizedState === null) {
    // Initialize state
    const initialState = init !== undefined ? init(initialArg) : initialArg;
    hook.memoizedState = initialState;
    hook.baseState = initialState;
    
    const queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: reducer,
      lastRenderedState: initialState
    };
    hook.queue = queue;
    
    const dispatch = dispatchAction.bind(null, currentFiber, queue);
    queue.dispatch = dispatch;
    
    return [initialState, dispatch];
  }
  
  // Process updates
  const newState = processUpdateQueue(hook, hook.queue, reducer);
  return [newState, hook.queue.dispatch];
}
```

## Hook Rules Enforcement

### Why Hook Rules Exist
```javascript
// This is why hooks must be called in the same order
function BadComponent({ condition }) {
  const [count, setCount] = useState(0); // Hook 1
  
  if (condition) {
    const [name, setName] = useState(''); // Hook 2 (conditional!)
  }
  
  const [items, setItems] = useState([]); // Hook 3 or 2?
  
  // This breaks the hook chain consistency!
}

// React's internal hook chain on first render:
// Hook1 -> Hook2 -> Hook3 -> null

// On second render with condition=false:
// Hook1 -> Hook3 -> null (Hook2 is missing!)
// This causes Hook3 to get Hook2's state!
```

### Hook Index Tracking
```javascript
// React tracks hooks by call order, not by name
let hookIndex = 0;
const hookArray = [];

function updateWorkInProgressHook() {
  const current = currentHook;
  const workInProgress = workInProgressHook;
  
  if (current !== null) {
    // Update existing hook
    workInProgressHook = {
      memoizedState: current.memoizedState,
      baseState: current.baseState,
      baseQueue: current.baseQueue,
      queue: current.queue,
      next: null
    };
  } else {
    // Create new hook
    workInProgressHook = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
  }
  
  return workInProgressHook;
}
```

## Memory Management and Cleanup

### Hook Cleanup Process
```javascript
// When component unmounts
function commitUnmount(finishedRoot, current) {
  switch (current.tag) {
    case FunctionComponent: {
      // Clean up all effects
      const updateQueue = current.updateQueue;
      if (updateQueue !== null) {
        const lastEffect = updateQueue.lastEffect;
        if (lastEffect !== null) {
          const firstEffect = lastEffect.next;
          let effect = firstEffect;
          do {
            const destroy = effect.destroy;
            if (destroy !== undefined) {
              destroy(); // Call cleanup functions
            }
            effect = effect.next;
          } while (effect !== firstEffect);
        }
      }
      break;
    }
  }
}
```

## Performance Optimizations

### Hook Memoization
```javascript
// useMemo implementation
function useMemo(create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  if (hook.memoizedState !== null) {
    if (nextDeps !== null) {
      const prevDeps = hook.memoizedState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return hook.memoizedState[0]; // Return cached value
      }
    }
  }
  
  const nextValue = create();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

// useCallback is just useMemo for functions
function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}
```

## Concurrent Features Integration

### Hook Updates in Concurrent Mode
```javascript
// Hooks work with React's concurrent features
function scheduleUpdateOnFiber(fiber, lane, eventTime) {
  // Mark fiber for update
  markUpdateLaneFromFiberToRoot(fiber, lane);
  
  // Schedule work based on priority
  if (lane === SyncLane) {
    // Synchronous update
    performSyncWorkOnRoot(root);
  } else {
    // Concurrent update
    ensureRootIsScheduled(root, eventTime);
  }
}
```

## Key Takeaways

1. **Hooks are stored in a linked list** attached to the Fiber node
2. **Call order matters** because React uses position, not names, to track hooks
3. **State updates are queued** and processed during re-renders
4. **Effects run after DOM updates** in the commit phase
5. **Context values are resolved** by walking up the Fiber tree
6. **Memory cleanup** happens automatically when components unmount
7. **Performance optimizations** use shallow comparison of dependencies

This internal architecture enables React Hooks to provide a clean, functional API while maintaining efficient updates and proper cleanup.