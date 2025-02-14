# Consuming state

**Bonsify** makes observation transparent. With the included babel/swc plugin any component function defined in your codebase will become observers. That means you do not have to think about adding observation or worry about props passing etc. The observation memory footprint is tiny and saves you from a lot of reconciliation work as components will only reconcile by the state they observe. Additionally these observing components uses `memo` as you will be doing a lot less props passing, avoiding waterfall reconciliation. To optimise, just break up big components consuming a lot of state into smaller nested components.

You can consume state directly in your components:

```tsx
import { reactive } from "bonsify";

const counter = reactive({
  count: 0,
  increase() {
    this.count++;
  },
});

export function App() {
  return (
    <button onClick={() => counter.increase()}>
      Increase ({counter.count})
    </button>
  );
}
```

But it is recommendede to provide the state using a Provider. This helps testability and providing the state in multiple environments.

```ts
import { createContext, context } from "react";

export const appContext = createContext();
export const useApp = () => useContext(context);
```

```tsx
import { createRoot } from "react-dom/client";
import { createApp } from "./app";
import { MyApp } from "./MyApp";
import { appContext } from "./appContext";

const el = document.querySelector("#root");
const root = createRoot(el);

root.render(
  <appContext.Provider value={createApp()}>
    <MyApp />
  </appContext.Provider>
);
```
