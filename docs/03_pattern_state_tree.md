# Pattern: State Tree

Building a state tree allows your components to consume all the state of your application from a root object. The mental model of a single state tree is the exact same model as your components.

Building up a state tree is about composition, just like components:

```ts
import { reactive } from "bonsify";

function Counter() {
  const counter = reactive({
    count: 0,
    increase,
  });

  return reactive.readonly(counter);

  function increase() {
    counter.count++;
  }
}

export function State() {
  const state = reactive({
    counter: Counter(),
  });

  return reactive.readonly(state);
}
```

## Disposing state

You might initialize nested state that creates a side effect. If the parent state is disposed for whatever reason you want to clean up these nested effects.

```ts
// The counter creates an interval effect
function Counter({ onDispose }) {
  const counter = reactive({
    count: 0,
  });

  const interval = setInterval(increaseCount, 1000);

  onDispose(() => clearInterval(interval));

  return counter;

  function increaseCount() {
    counter.count++;
  }
}

export function State() {
  // We keep track of any disposers
  const disposers = new Set();
  const state = reactive({
    // We pass it down the tree
    counter: Counter({ onDispose }),
    dispose,
  });

  return state;

  // Any nested state can be passed this function to register a disposer
  function onDispose(disposer) {
    disposers.set(disposer);
  }

  // When disposing of the state, any registered disposers are also disposed
  function dispose() {
    disposers.forEach((dispose) => dispose());
    disposers.clear();
  }
}
```
